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
 assert.ok(activity.includes('pendingStart.consumeIfVisible(visible&&!destroyed)'));assert.ok(activity.includes('runOnUiThread'));
});
test('speech callbacks carry playback ranges and guard old utterance ownership',()=>{
 assert.ok(service.includes('onRangeStart'));assert.ok(service.includes('validSpeech(id)'));assert.ok(service.includes('speech-range'));
 assert.ok(service.includes('memory.prompt(text)'));assert.ok(service.includes('BonzeInference.classify'));
});
test('stop cannot discard inference completion bookkeeping from the main queue',()=>{
 assert.ok(!service.includes('main.removeCallbacksAndMessages(null)'));
 assert.ok(service.includes('finally{generating.set(false);}'));
});

test('model switching imports only pinned local weights and never permits cloud loading',()=>{
 const source=read('android/app/src/main/java/fr/bonzeai/companion/LocalModelStore.java');
 const inference=read('android/app/src/main/java/fr/bonzeai/companion/BonzeInference.kt');
 assert.ok(source.includes('ACTION')===false); // Source selector lives in Activity.
 assert.ok(source.includes('SHA-256')&&source.includes('LARGE_SHA256'));
 assert.ok(source.includes('openInputStream(uri)'));
 assert.ok(source.includes('"content".equals(uri.getScheme())'));
 assert.ok(activity.includes('Intent.ACTION_OPEN_DOCUMENT'));
 assert.ok(activity.includes('LocalModelStore.install'));
 assert.ok(inference.includes('if (loadedChoice != selected) release()'));
 assert.ok(service.includes('LocalModelStore.available'));
 assert.ok(!manifest.includes('android.permission.INTERNET'));
});

test('BONZE-043: Liquid classifies only, repertoire is the speaking source and Piper never silently changes voices',()=>{
 const inference=read('android/app/src/main/java/fr/bonzeai/companion/BonzeInference.kt');
 const classifier=read('android/app/src/main/java/fr/bonzeai/companion/IntentClassify.java');
 assert.ok(inference.includes('fun classify(')&&inference.includes('IntentClassify.label(rawLabel)'));
 assert.ok(!service.includes('BonzeInference.reply('));
 assert.ok(service.includes('scriptedReply(text,chosenLabel,turn)'));
 assert.ok(service.includes('ReplyQuality.review(text,candidate,memory.repeats(candidate),recentBot)'));
 assert.ok(classifier.includes('LABELS.contains(first)'));
 const failedStart=service.indexOf('public void failed(String reason,boolean hadAudio)');
 const selectedAndroidStart=service.indexOf('}else androidSpeech(epoch,0);',failedStart);
 assert.ok(failedStart>0&&selectedAndroidStart>failedStart);
 const failed=service.slice(failedStart,selectedAndroidStart);
 assert.ok(failed.includes('"nextEngine","none"'));
 assert.ok(!failed.includes('androidSpeech(epoch,0)'), 'a failed Piper voice must not silently become Android TTS');
 assert.ok(service.includes('}else androidSpeech(epoch,0);'),'Android remains explicitly selectable');
});


test('BONZE-044: Liquid selects synonyms only, latest turn wins and Piper choice persists',()=>{
 const inference=read('android/app/src/main/java/fr/bonzeai/companion/BonzeInference.kt');
 const lexicon=read('android/app/src/main/java/fr/bonzeai/companion/SynonymChoice.java');
 const audit=read('scripts/audit-piper-corpus.mjs');
 assert.ok(inference.includes('fun chooseVariation('));
 assert.ok(inference.includes('maxTokens = 4'));
 assert.ok(!service.includes('BonzeInference.reply('),'no free-form neural answers in service');
 assert.ok(service.includes('SynonymChoice.pick(authored,variants,index)'));
 assert.ok(service.includes('if(!disposed&&epoch==workEpoch&&turn==diagnosticTurn)'));
 assert.ok(service.includes('if(disposed||epoch!=workEpoch||turn!=diagnosticTurn)return;'));
 assert.ok(service.includes('if("piper-mls".equals(preferred)){'));
 assert.ok(service.includes('putString("voiceChoiceV2",voiceName)'));
 assert.ok(lexicon.includes('candidates(original).contains(candidate)'));
 assert.ok(audit.includes('synonymOOV'),'all synonym options need Piper lexicon checks');
});
