import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../android/app/src/main/java/fr/bonzeai/companion/MainActivity.java',import.meta.url),'utf8');
test('native generation request serializes epoch capture with queued microphone stop',()=>{
 const bridge=source.slice(source.indexOf('public void generateLocalReply'),source.indexOf('@JavascriptInterface public void setNeuralEnabled'));
 assert.ok(bridge.includes('runOnUiThread(()->generateReplyOnMain(text,mood,token))'));
 assert.ok(!bridge.includes('inferenceEpoch.get()'));
 const helper=source.slice(source.indexOf('private void generateReplyOnMain'),source.indexOf('private void releaseModel'));
 assert.ok(helper.includes('final long epoch=inferenceEpoch.get()'));
});
