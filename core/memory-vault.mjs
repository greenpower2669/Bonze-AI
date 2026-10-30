import {snapshotDrawers,restoreDrawers} from './memory-drawers.mjs';
const textEncoder=new TextEncoder(),textDecoder=new TextDecoder('utf-8',{fatal:true});
const AAD=textEncoder.encode('BonzeAI|private-drawers|v1|PBKDF2-310000|AES-GCM');
const iter=310000;
const b64=v=>{let s='';for(let i=0;i<v.length;i+=8192)s+=String.fromCharCode(...v.subarray(i,i+8192));return btoa(s);};
const un64=(v,max)=>{
 if(typeof v!=='string'||v.length>max*2||!/^[A-Za-z0-9+/]*={0,2}$/.test(v))throw Error('Coffre invalide');
 const a=Uint8Array.from(atob(v),c=>c.charCodeAt(0));if(a.length>max)throw Error('Coffre volumineux');return a;
};
function checkSecret(secret){
 if(typeof secret!=='string'||secret.length<12||secret.length>256)throw Error('Phrase secrète de 12 caractères minimum requise');
}
async function derive(secret,salt){
 checkSecret(secret);
 const m=await crypto.subtle.importKey('raw',textEncoder.encode(secret),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',iterations:iter,salt},m,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export function validateVaultEnvelope(value,scope){
 if(value==null)return null;
 if(!value||typeof value!=='object'||Array.isArray(value)||value.format!=='bonze-drawers'||
   value.version!==1||value.scope!==scope||value.iterations!==iter||
   typeof value.salt!=='string'||typeof value.iv!=='string'||typeof value.ciphertext!=='string')throw Error('Coffre privé incompatible');
 const salt=un64(value.salt,16),iv=un64(value.iv,12),cipher=un64(value.ciphertext,256000);
 if(salt.length!==16||iv.length!==12||cipher.length<16)throw Error('Coffre altéré');
 return {format:'bonze-drawers',version:1,scope,iterations:iter,salt:value.salt,iv:value.iv,ciphertext:value.ciphertext};
}
export async function encryptDrawers(state,access,secret){
 const data=snapshotDrawers(state,access),salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await derive(secret,salt);
 const bytes=textEncoder.encode(JSON.stringify(data));if(bytes.byteLength>256000)throw Error('Coffre trop volumineux');
 const ciphertext=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:AAD,tagLength:128},key,bytes));
 return {format:'bonze-drawers',version:1,scope:state.scope,iterations:iter,salt:b64(salt),iv:b64(iv),ciphertext:b64(ciphertext)};
}
export async function decryptDrawers(value,scope,secret){
 const envelope=validateVaultEnvelope(value,scope),salt=un64(envelope.salt,16),iv=un64(envelope.iv,12);
 try{
  const data=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:AAD,tagLength:128},
    await derive(secret,salt),un64(envelope.ciphertext,256000));
  const access={verified:true,scope};
  return restoreDrawers(JSON.parse(textDecoder.decode(data)),access);
 }catch{throw Error('Phrase secrète incorrecte ou coffre altéré : aucun souvenir ouvert');}
}
