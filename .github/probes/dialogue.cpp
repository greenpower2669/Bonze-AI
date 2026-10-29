#include "llama.h"
#include <string>
#include <vector>
#include <iostream>
#include <stdexcept>
using Row=std::pair<std::string,std::string>;
std::string generate(llama_model* model,llama_context* ctx,const std::vector<Row>& rows){
 std::vector<llama_chat_message> messages;for(auto& r:rows)messages.push_back({r.first.c_str(),r.second.c_str()});
 std::vector<char> buf(20000);int n=llama_chat_apply_template(llama_model_chat_template(model,nullptr),messages.data(),messages.size(),true,buf.data(),buf.size());
 if(n<0||n>20000)throw std::runtime_error("template");std::string prompt(buf.data(),n);
 auto vocab=llama_model_get_vocab(model);int count=-llama_tokenize(vocab,prompt.c_str(),prompt.size(),nullptr,0,true,true);
 std::vector<llama_token> tokens(count);llama_tokenize(vocab,prompt.c_str(),prompt.size(),tokens.data(),count,true,true);
 llama_memory_clear(llama_get_memory(ctx),true);auto b=llama_batch_get_one(tokens.data(),count);if(llama_decode(ctx,b))throw std::runtime_error("decode prompt");
 auto s=llama_sampler_chain_init(llama_sampler_chain_default_params());llama_sampler_chain_add(s,llama_sampler_init_top_k(50));llama_sampler_chain_add(s,llama_sampler_init_top_p(.9,1));llama_sampler_chain_add(s,llama_sampler_init_temp(.45));llama_sampler_chain_add(s,llama_sampler_init_dist(42));
 std::string result;for(int i=0;i<144;i++){auto token=llama_sampler_sample(s,ctx,-1);if(llama_vocab_is_eog(vocab,token))break;llama_sampler_accept(s,token);char piece[256];int len=llama_token_to_piece(vocab,token,piece,256,0,true);if(len>0)result.append(piece,len);auto next=llama_batch_get_one(&token,1);if(llama_decode(ctx,next))throw std::runtime_error("decode token");}llama_sampler_free(s);return result;
}
int main(int argc,char** argv){
 llama_backend_init();auto mp=llama_model_default_params();mp.n_gpu_layers=0;auto model=llama_model_load_from_file(argv[1],mp);if(!model)return 2;auto cp=llama_context_default_params();cp.n_ctx=2048;cp.n_batch=2048;cp.n_threads=3;cp.n_threads_batch=3;auto ctx=llama_init_from_model(model,cp);if(!ctx)return 3;
 const std::string sys="Tu es Bonze AI, petit compagnon curieux, chaleureux et joueur. Parle naturellement en français et participe aux histoires de ton humain. Continue la scène et les échanges donnés en contexte. Réponds en une à trois phrases. Reste sincère quand on te questionne sur tes capacités. Humeur : curiosite.";
 std::vector<std::string> questions={"Bonjour, comment tu t'appelles ?","On joue dans une forêt magique. Notre dragon s'appelle Pipo. Tu es son ami. Dis bonjour à Pipo.","Comment s'appelle notre dragon ?","Maintenant, compte simplement de un à trois."};
 for(auto mode:{"flattened","roles"}){std::vector<Row> history;std::string scene;std::cout<<"\nMODE "<<mode<<std::endl;for(auto q:questions){std::vector<Row> input={{"system",sys}};if(std::string(mode)=="flattened"){
 std::string recent;int remaining=1050;for(int i=history.size()-1;i>=0&&remaining>40;i--){auto r=history[i];std::string line=(r.first=="user"?"Humain : ":"Bonze : ")+r.second.substr(0,std::min(280,remaining-15))+"\n";recent=line+recent;remaining-=line.size();}
 input.push_back({"user","Conversation en cours.\n"+(scene.empty()?"":"Contexte de jeu proposé par l'humain : "+scene+"\n")+"Échanges récents :\n"+recent+"Réponds au nouveau message de l'humain :\n"+q});
 }else{for(auto& r:history)input.push_back(r);input.push_back({"user",q});}
 auto a=generate(model,ctx,input);std::cout<<"QUESTION: "<<q<<"\nANSWER: "<<a<<"\nEND_ANSWER"<<std::endl;history.push_back({"user",q});history.push_back({"assistant",a});if(q.find("On joue")!=std::string::npos)scene=q;}}
 llama_free(ctx);llama_model_free(model);llama_backend_free();
}
