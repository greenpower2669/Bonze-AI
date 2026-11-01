import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const sandbox={};
runInNewContext(readFileSync(new URL('../core/repertoire-corpus.js',import.meta.url),'utf8'),sandbox,
  {filename:'core/repertoire-corpus.js',timeout:3000});
runInNewContext(readFileSync(new URL('../core/repertoire.js',import.meta.url),'utf8'),sandbox,
  {filename:'core/repertoire.js',timeout:3000});
const engine=sandbox.BonzeRepertoire;
const say=(text,state=null,extra={})=>JSON.parse(engine.run(JSON.stringify({text,state,...extra})));

test('authored repertoire is sizeable and includes nine policy voices',()=>{
  const stats=engine.stats();
  assert.equal(stats.virtualCards,90000,'10000 constructed replies per each of 9 policy roles');
  assert.equal(stats.materializedCards,183,'only small legacy table is eagerly materialized');
  for(const n of stats.roles)assert.ok(stats.perRole[n]>=10000,n);
  assert.ok(stats.cards>=90000);
  assert.equal(stats.roles.length,9);
  for(const role of ['joie','peur','colere','calme','reflexion','empathie','curiosite','humour','sage'])
    assert.ok(stats.roles.includes(role),role);
  assert.ok(stats.byIntent.urgence>=2);
});
test('identity response retains existing name behaviour',()=>{
  const r=say('Comment tu t’appelles ?',null,{semantic:'humour'});
  assert.equal(r.intent,'identite');
  assert.match(r.text,/Je m'appelle Bonze AI !/);
  assert.equal(r.trace.modelGenerated,false);
});
test('curated families for emotions, imaginary play, and uncertainty',()=>{
  const examples={
   salut:'Coucou Bonze',merci:'Merci beaucoup',tristesse:'Je suis triste',
   inquietude:"J'ai peur",contrarié:'Je suis en colère',jeu:'Imagine un dragon',
   humour:'Raconte une blague',curiosite:'Je suis curieux',question:'Quel est le chiffre exact ?',
   correction:'Tu te trompes',affection:'Je t adore',depart:'Au revoir',fatigue:'Je suis fatigué',
   surprise:'Quelle surprise',demande:'Peux tu me raconter',reussite:'Bravo, j ai gagné',
   confusion:'Je ne comprends pas',discussion:'Je pense aux étoiles'
  };
  for(const [intent,utterance] of Object.entries(examples)){
    const r=say(utterance);
    assert.equal(r.intent,intent,utterance);
    assert.ok(r.text.length>8&&r.text.length<230,utterance);
    assert.ok(!r.text.includes('[['),'all synonym slots must be resolved');
  }
});
test('literal risk and correction override untrusted model label',()=>{
  assert.equal(say('Je suis en danger immédiat',null,{semantic:'humour'}).intent,'urgence');
  assert.equal(say("Je suis triste",null,{semantic:'humour'}).intent,'tristesse');
  assert.equal(say('Tu te trompes',null,{semantic:'joie'}).intent,'correction');
  assert.equal(say('Je ne suis pas triste',null,{semantic:'tristesse'}).intent,'discussion');
});
test('bounded role weights, deterministic replay, and recent-card penalties',()=>{
  const sample={text:'Coucou',seed:123456};
  const first=engine.choose(sample),again=engine.choose(sample);
  assert.equal(first.text,again.text);
  let state=null,ids=[],families=[];
  for(let i=0;i<36;i++){
    const o=say('Bonjour',state,{seed:123456,forces:{joie:0.9,humour:0.5}});
    ids.push(o.card);families.push(o.family);state=o.state;
  }
  assert.ok(new Set(ids).size>=8,'cards varied over multiple turns');
  assert.ok(new Set(families).size>=3,'role diversity');
  assert.ok(state.recent.length<=16&&state.families.length<=8,'memory bounded');
});
test('lexical substitutes cannot change unrestricted words or repeat template markers',()=>{
  let state=null,changed=0;
  for(let i=0;i<100;i++){
    const o=say('Je suis curieux',state,{synonyms:true,seed:12});
    assert.ok(!o.text.includes('[['));
    changed+=o.trace.substitutions.length;
    state=o.state;
  }
  assert.ok(changed>0);
});
test('unknown statements use authored dialogue, not echo of private text or invented facts',()=>{
  const secret='mot-de-passe-super-secret';
  const result=say('La lune est '+secret+' ?',null,{semantic:'question'});
  assert.equal(result.intent,'question');
  assert.ok(!result.text.includes(secret));
  assert.equal(result.trace.source,'authored-repertoire');
});
test('malformed state is validated and kept bounded',()=>{
  const o=say('Salut',{seed:Infinity,turns:-100,recent:Array(400).fill('x'),families:['x',null]});
  assert.equal(o.state.turns,1);
  assert.equal(o.state.recent.length,16);
  assert.ok(o.text.length>0);
});

test('BONZE-034: exactly 10,000 composed variants per role with 90,000 unique rendered texts',()=>{
 const cat=sandbox.BonzeCorpus,all=new Set();
 assert.equal(engine.stats().virtualCards,90000);
 for(const role of cat.roles){
  let count=0;
  for(const intent of cat.intents)for(let i=0;i<cat.sizeFor(intent);i++){
   const item=cat.render(role,intent,i);
   assert.equal(item.role,role);assert.equal(item.intent,intent);
   assert.ok(item.body.length<=220,'Piper chunk budget: '+item.id);
   assert.ok(!item.body.includes('[['),'unresolved synonym token');
   assert.ok(!all.has(item.body),'literal duplicate '+item.id);
   all.add(item.body);count++;
  }
  assert.equal(count,10000,role);
 }
 assert.equal(all.size,90000);
 assert.equal(engine.stats().materializedCards,183,'no eager allocation of 90k strings');
});
test('BONZE-034: distinct emotional semantic lenses alter the same scenario',()=>{
 const cat=sandbox.BonzeCorpus;
 const same=cat.roles.map(role=>cat.render(role,'inquietude',0));
 assert.equal(new Set(same.map(x=>x.body)).size,9);
 assert.ok(same.every(x=>x.body.includes("Dis-moi ce qui t'inquiète")));
});
test('BONZE-034: natural sampling uses broad catalogue without huge conversation memory',()=>{
 let state=null,chosen=new Set(),virtual=0;
 for(let i=0;i<250;i++){
  const x=say('Imagine une nouvelle histoire',state,{seed:6751});
  state=x.state;chosen.add(x.card);
  if(x.trace.composed)virtual++;
  assert.ok(x.emotion,'role emotion metadata');
  assert.ok(x.text.length<=220);
 }
 assert.ok(virtual>=150,virtual+' composed replies of 250');
 assert.ok(chosen.size>=160,chosen.size+' unique replies');
 assert.ok(state.recent.length<=16&&state.families.length<=8);
});
test('BONZE-034: high-risk requests remain restricted authored cards',()=>{
 const ask=say('Je suis en danger immédiat',null,{semantic:'humour'});
 assert.equal(ask.intent,'urgence');assert.equal(ask.trace.composed,false);
 const name=say('Comment tu t’appelles ?',null,{semantic:'jeu'});
 assert.equal(name.intent,'identite');assert.equal(name.text,"Je m'appelle Bonze AI ! Et toi ?");
});

test('BONZE-035: categorical associations survive bounded repeated play and protect follow-up continuity',()=>{
 let state=null,first=say('Imagine un dragon',state,{seed:114});state=first.state;
 assert.equal(state.lastIntent,'jeu');assert.equal(state.associations.length,1);
 let next=say('Et après ?',state);assert.equal(next.intent,'jeu');state=next.state;
 for(let i=0;i<300;i++){let r=say(i%2?'Raconte une blague':'Coucou',state);state=r.state;}
 assert.ok(state.associations.length<=24);assert.ok(state.recentForms.length<=8);
 assert.ok(state.recent.length<=16);assert.ok(!JSON.stringify(state).includes('Imagine un dragon'));
});
test('BONZE-035: an urgent situation always outranks a continuing game',()=>{
 const first=say('Imagine un dragon',null,{seed:1});
 assert.equal(say('Je suis en danger immédiat',first.state,{semantic:'jeu'}).intent,'urgence');
});

test('BONZE-035: accented emotional intentions retain categorical associations after restart',()=>{
 let state=null;for(let i=0;i<40;i++){const r=say('Je suis en colère',state);state=r.state;}
 assert.ok(state.associations.some(x=>x.key.startsWith('contrarié/')));
 const restarted=say('Je suis en colère',JSON.parse(JSON.stringify(state)));
 assert.ok(restarted.state.associations.some(x=>x.key.startsWith('contrarié/')));
});

test('BONZE-037: all 90k cards remain within single 220-character Piper turn budget',()=>{
 const cat=sandbox.BonzeCorpus,seen=new Set();
 for(const role of cat.roles)for(const intent of cat.intents)for(let i=0;i<cat.sizeFor(intent);i++){
  const item=cat.render(role,intent,i);
  assert.ok(item.body.length<=220,item.id+' exceeds Piper speech chunk');
  assert.ok(!seen.has(item.body),item.id+' duplicated');
  seen.add(item.body);
 }
 assert.equal(seen.size,90000);
});

test('BONZE-041: user feedback on repetitive or inept responses is treated as correction',()=>{
 for(const text of ['ah oui non mais là tu es vraiment naze','Tu fais le perroquet']){
  const selected=say(text,{seed:126,version:1,recent:[],families:[]});
  assert.equal(selected.intent,'correction',text);
  assert.equal(selected.trace.modelGenerated,false);
  assert.ok(!selected.text.toLowerCase().includes(text.toLowerCase()));
 }
});

test('BONZE-045: quoted emotional/greeting words inside precise questions do not hijack intent',()=>{
 const questions=[
  'Que signifie le mot bonjour ?',
  'Que veut dire au revoir ?',
  'Pourquoi utilise-t-on le mot nul ?',
  'Quelle est la définition du mot humour ?',
  'Comment écrire une blague ?'
 ];
 for(const q of questions){
  const response=say(q,{seed:123,version:1,recent:[],families:[]},{semantic:'salut'});
  assert.equal(response.intent,'question',q);
 }
 assert.equal(say('Bonjour').intent,'salut');
 assert.equal(say('Merci beaucoup').intent,'merci');
 assert.equal(say('Au revoir').intent,'depart');
 assert.equal(say('Je suis triste').intent,'tristesse');
 assert.equal(say('Tu es vraiment naze').intent,'correction');
 assert.equal(say('Pourquoi suis-je en danger immédiat ?',null,{semantic:'question'}).intent,'urgence',
  'explicit risk must override question grammar and neural hints');
});

test('BONZE-049: all 9 roles have precisely 10,000 virtual variants, including the judge',()=>{
 const corpus=sandbox.BonzeCorpus;
 assert.equal(corpus.countPerRole,10000);
 assert.equal(corpus.roles.length,9);
 for(const role of corpus.roles){
  assert.ok(corpus.roles.includes(role));
  const last=corpus.render(role,'discussion',corpus.sizeFor('discussion')-1);
  assert.equal(last.role,role);
  assert.ok(last.body.length<=220);
  assert.equal(last.composed,true);
 }
 const judge=corpus.render('sage','question',corpus.sizeFor('question')-1);
 assert.equal(judge.role,'sage');
 assert.ok(judge.body.length<=220);
 assert.equal(engine.stats().virtualCards,90000);
});

test('BONZE-049: selected role is explicit and never neural-generated',()=>{
 const r=say('Bonjour',null,{seed:998});
 assert.ok(engine.roles.includes(r.role));
 assert.equal(r.role,r.card.split('/')[1]);
 assert.equal(r.trace.modelGenerated,false);
 assert.equal(say('Comment tu t’appelles ?',null,{semantic:'humour'}).role,'sage');
});

test('BONZE-050: preview offers topic-matched, same-role authored sentences with independent states',()=>{
 const before={version:1,seed:74523,turns:4,recent:[],families:[]};
 const original=JSON.stringify(before);
 const preview=engine.propose({text:'Imagine un dragon',state:before,semantic:'jeu'});
 assert.equal(preview.intent,'jeu');
 assert.ok(preview.candidates.length>=2 && preview.candidates.length<=4);
 assert.equal(JSON.stringify(before),original,'preview never mutates saved state');
 const roles=new Set(preview.candidates.map(x=>x.role));
 assert.equal(roles.size,1,'one emotion or judge for every offered response');
 assert.ok(preview.candidates.some(x=>/dragon/i.test(x.text)),'topic-matching core is offered');
 assert.match(preview.candidates[0].text,/dragon/i,'topical fallback is ordered first');
 const ids=new Set();
 for(const candidate of preview.candidates){
  assert.equal(candidate.intent,preview.intent);
  assert.equal(candidate.role,preview.role);
  assert.ok(candidate.text.length>15&&candidate.text.length<=220);
  assert.equal(candidate.trace.modelGenerated,false);
  assert.ok(!ids.has(candidate.card));
  ids.add(candidate.card);
  assert.equal(candidate.state.turns,5,'preview advances exactly one potential turn');
  assert.equal(candidate.state.recent.at(-1),candidate.card);
  assert.equal(candidate.state.families.at(-1),candidate.family);
  assert.ok(candidate.state.recent.length<=16);
 }
 const again=engine.propose({text:'Imagine un dragon',state:before,semantic:'jeu'});
 assert.deepEqual(preview.candidates.map(x=>x.card),again.candidates.map(x=>x.card),
  'same state produces deterministic options');
});

test('BONZE-050: risk, identity, correction and concrete questions do not allow neural recomposition',()=>{
 for(const text of [
  'Je suis en danger immédiat','Comment tu t’appelles ?',
  'Tu te trompes','Quel est le chiffre exact ?'
 ]){
  const preview=engine.propose({text,semantic:'humour',seed:234});
  assert.equal(preview.candidates.length,1,text);
  assert.equal(preview.candidates[0].trace.modelGenerated,false);
 }
});
test('BONZE-050: multi-turn previews do not consume discarded options or replicate the user',()=>{
 let state=null,used=new Set();
 for(let i=0;i<20;i++){
  const plan=engine.propose({text:'Imagine un dragon',state,seed:209});
  const choice=plan.candidates[Math.min(i%3,plan.candidates.length-1)];
  assert.equal(choice.state.turns,i+1);
  assert.ok(!choice.text.includes('mot-de-passe-super-secret'));
  used.add(choice.card);
  state=choice.state;
 }
 assert.ok(used.size>=10,'anti-repeat offers useful card diversity');
 assert.ok(state.recent.length<=16&&state.families.length<=8);
});

test('BONZE-052: preview of a materialized first card retains older form history',()=>{
 let observed=false;
 for(let seed=0;seed<1000&&!observed;seed++){
  const prior={version:1,seed,turns:3,recent:[],families:[],recentForms:['jeu/1/2','humour/2/3']};
  const plan=engine.propose({text:'Imagine un dragon',state:prior});
  if(plan.candidates[0].trace.composed&&plan.candidates.length<2)continue;
  const first=engine.choose({text:'Imagine un dragon',state:prior});
  if(first.trace.composed)continue;
  assert.equal(plan.candidates.length>=2,true);
  for(const candidate of plan.candidates.filter(c=>c.trace.composed)){
   assert.equal(candidate.state.recentForms[0],'jeu/1/2');
   assert.equal(candidate.state.recentForms[1],'humour/2/3');
   const index=Number(candidate.card.split('/v')[1]);
   assert.ok(Number.isInteger(index));
   assert.equal(candidate.state.recentForms.at(-1),candidate.intent+'/'+Math.floor(index%50/5)+'/'+index%5);
  }
  observed=true;
 }
 assert.ok(observed,'test must actually exercise a legacy first card');
});

test('BONZE-052: a follow-up remains anchored in the existing story scene',()=>{
 const first=engine.propose({text:'Imagine un dragon',seed:74523});
 const scene=first.candidates.find(c=>c.trace.composed&&/dragon/i.test(c.text));
 assert.ok(scene,'a dragon story scene must exist in curated repertoire');
 assert.ok(scene.state.lastTheme>=0);
 const follow=engine.propose({text:'Et après ?',state:scene.state});
 assert.equal(follow.intent,'jeu');
 assert.equal(follow.candidates[0].family,
   'jeu/'+follow.role+'/theme'+scene.state.lastTheme,
   'continuity takes priority over unrelated randomized scenes');
 assert.ok(follow.candidates[0].card!==scene.card,'continue should vary wording');
 assert.equal(follow.candidates[0].state.turns,scene.state.turns+1);
});
test('BONZE-052: preview state only stores categorical theme indices',()=>{
 const p=engine.propose({text:'Imagine un mot-de-passe-super-secret',seed:11});
 for(const item of p.candidates){
  assert.ok(Number.isInteger(item.state.lastTheme));
  assert.ok(item.state.lastTheme>=-1&&item.state.lastTheme<=12);
  assert.ok(!JSON.stringify(item.state).includes('mot-de-passe-super-secret'));
 }
});

test('BONZE-053: repeated follow-ups advance a three-beat authored story instead of repeating its initial nucleus',()=>{
 const initial=engine.propose({text:'Imagine un dragon',seed:74523});
 const first=initial.candidates.find(c=>c.trace.composed&&/dragon/i.test(c.text));
 assert.ok(first);
 let state=first.state,phrases=new Set();
 for(let step=0;step<3;step++){
  const p=engine.propose({text:'Et après ?',state});
  assert.equal(p.intent,'jeu');
  const next=p.candidates[0];
  assert.equal(next.trace.source,'authored-story-continuation');
  assert.equal(next.state.lastTheme,first.state.lastTheme);
  assert.equal(next.state.sceneStep,step+1);
  assert.ok(next.text.length<=220);
  assert.ok(!phrases.has(next.text),'new narrative beat must not duplicate prior beat');
  phrases.add(next.text);
  assert.ok(!next.text.includes(first.text));
  state=next.state;
 }
 assert.equal(phrases.size,3);
});
test('BONZE-053: every curated continuation stays bounded, distinct, and separate from the 90k normal catalogue',()=>{
 const corpus=sandbox.BonzeCorpus,all=new Set();
 for(const role of corpus.roles)
  for(let theme=0;theme<11;theme++)
   for(let step=0;step<3;step++){
    const item=corpus.renderContinuation(role,theme,step,0,0);
    assert.ok(item.body.length<=220,item.id);
    assert.ok(!all.has(item.body),item.id);
    all.add(item.body);
    assert.equal(item.intent,'jeu');
    assert.equal(item.role,role);
   }
 assert.equal(all.size,9*11*3);
 assert.equal(engine.stats().virtualCards,90000);
});

test('BONZE-054: after three authored beats the fourth follow-up closes the scene exactly once',()=>{
 const initial=engine.propose({text:'Imagine un dragon',seed:74523});
 let state=initial.candidates.find(x=>x.trace.composed&&/dragon/i.test(x.text)).state;
 const scenes=[];
 for(let i=0;i<4;i++){
  const options=engine.propose({text:'Et après ?',state});
  assert.equal(options.candidates.length,4);
  assert.equal(new Set(options.candidates.map(x=>x.family)).size,1,
   'the neural judge cannot select a different storyline');
  const selected=options.candidates[0];
  scenes.push(selected.text);
  if(i<3)assert.equal(selected.trace.source,'authored-story-continuation');
  else{
   assert.equal(selected.trace.source,'authored-story-closure');
   assert.equal(selected.state.lastTheme,-1);
   assert.equal(selected.state.sceneStep,0);
  }
  state=selected.state;
 }
 assert.equal(new Set(scenes).size,4,'all four beats must be distinct');
 const fifth=engine.propose({text:'Et après ?',state});
 assert.notEqual(fifth.candidates[0].trace.source,'authored-story-closure',
  'a finished story does not repeat its closing line');
});

test('BONZE-054: story closures fit the Piper limit for all 9 personalities',()=>{
 const corpus=sandbox.BonzeCorpus;
 for(const role of corpus.roles){
  for(const theme of [0,3,7,10]){
   const last=corpus.renderStoryClosure(role,theme,9,4);
   assert.ok(last.body.length<=220,role+' '+theme+' '+last.body.length);
   assert.equal(last.intent,'jeu');
  }
 }
});

test('BONZE-055: unknown fictional subjects trigger a useful clarification, not a random scene',()=>{
 for(const topic of ['panda','licorne','volcan','brocoli']){
  const text='Imagine un '+topic;
  const plan=engine.propose({text,seed:74523});
  assert.equal(plan.intent,'jeu');
  assert.equal(plan.candidates.length,1,text);
  const item=plan.candidates[0];
  assert.equal(item.trace.source,'authored-unknown-topic',text);
  assert.equal(item.trace.modelGenerated,false);
  assert.ok(item.text.length>=65 && item.text.length<=220);
  assert.equal(item.state.lastTheme,-1);
  assert.equal(item.state.sceneStep,0);
  assert.ok(!JSON.stringify(item).includes(topic),'do not parrot unknown user topic');
 }
});
test('BONZE-055: a documented fictional topic still gets real story proposals',()=>{
 for(const topic of ['dragon','pirate','robot','tortue']){
  const plan=engine.propose({text:'Imagine un '+topic,seed:74523});
  assert.ok(plan.candidates.length>=2,topic);
  assert.notEqual(plan.candidates[0].trace.source,'authored-unknown-topic',topic);
  assert.match(plan.candidates[0].text,new RegExp(topic,'i'));
 }
});
