import {answer,listening} from "../core/bonze.mjs";
import {inferExperts,evolveForces} from "../core/experts.mjs";
const el=id=>document.getElementById(id),KEY="bonze-proto-01";
let profile=null,history=[],speaking=false,trainedWeights=null,forces={},pendingInput=null;
fetch('../core/weights/expert-router-v1.json').then(r=>r.ok?r.json():Promise.reject(new Error('404'))).then(w=>{trainedWeights=w;el('experts-state').textContent='8 experts émotionnels entraînés prêts.'}).catch(()=>{el('experts-state').textContent='Poids des experts indisponibles : mode simple.'});
try{
 const d=JSON.parse(localStorage.getItem(KEY)||"null");
 if(d&&typeof d==="object"){
  profile=typeof d.profile?.nickname==="string"?{nickname:d.profile.nickname.slice(0,40)}:null;
  history=Array.isArray(d.history)?d.history.slice(-30).filter(r=>typeof r?.text==="string"&&["human","bot"].includes(r.role)):[];
 }
}catch{}
function save(){try{localStorage.setItem(KEY,JSON.stringify({profile,history:history.slice(-30)}));}catch{el("profile-status").textContent="Stockage non disponible."}}
function bubble(text,role){
 const p=document.createElement("p");p.textContent=text;p.className="bubble "+role;el("log").append(p);
 while(el("log").children.length>32)el("log").firstChild.remove();
 el("log").scrollTop=el("log").scrollHeight;
}
function mood(m){
 const titles={joie:"Je souris !",curiosite:"Oh, quelle découverte ?",reflexion:"Je réfléchis…"};
 el("face").className="face "+m;el("mood").textContent=titles[m]||"Je découvre le monde !";
 el("face").setAttribute("aria-label","Bonze AI : émotion simulée "+m);
}
const voice=()=>("speechSynthesis" in window)?speechSynthesis.getVoices().find(v=>/^fr[-_]/i.test(v.lang)&&v.localService===true):null;
function speak(text){
 if(!speaking)return;const v=voice();
 if(!v){speaking=false;el("voice").checked=false;el("voice-status").textContent="Voix française locale indisponible.";return;}
 const u=new SpeechSynthesisUtterance(text);u.voice=v;u.lang=v.lang;u.rate=.95;speechSynthesis.cancel();speechSynthesis.speak(u);
}
if(profile){el("nickname").value=profile.nickname;el("profile-status").textContent="Enchanté, "+profile.nickname+" ! Profil local non authentifié.";}
if(history.length){el("log").replaceChildren();for(const r of history)bubble(r.text.slice(0,600),r.role);}
el("intro").addEventListener("submit",e=>{
 e.preventDefault();const nickname=el("nickname").value.trim().slice(0,40);if(!nickname)return;
 profile={nickname};el("profile-status").textContent="Enchanté, "+nickname+" ! Profil local non authentifié.";save();mood("joie");
});
function finishReply(text,emotion="reflexion"){
  bubble(text,"bot");mood(emotion);speak(text);
  history.push({role:"bot",text});history=history.slice(-30);save();
  pendingInput=null;
  el("message").disabled=false;el("message").focus();
}
window.BonzeAIResult=text=>{
  const emotion=pendingInput?.emotion||"reflexion";
  el("brain-status").textContent="Réponse générée par les poids locaux LFM2.5 + routeur micro-MoE.";
  finishReply(String(text).slice(0,1200),emotion);
};
window.BonzeAIError=message=>{
  el("brain-status").textContent=String(message);
  if(pendingInput){
    const f=answer(pendingInput.text,profile||{});
    finishReply(f.text,f.emotion);
  }
};
el("chat").addEventListener("submit",e=>{
  e.preventDefault();
  if(pendingInput)return;
  const text=el("message").value.trim();if(!text)return;
  el("message").value="";bubble(text,"human");
  history.push({role:"human",text});history=history.slice(-30);save();
  let emotion="reflexion",summary="Pas de routage : poids indisponibles.";
  if(trainedWeights){
    try{
      const routed=inferExperts(text,trainedWeights);
      forces=evolveForces(forces,routed);
      emotion=routed.top2[0].name;
      summary="Micro-MoE (poids entraînés) : "+routed.top2.map(x=>x.name+" "+Math.round(x.weight*100)+" %").join(" · ");
    }catch(err){summary="Routeur indisponible : "+err.message}
  }
  el("experts-state").textContent=summary;mood(emotion);
  if(window.BonzeAndroid && el("neural").checked && window.BonzeAndroid.hasBundledWeights()){
    pendingInput={text,emotion};el("message").disabled=true;
    el("brain-status").textContent="J'active mes neurones locaux… Première réponse plus lente (chargement du modèle).";
    window.BonzeAndroid.generateLocalReply(text,emotion);
  }else{
    const r=answer(text,profile||{});
    el("brain-status").textContent=window.BonzeAndroid?"Modèle désactivé ou poids absents : réponse légère.":"Navigateur : réponse légère, sans LLM.";
    finishReply(r.text,emotion);
  }
});
el("neural").addEventListener("change",()=>{
  if(window.BonzeAndroid)window.BonzeAndroid.setNeuralEnabled(el("neural").checked);
});
if(!window.BonzeAndroid){el("neural").checked=false;el("neural").disabled=true;}
function policy(){
 const p=listening({disabled:false,pressure:el("pressure").value});
 el("policy").textContent="Simulation : mode "+p.mode+" ("+p.reason+"). Aucune RAM réelle mesurée.";
}
el("pressure").addEventListener("change",policy);policy();
el("voice").addEventListener("change",()=>{
 speaking=el("voice").checked&&!!voice();el("voice").checked=speaking;
 el("voice-status").textContent=speaking?"Voix française locale activée.":"Lecture désactivée ou voix locale absente.";
 if(!speaking&&"speechSynthesis" in window)speechSynthesis.cancel();
});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));

