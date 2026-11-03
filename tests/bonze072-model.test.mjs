import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const gradle=source('android/app/build.gradle');
const store=source('android/app/src/main/java/fr/bonzeai/companion/LocalModelStore.java');
const model=source('android/app/src/main/java/fr/bonzeai/companion/BonzeInference.kt');
const service=source('android/app/src/main/java/fr/bonzeai/companion/ConversationService.java');
const app=source('docs/app.js');
const main=source('android/app/src/main/java/fr/bonzeai/companion/MainActivity.java');

test('BONZE-072: new trial is a parallel isolated package with version 10',()=>{
 assert.match(gradle,/bonzeLab12b/);
 assert.match(gradle,/applicationIdSuffix '\.lab12b'/);
 assert.match(gradle,/0\.8\.2-lab12b/);
 assert.match(gradle,/versionCode project\.hasProperty\('bonzeLab12b'\) \? 10/);
 assert.match(gradle,/bonzeLab070/);
 assert.match(main,/isLargeTestBuild\(\)/);
});
test('BONZE-072: large Q4 uses matching official weight and atomic copy',()=>{
 assert.match(store,/b1b3de114215d9507409a662a501a631095a479a419584e8a2ded6304b19b4f5/);
 assert.match(store,/ensureBundled\(Context context\)/);
 assert.match(store,/MessageDigest\.getInstance\("SHA-256"\)/);
 assert.match(store,/context\.getAssets\(\)\.open\("models\/"\+LARGE_FILE\)/);
 assert.match(store,/out\.getFD\(\)\.sync\(\)/);
 assert.match(store,/temp\.renameTo\(dest\)/);
 assert.match(store,/\.lab12b/);
 assert.match(store,/850_000_000L/);
});
test('BONZE-072: original 230M stays untouched for all other apps',()=>{
 assert.match(model,/private const val MODEL = "LFM2\.5-230M-Q4_K_M\.gguf"/);
 assert.match(model,/if \(!context\.packageName\.endsWith\("\.lab12b"\)/);
 assert.match(model,/if \(loadedChoice != LocalModelStore\.LARGE\) return@runBlocking ""/);
 assert.match(model,/ensureModel\(context\)/);
 assert.match(service,/getPackageName\(\)\.endsWith\("\.lab12b"\)/);
 assert.match(service,/BonzeInference\.generateDialogue/);
 assert.match(service,/BonzeInference\.classify/);
 assert.match(service,/scriptedReply/);
});
test('BONZE-072: direct text generation is bounded and offline',()=>{
 assert.match(model,/maxTokens = 120/);
 assert.match(model,/recentContext\.takeLast\(850\)/);
 assert.match(model,/userText\.take\(350\)/);
 assert.match(model,/\.trim\(\)\.take\(450\)/);
 assert.doesNotMatch(model,/https?:\/\/|URLConnection|HttpClient/);
 assert.match(service,/ReplyQuality\.review\(text,candidate/);
 assert.match(service,/epoch!=workEpoch/);
 assert.match(app,/isLargeTestBuild/);
 assert.match(app,/modelChoice=saved\?\.modelChoice==='12b'/);
 assert.match(service,/model12Ready",LocalModelStore\.available\(this\)\|\|LocalModelStore\.bundled\(this\)/);
});
