import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createConversationSession} from "../core/conversation.mjs";
const html=readFileSync(new URL("../docs/index.html",import.meta.url),"utf8");
const script=readFileSync(new URL("../docs/app.js",import.meta.url),"utf8");
test("hands-free requires explicit activation and stops immediately",()=>{
  const s=createConversationSession();
  assert.equal(s.enabled,false);
  assert.equal(s.accept("salut","voice"),false);
  s.start();assert.equal(s.enabled,true);
  assert.equal(s.accept("salut","voice"),true);
  assert.equal(s.accept("répété","voice"),false);
  s.stop();assert.equal(s.finish(),false);
  assert.equal(s.accept("après stop","voice"),false);
});
test("text mode works while microphone off, without double-send",()=>{
  const s=createConversationSession();
  assert.equal(s.accept("Bonjour","text"),true);
  assert.equal(s.accept("Bonjour","text"),false);
  assert.equal(s.finish(),false);
  assert.equal(s.accept("  ","text"),false);
  assert.equal(s.turn,1);
});
test("reactivation only after explicit start",()=>{
  const s=createConversationSession();
  s.start();assert.equal(s.accept("une phrase","voice"),true);
  assert.equal(s.finish(),true);
  s.stop();assert.equal(s.accept("autre","voice"),false);
  s.start();assert.equal(s.accept("autre","voice"),true);
});
test("always visible face and controls, accessible captions",()=>{
  for(const key of ["id=\"face\"","id=\"heard\"","id=\"answer\"",
     "id=\"native-mic\"","id=\"settings\"","id=\"caption-size\"","id=\"face-touch\""])
    assert.ok(html.includes(key),key);
  assert.ok(html.includes('aria-live="polite"'));
  assert.ok(html.includes('id="keyboard-panel" hidden'));
  assert.ok(script.includes('window.BonzeNativeResult=text=>{handleText(text,"voice")'));
  assert.ok(script.includes('window.BonzeAndroid.speakReply(content)'));
});
