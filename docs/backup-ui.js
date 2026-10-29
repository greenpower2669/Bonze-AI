import {renderAdmin,setupAdminGesture} from './admin-ui.js';
import {sealBackup,openBackup} from '../core/backup.mjs';
export function setupBackup({getData,restoreWeb,stop,saveNativeWeb,isNative}){
 const el=id=>document.getElementById(id),status=message=>el('backup-status').textContent=message;
 let nativeData=null,preview=null,exportSecret='',importSecret='';
 const admin=(action,payload='')=>window.BonzeAndroid.admin(action,payload);
 setupAdminGesture(()=>el('admin-open').click());
 function download(text){const url=URL.createObjectURL(new Blob([text],{type:'application/octet-stream'})),a=document.createElement('a');a.href=url;a.download='Bonze-AI-sauvegarde-'+Date.now()+'.bonze';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 async function encrypt(){try{const data=getData();const text=await sealBackup({...data,...nativeData},exportSecret);exportSecret='';el('backup-password').value='';if(isNative)admin('export',text);else{download(text);status('Fichier chiffré préparé. Vérifie son enregistrement.');}}catch(e){status(e.message);}}
 async function inspect(text){try{preview=await openBackup(text,importSecret);el('backup-password').value='';importSecret='';el('backup-restore').hidden=false;status('Sauvegarde vérifiée : '+preview.web.history.length+' échanges conservés, identité '+preview.web.identity.seed.slice(0,8)+'. Restaure seulement si tu veux remplacer l’état actuel. Une copie de retour arrière sera gardée.');}catch(e){preview=null;importSecret='';el('backup-restore').hidden=true;status(e.message);}}
 el('backup-export').addEventListener('click',()=>{exportSecret=el('backup-password').value;el('backup-password').value='';stop();saveNativeWeb();nativeData=null;if(isNative)admin('snapshot');else encrypt();});
 el('backup-import').addEventListener('click',()=>{importSecret=el('backup-password').value;el('backup-password').value='';stop();preview=null;el('backup-restore').hidden=true;if(isNative)admin('import');else el('backup-file').click();});
 el('backup-file').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;if(f.size>8*1024*1024){status('Fichier trop volumineux.');return;}await inspect(await f.text());e.target.value='';});
 el('backup-restore').addEventListener('click',()=>{if(!preview)return;stop();saveNativeWeb();if(isNative)admin('restore',JSON.stringify(preview));else{try{localStorage.setItem('bonze-rollback',JSON.stringify(getData()));restoreWeb(preview);status('Restauration enregistrée. Micro arrêté.');}catch(e){status('Restauration impossible, état précédent conservé.');}}});
 el('backup-rollback').addEventListener('click',()=>{stop();if(isNative)admin('rollback');else{try{const previous=JSON.parse(localStorage.getItem('bonze-rollback'));if(!previous)throw Error();restoreWeb(previous);}catch{status('Aucun état précédent disponible.');}}});
 el('admin-open').addEventListener('click',()=>{stop();if(isNative)admin('unlock');else status('La console authentifiée utilise le code de verrouillage Android. Les sauvegardes Web restent chiffrées par leur phrase secrète.');});
 el('admin-close').addEventListener('click',()=>{el('admin-console').hidden=true;if(isNative)admin('lock');});
 window.BonzeAdminEvent=e=>{
  if(e.message)status(e.message);if(['error','cancelled'].includes(e.type)){exportSecret='';importSecret='';}
  if(e.type==='snapshot'){nativeData=e.data;encrypt();}
  if(e.type==='imported')inspect(e.data.encrypted);
  if(e.type==='restored'){preview=null;importSecret='';el('backup-restore').hidden=true;}
  if(e.type==='unlocked'){renderAdmin(e.data);el('admin-console').hidden=false;el('admin-journal').textContent=JSON.stringify(e.data,null,2);el('admin-close').focus();}
  if(e.type==='locked'){el('admin-console').hidden=true;}
 };
 document.addEventListener('visibilitychange',()=>{if(document.hidden){el('backup-password').value='';el('admin-console').hidden=true;}});
}

