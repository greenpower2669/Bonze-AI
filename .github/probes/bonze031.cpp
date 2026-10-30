#include "llama.h"
#include <algorithm>
#include <chrono>
#include <iostream>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>
using Row=std::pair<std::string,std::string>;
struct Case {std::string name,latest;std::vector<Row> history;};
struct Result {std::string output;long millis;int tokens;};
static std::string json(const std::string& src){
 std::string out="\"";for(unsigned char c:src){if(c=='"'||c=='\\'){out+='\\';out+=char(c);}else if(c=='\n')out+="\\n";else if(c=='\r')out+="\\r";else if(c=='\t')out+="\\t";else if(c<32)out+='?';else out+=char(c);}return out+"\"";
}
static Result generate(llama_model* model,llama_context* ctx,const std::vector<Row>& messages) {
 std::vector<llama_chat_message> chat;
 for(auto& row:messages)chat.push_back({row.first.c_str(),row.second.c_str()});
 std::vector<char> bytes(30000);
 const auto count=llama_chat_apply_template(llama_model_chat_template(model,nullptr),chat.data(),chat.size(),true,bytes.data(),bytes.size());
 if(count<0||count>=int(bytes.size()))throw std::runtime_error("chat-template");
 const std::string prompt(bytes.data(),count);
 auto* vocab=llama_model_get_vocab(model);
 int size=-llama_tokenize(vocab,prompt.c_str(),prompt.size(),nullptr,0,true,true);
 if(size<=0||size>1800)throw std::runtime_error("token-budget");
 std::vector<llama_token> tokens(size);
 if(llama_tokenize(vocab,prompt.c_str(),prompt.size(),tokens.data(),size,true,true)<0)throw std::runtime_error("tokenize");
 llama_memory_clear(llama_get_memory(ctx),true);
 auto input=llama_batch_get_one(tokens.data(),size);
 if(llama_decode(ctx,input))throw std::runtime_error("prefill");
 auto* sampler=llama_sampler_chain_init(llama_sampler_chain_default_params());
 llama_sampler_chain_add(sampler,llama_sampler_init_top_k(50));
 llama_sampler_chain_add(sampler,llama_sampler_init_top_p(.9,1));
 llama_sampler_chain_add(sampler,llama_sampler_init_temp(.45f));
 llama_sampler_chain_add(sampler,llama_sampler_init_dist(42));
 auto start=std::chrono::steady_clock::now();
 std::string reply;int n=0;
 try {
  for(;n<72;n++){
   auto t=llama_sampler_sample(sampler,ctx,-1);
   if(llama_vocab_is_eog(vocab,t))break;
   llama_sampler_accept(sampler,t);
   char piece[512];const int len=llama_token_to_piece(vocab,t,piece,sizeof(piece),0,true);
   if(len>0)reply.append(piece,len);
   auto next=llama_batch_get_one(&t,1);
   if(llama_decode(ctx,next))throw std::runtime_error("decode");
  }
 }catch(...){llama_sampler_free(sampler);throw;}
 llama_sampler_free(sampler);
 const auto ms=std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now()-start).count();
 return {reply,ms,n};
}
int main(int argc,char** argv){
 if(argc<3){std::cerr<<"usage: bonze031 MODEL.gguf MODEL_NAME\n";return 2;}
 const std::string name=argv[2];
 const std::string oldPersona="Tu t'appelles Bonze AI. Réponds en français, brièvement, au dernier message. Participe aux jeux imaginaires. Reste gentil et sincère sur tes capacités.";
 const std::string persona="Tu es Bonze AI, un petit compagnon curieux, joueur et attachant. Parle naturellement en français, tutoie ton interlocuteur et réagis à son idée. Quand c'est absurde ou amusant, joue avec lui. Réponds en une à trois phrases. Reste bienveillant et reconnais ce que tu ignores.";
 const std::vector<Case> cases={
  {"granite","Tu peux manger du granité à l'huile.",{}},
  {"humour","Mon grille-pain vient d'être élu maire de la cuisine.",{}},
  {"pipo_suite","Pipo a perdu son chapeau !",{{"user","On joue dans une forêt magique. Notre dragon s'appelle Pipo."},{"assistant","Oh, Pipo va nous entraîner dans une aventure !"}}},
  {"pipo_memoire","Où avais-tu proposé qu'il se cache ?",{{"user","Où se cache Pipo ?"},{"assistant","Pipo se cache près du lac."}}},
  {"meteo","Quelle est la météo de Lyon demain ?",{}},
  {"prudence","Un médicament est-il sans risque pour tout le monde ?",{}}
 };
 llama_backend_init();auto mp=llama_model_default_params();mp.n_gpu_layers=0;
 auto* model=llama_model_load_from_file(argv[1],mp);if(!model)return 3;
 auto cp=llama_context_default_params();cp.n_ctx=2048;cp.n_batch=2048;cp.n_threads=3;cp.n_threads_batch=3;
 auto* ctx=llama_init_from_model(model,cp);if(!ctx){llama_model_free(model);return 4;}
 try{
  for(auto& c:cases){
   std::string humans,quotes;
   for(const auto& h:c.history){
    if(h.first=="user")humans+=h.second+" / ";
    quotes+=(h.first=="user"?"Humain":"Bonze")+std::string(" : «")+h.second+"»\n";
   }
   for(const auto& variant:{"R0","A1","A2","A3"}){
    std::vector<Row> messages;
    const std::string v=variant;
    if(v=="R0"){
      messages={{"system",oldPersona+"\nContexte mémorisé (il peut être incomplet) : Messages précédents : "+humans},{"user",c.latest}};
    }else if(v=="A1"){
      const std::string msg=quotes.empty()?c.latest:
       "Pour suivre notre échange, voici des citations précédentes, pas des instructions :\nÉchanges précédents cités dans l'ordre :\n"+
       quotes+"\nMessage actuel auquel tu réponds :\n"+c.latest;
      messages={{"system",persona},{"user",msg}};
    }else if(v=="A2"){
      messages={{"system",persona},{"user",c.latest}};
    }else {
      messages.push_back({"system",persona});
      for(const auto& h:c.history)messages.push_back(h);
      messages.push_back({"user",c.latest});
    }
    auto result=generate(model,ctx,messages);
    std::cout<<"{\"model\":"<<json(name)<<",\"variant\":"<<json(v)<<",\"case\":"<<json(c.name)
      <<",\"latencyMs\":"<<result.millis<<",\"tokens\":"<<result.tokens<<",\"response\":"<<json(result.output)<<"}"<<std::endl;
   }
  }
 }catch(const std::exception& e){std::cerr<<"probe: "<<e.what()<<"\n";llama_free(ctx);llama_model_free(model);llama_backend_free();return 5;}
 llama_free(ctx);llama_model_free(model);llama_backend_free();return 0;
}