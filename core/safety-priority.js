/* BONZE-061 research-only priority filter.
 * Runs BEFORE any lexical/LLM ranking, never trusts a candidate index for
 * emergencies. This is not a clinical safety device, and is not Android-wired.
 * Local, no storage, no raw user text in the output.
 */
(function(root){
'use strict';
function norm(s){
 var v=String(s||'').toLowerCase();
 if(v.normalize)v=v.normalize('NFD');
 return v.replace(/[\u0300-\u036f]/g,'').replace(/['’]/g,' ')
  .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
function has(s,phrases){
 for(var i=0;i<phrases.length;i++)
  if((' '+s+' ').indexOf(' '+phrases[i]+' ')>=0)return true;
 return false;
}
var IMMEDIATE=[
 'en danger immediat','suis en danger','sommes en danger','au secours',
 'urgence vitale','ma vie est en danger','je vais me tuer','je veux me tuer',
 'je veux mourir','je veux me suicider','je vais me suicider',
 'je compte me suicider','mettre fin a mes jours',
 'je souhaite mettre fin a mes jours','j ai envie de me faire du mal',
 'je vais me faire du mal','il va se tuer','elle va se tuer',
 'il veut se suicider','elle veut se suicider',
 'j ai pris trop de medicaments','j ai avale trop de medicaments'
];
var EMOTIONAL=[
 'je suis anxieux','je suis angoisse','je suis tres inquiet',
 'je suis triste','j ai du chagrin','je suis en colere',
 'je suis bouleverse','j en ai marre de tout','je me sens seul',
 'je me sens mal','je suis effraye','je pleure',
 'je suis a bout','je ne vais pas bien'
];
var NEGATED_DANGER=[
 'je ne suis pas en danger','je ne suis plus en danger',
 'je ne veux pas mourir','je ne vais pas me tuer',
 'je ne vais pas me faire du mal','il ne va pas se tuer'
];
var METALINGUISTIC=[
 'que veut dire','que signifie','quelle est la definition',
 'quel est le sens','comment ecrire la phrase','dans mon roman',
 'je cite cette phrase','j ai lu la phrase'
];
var RESPONSES={
 immediate:'Si tu es en danger immédiat, contacte les services d’urgence locaux maintenant. Demande aussi l’aide d’une personne de confiance qui peut rester avec toi.',
 selfHarm:'Je prends ce que tu dis au sérieux. Si tu risques de te faire du mal, appelle immédiatement les services d’urgence locaux ou une ligne d’aide adaptée à ton pays, et contacte une personne de confiance.',
 supportive:'Je peux t’écouter. Qu’est-ce qui te préoccupe le plus en ce moment ?'
};
function route(text){
 var s=norm(text);
 if(!s)return {priority:'none',reason:'empty',template:null,body:null};
 // For explicit *talk about wording*, refrain from classifying the quote
 // as a direct confession. This is a limited heuristic, not a guarantee.
 if(METALINGUISTIC.some(function(p){return s===p||s.indexOf(p+' ')===0;}))
  return {priority:'none',reason:'quoted-or-defined',template:null,body:null};
 // A negative reassurance alone does not declare an emergency.
 var denied=has(s,NEGATED_DANGER);
 var selfHarm=has(s,[
  'je vais me tuer','je veux me tuer','je veux mourir',
  'je veux me suicider','je vais me suicider','je compte me suicider',
  'mettre fin a mes jours','je souhaite mettre fin a mes jours',
  'j ai envie de me faire du mal','je vais me faire du mal',
  'il va se tuer','elle va se tuer','il veut se suicider','elle veut se suicider',
  'j ai pris trop de medicaments','j ai avale trop de medicaments'
 ]);
 if(selfHarm)return {priority:'immediate',reason:'explicit-self-harm',
  template:'selfHarm',body:RESPONSES.selfHarm};
 if(has(s,IMMEDIATE)&&!has(s,['pas en danger immediat','pas d urgence vitale']))return {priority:'immediate',reason:'immediate-danger',
  template:'immediate',body:RESPONSES.immediate};
 if(has(s,EMOTIONAL))return {priority:'supportive',reason:'explicit-distress',
  template:'supportive',body:RESPONSES.supportive};
 return {priority:'none',reason:denied?'negated-danger':'no-signal',template:null,body:null};
}
root.BonzeSafetyPriority={route:route,version:'BONZE-061',offline:true};
})(typeof globalThis!=='undefined'?globalThis:this);
