import {answer,listening} from '../core/bonze.mjs';
import {inferExperts} from '../core/experts.mjs';
import {createConversationSession} from '../core/conversation.mjs';
import {restoreIdentity} from '../core/identity.mjs';
import {advance,experience} from '../core/organism.mjs';
import {setupEditor,renderAppearance,renderExpression,describe} from './avatar.js';
const el=id=>document.getElementById(id);
const STORAGE='bonze-proto-01';
const session=createConversationSession();
const isNative=!!window.BonzeAndroid;
const face=el('face'), nativeButton=el('native-mic'), faceTouch=el('face-touch');
let profile=null,history=[],trainedWeights=null,pendingInput=null;
let nativeReady=false,mode='off',lastSaved=performance.now(),lastTick=performance.now();
let fontSize=2,resourceMode='precise',neuralEnabled=true,contrast=false,reduceMotion=false;
let browserVoiceEnabled=false,identity,saved=null,voiceRun=0;
try{saved=JSON.parse(localStorage.getItem(STORAGE)||'null');}catch{}
if(saved&&typeof saved==='object'){
 profile=typeof saved.profile?.nickname==='string'?{nickname:saved.profile.nickname.slice(0,40)}:null;
 history=Array.isArray(saved.history)?saved.history.filter(r=>typeof r?.text==='string'&&['human','bot'].includes(r.role)).slice(-30):[];
 fontSize=[1,2,3].includes(saved.fontSize)?saved.fontSize:2;
 resourceMode=['precise','eco','light','text','off'].includes(saved.resourceMode)?saved.resourceMode:'precise';
 neuralEnabled=saved.neuralEnabled!==false;
 contrast=saved.contrast===true;reduceMotion=saved.reduceMotion===true;
}
identity=restoreIdentity(saved?.identity);
function save(){
 try{localStorage.setItem(STORAGE,JSON.stringify({profile,history:history.slice(-30),fontSize,resourceMode,neuralEnabled,contrast,reduceMotion,identity}));}
 catch{el('profile-status').textContent='Stockage indisponible : identité et changements ne pourront pas être conservés après fermeture.';}
 lastSaved=performance.now();
}
// Save the newborn identity immediately, before any conversation or personalization.
save();
function showHistory(){
 const log=el('log');log.replaceChildren();
 for(const line of history){const p=document.createElement('p');p.className='bubble '+line.role;p.textContent=line.text.slice(0,1200);log.append(p);}
 log.scrollTop=log.scrollHeight;
}
function record(role,text){history.push({role,text});history=history.slice(-30);save();showHistory();}
const titles={joie:'Je souris !',curiosite:'Je veux découvrir !',reflexion:'Je réfléchis…',calme:'Je suis tranquille.',peur:'Un peu inquiet…',colere:'Hum, ça me contrarie.',empathie:'Je prends soin de toi.',humour:'Hihi !'};
let describedMood='';
function draw(){
 const e=renderExpression(face,identity,mode);
 if(e.dominant!==describedMood){
  describedMood=e.dominant;el('mood').textContent=titles[e.dominant];
  face.setAttribute('aria-label',describe(identity)+' État simulé : '+e.dominant+'.');
 }
 el('organism-status').textContent='Endurance simulée : '+Math.round(identity.acquired.endurance*100)+' %. Échanges : '+identity.acquired.exchanges+'. Forces persistantes : '+Object.entries(identity.acquired.forces).map(([k,v])=>k+' '+Math.round(v*100)+' %').join(', ')+'.';
}
function state(next){
 const labels={off:'● Micro arrêté',listening:"● Je t'écoute",thinking:'● Je réfléchis',speaking:'● Je te réponds',waiting:'● Une petite seconde',indisponible:'● Voix indisponible'};
 mode=Object.hasOwn(labels,next)?next:'off';el('conversation-state').textContent=labels[mode];
 face.classList.remove('listening','thinking','speaking');
 if(['listening','thinking','speaking'].includes(mode))face.classList.add(mode);
 nativeButton.setAttribute('aria-pressed',String(session.enabled));
 nativeButton.textContent=session.enabled?'⏹ Arrêter la conversation':'🎙️ Démarrer la conversation';
 faceTouch.setAttribute('aria-label',session.enabled?'Toucher Bonze pour arrêter la conversation':isNative?'Toucher Bonze pour lui parler':'Toucher Bonze pour ouvrir le clavier');
 draw();
}
function clearPending(){pendingInput=null;el('message').disabled=false;el('send-message').disabled=false;}
function stopAll(reason='Conversation arrêtée par toi.',notifyNative=true){
 voiceRun+=1;session.stop();clearPending();state('off');
 if(notifyNative&&isNative)window.BonzeAndroid.stopHandsFree();
 if('speechSynthesis' in window)window.speechSynthesis.cancel();
 el('native-status').textContent=reason;save();
}
function browserLocalVoice(){
 return window.speechSynthesis?.getVoices().find(v=>/^fr[-_]/i.test(v.lang)&&v.localService===true)||null;
}
function browserSpeak(text,deliberate=false){
 if(isNative||(!browserVoiceEnabled&&!deliberate)||document.hidden||['off','text'].includes(resourceMode))return;
 const voice=browserLocalVoice();
 if(!voice){el('voice-status').textContent='Aucune voix française locale disponible.';return;}
 const u=new SpeechSynthesisUtterance(text);u.voice=voice;u.lang=voice.lang;u.rate=.94;
 window.speechSynthesis.cancel();window.speechSynthesis.speak(u);
}
function showKeyboard(){
 const panel=el('keyboard-panel'),visible=panel.hidden;panel.hidden=!visible;
 el('open-keyboard').setAttribute('aria-expanded',String(visible));
 el('open-keyboard').textContent=visible?'⌨️ Masquer le clavier':'⌨️ Écrire plutôt que parler';
 if(visible){if(session.enabled)stopAll('Écriture : conversation vocale arrêtée.');el('message').focus();}
}
function toggleConversation(){
 if(session.enabled){stopAll();return;}
 if(session.busy){el('native-status').textContent='Je termine ma réponse. Tu peux aussi tout arrêter.';return;}
 if(['off','text'].includes(resourceMode)){el('native-status').textContent='Choisis un mode avec voix dans les options.';return;}
 if(!isNative||!nativeReady){if(el('keyboard-panel').hidden)showKeyboard();return;}
 session.start();voiceRun+=1;state('waiting');window.BonzeAndroid.beginHandsFree(String(voiceRun));
}
function finishReply(text,token){
 if(!pendingInput||!session.isCurrent(token))return;
 const content=String(text||'Je cherche encore mes mots.').slice(0,1200);
 el('answer').textContent=content;record('bot',content);
 const talking=session.finish(token);clearPending();
 if(talking&&isNative){window.BonzeAndroid.speakReply(content,describedMood,String(voiceRun));}
 else{browserSpeak(content);state('off');}
}
function handleText(text,source='text'){
 if(resourceMode==='off'){el('native-status').textContent='Bonze est en pause. Choisis un autre mode dans les options.';return;}
 if(source==='text'&&session.enabled)stopAll('Écriture : conversation vocale arrêtée.');
 const clean=String(text??'').trim().slice(0,600);
 if(!session.accept(clean,source))return;
 const token=session.turn;
 el('message').value='';el('heard').textContent=clean;
 const familiar=history.length>0;record('human',clean);
 el('message').disabled=true;el('send-message').disabled=true;
 let stimulus={},summary='Classifieur émotionnel indisponible.';
 if(trainedWeights)try{
  const routed=inferExperts(clean,trainedWeights);
  stimulus=Object.fromEntries(routed.top2.map(x=>[x.name,x.weight*x.activation]));
  summary='Stimulus des micro-experts : '+routed.top2.map(x=>x.name+' '+Math.round(x.weight*100)+' %').join(' · ');
 }catch(error){summary='Erreur de routage : '+error.message;}
 identity={...identity,acquired:experience(identity,stimulus,'exchange',{familiar})};
 el('experts-state').textContent=summary;state('thinking');save();
 pendingInput={text:clean,token};
 if(isNative&&neuralEnabled&&['precise','eco'].includes(resourceMode)&&window.BonzeAndroid.hasBundledWeights()){
  el('brain-status').textContent='Mes neurones locaux réfléchissent…';
  window.BonzeAndroid.generateLocalReply(clean,describedMood,String(token));
 }else{
  el('brain-status').textContent='Réponse du mode textuel léger.';
  finishReply(answer(clean,profile||{}).text,token);
 }
}
window.BonzeAIResult=(text,token)=>{
 if(!pendingInput||String(pendingInput.token)!==String(token))return;
 el('brain-status').textContent='Réponse du modèle local dense LFM2.5-230M.';
 finishReply(text,pendingInput.token);
};
window.BonzeAIError=(reason,token)=>{
 if(!pendingInput||String(pendingInput.token)!==String(token))return;
 el('brain-status').textContent=String(reason).slice(0,260);
 identity={...identity,acquired:experience(identity,{},'uncertain')};
 finishReply(answer(pendingInput.text,profile||{}).text,pendingInput.token);
};
window.BonzeNativeResult=(text,run)=>{if(String(run)===String(voiceRun))handleText(text,"voice");};
window.BonzeNativeStatus=(text,run)=>{if(String(run)===String(voiceRun))el('native-status').textContent=String(text).slice(0,400);};
window.BonzeConversationState=(next,run)=>{
 if(String(run)!==String(voiceRun))return;
 if(next==='off'||next==='indisponible'){stopAll(el('native-status').textContent,false);state(next);}
 else if(session.enabled)state(next);
};
window.BonzeMemoryNotice=level=>stopAll(level==='critical'?'Mémoire critique : écoute arrêtée.':'Mémoire chargée : écoute arrêtée.',false);
faceTouch.addEventListener('click',toggleConversation);nativeButton.addEventListener('click',toggleConversation);
el('stop-all').addEventListener('click',()=>stopAll());
el('open-keyboard').addEventListener('click',showKeyboard);
el('chat').addEventListener('submit',e=>{e.preventDefault();handleText(el('message').value);});
function closeSettings(){el('settings').hidden=true;el('settings-open').setAttribute('aria-expanded','false');el('settings-open').textContent='⚙️ Options';el('settings-open').focus();}
el('settings-open').addEventListener('click',()=>{
 if(!el('settings').hidden){closeSettings();return;}
 el('settings').hidden=false;el('settings-open').setAttribute('aria-expanded','true');el('settings-open').textContent='✕ Fermer';el('settings-close').focus();
});
el('settings-close').addEventListener('click',closeSettings);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!el('settings').hidden)closeSettings();else stopAll();}});
el('intro').addEventListener('submit',e=>{
 e.preventDefault();const nickname=el('nickname').value.trim().slice(0,40);if(!nickname)return;
 profile={nickname};el('profile-status').textContent='Enchanté, '+nickname+' ! Surnom local, sans authentification.';save();
});
if(profile){el('nickname').value=profile.nickname;el('profile-status').textContent='Enchanté, '+profile.nickname+' ! Surnom enregistré localement.';}
function applyMode(){
 el('resource-mode').value=resourceMode;
 const enabled=neuralEnabled&&['precise','eco'].includes(resourceMode);
 el('neural').checked=enabled;el('neural').disabled=!isNative||!['precise','eco'].includes(resourceMode);
 if(isNative){window.BonzeAndroid.setNeuralEnabled(enabled);window.BonzeAndroid.setEconomyMode(resourceMode==='eco');}
 save();
}
el('resource-mode').addEventListener('change',e=>{stopAll();resourceMode=e.target.value;applyMode();});
el('neural').addEventListener('change',()=>{stopAll();neuralEnabled=el('neural').checked;applyMode();});
el('caption-size').value=fontSize;
function sizeCaptions(value){fontSize=Math.max(1,Math.min(3,Number(value)||2));document.documentElement.style.setProperty('--subtitle',{1:'1.25rem',2:'1.68rem',3:'2.15rem'}[fontSize]);save();}
sizeCaptions(fontSize);el('caption-size').addEventListener('input',e=>sizeCaptions(e.target.value));
function visualSettings(){document.body.classList.toggle('high-contrast',contrast);document.body.classList.toggle('reduce-motion',reduceMotion);el('contrast').checked=contrast;el('reduce-motion').checked=reduceMotion;save();}
el('contrast').addEventListener('change',e=>{contrast=e.target.checked;visualSettings();});
el('reduce-motion').addEventListener('change',e=>{reduceMotion=e.target.checked;visualSettings();});
visualSettings();
el('voice').disabled=isNative;
if(isNative)el('voice-status').textContent='Conversation : voix française locale Android. Piper reste à intégrer.';
el('voice').addEventListener('change',()=>{browserVoiceEnabled=el('voice').checked;el('voice-status').textContent=browserVoiceEnabled?'Voix locale choisie si disponible.':'Lecture désactivée.';if(!browserVoiceEnabled)window.speechSynthesis?.cancel();});
setupEditor({getIdentity:()=>identity,setIdentity:i=>{identity=i;renderAppearance(face,i);describedMood='';draw();save();},root:el('avatar-fields'),description:el('avatar-description')});
el('avatar-read').addEventListener('click',()=>{stopAll();if(isNative)window.BonzeAndroid.speakDescription(describe(identity));else browserSpeak(describe(identity),true);});
el('resources-refresh').addEventListener('click',()=>{
 if(!isNative){el('resources-real').textContent='Mesures système indisponibles dans ce navigateur.';return;}
 try{const r=JSON.parse(window.BonzeAndroid.resourceSnapshot());if(![r.availableMiB,r.totalMiB,r.pssMiB].every(Number.isFinite))throw Error('metrics');el('resources-real').textContent=`Mesuré sur Android : RAM disponible ${r.availableMiB} Mio / ${r.totalMiB} Mio ; processus ${r.pssMiB} Mio PSS. Dernière génération : ${r.lastLatencyMs??'non mesurée'} ms ; CPU du thread appelant ${r.lastCpuMs??'non mesuré'} ms.`;}catch{el('resources-real').textContent='Mesure indisponible.';}
});
function policy(){const p=listening({disabled:false,pressure:el('pressure').value});el('policy').textContent='Simulation : '+p.mode+' / '+p.reason+'. Cette valeur ne mesure pas la mémoire Android.';}
el('pressure').addEventListener('change',policy);policy();showHistory();
if(isNative){try{nativeReady=window.BonzeAndroid.localSpeechAvailable();}catch{}nativeButton.hidden=false;nativeButton.disabled=!nativeReady;}
el('native-status').textContent=isNative?(nativeReady?'Micro arrêté. Un appui pour parler.':'Reconnaissance locale indisponible. Le clavier reste disponible.'):'WebApp : clavier disponible. Aucun micro distant utilisé.';
const lastHuman=history.filter(x=>x.role==='human').at(-1),lastBot=history.filter(x=>x.role==='bot').at(-1);
if(lastHuman)el('heard').textContent=lastHuman.text;if(lastBot)el('answer').textContent=lastBot.text;
renderAppearance(face,identity);applyMode();state('off');
setInterval(()=>{
 const now=performance.now();const dt=Math.min(2,(now-lastTick)/1000);lastTick=now;
 if(document.hidden)return;
 identity={...identity,acquired:advance(identity,dt,mode)};draw();
 if(now-lastSaved>10000)save();
},200);
document.addEventListener('visibilitychange',()=>{lastTick=performance.now();if(document.hidden)stopAll('Application en arrière-plan : écoute arrêtée.');});
window.addEventListener('pagehide',()=>stopAll('Écoute arrêtée.'));
fetch('../core/weights/expert-router-v1.json').then(r=>r.ok?r.json():Promise.reject(Error('404'))).then(w=>{trainedWeights=w;el('experts-state').textContent='Huit micro-experts émotionnels disponibles.';}).catch(()=>{});
if('serviceWorker' in navigator&&!isNative)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
