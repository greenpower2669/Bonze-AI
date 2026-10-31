/** BONZE-039: personal preferences are whitelisted, not a source of instructions. */
export const DEFAULT_STYLE=Object.freeze({preset:'naturel',address:'tu',length:'normal',humour:2,curiosite:2,douceur:2,pace:1});
const choices=['naturel','doux','joueur','enqueteur','calme'];
const pick=(v,a,d)=>a.includes(v)?v:d;
const level=(v,d)=>Number.isFinite(v)?Math.max(0,Math.min(3,Math.round(v))):d;
export function normalizeStyle(input){
 const v=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
 return {preset:pick(v.preset,choices,'naturel'),address:pick(v.address,['tu','vous'],'tu'),
 length:pick(v.length,['court','normal','detail'],'normal'),
 humour:level(v.humour,2),curiosite:level(v.curiosite,2),douceur:level(v.douceur,2),
 pace:Number.isFinite(v.pace)?Math.max(.85,Math.min(1.15,Math.round(v.pace*100)/100)):1};
}
export function describeStyle(value){
 const v=normalizeStyle(value);
 return 'Caractère '+({naturel:'naturel',doux:'doux',joueur:'joueur',enqueteur:'enquêteur',calme:'calme'}[v.preset])+
 ', '+(v.address==='tu'?'tutoiement':'vouvoiement')+', réponse '+v.length+
 ', humour '+v.humour+'/3, curiosité '+v.curiosite+'/3, douceur '+v.douceur+'/3.';
}
