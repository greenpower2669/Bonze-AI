import {appearance,customize,resetAppearance,OPTIONS,RANGES} from '../core/identity.mjs';
import {expression} from '../core/organism.mjs';

const labels={pixel:'Pixels',round:'Ronds',soft:'Doux',straight:'Droits',arched:'Arquées',gentle:'Discret',wide:'Large',tiny:'Petit',bean:'Petit haricot',square:'Carré doux',sprout:'Pousse',leaf:'Feuille',bud:'Bourgeon',star:'Étoile',garden:'Jardin',night:'Nuit',sunrise:'Aurore'};
const names={eyes:'Yeux',brows:'Sourcils',smile:'Sourire',body:'Corps',decoration:'Décoration',skin:'Ambiance',eyeSize:'Taille des yeux',eyeSpacing:'Espacement des yeux',browThickness:'Épaisseur des sourcils',blush:'Intensité des joues',motion:'Amplitude des mouvements'};
export function describe(identity){
 const a=appearance(identity);
 return `Bonze : couleur ${a.color}, yeux ${labels[a.eyes].toLowerCase()}, corps ${labels[a.body].toLowerCase()}, décoration ${labels[a.decoration].toLowerCase()}, ambiance ${labels[a.skin].toLowerCase()}. ${Object.keys(identity.personalized).length?'Apparence personnalisée.':'Apparence de naissance conservée.'}`;
}
export function renderAppearance(face,identity){
 const a=appearance(identity);
 for(const key of Object.keys(OPTIONS))face.dataset[key]=a[key];
 for(const [key,value] of Object.entries({color:a.color,'cheek-color':a.cheekColor,'eye-size':a.eyeSize,'eye-gap':a.eyeSpacing,'brow-weight':`${7*a.browThickness}px`}))face.style.setProperty('--'+key,value);
}
export function renderExpression(face,identity,mode){
 const e=expression(identity,identity.acquired,mode);
 const vars={eyescale:e.eyeOpen,brow:e.brow+'deg',smile:e.smile+'px',blush:e.blush,'gaze-x':e.gazeX+'px','gaze-y':e.gazeY+'px',sway:e.sway+'px',tempo:e.tempo+'s',blink:e.blink+'s','mouth-open':e.mouth+'px'};
 for(const [key,v] of Object.entries(vars))face.style.setProperty('--'+key,v);
 return e;
}
export function setupEditor({getIdentity,setIdentity,root,description}){
 const fields=[];
 const sync=()=>{const a=appearance(getIdentity());for(const [key,input] of fields)input.value=a[key];description.textContent=describe(getIdentity());};
 const field=(key,input)=>{
  input.id='avatar-'+key;input.name=key;
  const label=document.createElement('label');label.htmlFor=input.id;label.textContent=names[key]||'Couleur principale';
  root.append(label,input);fields.push([key,input]);
  input.addEventListener('input',()=>{
   const value=input.type==='range'?Number(input.value):input.value;
   setIdentity(customize(getIdentity(),{[key]:value}));description.textContent=describe(getIdentity());
  });
 };
 const color=document.createElement('input');color.type='color';field('color',color);
 for(const [key,choices] of Object.entries(OPTIONS)){
  const select=document.createElement('select');
  for(const value of choices){const o=document.createElement('option');o.value=value;o.textContent=labels[value];select.append(o);}
  field(key,select);
 }
 for(const [key,[min,max]] of Object.entries(RANGES)){
  const input=document.createElement('input');input.type='range';input.min=min;input.max=max;input.step=.01;field(key,input);
 }
 document.getElementById('avatar-reset').addEventListener('click',()=>{setIdentity(resetAppearance(getIdentity()));sync();});
 document.getElementById('avatar-preset').addEventListener('change',e=>{
  const presets={garden:{color:'#70dcb1',skin:'garden',decoration:'sprout',body:'bean'},night:{color:'#b2c6ee',skin:'night',decoration:'star',body:'round'},sunrise:{color:'#efc385',skin:'sunrise',decoration:'bud',body:'square'}};
  if(presets[e.target.value]){setIdentity(customize(getIdentity(),presets[e.target.value]));sync();}e.target.value='';
 });
 sync();
}
