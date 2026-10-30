/** Orders playback/snapshot events; never grants microphone authority. */
export function createNativeView(){
 let boot=null,seq=0,expected=null;const retired=new Set();
 return{
  expect(id){expected=String(id);},
  accept(e){
   if(!e||typeof e.boot!=='string'||!Number.isSafeInteger(e.seq)||retired.has(e.boot))return false;
   if(e.boot!==boot){
    if(e.type!=='snapshot')return false;
    if(boot!==null){retired.add(boot);expected=null;}boot=e.boot;seq=0;
   }
   if(e.seq<=seq)return false;seq=e.seq;
   return expected===null||String(e.request)===expected;
  }
 };
}
