import '../core/council.js';
import '../core/repertoire-corpus.js';
import '../core/repertoire.js';
import {setupBackup} from './backup-ui.js';
import {captionPair} from '../core/captions.mjs';
import {answer,listening} from '../core/bonze.mjs';
import {inferExperts} from '../core/experts.mjs';
import {createConversationSession} from '../core/conversation.mjs';
import {createSpeechMotion} from '../core/speech.mjs';
import {createNativeView} from '../core/native-view.mjs';
import {restoreIdentity} from '../core/identity.mjs';
import {advance,experience} from '../core/organism.mjs';
import {setupEditor,renderAppearance,renderExpression,describe} from './avatar.js';
const el=id=>document.getElementById(id);
const STORAGE='bonze-proto-01';
const session=createConversationSession();
const nativeView=createNativeView(),speechMotion=createSpeechMotion();
const isNative=!!window.BonzeAndroid;
const face=el('face'), nativeButton=el('native-mic'), faceTouch=el('face-touch');
let profile=null,history=[],trainedWeights=null,pendingInput=null;
let nativeReady=false,mode='off',lastSaved=performance.now(),lastTick=performance.now();
let fontSize=2,resourceMode='precise',neuralEnabled=true,contrast=false,reduceMotion=false;
let browserVoiceEnabled=false,identity,saved=null,voiceRun=0,councilState=null,councilParams=null,councilJournal=[];
let nativeActive=false,nativeBusy=false,nativeConnected=false,nativeVoice='',lastNativeHumanId=0,pendingVoice=null;
try{saved=JSON.parse(localStorage.getItem(STORAGE)||'null');}catch{}
if(saved&&typeof saved==='object'){
 profile=typeof saved.profile?.nickname==='string'?{nickname:saved.profile.nickname.slice(0,40)}:null;
 history=Array.isArray(saved.history)?saved.history.filter(r=>typeof r?.text==='string'&&['human','bot'].includes(r.role)).slice(-30):[];
 fontSize=[1,2,3].includes(saved.fontSize)?saved.fontSize:2;
 resourceMode=['precise','eco','light','text','off'].includes(saved.resourceMode)?saved.resourceMode:'precise';
 neuralEnabled=saved.neuralEnabled!==false;
 contrast=saved.contrast===true;reduceMotion=saved.reduceMotion===true;
 browserVoiceEnabled=saved.browserVoiceEnabled===true;lastNativeHumanId=Number.isSafeInteger(saved.lastNativeHumanId)?saved.lastNativeHumanId:0;
}
let scriptedState=saved?.scriptedState||null;
identity=restoreIdentity(saved?.identity);councilState=saved?.councilState||{version:1,forces:{...identity.acquired.forces},globalEndurance:identity.acquired.endurance};councilParams=saved?.councilParams||null;try{councilJournal=JSON.parse(localStorage.getItem("bonze-diagnostics")||"[]");}catch{}
function webState(){return {profile,history:history.slice(-30),fontSize,resourceMode,neuralEnabled,contrast,reduceMotion,identity,browserVoiceEnabled,lastNativeHumanId,councilState,councilParams,scriptedState};}
function saveNativeWeb(){if(isNative&&nativeConnected)window.BonzeAndroid.command('save-web',JSON.stringify({web:webState(),weights:trainedWeights}),'');}
function save(){
 try{localStorage.setItem(STORAGE,JSON.stringify(webState()));if(!isNative)localStorage.setItem('bonze-diagnostics',JSON.stringify(councilJournal));}
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
 const e=renderExpression(face,identity,mode,speechMotion.sample(performance.now(),reduceMotion));
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
 const active=isNative?nativeActive:session.enabled;
 nativeButton.setAttribute('aria-pressed',String(active));
 nativeButton.textContent=active?'⏹ Arrêter la conversation':'🎙️ Démarrer la conversation';
 faceTouch.setAttribute('aria-label',active?'Toucher Bonze pour arrêter la conversation':isNative?'Toucher Bonze pour lui parler':'Toucher Bonze pour ouvrir le clavier');
 draw();
}
function clearPending(){pendingInput=null;el('message').disabled=false;el('send-message').disabled=false;}
function nativeCommand(action,text=''){
 const id=Date.now().toString(36)+'-'+(++voiceRun);nativeView.expect(id);
 window.BonzeAndroid.command(action,text,id);return id;
}
function stopAll(reason='Conversation arrêtée par toi.',notifyNative=true){
 session.stop();nativeActive=false;nativeBusy=false;clearPending();speechMotion.stop();state('off');
 if(notifyNative&&isNative)nativeCommand('stop');
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
 const u=new SpeechSynthesisUtterance(text);u.voice=voice;u.lang=voice.lang;u.rate=.98;
 const id='web-'+Date.now();
 u.onstart=()=>{speechMotion.start(id,text,performance.now());state('speaking');};
 u.onboundary=e=>speechMotion.range(id,e.charIndex,e.charIndex+(e.charLength||4),performance.now());
 const ended=()=>{speechMotion.end(id);state('off');};u.onend=ended;u.onerror=ended;
 window.speechSynthesis.cancel();window.speechSynthesis.speak(u);
}
function showKeyboard(){
 const panel=el('keyboard-panel'),visible=panel.hidden;panel.hidden=!visible;
 el('open-keyboard').setAttribute('aria-expanded',String(visible));
 el('open-keyboard').textContent=visible?'⌨️ Masquer le clavier':'⌨️ Écrire plutôt que parler';
 if(visible){if(isNative?nativeActive:session.enabled)stopAll('Écriture : conversation vocale arrêtée.');el('message').focus();}
}
function toggleConversation(){
 if(isNative?nativeActive:session.enabled){stopAll();return;}
 if(nativeBusy||session.busy){el('native-status').textContent='Je termine ma réponse. Tu peux aussi tout arrêter.';return;}
 if(['off','text'].includes(resourceMode)){el('native-status').textContent='Choisis un mode avec voix dans les options.';return;}
 if(!isNative||!nativeReady){if(el('keyboard-panel').hidden)showKeyboard();return;}
 nativeActive=true;state('waiting');configureNative();nativeCommand('start');
}
function finishReply(text,token){
 if(!pendingInput||!session.isCurrent(token))return;
 const content=String(text||'Je cherche encore mes mots.').slice(0,1200);
 el('answer').textContent=content;record('bot',content);
 const talking=session.finish(token);clearPending();
 browserSpeak(content);state('off');
}
function handleText(text,source='text'){
 if(resourceMode==='off'){el('native-status').textContent='Bonze est en pause. Choisis un autre mode dans les options.';return;}
 const clean=String(text??'').trim().slice(0,600);
 if(isNative){if(!clean||nativeBusy)return;el('message').value='';nativeBusy=true;el('message').disabled=true;el('send-message').disabled=true;state('thinking');configureNative();nativeCommand('text',clean);return;}
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
 const r=JSON.parse(globalThis.BonzeCouncil.run(JSON.stringify({state:councilState,params:councilParams,weights:trainedWeights,temperament:identity.innate.temperament,text:clean,context:{familiar},seconds:0})));
 councilState=r.state;councilParams=r.params;councilJournal.push({at:Date.now(),stage:'council',data:r});councilJournal=councilJournal.slice(-120);
 identity={...identity,acquired:{...experience(identity,stimulus,'exchange',{familiar}),forces:{...r.state.forces},endurance:r.state.globalEndurance}};
 el('experts-state').textContent=summary;state('thinking');save();
 pendingInput={text:clean,token};
 let spoken='';
 try{
  const selected=JSON.parse(globalThis.BonzeRepertoire.run(JSON.stringify({text:clean,state:scriptedState,forces:r.state.forces,endurances:r.state.endurances,synonyms:['humour','curiosite'].includes(r.trace?.action)})));
  scriptedState=selected.state;spoken=selected.text;
  councilJournal.push({at:Date.now(),stage:'repertoire',data:{card:selected.card,intent:selected.intent,source:'authored'}});councilJournal=councilJournal.slice(-120);
  save();
 }catch(error){spoken=answer(clean,profile||{}).text;}
 el('brain-status').textContent='Répliques préécrites · choix émotionnel local.';
 finishReply(spoken,token);
}
function configData(){return JSON.stringify({mode:resourceMode,neural:neuralEnabled,readText:browserVoiceEnabled,mood:describedMood||'curiosite',nickname:profile?.nickname||'',voice:nativeVoice,identity});}
function configureNative(){if(isNative&&nativeConnected)window.BonzeAndroid.configureNative(configData());}
function applyNativeHistory(rows){
 if(!Array.isArray(rows))return;
 const valid=rows.filter(r=>typeof r?.text==='string'&&['human','bot'].includes(r.role)).slice(-30);
 for(const row of valid){
  if(row.role!=='human'||!Number.isSafeInteger(row.id)||row.id<=lastNativeHumanId)continue;
  let stimulus={};if(trainedWeights)try{const routed=inferExperts(row.text,trainedWeights);stimulus=Object.fromEntries(routed.top2.map(x=>[x.name,x.weight*x.activation]));}catch{}
  identity={...identity,acquired:experience(identity,stimulus,'exchange',{familiar:history.length>0})};lastNativeHumanId=Math.max(lastNativeHumanId,row.id);
 }
 history=valid.map(r=>({role:r.role,text:r.text}));showHistory();
 const captions=captionPair(valid);
 if(captions.heard)el('heard').textContent=captions.heard;
 el('answer').textContent=captions.pending?'Je prépare ma réponse…':captions.answer||'Coucou ! Tu peux me parler ou utiliser le clavier.';
 el('answer').setAttribute('aria-busy',String(captions.pending));save();
}
window.BonzeNativeEvent=e=>{
 if(!nativeView.accept(e))return;
 if(e.council?.state){councilState=e.council.state;councilParams=e.council.params;}
 if(e.type==='snapshot'){
  if(e.restoredWeb){
   try{localStorage.setItem(STORAGE,JSON.stringify(e.restoredWeb));if(e.restoreWeights)localStorage.setItem('bonze-expert-weights',JSON.stringify(e.restoreWeights));if(e.restoreJournal)localStorage.setItem('bonze-diagnostics',JSON.stringify(e.restoreJournal));window.BonzeAndroid.command('restore-ack','','');location.reload();return;}catch{el('profile-status').textContent='Écriture de la restauration impossible : la copie native attend toujours.';return;}
  }
  nativeActive=e.active===true;nativeBusy=e.busy===true;
  if(Number.isSafeInteger(e.importedThrough))lastNativeHumanId=Math.max(lastNativeHumanId,e.importedThrough);
  applyNativeHistory(e.history);el('message').disabled=nativeBusy;el('send-message').disabled=nativeBusy;
  el('native-status').textContent=String(e.status||'');state(e.state);
  if(e.speech)speechMotion.resume(e.speech.id,e.speech.text,performance.now()-Math.min(60000,e.speech.ageMs||0));
  else if(e.state!=='speaking')speechMotion.stop();
  const select=el('native-voice');if(Array.isArray(e.voices)){
   select.replaceChildren();for(const v of e.voices){const o=document.createElement('option');o.value=v.name;o.textContent=v.name==='piper-mls'?'MLS · ma voix Piper locale':v.name;select.append(o);}
   const acknowledged=String(e.voice||'');
   if(pendingVoice===acknowledged||pendingVoice&&!e.voices.some(v=>v.name===pendingVoice))pendingVoice=null;
   nativeVoice=pendingVoice||acknowledged;select.value=nativeVoice;
   if(e.piperFallback)el('voice-status').textContent='Piper a rencontré une difficulté ; relais vocal Android pour garder une voix régulière.';
   el('voice-status').textContent=nativeVoice?'Voix locale : '+nativeVoice+'. Lecture par phrases et pauses.':'Voix française locale en préparation ou absente.';
   if(e.piperFallback)el('voice-status').textContent='Relais vocal Android actif : Piper indisponible pour cette conversation.';
  }
 }else if(e.type==='speech-level')speechMotion.level(e.id,e.level,performance.now());
 else if(e.type==='speech-start'){speechMotion.start(e.id,e.text,performance.now());state('speaking');}
 else if(e.type==='speech-range')speechMotion.range(e.id,e.start,e.end,performance.now());
 else if(e.type==='speech-end')speechMotion.end(e.id);
 if(councilState){identity={...identity,acquired:{...identity.acquired,forces:{...councilState.forces},endurance:councilState.globalEndurance}};}
 draw();
};
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
 profile={nickname};el('profile-status').textContent='Enchanté, '+nickname+' ! Surnom local, sans authentification.';save();configureNative();
});
if(profile){el('nickname').value=profile.nickname;el('profile-status').textContent='Enchanté, '+profile.nickname+' ! Surnom enregistré localement.';}
function applyMode(){
 el('resource-mode').value=resourceMode;
 const enabled=neuralEnabled&&['precise','eco'].includes(resourceMode);
 el('neural').checked=enabled;el('neural').disabled=!isNative||!['precise','eco'].includes(resourceMode);
 configureNative();
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
el('voice').checked=browserVoiceEnabled;el('native-voice-row').hidden=!isNative;
el('native-voice').addEventListener('change',e=>{const wanted=e.target.value;pendingVoice=wanted;nativeVoice=wanted;stopAll();configureNative();});
el('voice').addEventListener('change',()=>{browserVoiceEnabled=el('voice').checked;el('voice-status').textContent=browserVoiceEnabled?'Voix locale choisie si disponible.':'Lecture désactivée.';if(!browserVoiceEnabled)window.speechSynthesis?.cancel();configureNative();save();});
setupEditor({getIdentity:()=>identity,setIdentity:i=>{identity=i;renderAppearance(face,i);describedMood='';draw();save();},root:el('avatar-fields'),description:el('avatar-description')});
el('voice-sample').addEventListener('click',()=>{stopAll();if(['off','text'].includes(resourceMode)){el('voice-status').textContent='Choisis un mode avec voix pour écouter cet essai.';return;}const sample='Bonjour, je suis ton petit compagnon. Tu veux jouer avec moi ?';closeSettings();el('answer').textContent=sample;if(isNative)nativeCommand('describe',sample);else browserSpeak(sample,true);});
el('avatar-read').addEventListener('click',()=>{stopAll();if(isNative)nativeCommand('describe',describe(identity));else browserSpeak(describe(identity),true);});
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
 if(!isNative){const r=JSON.parse(globalThis.BonzeCouncil.run(JSON.stringify({state:councilState,params:councilParams,temperament:identity.innate.temperament,seconds:dt,activity:mode})));councilState=r.state;councilParams=r.params;identity={...identity,acquired:{...identity.acquired,forces:{...r.state.forces},endurance:r.state.globalEndurance}};}draw();
 if(now-lastSaved>10000){save();saveNativeWeb();configureNative();}
},65);
document.addEventListener('visibilitychange',()=>{
 lastTick=performance.now();save();
 if(!isNative&&document.hidden)stopAll('Lecture suspendue : écran masqué.');
 if(isNative&&!document.hidden)window.BonzeAndroid.command('sync','','');
});
window.addEventListener('pagehide',()=>{save();saveNativeWeb();if(!isNative)stopAll('Lecture arrêtée.');});
setupBackup({isNative,getData:()=>({schema:1,createdAt:Date.now(),web:webState(),native:null,council:{state:councilState,params:councilParams},weights:trainedWeights,journal:councilJournal}),stop:()=>stopAll(),saveNativeWeb,restoreWeb:data=>{localStorage.setItem(STORAGE,JSON.stringify(data.web));if(data.weights)localStorage.setItem('bonze-expert-weights',JSON.stringify(data.weights));else localStorage.removeItem('bonze-expert-weights');localStorage.setItem('bonze-diagnostics',JSON.stringify(data.journal||[]));location.reload();}});
if(isNative){nativeConnected=true;window.BonzeAndroid.connectNative(JSON.stringify({history}),configData());}
fetch('../core/weights/expert-router-v1.json').then(r=>r.ok?r.json():Promise.reject(Error('404'))).then(w=>{try{const custom=JSON.parse(localStorage.getItem('bonze-expert-weights'));if(custom){inferExperts('',custom);w=custom;}}catch{}trainedWeights=w;el('experts-state').textContent='Huit micro-experts émotionnels disponibles.';}).catch(()=>{});
if('serviceWorker' in navigator&&!isNative)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

