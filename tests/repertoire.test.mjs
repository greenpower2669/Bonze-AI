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
  assert.equal(stats.virtualCards,18000,'2000 constructed replies per each of 9 policy roles');
  assert.equal(stats.materializedCards,183,'only small legacy table is eagerly materialized');
  for(const n of stats.roles)assert.ok(stats.perRole[n]>=2000,n);
  assert.ok(stats.cards>=18000);
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

test('BONZE-034: exactly 2,000 composed variants per role with 18,000 unique rendered texts',()=>{
 const cat=sandbox.BonzeCorpus,all=new Set();
 assert.equal(engine.stats().virtualCards,18000);
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
  assert.equal(count,2000,role);
 }
 assert.equal(all.size,18000);
 assert.equal(engine.stats().materializedCards,183,'no eager allocation of 18k strings');
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
