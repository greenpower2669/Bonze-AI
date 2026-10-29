import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const {chromium}=await import(process.env.BONZE_PLAYWRIGHT_MODULE||'playwright');
const root=resolve(new URL('..',import.meta.url).pathname);
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost'), path=resolve(root,'.'+decodeURIComponent(url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname));
 if(!path.startsWith(root+'/'))throw Error('path');
 const body=await readFile(path);res.writeHead(200,{'Content-Type':mime[extname(path)]||'text/plain'});res.end(body);
}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let checks=0;const check=(v,message)=>{assert.ok(v,message);checks++;};
try{
 const context=await browser.newContext({viewport:{width:393,height:852}}),page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(origin+'/docs/');await page.waitForSelector('#avatar-fields select',{state:'attached'});
 const born=await page.evaluate(()=>JSON.parse(localStorage.getItem('bonze-proto-01')).identity);
 check(born.seed.length===32,'seed born');
 await page.getByRole('button',{name:'Options',exact:false}).click();
 await page.locator('#avatar-editor summary').first().click();
 await page.locator('#avatar-preset').selectOption('night');
 check(await page.locator('#face').getAttribute('data-skin')==='night','skin preview live');
 await page.locator('#settings-close').click();
 await page.locator('#open-keyboard').click();await page.locator('#message').fill('Comment tu t’appelles ?');await page.locator('#send-message').click();
 check((await page.locator('#answer').textContent()).includes("Je m'appelle Bonze AI !"),'natural name');
 const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('bonze-proto-01')));
 await page.reload();await page.waitForSelector('#avatar-fields select',{state:'attached'});
 const reload=await page.evaluate(()=>JSON.parse(localStorage.getItem('bonze-proto-01')));
 check(reload.identity.seed===born.seed,'seed stable after reload');
 check(reload.identity.personalized.skin==='night','skin retained');
 check(reload.history.length===persisted.history.length,'history retained');
 await page.locator('#settings-open').click();await page.locator('#avatar-editor summary').first().click();
 await page.locator('#avatar-reset').click();
 const reset=await page.evaluate(()=>JSON.parse(localStorage.getItem('bonze-proto-01')));
 check(reset.identity.innate.appearance.skin===born.innate.appearance.skin,'innate retained');
 check(reset.identity.acquired.exchanges===reload.identity.acquired.exchanges,'appearance reset preserves acquired');
 await page.locator('#contrast').check();await page.locator('#reduce-motion').check();
 check(await page.locator('body').evaluate(b=>b.classList.contains('high-contrast')),'contrast available');
 await page.locator('#settings-close').click();
 for(const [width,height] of [[393,852],[320,568],[852,393],[393,640]]){
  await page.setViewportSize({width,height});
  const rects=await page.evaluate(()=>{
   const r=id=>{let b=document.getElementById(id).getBoundingClientRect();return{top:b.top,bottom:b.bottom,left:b.left,right:b.right};};
   return{face:r('face'),stop:r('stop-all'),vh:innerHeight,vw:innerWidth};
  });
  check(rects.face.top>=0&&rects.face.bottom<=height,'face visible '+width+'x'+height);
  if(width===393&&height===852)check(rects.face.right-rects.face.left>=190,'larger portrait face');
  check(rects.stop.top>=0&&rects.stop.bottom<=height&&rects.stop.right<=width,'stop visible '+width+'x'+height);
 }
 await page.setViewportSize({width:393,height:852});
 await page.screenshot({path:process.env.BONZE_SCREENSHOT||'/tmp/bonze-v050.png'});
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await context.setOffline(true);await page.reload();await page.waitForSelector('#avatar-fields select',{state:'attached'});
 check(await page.locator('#face').isVisible(),'PWA offline reload');await context.setOffline(false);
 check(errors.length===0,'no browser exceptions: '+errors.join(','));await context.close();

 const native=await browser.newContext({viewport:{width:393,height:852}});
 await native.addInitScript(()=>{
  window.calls=[];window.seq=0;window.request='';window.active=false;window.rows=[];window.emitSnapshot=(extra={})=>{
   BonzeNativeEvent({type:'snapshot',boot:'service',seq:++seq,request,active,state:active?'listening':'off',status:'Service local',history:rows,voices:[{name:'fr-local'}],voice:'fr-local',...extra});
  };
  window.BonzeAndroid={localSpeechAvailable:()=>true,
   connectNative:()=>{calls.push(['connect']);emitSnapshot();},configureNative:data=>calls.push(['configure',JSON.parse(data)]),
   command:(action,text,id)=>{
    calls.push([action,text,id]);if(action==='sync'){emitSnapshot();return;}
    request=id;
    if(action==='start'){active=true;emitSnapshot();}
    else if(action==='stop'){active=false;emitSnapshot();}
    else if(action==='text'){active=false;rows.push({id:Date.now(),role:'human',text});emitSnapshot({state:'thinking',busy:true});}
    else if(action==='describe'){active=false;emitSnapshot();BonzeNativeEvent({type:'speech-start',boot:'service',seq:++seq,request,id:'description',text});}
   },resourceSnapshot:()=>JSON.stringify({availableMiB:1024,totalMiB:8192,pssMiB:300})};
 });
 const p=await native.newPage();p.on('pageerror',e=>errors.push(String(e)));
 await p.goto(origin+'/docs/');await p.waitForSelector('#avatar-fields select',{state:'attached'});
 check(await p.evaluate(()=>!calls.some(c=>c[0]==='start')),'never auto listen');
 await p.locator('#native-mic').click();check(await p.locator('#native-mic').getAttribute('aria-pressed')==='true','explicit start reflected');
 await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 check(await p.evaluate(()=>!calls.some(c=>c[0]==='stop')),'screen hide does not stop native conversation');
 await p.evaluate(()=>{rows.push({id:100,role:'human',text:'Notre forêt s’appelle Azur.'},{id:101,role:'bot',text:'Je garde Azur.'});Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
 check((await p.locator('#answer').textContent()).includes('Azur'),'wake synchronizes background history');
 await p.evaluate(()=>{BonzeNativeEvent({type:'speech-start',boot:'service',seq:++seq,request,id:'phrase',text:'Bonjour, la forêt !'});});
 await p.waitForFunction(()=>document.getElementById('face').classList.contains('is-talking'));
 const mouthHeight=await p.locator('.mouth').evaluate(el=>el.getBoundingClientRect().height);
 check(mouthHeight>10,'mouth has visible opening while speaking');
 await p.locator('#stop-all').click();
 await p.evaluate(()=>BonzeNativeEvent({type:'speech-start',boot:'service',seq:++seq,request:'old-request',id:'old',text:'Périmé'}));
 check(await p.locator('#face').evaluate(el=>!el.classList.contains('is-talking')),'stop rejects old speech event');
 await p.locator('#settings-open').click();await p.locator('#avatar-editor summary').first().click();
 await p.locator('#avatar-read').click();
 await p.waitForFunction(()=>document.getElementById('face').classList.contains('is-talking'));
 check(await p.locator('#native-mic').getAttribute('aria-pressed')==='false','description animates without enabling microphone');
 await p.locator('#settings-close').click();await p.locator('#stop-all').click();
 await p.locator('#open-keyboard').click();await p.locator('#message').fill('Je suis le gardien');await p.locator('#send-message').click();
 check(await p.evaluate(()=>calls.filter(c=>c[0]==='text').length===1),'one native text turn');
 await p.locator('#stop-all').click();await p.locator('#settings-open').click();await p.locator('#neural').uncheck();
 await p.reload();await p.waitForSelector('#avatar-fields select',{state:'attached'});
 check(await p.evaluate(()=>calls.some(c=>c[0]==='configure'&&c[1].neural===false)),'neural disable persisted');
 check(await p.evaluate(()=>!calls.some(c=>c[0]==='start')),'reload never resumes microphone by itself');
 check(errors.length===0,'no native UI exceptions: '+errors.join(','));
 await native.close();
 console.log(checks+' browser assertions passed');
}catch(error){const p=browser.contexts().at(-1)?.pages().at(-1);if(p)await p.screenshot({path:process.env.BONZE_SCREENSHOT||'/tmp/bonze-v050.png'});throw error;}finally{await browser.close();server.closeAllConnections();server.close();}
