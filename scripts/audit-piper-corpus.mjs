#!/usr/bin/env node
// BONZE-036: offline audit of the *actual* packaged French Piper lexicon.
// This is a diagnostic, not a substitute for listening to the audio.
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const corpusSource=readFileSync(new URL('../core/repertoire-corpus.js',import.meta.url),'utf8');
const repertoireSource=readFileSync(new URL('../core/repertoire.js',import.meta.url),'utf8');
const lexiconFile=new URL('../android/app/src/main/assets/piper/lexicon.txt',import.meta.url);
const lines=readFileSync(lexiconFile,'utf8').split(/\r?\n/);
const dictionary=new Set(lines.filter(s=>s.includes('||')).map(s=>s.split('||',1)[0].trim().toLocaleLowerCase('fr-FR')));
if(dictionary.size<70000)throw Error('Unexpected packaged Piper lexicon; audit must run after fetch-piper.sh');
const context={};
runInNewContext(corpusSource,context,{timeout:3000});
runInNewContext(repertoireSource,context,{timeout:3000});
const corpus=context.BonzeCorpus;
const WORD=/\p{L}+/gu;
const missing=new Map();
let checked=0,fullyCovered=0,shortSamples=0,uniqueTexts=new Set();
const byIntent={};
for(const role of corpus.roles){
 for(const intent of corpus.intents){
  for(let i=0;i<corpus.sizeFor(intent);i++){
   const card=corpus.render(role,intent,i),words=card.body.toLocaleLowerCase('fr-FR').match(WORD)||[];
   checked++;uniqueTexts.add(card.body);
   const unknown=[...new Set(words.filter(w=>!dictionary.has(w)))];
   if(!unknown.length)fullyCovered++;
   else{
    byIntent[intent]=(byIntent[intent]||0)+1;
    for(const word of unknown)missing.set(word,(missing.get(word)||0)+1);
   }
   if(words.length<5)shortSamples++;
  }
 }
}
const report={
 model:'Piper MLS French medium + lexicon as packaged',
 evaluated:new Date().toISOString(),
 variantsChecked:checked,
 uniqueTexts:uniqueTexts.size,
 lexiconEntries:dictionary.size,
 lexicallyCoveredVariants:fullyCovered,
 variantsWithUnknownWords:checked-fullyCovered,
 lexicalCoveragePct:Number((100*fullyCovered/checked).toFixed(2)),
 topOOV:[...missing.entries()].sort((a,b)=>b[1]-a[1]).slice(0,70).map(([word,variants])=>({word,variants})),
 uncoveredByIntent:byIntent,
 notes:'No acoustic claim. Short IPA and audio/permission failures remain possible even for covered texts.'
};
writeFileSync('piper-corpus-report.json',JSON.stringify(report,null,2)+'\n');
console.log('PIPER_CORPUS_AUDIT variants='+checked+' unique='+uniqueTexts.size+' fullLexicalCoveragePct='+report.lexicalCoveragePct+' OOV='+missing.size);
console.log('PIPER_MOST_COMMON_OOV '+report.topOOV.slice(0,20).map(x=>x.word+':'+x.variants).join(' '));
if(checked!==18000||uniqueTexts.size!==18000)throw Error('Corpus count or uniqueness changed');
