/* Bonze AI: platform-neutral drawer index and selective recall.
 * Never persists plaintext, authenticates a person, or silently learns.
 * The caller MUST provide authenticated per-person access and encrypted storage.
 * All methods fail closed when authorization is missing. */
export const DRAWER_SCHEMA=1;
export const DRAWER_KINDS=Object.freeze([
  'personnalite','personnes','relations','connaissances','experiences',
  'competences','missions','scenes','archives'
]);
const STATUSES=new Set(['declare','observe','verifie','hypothese','fiction','conteste']);
const MAX_ITEMS=300,MAX_TEXT=360,MAX_TAGS=6;
function validateSVC(v){
 if(v==null)return null;
 assert(v&&typeof v==='object'&&!Array.isArray(v),'Fiche SVC invalide');
 for(const [key,max] of [['subject',100],['verb',60],['complement',220]]){
  assert(typeof v[key]==='string'&&v[key].length>=2&&v[key].length<=max&&clean(v[key],max)===v[key],'Fiche SVC invalide');
 }
 return {subject:v.subject,verb:v.verb,complement:v.complement};
}
function svcRelation(v){return norm(v.subject)+'|'+norm(v.verb);}
function svcDuplicate(items,row,id){return Boolean(row.svc&&items.some(v=>v.id!==id&&v.svc&&
 svcRelation(v.svc)===svcRelation(row.svc)&&norm(v.svc.complement)===norm(row.svc.complement)));}
function svcConflict(items,row,id){return Boolean(row.svc&&row.status!=='fiction'&&items.some(v=>v.id!==id&&v.svc&&v.status!=='fiction'&&
 svcRelation(v.svc)===svcRelation(row.svc)&&norm(v.svc.complement)!==norm(row.svc.complement)));}

