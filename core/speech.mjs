/** Speech motion follows playback events. No microphone authority is held here. */
export function createSpeechMotion(){
 let id=null,text='',began=0,rangeAt=-Infinity,timed=false,word='';
 return {
  start(token,content,now=0){id=String(token);text=String(content||'');began=now;rangeAt=-Infinity;timed=false;word='';},
  resume(token,content,now=0){if(String(token)!==id){id=String(token);text=String(content||'');began=now;rangeAt=-Infinity;timed=false;word='';}},
  range(token,start,end,now){if(String(token)!==id)return;word=text.slice(Math.max(0,start),Math.max(0,end));rangeAt=now;timed=true;},
  end(token){if(String(token)===id)id=null;},stop(){id=null;},
  sample(now,reduced=false){
   if(id===null)return{open:0,round:0,emphasis:0,timed:false};
   const elapsed=Math.max(0,now-began),phase=elapsed/83;
   // Range callbacks are word-aligned, not phoneme timing. Fallback is explicitly approximate.
   const recent=now-rangeAt<380;
   const punctuation=/^[\s,.!?;:]*$/.test(word);
   const pulse=(.5+.5*Math.sin(phase))*(.7+.3*Math.sin(phase*.47));
   const open=reduced?.38:timed?(recent&&!punctuation?.28+.62*pulse:.06):.28+.58*pulse;
   return{open,round:/[ouôœ]/i.test(word||text.slice(Math.floor(elapsed/80)%Math.max(1,text.length))),emphasis:reduced?0:open*.6,timed};
  }
 };
}
