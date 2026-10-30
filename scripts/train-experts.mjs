// Entraîne les petits poids de routage/expertise (pas ceux de Liquid AI).
// Déterministe : node scripts/train-experts.mjs
import {writeFileSync} from "node:fs";
import {features,NAMES} from "../core/experts.mjs";
const samples={
joie:["Je suis content de te voir","C'est génial bravo","Quel plaisir de te rencontrer","Ça me rend heureux","Merci, c'est super","Un sourire joyeux","Je suis très fier","Quelle bonne surprise !"],
peur:["J'ai peur du noir","Il y a un danger","Je suis inquiet","C'est effrayant","Ça m'angoisse","Je tremble de stress","Je suis terrifié","J'ai vraiment peur"],
colere:["Je suis furieux","Cette injustice me met en colère","Ça m'énerve","Arrête, je suis fâché","Je rage","Je suis très agacé","Cette situation m'exaspère","Il est en colère"],
calme:["Je veux rester calme","Prends du repos","Tout est paisible","On va respirer doucement","Je suis tranquille","J'ai besoin de douceur","Ça m'apaise","On se repose paisiblement"],
reflexion:["Je réfléchis à cette question","Pourquoi ça marche comme ça ?","Il faut analyser","Est-ce logique ?","Je me pose une question","Quelle est la bonne raison ?","Explique le raisonnement","Je veux comprendre pourquoi"],
empathie:["Je voudrais aider cette personne","Il est triste, consolons-le","Je veux être gentil","Fais preuve de compassion","Écoute ton ami","Partage avec les autres","Aide cet enfant","Je suis touché par sa tristesse"],
curiosite:["Je suis curieux","Je veux apprendre à faire ça","Découvrons quelque chose","On va explorer","Ça m'intéresse","Qu'est-ce que tu sais ?","C'est une nouvelle découverte","Comment apprendre ?"],
humour:["Raconte une blague","C'est trop drôle","Ça me fait rire","On rigole ensemble","Je veux faire une farce","Quel humour !","Fais-moi rire","C'est amusant"]
};
const data=NAMES.flatMap((name,k)=>samples[name].map(text=>({x:features(text),k})));
const D=data[0].x.length,C=NAMES.length;
let gate=Array.from({length:C},()=>Array(D).fill(0));
let experts=Array.from({length:C},()=>Array(D).fill(0));
for(let epoch=0;epoch<900;epoch++){
  const rate=.12/(1+epoch/250);
  for(const {x,k} of data){
    const logits=gate.map(row=>row.reduce((z,v,i)=>z+v*x[i],0));
    const m=Math.max(...logits),ex=logits.map(z=>Math.exp(z-m));
    const s=ex.reduce((a,b)=>a+b,0);
    for(let c=0;c<C;c++){
      const gradient=ex[c]/s-(c===k?1:0);
      const z=experts[c].reduce((a,v,i)=>a+v*x[i],0);
      const p=1/(1+Math.exp(-z)), target=c===k?1:0;
      for(let i=0;i<D;i++){
        gate[c][i]-=rate*(gradient*x[i]+.0002*gate[c][i]);
        experts[c][i]-=rate*((p-target)*x[i]+.0002*experts[c][i]);
      }
    }
  }
}
const rounded=rows=>rows.map(row=>row.map(v=>Number(v.toFixed(7))));
const result={version:1,origin:"Bonze AI supervised micro-MoE, synthetic French seed examples",names:NAMES,features:D,examples:data.length,gate:rounded(gate),experts:rounded(experts)};
const dest="core/weights/expert-router-v1.json";
writeFileSync(dest,JSON.stringify(result,null,2)+"\n");
console.log("trained",dest,"samples",data.length,"parameters",2*C*D);
