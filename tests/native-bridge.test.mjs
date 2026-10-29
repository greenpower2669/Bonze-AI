import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const activity=read('android/app/src/main/java/fr/bonzeai/companion/MainActivity.java');
const service=read('android/app/src/main/java/fr/bonzeai/companion/ConversationService.java');
const manifest=read('android/app/src/main/AndroidManifest.xml');
test('Activity detaches its view at pause without stopping the authorized native session',()=>{
 const pause=activity.slice(activity.indexOf('@Override public void onPause'),activity.indexOf('@Override public void onDestroy'));
 assert.ok(pause.includes('engine.detach(observer)'));assert.ok(!pause.includes('.stop('));
 assert.ok(!activity.includes('Llama.complete'));assert.ok(service.includes('START_NOT_STICKY'));
});
test('microphone service is private, declares permissions and starts only after visible action',()=>{
 for(const p of ['FOREGROUND_SERVICE_MICROPHONE','FOREGROUND_SERVICE_MEDIA_PLAYBACK','WAKE_LOCK'])assert.ok(manifest.includes(p));
 assert.ok(manifest.includes('android:exported="false"'));assert.ok(!manifest.includes('uses-permission android:name="android.permission.INTERNET"'));
 assert.ok(activity.includes('!visible||destroyed||!pendingStart.equals(id)'));assert.ok(activity.includes('runOnUiThread'));
});
test('speech callbacks carry playback ranges and guard old utterance ownership',()=>{
 assert.ok(service.includes('onRangeStart'));assert.ok(service.includes('validSpeech(id)'));assert.ok(service.includes('speech-range'));
 assert.ok(service.includes('memory.prompt(text)'));assert.ok(service.includes('BonzeInference.reply'));
});
