import test from 'node:test';
import assert from 'node:assert/strict';
import {createConversationSession} from '../core/conversation.mjs';
test('stop cancels busy turn; old result cannot finish a subsequent turn',()=>{
 const s=createConversationSession();s.start();assert.equal(s.accept('ancien','voice'),true);
 const old=s.turn;s.stop();assert.equal(s.busy,false);
 s.start();assert.equal(s.accept('nouveau','voice'),true);const current=s.turn;
 assert.equal(s.isCurrent(old),false);assert.equal(s.finish(old),false);assert.equal(s.busy,true);
 assert.equal(s.isCurrent(current),true);assert.equal(s.finish(current),true);
});
