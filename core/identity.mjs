import {INITIAL} from './bonze.mjs';

export const OPTIONS=Object.freeze({
 eyes:['pixel','round','soft'], brows:['straight','soft','arched'],
 smile:['gentle','wide','tiny'], body:['bean','round','square'],
 decoration:['sprout','leaf','bud','star'], skin:['garden','night','sunrise']
});
export const RANGES=Object.freeze({eyeSize:[.8,1.3],eyeSpacing:[.75,1.25],browThickness:[.7,1.4],blush:[.1,.7],motion:[.7,1.3]});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number.isFinite(n)?n:a));
function randomFrom(seed){
 let h=2166136261;for(const c of seed){h=Math.imul(h^c.charCodeAt(0),16777619);}
 return()=>{h+=0x6D2B79F5;let t=Math.imul(h^(h>>>15),1|h);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296;};
}
function randomSeed(){
 if(!globalThis.crypto?.getRandomValues)throw new Error('Générateur aléatoire local indisponible');
 return Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('');
}
export function validPatch(input={}){
 const out={};if(!input||typeof input!=='object')return out;
 for(const key of ['color','cheekColor'])if(/^#[\da-f]{6}$/i.test(input[key]||''))out[key]=input[key];
 for(const [key,choices] of Object.entries(OPTIONS))if(choices.includes(input[key]))out[key]=input[key];
 for(const [key,[lo,hi]] of Object.entries(RANGES))if(Number.isFinite(input[key]))out[key]=clamp(input[key],lo,hi);
 return out;
}
export function createIdentity(seed=randomSeed()){
 if(typeof seed!=='string'||!seed.length||seed.length>128)throw new TypeError('Graine invalide');
 const rand=randomFrom(seed),pick=a=>a[Math.floor(rand()*a.length)],n=(a,b)=>Math.round((a+rand()*(b-a))*1000)/1000;
 const physical={color:pick(['#70dcb1','#8acfdc','#b2c6ee','#efc385','#c9d78e','#d9b3df']),cheekColor:pick(['#ff8da9','#f79c86','#e9a0b9'])};
 for(const [key,choices] of Object.entries(OPTIONS))physical[key]=pick(choices);
 for(const [key,[lo,hi]] of Object.entries(RANGES))physical[key]=n(lo,hi);
 const temperament={};for(const [key,value] of Object.entries(INITIAL))temperament[key]=clamp(value+n(-.09,.09),key==='curiosite'?.45:0,.85);
 const innate={appearance:physical,temperament,expressivity:n(.8,1.2),shyness:n(.05,.3),reaction:n(.8,1.2)};
 return {version:1,seed,innate,personalized:{},acquired:{forces:{...temperament},adaptation:{},endurance:.85,exchanges:0},changes:[]};
}
export function restoreIdentity(saved){
 if(!saved||saved.version!==1||typeof saved.seed!=='string'||!saved.seed.length||saved.seed.length>128)return createIdentity();
 // Innate values are always regenerated from the original seed and schema.
 const i=createIdentity(saved.seed);i.personalized=validPatch(saved.personalized);
 const a=saved.acquired||{};
 for(const key of Object.keys(INITIAL)){
  if(Number.isFinite(a.forces?.[key]))i.acquired.forces[key]=clamp(a.forces[key],0,1);
  if(Number.isFinite(a.adaptation?.[key]))i.acquired.adaptation[key]=clamp(a.adaptation[key],-.15,.15);
 }
 if(Number.isFinite(a.endurance))i.acquired.endurance=clamp(a.endurance,0,1);
 i.acquired.exchanges=Number.isSafeInteger(a.exchanges)?clamp(a.exchanges,0,1e6):0;
 i.changes=Array.isArray(saved.changes)?saved.changes.slice(-40).filter(x=>Number.isFinite(x?.at)).map(x=>({at:x.at,kind:x.kind==='reset'?'reset':'customize',patch:validPatch(x.patch)})):[];
 return i;
}
export function appearance(identity){return {...identity.innate.appearance,...validPatch(identity.personalized)};}
export function customize(identity,patch,at=Date.now()){
 const clean=validPatch(patch);
 return {...identity,personalized:{...identity.personalized,...clean},changes:[...identity.changes,{at,kind:'customize',patch:clean}].slice(-40)};
}
export function resetAppearance(identity,at=Date.now()){
 return {...identity,personalized:{},changes:[...identity.changes,{at,kind:'reset',patch:{}}].slice(-40)};
}
