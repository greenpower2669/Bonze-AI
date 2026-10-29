import {answer,listening} from "../core/bonze.mjs";
const el=id=>document.getElementById(id),KEY="bonze-proto-01";
let profile=null,history=[],speaking=false;
try{
 const d=JSON.parse(localStorage.getItem(KEY)||"null");
 if(d&&typeof d==="object"){
  profile=typeof d.profile?.nickname==="string"?{nickname:d.profile.nickname.slice(0,40)}:null;
  history=Array.isArray(d.history)?d.history.slice(-30).filter(r=>typeof r?.text==="string"&&["human","bot"].includes(r.role)):[];
 }
}catch{}
function save(){try{localStorage.setItem(KEY,JSON.stringify({profile,history:history.slice(-30)}));}catch{el("profile-status").textContent="Stockage non disponible."}}
function bubble(text,role){
 const p=document.createElement("p");p.textContent=text;p.className="bubble "+role;el("log").append(p);
 while(el("log").children.length>32)el("log").firstChild.remove();
 el("log").scrollTop=el("log").scrollHeight;
}
function mood(m){
 const titles={joie:"Je souris !",curiosite:"Oh, quelle découverte ?",reflexion:"Je réfléchis…"};
 el("face").className="face "+m;el("mood").textContent=titles[m]||"Je découvre le monde !";
 el("face").setAttribute("aria-label","Bonze AI : émotion simulée "+m);
}
const voice=()=>("speechSynthesis" in window)?speechSynthesis.getVoices().find(v=>/^fr[-_]/i.test(v.lang)&&v.localService===true):null;
function speak(text){
 if(!speaking)return;const v=voice();
 if(!v){speaking=false;el("voice").checked=false;el("voice-status").textContent="Voix française locale indisponible.";return;}
 const u=new SpeechSynthesisUtterance(text);u.voice=v;u.lang=v.lang;u.rate=.95;speechSynthesis.cancel();speechSynthesis.speak(u);
}
if(profile){el("nickname").value=profile.nickname;el("profile-status").textContent="Enchanté, "+profile.nickname+" ! Profil local non authentifié.";}
if(history.length){el("log").replaceChildren();for(const r of history)bubble(r.text.slice(0,600),r.role);}
el("intro").addEventListener("submit",e=>{
 e.preventDefault();const nickname=el("nickname").value.trim().slice(0,40);if(!nickname)return;
 profile={nickname};el("profile-status").textContent="Enchanté, "+nickname+" ! Profil local non authentifié.";save();mood("joie");
});
el("chat").addEventListener("submit",e=>{
 e.preventDefault();const text=el("message").value.trim();if(!text)return;el("message").value="";bubble(text,"human");
 const r=answer(text,profile||{});bubble(r.text,"bot");mood(r.emotion);speak(r.text);
 history.push({role:"human",text},{role:"bot",text:r.text});history=history.slice(-30);save();
});
function policy(){
 const p=listening({disabled:false,pressure:el("pressure").value});
 el("policy").textContent="Simulation : mode "+p.mode+" ("+p.reason+"). Aucune RAM réelle mesurée.";
}
el("pressure").addEventListener("change",policy);policy();
el("voice").addEventListener("change",()=>{
 speaking=el("voice").checked&&!!voice();el("voice").checked=speaking;
 el("voice-status").textContent=speaking?"Voix française locale activée.":"Lecture désactivée ou voix locale absente.";
 if(!speaking&&"speechSynthesis" in window)speechSynthesis.cancel();
});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
