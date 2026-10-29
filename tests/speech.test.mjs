import test from 'node:test';import assert from 'node:assert/strict';
import {createSpeechMotion} from '../core/speech.mjs';
test('mouth follows actual speech lifecycle and range pulses, not listening permission',()=>{
 const s=createSpeechMotion();assert.equal(s.sample(0).open,0);
 s.start('a','Bonjour, la forêt !',0);const open=s.sample(100).open;assert.ok(open>.2);
 s.range('a',0,7,120);assert.ok(s.sample(140).open>.2);
 s.end('old');assert.ok(s.sample(160).open>0);
 s.end('a');assert.equal(s.sample(200).open,0);
});
test('old utterance callbacks cannot animate a new utterance, stop is immediate',()=>{
 const s=createSpeechMotion();s.start('b','Salut',0);s.range('old',0,4,30);assert.equal(s.sample(60).timed,false);
 s.stop();assert.equal(s.sample(80).open,0);
});
test('speech is visible in reduced motion mode, without idle rocking',()=>{
 const s=createSpeechMotion();s.start('a','Bonjour',0);assert.ok(s.sample(100,true).open>=.3);
 s.stop();assert.equal(s.sample(120,true).open,0);
});
test('resync of the same utterance preserves its word-aligned timing',()=>{
 const s=createSpeechMotion();s.start('a','Bonjour',0);s.range('a',0,7,100);s.resume('a','Bonjour',0);
 assert.equal(s.sample(130).timed,true);
});
