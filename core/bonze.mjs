// Noyau pur Bonze AI, identique en WebApp et en futur conteneur Android.
export const INVARIANTS=Object.freeze(["curiosite","apprentissage","respect","sincerite","micro_coupe_prioritaire"]);
export const INITIAL=Object.freeze({calme:.55,curiosite:.65,joie:.3,empathie:.5,reflexion:.2,peur:0,colere:0,humour:.25});
const clip=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
export function evolve(state=INITIAL,stimulus={},dt=1){
  const result={},decay=Math.pow(.9,Math.max(0,Math.min(60,dt)));
  for(const key of Object.keys(INITIAL))
    result[key]=clip(INITIAL[key]+((state[key]??INITIAL[key])-INITIAL[key])*decay+(Number(stimulus[key])||0));
  result.colere=clip(result.colere-.08*result.empathie-.06*result.calme);
  result.calme=clip(result.calme+.25*(Number(stimulus.empathie)||0)-.2*(Number(stimulus.peur)||0));
  return result;
}
export function competence(events=[]){
  const trials=events.filter(x=>typeof x?.passed==="boolean");
  if(!trials.length)return{status:"non_teste",confidence:null,tests:0};
  const count=trials.filter(x=>x.passed).length;
  return{status:trials.at(-1).passed?"teste":"a_reverifier",confidence:(count+1)/(trials.length+2),tests:trials.length};
}
export function trial(events=[],entry){
  if(!entry||typeof entry.id!=="string"||typeof entry.passed!=="boolean")
    throw new TypeError("Preuve invalide");
  if(events.some(e=>e.id===entry.id))return events.slice();
  return[...events,{id:entry.id,passed:entry.passed,at:entry.at??null}].slice(-100);
}
export function listening({disabled=true,pressure="normal",precise=false,eco=false}={}){
  if(disabled)return{mode:"off",reason:"demande_humaine"};
  if(pressure==="critical")return{mode:"text",reason:"memoire_critique"};
  if(pressure==="high")return eco?{mode:"eco",reason:"memoire_chargee"}:{mode:"text",reason:"moteur_leger_absent"};
  if(precise)return{mode:"precise",reason:"ressources_suffisantes"};
  if(eco)return{mode:"eco",reason:"precis_indisponible"};
  return{mode:"text",reason:"aucun_transcripteur_local"};
}
export function answer(input,profile={}){
  const raw=String(input??"").trim().slice(0,600);
  const norm=raw.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const name=String(profile.nickname||"toi").slice(0,40);
  if(!raw)return{text:"Je t'écoute.",emotion:"calme"};
  if(/\b(coucou|bonjour|salut)\b/.test(norm))return{text:"Coucou "+name+" ! Qu'allons-nous découvrir ?",emotion:"joie"};
  if(/comment tu t.appelles/.test(norm))return{text:"Je m'appelle Bonze AI ! Et toi ?",emotion:"joie"};
  if(/pas compris|ne comprends pas|comprends pas/.test(norm))return{text:"Tu as raison, mon prototype comprend encore très peu. Peux-tu reformuler ?",emotion:"reflexion"};
  if(/merci|bravo|super/.test(norm))return{text:"Merci ! Apprenons quelque chose ensemble.",emotion:"joie"};
  if(raw.includes("?")||/\b(comment|pourquoi|combien|quand|qui)\b/.test(norm))
    return{text:"Je ne sais pas encore répondre avec fiabilité. Veux-tu m'apprendre ou connais-tu quelqu'un qui pourrait nous aider ?",emotion:"curiosite"};
  return{text:"J'ai bien reçu tes mots, mais je ne sais pas encore les interpréter. Peux-tu m'expliquer ?",emotion:"reflexion"};
}

