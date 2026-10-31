/* BONZE-038: structured S-V-C cards, portable core. Never writes files,
 * preferences, network, or localStorage, and NEVER infers personal facts.
 * Authentication and encryption belong to the host vault (BONZE-031).
 * A verified:true flag is a trusted-host assertion, NOT an authenticator.
 */
export const FACT_SCHEMA=1;
export const FACT_LIMIT=128;
const STATES=['declare','verifie','hypothese','fiction','conteste'];
const SOURCES=['human','observation','test','source'];
const MAX_BYTES=100000;
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function fail(message){throw new Error(message);}
function plain(v){return v!==null&&typeof v==='object'&&!Array.isArray(v);}
function clean(s,max){return String(s??'').normalize('NFC').replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028\u2029\u2060\ufeff]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);}
function norm(s){return clean(s,360).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function words(s){return new Set((norm(s).match(/[\p{L}\p{N}]{3,}/gu)||[]));}
const copy=x=>JSON.parse(JSON.stringify(x));
function authorized(state,access){return plain(access)&&access.verified===true&&access.scope===state.scope&&state.scope.length>=8;}
function accessOrFail(state,access){if(!authorized(state,access))fail('Accès non authentifié au coffre de souvenirs');}
function checkParts(subject,verb,complement){
 const s=clean(subject,100),v=clean(verb,60),c=clean(complement,220);
 if(s.length<2||v.length<2||c.length<2)fail('Une fiche exige sujet, verbe et complément explicites');
 return {subject:s,verb:v,complement:c};
}
function key(card){return [card.subject,card.verb,card.complement].map(norm).join('|');}
function relation(card){return [card.subject,card.verb].map(norm).join('|');}
function checked(state){
 if(!plain(state)||state.version!==FACT_SCHEMA||typeof state.scope!=='string'||state.scope.length<8||
 state.scope.length>128||!Number.isSafeInteger(state.turn)||state.turn<0||state.turn>10000000||
 !Array.isArray(state.cards)||state.cards.length>FACT_LIMIT||JSON.stringify(state).length>MAX_BYTES)fail('Index SVC invalide');
 const ids=new Set(),relations=new Set();
 for(const card of state.cards){
  if(!plain(card)||typeof card.id!=='string'||!/^[a-zA-Z0-9_-]{8,80}$/.test(card.id)||ids.has(card.id)||
  typeof card.subject!=='string'||typeof card.verb!=='string'||typeof card.complement!=='string'||
  card.subject.length>100||card.verb.length>60||card.complement.length>220||
  !card.subject.trim()||!card.verb.trim()||!card.complement.trim()||
  !STATES.includes(card.status)||!SOURCES.includes(card.source)||
  !Number.isSafeInteger(card.seen)||card.seen<0||card.seen>state.turn||
  !Number.isFinite(card.strength)||card.strength<0||card.strength>1||
  !Array.isArray(card.tags)||card.tags.length>6||card.tags.some(x=>typeof x!=='string'||x.length>32))fail('Fiche SVC corrompue');
  ids.add(card.id);if(relations.has(key(card)))fail('Fiche SVC dupliquée');relations.add(key(card));
 }
 return state;
}
export function createFactMemory(scope){
 if(typeof scope!=='string'||scope.length<8||scope.length>128)fail('Périmètre mémoire requis');
 return {version:FACT_SCHEMA,scope,turn:0,cards:[]};
}
export function validateFactMemory(value){return copy(checked(value));}
export function addFact(state,access,input){
 checked(state);accessOrFail(state,access);
 if(!plain(input)||input.confirmed!==true)fail('Confirmation humaine explicite requise');
 if(state.cards.length>=FACT_LIMIT)fail('Mémoire SVC pleine : archiver ou oublier manuellement');
 const id=String(input.id||'');
 if(!/^[a-zA-Z0-9_-]{8,80}$/.test(id)||state.cards.some(c=>c.id===id))fail('Identifiant unique obligatoire');
 const core=checkParts(input.subject,input.verb,input.complement);
 const status=String(input.status||''),source=String(input.source||'');
 if(!STATES.includes(status)||!SOURCES.includes(source))fail('Statut ou provenance manquant');
 const tags=[...new Set((Array.isArray(input.tags)?input.tags:[]).slice(0,6).map(t=>norm(t).slice(0,32)).filter(Boolean))];
 const card={id,...core,status,source,tags,strength:.35,seen:state.turn};
 if(state.cards.some(c=>key(c)===key(card)))fail('Fait déjà présent');
 const contradicts=state.cards.filter(c=>relation(c)===relation(card)&&
  c.status!=='fiction'&&card.status!=='fiction'&&key(c)!==key(card));
 if(contradicts.length&&input.confirmConflict!==true)fail('Contradiction détectée : examiner avant de confirmer');
 if(contradicts.length&&status!=='conteste')fail('Un fait contradictoire doit être marqué contesté');
 const next=copy(state);next.cards.push(card);return next;
}
export function reviseFact(state,access,id,change){
 checked(state);accessOrFail(state,access);
 if(!plain(change)||change.confirmed!==true)fail('Révision humaine explicite requise');
 const next=copy(state),card=next.cards.find(x=>x.id===id);if(!card)fail('Fiche introuvable');
 const parts=checkParts(own(change,'subject')?change.subject:card.subject,own(change,'verb')?change.verb:card.verb,own(change,'complement')?change.complement:card.complement);
 const status=change.status??card.status;if(!STATES.includes(status))fail('Statut invalide');
 Object.assign(card,parts,{status,strength:.35,seen:next.turn});
 if(next.cards.some(x=>x.id!==id&&key(x)===key(card)))fail('Fait dupliqué');
 return next;
}
export function forgetFact(state,access,id){
 checked(state);accessOrFail(state,access);const next=copy(state);next.cards=next.cards.filter(x=>x.id!==id);
 if(next.cards.length===state.cards.length)fail('Fiche introuvable');return next;
}
export function strengthenFact(state,access,id,confirmed){
 checked(state);accessOrFail(state,access);if(confirmed!==true)fail('Renforcement non confirmé');
 const next=copy(state),card=next.cards.find(x=>x.id===id);if(!card)fail('Fiche introuvable');
 card.strength=Math.min(1,card.strength*.9+.12);card.seen=next.turn;return next;
}
export function advanceFactTurn(state){
 checked(state);const next=copy(state);next.turn=Math.min(10000000,next.turn+1);return next;
}
export function recallFacts(state,access,query,{limit=3,budget=800,includeFiction=false}={}){
 checked(state);
 if(!authorized(state,access))return {denied:true,cards:[],scanned:0,spent:0};
 const tokens=words(query),ranked=[];
 const safeLimit=Number.isFinite(limit)?Math.max(0,Math.min(5,Math.trunc(limit))):3;
 const safeBudget=Number.isFinite(budget)?Math.max(0,Math.min(1500,Math.trunc(budget))):800;
 if(!tokens.size)return {denied:false,cards:[],scanned:0,spent:0};
 for(const c of state.cards){
  if(c.status==='conteste'||(c.status==='fiction'&&!includeFiction))continue;
  const subject=words(c.subject),verb=words(c.verb),obj=words(c.complement),tags=words(c.tags.join(' '));
  let score=0;
  for(const token of tokens){if(subject.has(token))score+=4;if(verb.has(token))score+=2;if(obj.has(token))score+=1;if(tags.has(token))score+=1;}
  if(score<=0)continue;
  const age=Math.min(10000,Math.max(0,state.turn-c.seen));
  score*=.5+.5*c.strength*Math.pow(.999,age);
  if(c.status==='verifie')score+=.25;
  ranked.push({c,score});
 }
 ranked.sort((a,b)=>b.score-a.score||a.c.id.localeCompare(b.c.id));
 const cards=[];let spent=0;
 for(const {c,score} of ranked){
  if(cards.length>=safeLimit)break;
  const item={id:c.id,subject:c.subject,verb:c.verb,complement:c.complement,status:c.status,source:c.source,
    confidence:Number(Math.max(0,Math.min(1,c.strength)).toFixed(3))};
  const cost=JSON.stringify(item).length;
  if(spent+cost>safeBudget)continue;
  cards.push(item);spent+=cost;
 }
 return {denied:false,cards,scanned:ranked.length,spent};
}
