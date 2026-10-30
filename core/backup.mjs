import './council.js';
import {restoreIdentity} from './identity.mjs';
import {inferExperts} from './experts.mjs';
import {validateVaultEnvelope} from './memory-vault.mjs';
const MAX=8*1024*1024,ITERATIONS=310000;
const encoder=new TextEncoder(),decoder=new TextDecoder('utf-8',{fatal:true});
const modes=['precise','eco','light','text','off'];
function fail(){throw new Error('Sauvegarde invalide ou version non prise en charge.');}
const plain=x=>x&&typeof x==='object'&&!Array.isArray(x);
function rows(items){
 if(!Array.isArray(items)||items.length>30)fail();
 return items.map(r=>{if(!plain(r)||!['human','bot'].includes(r.role)||typeof r.text!=='string'||r.text.length>1200)fail();return{...(Number.isSafeInteger(r.id)&&r.id>0?{id:r.id}:{}),role:r.role,text:r.text};});
}
export function validateBackup(input){
 if(!plain(input)||input.schema!==1||!plain(input.web)||JSON.stringify(input).length>MAX/2)fail();
 const w=input.web,i=w.identity;
 if(!plain(i)||i.version!==1||typeof i.seed!=='string'||i.seed.length<1||i.seed.length>128||!plain(i.acquired)||!plain(i.acquired.forces))fail();
 for(const n of Object.values(i.acquired.forces))if(!Number.isFinite(n)||n<0||n>1)fail();
 const web={identity:restoreIdentity(i),history:rows(w.history||[]),profile:typeof w.profile?.nickname==='string'?{nickname:w.profile.nickname.slice(0,40)}:null,fontSize:[1,2,3].includes(w.fontSize)?w.fontSize:2,resourceMode:modes.includes(w.resourceMode)?w.resourceMode:'text',neuralEnabled:w.neuralEnabled===true,contrast:w.contrast===true,reduceMotion:w.reduceMotion===true,browserVoiceEnabled:w.browserVoiceEnabled===true,lastNativeHumanId:Number.isSafeInteger(w.lastNativeHumanId)?w.lastNativeHumanId:0,memoryVault:validateVaultEnvelope(w.memoryVault??null,i.seed)};
 let native=null;
 if(input.native!=null){const n=input.native;if(!plain(n)||n.schema!==1||!modes.includes(n.mode))fail();native={schema:1,history:rows(n.history),scene:String(n.scene||'').slice(0,360),mode:n.mode,neural:n.neural===true,readText:n.readText===true,voice:String(n.voice||'').slice(0,200),mood:String(n.mood||'curiosite').slice(0,30),model:['230m','12b'].includes(n.model)?n.model:'230m'};}
 let weights=null;if(input.weights!=null){inferExperts('',input.weights);weights=JSON.parse(JSON.stringify(input.weights));}
 const journal=input.journal??[];if(!Array.isArray(journal)||journal.length>200||JSON.stringify(journal).length>1000000)fail();
 let council=null;if(!input.council?.state){const migrated=JSON.parse(globalThis.BonzeCouncil.run(JSON.stringify({state:{version:1,forces:web.identity.acquired.forces,globalEndurance:web.identity.acquired.endurance},seconds:0})));input={...input,council:{state:migrated.state,params:migrated.params}};}
 if(input.council?.state){const c=input.council;if(c.state.version!==1)fail();for(const group of ['forces','endurances'])for(const key of globalThis.BonzeCouncil.names)if(!Number.isFinite(c.state[group]?.[key])||c.state[group][key]<0||c.state[group][key]>1)fail();if(!Number.isFinite(c.state.globalEndurance)||c.state.globalEndurance<0||c.state.globalEndurance>1)fail();
 const result=JSON.parse(globalThis.BonzeCouncil.run(JSON.stringify({state:c.state,params:c.params,weights,seconds:0})));council={state:result.state,params:result.params};web.councilState=result.state;web.councilParams=result.params;}
 return {council,schema:1,createdAt:Number.isFinite(input.createdAt)?input.createdAt:0,web,native,weights,journal};
}
function b64(bytes){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);}
function un64(s,max){if(typeof s!=='string'||s.length>max*2||!/^[A-Za-z0-9+/]*={0,2}$/.test(s))fail();const b=Uint8Array.from(atob(s),c=>c.charCodeAt(0));if(b.length>max)fail();return b;}
async function key(password,salt){
 if(typeof password!=='string'||password.length<12||password.length>256)throw new Error('Choisis une phrase secrète de 12 à 256 caractères.');
 const material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',iterations:ITERATIONS,salt},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
const aad=encoder.encode('BonzeAI|backup|1|PBKDF2-SHA256|310000|AES-256-GCM');
export async function sealBackup(input,password){
 const data=validateBackup(input),salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},await key(password,salt),encoder.encode(JSON.stringify(data)));
 return JSON.stringify({format:'bonze-backup',version:1,kdf:'PBKDF2-SHA256',iterations:ITERATIONS,salt:b64(salt),iv:b64(iv),ciphertext:b64(new Uint8Array(cipher))});
}
export async function openBackup(text,password){
 if(typeof text!=='string'||text.length>MAX)fail();let envelope;try{envelope=JSON.parse(text);}catch{fail();}
 if(envelope?.format!=='bonze-backup'||envelope.version!==1||envelope.kdf!=='PBKDF2-SHA256'||envelope.iterations!==ITERATIONS)fail();
 const salt=un64(envelope.salt,16),iv=un64(envelope.iv,12),cipher=un64(envelope.ciphertext,MAX/2);
 if(salt.length!==16||iv.length!==12||cipher.length<16)fail();
 try{const bytes=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},await key(password,salt),cipher);return validateBackup(JSON.parse(decoder.decode(bytes)));}
 catch{throw new Error('Phrase secrète incorrecte ou sauvegarde altérée. Aucune donnée modifiée.');}
}