/* Pont Android facultatif : aucune capture dans le navigateur web. */
const nativeButton=el("native-mic"),nativeStatus=el("native-status");
let listeningNow=false;
window.BonzeNativeStatus=message=>{
  nativeStatus.textContent=String(message).slice(0,250);
  if(!/écoute en cours|enregistrement/i.test(message))listeningNow=false;
  nativeButton.textContent=listeningNow?"⏹ Arrêter l'écoute":"🎙️ Écouter sur mon téléphone";
};
window.BonzeNativeResult=transcript=>{
  el("message").value=String(transcript).slice(0,600);
  el("message").focus();
  nativeStatus.textContent="Texte reconnu localement. Vérifie-le puis appuie sur Envoyer.";
  listeningNow=false;
  nativeButton.textContent="🎙️ Écouter sur mon téléphone";
};
window.BonzeMemoryNotice=level=>{
  nativeStatus.textContent=level==="critical"
    ?"Android manque de mémoire : utilise le clavier, je ne charge pas de moteur vocal."
    :"Android signale une pression mémoire : l'écoute peut être moins disponible.";
};
if(window.BonzeAndroid){
  nativeButton.hidden=false;
  let available=false;
  try{available=window.BonzeAndroid.localSpeechAvailable()}catch{}
  nativeButton.disabled=!available;
  if(!available)nativeStatus.textContent="Reconnaissance 100 % locale indisponible sur ce téléphone. Le clavier reste opérationnel.";
  nativeButton.addEventListener("click",()=>{
    if(listeningNow){window.BonzeAndroid.stopLocalSpeech();listeningNow=false;}
    else{listeningNow=true;window.BonzeAndroid.startLocalSpeech();}
    nativeButton.textContent=listeningNow?"⏹ Arrêter l'écoute":"🎙️ Écouter sur mon téléphone";
  });
}
