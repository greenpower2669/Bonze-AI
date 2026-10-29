// Bonze AI : micro-MoE entraîné, indépendant du moteur de langage.
export const NAMES=Object.freeze(["joie","peur","colere","calme","reflexion","empathie","curiosite","humour"]);
export const FEATURE_PATTERNS=Object.freeze([
  "joyeux|heureux|content|bravo|super|genial|merci|sourire|plaisir",
  "peur|effray|angoiss|terreur|dangereux|danger|inquiet|stress",
  "colere|furieux|enerve|fache|rage|injustice|agace",
  "calme|paisible|repos|respir|douceur|tranquill|apais",
  "pense|reflech|raison|analyse|pourquoi|logique|question",
  "gentil|aide|triste|empath|ecoute|compassion|partag|consol",
  "curieux|decouvr|apprend|explor|interess|connait|nouveau|savoir",
  "rire|blague|amus|rigol|drole|humour|farce",
  "bonjour|coucou|salut","famille|papa|maman|enfant|ami",
  "jamais|pas|impossible|non","comment|quoi|qui|quel|ou|quand",
  "fort|beaucoup|tres|incroyable|vraiment",
  "peux|pourrais|aider|s'il te plait|stp",
  "fatigue|epuise|dormir|sommeil",
  "inconnu|ignor|ne sais|doute|incertain",
  "explique|comprendre|compris",
  "jouer|jeu|plaisant|amusant"
]);
const regex=FEATURE_PATTERNS.map(v=>new RegExp(v,"i"));
export function features(text){
  const norm=String(text??"").toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  return [1,...regex.map(r=>r.test(norm)?1:0)];
}
export function inferExperts(text,weights){
  if(!weights||weights.version!==1||weights.names?.join(",")!==NAMES.join(","))
    throw new Error("Poids MoE absents ou incompatibles");
  const x=features(text);
  if(!Array.isArray(weights.gate)||!Array.isArray(weights.experts)||weights.gate.length!==NAMES.length||weights.experts.length!==NAMES.length)
    throw new Error("Dimensions des poids incorrectes");
  const dot=w=>{if(!Array.isArray(w)||w.length!==x.length||w.some(n=>!Number.isFinite(n)))throw new Error("Poids corrompus");return w.reduce((a,n,i)=>a+n*x[i],0)};
  const gateLogits=weights.gate.map(dot), peak=Math.max(...gateLogits);
  const exp=gateLogits.map(z=>Math.exp(z-peak)),sum=exp.reduce((a,v)=>a+v,0);
  const probabilities=exp.map(v=>v/sum);
  const strengths=weights.experts.map(row=>1/(1+Math.exp(-dot(row))));
  const order=NAMES.map((name,index)=>({name,index,weight:probabilities[index],activation:strengths[index]}))
    .sort((a,b)=>b.weight-a.weight);
  return {top2:order.slice(0,2),all:order};
}
// Influence asymétrique : chaque tendance a sa réserve, certaines se freinent.
export function evolveForces(current={},routing,seconds=1){
  const t=Math.max(0,Math.min(10,seconds)),decay=Math.pow(.94,t);
  const output={};
  for(const key of NAMES)output[key]=Math.max(0,Math.min(1,(current[key]??.15)*decay));
  for(const expert of routing.top2)output[expert.name]=Math.min(1,output[expert.name]+.24*expert.weight*expert.activation*t);
  const old={...output};
  output.colere=Math.max(0,old.colere-.10*old.empathie-.06*old.reflexion);
  output.calme=Math.max(0,old.calme-.08*old.peur-.04*old.colere+.03*old.empathie);
  output.peur=Math.max(0,old.peur-.05*old.calme);
  return output;
}
