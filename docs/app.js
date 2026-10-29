import {answer,listening} from "../core/bonze.mjs";
import {inferExperts,evolveForces} from "../core/experts.mjs";
import {createConversationSession} from "../core/conversation.mjs";
const el=id=>document.getElementById(id);
const STORAGE="bonze-proto-01";
const session=createConversationSession();
let profile=null,history=[],trainedWeights=null,forces={},pendingInput=null,speaking=false;
let nativeReady=false, speechEnabled=false, lastMood="calme";
const isNative=!!window.BonzeAndroid;
const face=el("face"),nativeButton=el("native-mic"),faceTouch=el("face-touch");
const readOnlyCaption=el("answer");
let fontSize=2;
try{
  const saved=JSON.parse(localStorage.getItem(STORAGE)||"null");
  if(saved&&typeof saved==="object"){
    profile=typeof saved.profile?.nickname==="string"?{nickname:saved.profile.nickname.slice(0,40)}:null;
    history=Array.isArray(saved.history)?saved.history.slice(-30)
      .filter(r=>typeof r?.text==="string" && ["human","bot"].includes(r.role)):[];
    fontSize=[1,2,3].includes(saved.fontSize)?saved.fontSize:2;
  }
}catch{}
function save(){
  try{localStorage.setItem(STORAGE,JSON.stringify({profile,history:history.slice(-30),fontSize}));}
  catch{el("profile-status").textContent="Stockage non disponible : ces informations ne seront pas conservées.";}
}
function showHistory(){
  const log=el("log");log.replaceChildren();
  for(const line of history.slice(-30)){
    const p=document.createElement("p");
    p.className="bubble "+line.role;p.textContent=line.text.slice(0,1200);
    log.append(p);
  }
  log.scrollTop=log.scrollHeight;
}
function record(role,text){history.push({role,text});history=history.slice(-30);save();showHistory();}
function state(mode){
  const labels={off:"● Micro arrêté",listening:"● Je t'écoute",thinking:"● Je réfléchis",speaking:"● Je te réponds",waiting:"● Une petite seconde",indisponible:"● Voix indisponible"};
  const key=Object.hasOwn(labels,mode)?mode:"off";
  el("conversation-state").textContent=labels[key];
  face.classList.remove("listening","thinking","speaking");
  if(["listening","thinking","speaking"].includes(key))face.classList.add(key);
  nativeButton.setAttribute("aria-pressed",String(session.enabled));
  nativeButton.textContent=session.enabled?"⏹ Arrêter la conversation":"🎙️ Démarrer la conversation";
  faceTouch.setAttribute("aria-label",session.enabled?"Toucher Bonze pour arrêter la conversation":"Toucher Bonze pour lui parler");
}
function mood(emotion){
  lastMood=emotion;
  const titles={joie:"Je souris !",curiosite:"Je veux découvrir !",reflexion:"Je réfléchis…",calme:"Je suis tranquille.",peur:"Un peu inquiet…",colere:"Hum, ça m'agace !",empathie:"Je prends soin de toi.",humour:"Hihi !"};
  face.className="face "+emotion;
  el("mood").textContent=titles[emotion]||"Je suis curieux !";
  face.setAttribute("aria-label","Bonze AI, émotion simulée : "+emotion);
}
function browserLocalVoice(){
  if(!("speechSynthesis" in window))return null;
  return window.speechSynthesis.getVoices().find(v=>/^fr[-_]/i.test(v.lang)&&v.localService===true)||null;
}
function optionalBrowserSpeak(text){
  if(!speaking || isNative)return;
  const v=browserLocalVoice();
  if(!v){speaking=false;el("voice").checked=false;
    el("voice-status").textContent="Aucune voix française locale disponible dans le navigateur.";return;}
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.voice=v;utterance.lang=v.lang;utterance.rate=.94;
  window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);
}
function stopConversation(reason){
  session.stop();state("off");
  if(reason)el("native-status").textContent=reason;
}
function toggleConversation(){
  if(!isNative || !nativeReady){
    showKeyboard();
    el("native-status").textContent="La conversation vocale exige une reconnaissance locale sur Android. Le clavier reste disponible.";
    return;
  }
  if(session.enabled){
    session.stop();
    window.BonzeAndroid.stopHandsFree();
    state("off");
    return;
  }
  session.start();
  el("native-status").textContent="Autorisation du micro demandée si nécessaire. Je ne m'activerai pas en arrière-plan.";
  state("waiting");
  window.BonzeAndroid.beginHandsFree();
}
function finishReply(text,emotion=lastMood){
  const content=String(text||"").slice(0,1200);
  readOnlyCaption.textContent=content;
  record("bot",content);
  mood(emotion);
  const keepTalking=session.finish();
  pendingInput=null;
  el("message").disabled=false;
  el("send-message").disabled=false;
  if(keepTalking && isNative){
    el("native-status").textContent="J'essaie de te répondre avec ma voix locale…";
    window.BonzeAndroid.speakReply(content);
  }else{
    optionalBrowserSpeak(content);
    if(!session.enabled)state("off");
  }
}
function handleText(text,source="text"){
  const clean=String(text??"").trim().slice(0,600);
  if(!session.accept(clean,source))return;
  el("message").value="";
  el("heard").textContent=clean;
  record("human",clean);
  el("message").disabled=true;
  el("send-message").disabled=true;
  state("thinking");
  let emotion="reflexion",summary="Poids des experts indisponibles.";
  if(trainedWeights){
    try{
      const routed=inferExperts(clean,trainedWeights);
      forces=evolveForces(forces,routed);
      emotion=routed.top2[0].name;
      summary="Micro-MoE : "+routed.top2.map(x=>x.name+" "+Math.round(x.weight*100)+" %").join(" · ");
    }catch(error){summary="Erreur de routage : "+error.message;}
  }
  el("experts-state").textContent=summary;
  mood(emotion);
  pendingInput={text:clean,emotion};
  if(isNative && el("neural").checked && window.BonzeAndroid.hasBundledWeights()){
    el("brain-status").textContent="Mes neurones locaux réfléchissent… Le premier chargement peut prendre du temps.";
    window.BonzeAndroid.generateLocalReply(clean,emotion);
  }else{
    const result=answer(clean,profile||{});
    el("brain-status").textContent=isNative?"Mode léger activé.":"WebApp sans LLM : réponse légère.";
    finishReply(result.text,emotion);
  }
}
function showKeyboard(){
  const panel=el("keyboard-panel"),visible=panel.hidden;
  panel.hidden=!visible;
  el("open-keyboard").setAttribute("aria-expanded",String(visible));
  el("open-keyboard").textContent=visible?"⌨️ Masquer le clavier":"⌨️ Écrire plutôt que parler";
  if(visible)el("message").focus();
}
window.BonzeAIResult=text=>{
  if(!pendingInput)return;
  el("brain-status").textContent="Réponse issue du modèle local LFM2.5 et du routage de huit micro-experts.";
  finishReply(text,pendingInput.emotion);
};
window.BonzeAIError=reason=>{
  if(!pendingInput)return;
  el("brain-status").textContent=String(reason).slice(0,260);
  const fallback=answer(pendingInput.text,profile||{});
  finishReply(fallback.text,pendingInput.emotion);
};
window.BonzeNativeResult=text=>{handleText(text,"voice");};
window.BonzeNativeStatus=text=>{el("native-status").textContent=String(text).slice(0,400);};
window.BonzeConversationState=mode=>{
  if(mode==="off"||mode==="indisponible")session.stop();
  state(mode);
};
window.BonzeMemoryNotice=level=>{
  stopConversation(level==="critical"?
    "Android signale une mémoire critique : je coupe mon écoute et reste disponible par écrit.":
    "Mémoire chargée : l'écoute vocale a été suspendue.");
};
faceTouch.addEventListener("click",toggleConversation);
nativeButton.addEventListener("click",toggleConversation);
el("open-keyboard").addEventListener("click",showKeyboard);
el("chat").addEventListener("submit",e=>{
  e.preventDefault();
  handleText(el("message").value,"text");
});
el("settings-open").addEventListener("click",()=>{
  const panel=el("settings"),open=panel.hidden;
  panel.hidden=!open;
  el("settings-open").setAttribute("aria-expanded",String(open));
  el("settings-open").textContent=open?"✕ Fermer":"⚙️ Options";
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&!el("settings").hidden){
    el("settings").hidden=true;el("settings-open").setAttribute("aria-expanded","false");
    el("settings-open").textContent="⚙️ Options";el("settings-open").focus();
  }
});
el("intro").addEventListener("submit",e=>{
  e.preventDefault();const nickname=el("nickname").value.trim().slice(0,40);
  if(!nickname)return;
  profile={nickname};
  el("profile-status").textContent="Enchanté, "+nickname+" ! Ce surnom local n'est pas une identité vérifiée.";
  save();mood("joie");
});
if(profile){
  el("nickname").value=profile.nickname;
  el("profile-status").textContent="Enchanté, "+profile.nickname+" ! Surnom enregistré localement, sans authentification.";
}
el("caption-size").value=String(fontSize);
function sizeCaptions(value){
  fontSize=Math.max(1,Math.min(3,Number(value)||2));
  document.documentElement.style.setProperty("--subtitle",
    {1:"1.25rem",2:"1.68rem",3:"2.15rem"}[fontSize]);
  save();
}
sizeCaptions(fontSize);
el("caption-size").addEventListener("input",e=>sizeCaptions(e.target.value));
el("neural").addEventListener("change",()=>{
  if(isNative)window.BonzeAndroid.setNeuralEnabled(el("neural").checked);
});
if(!isNative){
  el("neural").checked=false;el("neural").disabled=true;
  el("native-status").textContent="WebApp : clavier accessible. Aucun micro ni service vocal distant utilisé.";
  faceTouch.setAttribute("aria-label","Toucher le visage de Bonze pour ouvrir le clavier");
}else{
  nativeButton.hidden=false;
  try{nativeReady=window.BonzeAndroid.localSpeechAvailable();}
  catch{nativeReady=false;}
  if(!nativeReady){
    nativeButton.disabled=true;
    el("native-status").textContent="Moteur de reconnaissance locale indisponible : tu peux écrire à Bonze.";
  }else{
    el("native-status").textContent="Micro désactivé. Un seul appui pour parler ; appuie à nouveau pour arrêter.";
  }
}
el("voice").addEventListener("change",()=>{
  speaking=el("voice").checked&&!!browserLocalVoice();
  el("voice").checked=speaking;
  el("voice-status").textContent=speaking?"Voix locale du navigateur activée.":
    "Lecture navigateur désactivée ou voix locale absente.";
  if(!speaking&&"speechSynthesis" in window)window.speechSynthesis.cancel();
});
el("pressure").addEventListener("change",policy);
function policy(){
  const p=listening({disabled:false,pressure:el("pressure").value});
  el("policy").textContent="Simulation : "+p.mode+" / "+p.reason+
    ". Cette valeur ne mesure pas la mémoire Android.";
}
policy();showHistory();
const lastHuman=history.filter(x=>x.role==="human").at(-1);
const lastBot=history.filter(x=>x.role==="bot").at(-1);
if(lastHuman)el("heard").textContent=lastHuman.text;
if(lastBot)readOnlyCaption.textContent=lastBot.text;
state("off");
fetch("../core/weights/expert-router-v1.json").then(r=>r.ok?r.json():Promise.reject(Error("404")))
  .then(w=>{trainedWeights=w;el("experts-state").textContent="Huit micro-experts entraînés disponibles."})
  .catch(()=>{el("experts-state").textContent="Routeur des experts indisponible. Mode léger conservé.";});
if("serviceWorker" in navigator)window.addEventListener("load",()=>
  navigator.serviceWorker.register("./sw.js").catch(()=>{}));
