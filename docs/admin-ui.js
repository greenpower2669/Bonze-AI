import {createAdminGesture} from '../core/admin-gesture.mjs';
export function renderAdmin(data){
 const target=document.getElementById('admin-controls');target.replaceChildren();if(!data.council?.state)return;
 const update=structuredClone(data.council);
 function slider(parent,label,value,min,max,step,change){const row=document.createElement('label'),range=document.createElement('input'),out=document.createElement('output');row.textContent=label+' ';range.type='range';range.min=min;range.max=max;range.step=step;range.value=value;range.setAttribute('aria-label',label);out.textContent=Number(value).toFixed(3);range.oninput=()=>{change(Number(range.value));out.textContent=Number(range.value).toFixed(3);};row.append(range,out);parent.append(row);}
 for(const n of Object.keys(update.state.forces)){slider(target,'Force : '+n,update.state.forces[n],0,1,.01,v=>update.state.forces[n]=v);slider(target,'Endurance : '+n,update.state.endurances[n],0,1,.01,v=>update.state.endurances[n]=v);}
 slider(target,'Endurance générale',update.state.globalEndurance,0,1,.01,v=>update.state.globalEndurance=v);
 for(const [k,min,max,step] of [['recovery',.0001,.05,.0001],['drain',0,.1,.001],['stimulus',0,.5,.01],['directGain',.2,2,.01]])slider(target,k,update.params[k],min,max,step,v=>update.params[k]=v);
 const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Influences directionnelles';details.append(summary);target.append(details);
 for(const [edge,value] of Object.entries(update.params.influences))slider(details,edge,value,-.5,.5,.01,v=>update.params.influences[edge]=v);
 const apply=document.createElement('button');apply.textContent='Appliquer ces paramètres';apply.className='secondary-button';apply.onclick=()=>window.BonzeAndroid.admin('emotion',JSON.stringify(update));target.append(apply);
}
export function setupAdminGesture(open){const g=createAdminGesture();for(const side of ['left','right']){const zone=document.createElement('span');zone.className='admin-zone admin-'+side;zone.setAttribute('aria-hidden','true');zone.addEventListener('pointerdown',()=>{if(g.tap(side,performance.now()))open();});document.querySelector('.topbar').append(zone);}}
