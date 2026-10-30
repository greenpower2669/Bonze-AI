const CACHE="bonze-static-v8";
const ASSETS=["./backup-ui.js","./admin-ui.js","../core/captions.mjs","../core/backup.mjs","../core/council.js","../core/admin-gesture.mjs","./","./index.html","./style.css","./app.js","./avatar.js","./icon.svg","./manifest.webmanifest","../core/bonze.mjs","../core/identity.mjs","../core/organism.mjs","../core/speech.mjs","../core/native-view.mjs","../core/experts.mjs","../core/conversation.mjs","../core/weights/expert-router-v1.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("bonze-static-")&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET"||new URL(e.request.url).origin!==self.location.origin)return;
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));
});