const clean=(s,n)=>String(s??'').normalize('NFC').replace(/[\u0000-\u001f\u007f\u2028\u2029]/g,' ').replace(/\s+/g,' ').trim().slice(0,n);
const norm=s=>clean(s,512).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const words=s=>new Set(norm(s).match(/[\p{L}\p{N}]{3,}/gu)||[]);
const assert=(p,m)=>{if(!p)throw new Error(m)};
function authorization(access,scope){
  // Never accept nicknames, model output, phone unlock or a voice as proof.
  return access?.verified===true&&access.scope===scope&&typeof scope==='string'&&scope.length>=8;
}
const copy=x=>JSON.parse(JSON.stringify(x));
const stamp=n=>Number.isSafeInteger(n)&&n>=0?n:Date.now();
export function createDrawers(scope){
 assert(typeof scope==='string'&&scope.length>=8&&scope.length<=128,'Scope requis');
 return {schema:DRAWER_SCHEMA,scope,revision:0,items:[]};
}
function checked(state){
 assert(state?.schema===DRAWER_SCHEMA&&typeof state.scope==='string'&&
   Array.isArray(state.items)&&state.items.length<=MAX_ITEMS,'Index mémoire invalide');
 return state;
}
export function drawerMap(state,access){
 checked(state);assert(authorization(access,state.scope),'Accès non authentifié');
 const entries={};
 for(const kind of DRAWER_KINDS)entries[kind]={count:0,updatedAt:0};
 for(const row of state.items){
  if(!DRAWER_KINDS.includes(row.kind))continue;
  entries[row.kind].count++;
  entries[row.kind].updatedAt=Math.max(entries[row.kind].updatedAt,row.updatedAt);
 }
 return {schema:DRAWER_SCHEMA,scope:state.scope,revision:state.revision,drawers:entries};
}
export function remember(state,access,item){
 checked(state);assert(authorization(access,state.scope),'Accès non authentifié');
 assert(item?.confirmed===true,'Confirmation humaine explicite requise');
 assert(DRAWER_KINDS.includes(item.kind)&&item.kind!=='archives','Catégorie invalide');
 assert(STATUSES.has(item.status),'Fiabilité manquante');
 assert(['human','observation','source','test'].includes(item.provenance),'Provenance requise');
 const text=clean(item.text,MAX_TEXT);assert(text.length>=3&&text.length<=MAX_TEXT,'Contenu invalide');
 const tags=[...new Set((Array.isArray(item.tags)?item.tags:[]).slice(0,MAX_TAGS).map(v=>norm(v).slice(0,32)).filter(Boolean))];
 const at=stamp(item.at),id=clean(item.id,80);
 assert(/^[a-zA-Z0-9_-]{8,80}$/.test(id),'Identifiant unique explicite requis');
 assert(!state.items.some(v=>v.id===id),'Souvenir déjà présent');
 assert(state.items.length<MAX_ITEMS,'Index plein : archiver ou supprimer explicitement');
 const svc=validateSVC(item.svc);
 if(svc)assert(text===[svc.subject,svc.verb,svc.complement].join(' '),'Fiche SVC et texte différents');
 const row={id,kind:item.kind,text,tags,status:item.status,provenance:item.provenance,
   source:clean(item.source,140),createdAt:at,updatedAt:at,revision:1,archived:false,
   ...(svc?{svc}:{})};
 assert(!svcDuplicate(state.items,row,id),'Fiche SVC déjà présente');
 assert(!svcConflict(state.items,row,id)||row.status==='conteste','Contradiction SVC : noter contesté');
 const next=copy(state);next.items.push(row);next.revision++;
 return next;
}
export function revise(state,access,id,patch){
 checked(state);assert(authorization(access,state.scope),'Accès non authentifié');
 const next=copy(state),row=next.items.find(x=>x.id===id);
 assert(row,'Souvenir absent');assert(patch?.confirmed===true,'Confirmation requise');
 if(patch.text!==undefined){const t=clean(patch.text,MAX_TEXT);assert(t.length>=3,'Contenu vide');row.text=t;if(patch.svc===undefined)delete row.svc;}
 if(patch.status!==undefined){assert(STATUSES.has(patch.status),'Statut invalide');row.status=patch.status;}
 if(patch.kind!==undefined){assert(DRAWER_KINDS.includes(patch.kind),'Catégorie invalide');row.kind=patch.kind;}
 if(patch.svc!==undefined){
  if(patch.svc===null)delete row.svc;
  else {row.svc=validateSVC(patch.svc);assert(row.text===[row.svc.subject,row.svc.verb,row.svc.complement].join(' '),'Fiche SVC et texte différents');}
 }
 if(patch.archived!==undefined)row.archived=patch.archived===true;
 assert(!svcDuplicate(next.items,row,id),'Fiche SVC déjà présente');
 assert(!svcConflict(next.items,row,id)||row.status==='conteste','Contradiction SVC : noter contesté');
 row.updatedAt=stamp(patch.at);row.revision++;next.revision++;
 return next;
}
export function forget(state,access,id){
 checked(state);assert(authorization(access,state.scope),'Accès non authentifié');
 const next=copy(state);next.items=next.items.filter(x=>x.id!==id);
 assert(next.items.length!==state.items.length,'Souvenir absent');next.revision++;return next;
}
export function recall(state,access,query,{kinds=DRAWER_KINDS,limit=3,budget=600,includeArchives=false}={}){
 checked(state);
 if(!authorization(access,state.scope))return {snippets:[],spent:0,denied:true,considered:0};
 const tokens=words(query);
 if(!tokens.size)return {snippets:[],spent:0,denied:false,considered:0};
 const allowed=new Set(kinds.filter(v=>DRAWER_KINDS.includes(v)));
 const candidates=[];
 for(const row of state.items){
  if(!allowed.has(row.kind)||row.archived&&!includeArchives||row.status==='conteste')continue;
  const tags=words(row.tags.join(' ')),text=words(row.text),hits=[...tokens].filter(t=>text.has(t)||tags.has(t)).length;
  if(!hits)continue;
  const score=hits/(tokens.size+1)+(row.status==='verifie'?.1:0);
  candidates.push({row,score});
 }
 candidates.sort((a,b)=>b.score-a.score||b.row.updatedAt-a.row.updatedAt||a.row.id.localeCompare(b.row.id));
 const snippets=[],max=Math.max(0,Math.min(5,Math.trunc(limit))),cap=Math.max(0,Math.min(1200,Math.trunc(budget)));let spent=0;
 for(const {row} of candidates){
  if(snippets.length>=max)break;
  const snippet={id:row.id,kind:row.kind,status:row.status,provenance:row.provenance,
   text:row.text,updatedAt:row.updatedAt};
  const cost=JSON.stringify(snippet).length;
  if(cost>cap-spent)continue;snippets.push(snippet);spent+=cost;
 }
 return {snippets,spent,denied:false,considered:candidates.length};
}
export function snapshotDrawers(state,access){
 checked(state);assert(authorization(access,state.scope),'Accès non authentifié');
 // Caller must encrypt before storing or exporting; the application owns the key and rights.
 return copy(state);
}
export function restoreDrawers(value,access){
 assert(value?.schema===DRAWER_SCHEMA,'Schéma incompatible');
 assert(authorization(access,value.scope),'Accès non authentifié');
 const state=checked(copy(value));assert(Number.isSafeInteger(state.revision),'Révision invalide');
 const ids=new Set();
 for(const row of state.items){
  assert(row&&/^[a-zA-Z0-9_-]{8,80}$/.test(row.id)&&!ids.has(row.id)&&
    DRAWER_KINDS.includes(row.kind)&&typeof row.text==='string'&&row.text.length<=MAX_TEXT&&
    STATUSES.has(row.status)&&['human','observation','source','test'].includes(row.provenance)&&
    Number.isSafeInteger(row.updatedAt),'Souvenir corrompu');
  if(row.svc){const structured=validateSVC(row.svc);assert(row.text===[structured.subject,structured.verb,structured.complement].join(' '),'Souvenir SVC corrompu');
   assert(!svcDuplicate(state.items,row,row.id),'Fiche SVC dupliquée');
   assert(!svcConflict(state.items,row,row.id)||row.status==='conteste','Contradiction SVC corrompue');
  }
  ids.add(row.id);
 }
 return state;
}
