import {INITIAL} from './bonze.mjs';
import {appearance} from './identity.mjs';
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(n)?n:a));
const keys=Object.keys(INITIAL);

/** Continuous simulated organism; these values are not neural claims or truth evidence. */
export function advance(identity,seconds=1,activity='off'){
 const old=identity.acquired;
 const out={...old,forces:{...old.forces},adaptation:{...old.adaptation}};
 let remaining=clamp(seconds,0,300);
 while(remaining>0){
  const dt=Math.min(remaining,.25);remaining-=dt;
  const f=out.forces,baseline=identity.innate.temperament;
  const active=['thinking','speaking','listening','waiting'].includes(activity);
  const drain={thinking:.005,speaking:.003,listening:.0015,waiting:.0005}[activity]||0;
  out.endurance=clamp(out.endurance+(active?-drain:.002)*dt);
  const next={};
  for(const key of keys){
   const target=clamp(baseline[key]+(old.adaptation[key]||0));
   next[key]=f[key]+(target-f[key])*(1-Math.exp(-dt/50));
  }
  next.colere-=dt*(.025*f.empathie+.02*f.reflexion)*f.colere;
  next.peur-=dt*(.02*f.calme+.012*f.curiosite)*f.peur;
  next.calme+=dt*(.005*f.empathie-.009*f.peur-.008*f.colere);
  if(activity==='thinking')next.reflexion+=dt*.009*(1-f.reflexion);
  if(activity==='listening')next.curiosite+=dt*.004*(1-f.curiosite);
  next.calme+=dt*(1-out.endurance)*.003;
  for(const key of keys)next[key]=clamp(next[key]);
  out.forces=next;
 }
 return out;
}
/** Context and learned dispositions supplement the classifier, never establish facts. */
export function experience(identity,stimulus={},event='exchange',context={}){
 const a=identity.acquired,forces={...a.forces},adaptation={...a.adaptation};
 for(const key of keys){
  const input=Number.isFinite(stimulus[key])?clamp(stimulus[key],-.3,.7):0;
  forces[key]=clamp(forces[key]+input*.15);
  adaptation[key]=clamp((adaptation[key]||0)+input*.001,-.15,.15);
 }
 if(context.familiar)forces.calme=clamp(forces.calme+.025);
 if(event==='uncertain')forces.reflexion=clamp(forces.reflexion+.08);
 if(event==='exchange')forces.curiosite=Math.max(.25,forces.curiosite);
 return {...a,forces,adaptation,endurance:clamp(a.endurance-.004),exchanges:Math.min(1e6,a.exchanges+1)};
}
export function expression(identity,acquired=identity.acquired,activity='off'){
 const f=acquired.forces,a=appearance(identity),gain=identity.innate.expressivity;
 const shy=identity.innate.shyness*(.25+f.peur)*(1-f.joie*.3);
 return {
  eyeOpen:clamp(.85+gain*(.28*f.curiosite+.15*f.peur-.13*f.calme-.1*f.joie),.65,1.3),
  brow:clamp(gain*(17*f.colere+12*f.reflexion-18*f.peur-10*f.curiosite),-24,24),
  smile:clamp(8+gain*(19*f.joie+13*f.humour+7*f.empathie-9*f.colere-8*f.peur),2,35),
  mouth:activity==='speaking'?8:0,
  blush:clamp(a.blush+shy*.6+f.empathie*.14+f.joie*.1),
  gazeX:clamp(7*f.reflexion-10*shy,-12,12),gazeY:clamp(5*shy-3*f.curiosite,-5,6),
  sway:clamp((1+3*f.joie+3*f.curiosite-2*f.calme)*a.motion,.2,7),
  tempo:clamp((4-f.curiosite-f.joie+2*(1-acquired.endurance))/identity.innate.reaction,1.8,7),
  blink:clamp(6+2*f.calme-2*f.peur,3,9),
  dominant:keys.reduce((best,key)=>f[key]>f[best]?key:best,keys[0])
 };
}
