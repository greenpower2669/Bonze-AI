package fr.bonzeai.companion;

import android.Manifest;
import android.app.*;
import android.content.*;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.media.*;
import android.os.*;
import android.speech.*;
import android.speech.tts.*;
import androidx.annotation.ChecksSdkIntAtLeast;
import org.json.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

/** User-started offline conversation. The Activity is a view, never the session owner. */
public final class ConversationService extends Service {
 public static final String START="fr.bonzeai.START",STOP="fr.bonzeai.STOP";
 private static final int NOTICE=501;
 public interface Listener{void onEvent(String json);}
 public final class LocalBinder extends Binder{public ConversationService service(){return ConversationService.this;}}
 private final LocalBinder binder=new LocalBinder();
 private final Handler main=new Handler(Looper.getMainLooper());
 private final ExecutorService inference=Executors.newSingleThreadExecutor();
 private final VoiceSession session=new VoiceSession();
 private final DialogueMemory memory=new DialogueMemory();
 private final String boot=UUID.randomUUID().toString();
 private Listener listener;private SpeechRecognizer recognizer;private TextToSpeech tts;
 private android.content.SharedPreferences prefs;private DiagnosticJournal journal;private long diagnosticTurn;private EmotionalCouncil council;private ScriptedDialogue scripted;private long councilAt;private String policyHint="";private PiperVoice piper;private String speechEngine="";
 private PowerManager.WakeLock cpu;
 private AudioManager audio;private AudioFocusRequest focus;
 private boolean promoted,recording,disposed,localVoiceReady,voiceInitFinished;
 private final AtomicBoolean generating=new AtomicBoolean();
 private long focusSerial;
 private boolean neural=true,readText=false,economy;
 private String mode="precise",mood="curiosite",request="",state="off",status="Micro arrêté.",voiceName="";
 private long workEpoch,sequence,speechSerial,speechBegan,lastHeardAt;
 private volatile long lastLatency=-1,lastCpu=-1;
 private int noSpeech;
 private String speechId="",speechText="",speechPrefix="";
 private List<String> speechChunks=Collections.emptyList();
 private boolean speechConversation;
 private final BroadcastReceiver unplugged=new BroadcastReceiver(){@Override public void onReceive(Context c,Intent i){stop(request,"Casque débranché : conversation arrêtée.");}};

 @Override public void onCreate(){
  super.onCreate();prefs=getSharedPreferences("bonze-conversation-v1",MODE_PRIVATE);
  mode=prefs.getString("mode","precise");neural=prefs.getBoolean("neural",true);readText=prefs.getBoolean("readText",false);economy="eco".equals(mode);
  journal=new DiagnosticJournal(prefs);try{council=new EmotionalCouncil(this,prefs);}catch(Exception e){journal.add("council-error",0,DiagnosticJournal.fields("error",e.getClass().getSimpleName()));}councilAt=SystemClock.elapsedRealtime();main.postDelayed(this::councilTick,10000);piper=new PiperVoice(getApplicationContext());try{scripted=new ScriptedDialogue(this,prefs);}catch(Exception e){journal.add("repertoire-init-error",0,DiagnosticJournal.fields("error",e.getClass().getSimpleName()));}voiceName=prefs.getString("voiceChoiceV2","piper-mls");loadMemory();audio=(AudioManager)getSystemService(AUDIO_SERVICE);
  cpu=((PowerManager)getSystemService(POWER_SERVICE)).newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,"BonzeAI:Conversation");cpu.setReferenceCounted(false);
  ((NotificationManager)getSystemService(NOTIFICATION_SERVICE)).createNotificationChannel(new NotificationChannel("bonze-dialogue","Conversation Bonze",NotificationManager.IMPORTANCE_LOW));
  IntentFilter filter=new IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY);
  if(Build.VERSION.SDK_INT>=33)registerReceiver(unplugged,filter,Context.RECEIVER_NOT_EXPORTED);else registerReceiver(unplugged,filter);
  prepareVoice();
 }
 @Override public IBinder onBind(Intent intent){return binder;}
 public void attach(Listener observer){listener=observer;session.attachUi();publish();}
 public void detach(Listener observer){if(listener==observer)listener=null;session.detachUi();}
 public void authorizeStart(String id){session.authorizeStart(id);}
 public String snapshot(){return snapshotObject().toString();}
 @Override public int onStartCommand(Intent intent,int flags,int startId){
  if(intent==null){stopSelf();return START_NOT_STICKY;}
  String id=intent.getStringExtra("request");if(id==null)id=request;
  if(STOP.equals(intent.getAction())){stop(id,"Conversation arrêtée.");return START_NOT_STICKY;}
  if(START.equals(intent.getAction())){
   if(!session.consumeStart(id)){if(!promoted)stopSelf(startId);return START_NOT_STICKY;}
   request=id;
   try{
    if(checkSelfPermission(Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED)throw new SecurityException();
    promote();begin(id);
   }catch(RuntimeException error){stop(id,"Microphone en veille indisponible : ouvre Bonze pour réessayer.");}
  }
  return START_NOT_STICKY; // Never resurrect the microphone after process death.
 }
 private void promote(){
  Notification n=notification();
  if(Build.VERSION.SDK_INT>=29)startForeground(NOTICE,n,ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE|ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
  else startForeground(NOTICE,n);
  promoted=true;
 }
 private Notification notification(){
  PendingIntent open=PendingIntent.getActivity(this,0,new Intent(this,MainActivity.class),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
  PendingIntent stop=PendingIntent.getService(this,1,new Intent(this,ConversationService.class).setAction(STOP),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
  String label="listening".equals(state)?"Bonze écoute":"speaking".equals(state)?"Bonze te répond":"thinking".equals(state)?"Bonze réfléchit":"Conversation Bonze active";
  return new Notification.Builder(this,"bonze-dialogue").setSmallIcon(fr.bonzeai.companion.R.drawable.bonze_icon)
   .setContentTitle(label).setContentText("Hors ligne · actif même écran éteint")
   .setContentIntent(open).setOngoing(true).setOnlyAlertOnce(true).setVisibility(Notification.VISIBILITY_PUBLIC)
   .addAction(new Notification.Action.Builder(null,"Arrêter",stop).build()).build();
 }
 private void notifyState(){if(promoted)((NotificationManager)getSystemService(NOTIFICATION_SERVICE)).notify(NOTICE,notification());}
 private void holdCpu(){if(session.active())cpu.acquire(120_000L);}
 private void releaseCpu(){if(cpu!=null&&cpu.isHeld())cpu.release();}
 @ChecksSdkIntAtLeast(api=31) private boolean localSupported(){return Build.VERSION.SDK_INT>=31&&SpeechRecognizer.isOnDeviceRecognitionAvailable(this);}
 private void begin(String id){
  invalidate();request=id;
  if("off".equals(mode)||"text".equals(mode)){stop(id,"Ce mode conserve le microphone arrêté.");return;}
  if(!localSupported()){stop(id,"Reconnaissance française locale indisponible. Tu peux écrire.");return;}
  session.begin();noSpeech=0;lastHeardAt=SystemClock.elapsedRealtime();holdCpu();setState("waiting","Je prépare notre conversation, même écran éteint.");listen();
 }
 public void stop(String id,String message){
  request=id==null?request:id;invalidate();setState("off",message);releaseCpu();
  if(promoted){stopForeground(STOP_FOREGROUND_REMOVE);promoted=false;stopSelf();}
 }
 private void invalidate(){
  workEpoch++;session.stop();releaseRecognizer(true);
  speechId="";speechPrefix="";speechText="";if(tts!=null)tts.stop();if(piper!=null)piper.stop();abandonFocus();
 }
 public void configure(String json){
  try{
   JSONObject c=new JSONObject(json);String wanted=c.optString("mode",mode);
   if(Arrays.asList("precise","eco","light","text","off").contains(wanted))mode=wanted;
   neural=c.optBoolean("neural",neural);readText=c.optBoolean("readText",readText);economy="eco".equals(mode);
   if(council==null)mood=DialogueMemory.clean(c.optString("mood",mood),30);if(council!=null&&c.optJSONObject("identity")!=null)council.seed(c.getJSONObject("identity"));memory.setName(c.optString("nickname",""));
   String chosen=c.optString("voice","");if(!chosen.isEmpty()&&!chosen.equals(voiceName))selectVoice(chosen);
   prefs.edit().putString("mode",mode).putBoolean("neural",neural).putBoolean("readText",readText).apply();
   if(!neural||!Arrays.asList("precise","eco").contains(mode)){if(!inference.isShutdown())inference.execute(BonzeInference::release);}if("off".equals(mode)||"text".equals(mode))piper.unload();
   if(("off".equals(mode)||"text".equals(mode))&&session.active())stop(request,"Mode texte : conversation vocale arrêtée.");
   publish();
  }catch(JSONException ignored){}
 }
 public void bootstrap(String json){
  // First upgrade only: local WebView history is imported, then native ledger is authoritative.
  if(prefs.getBoolean("imported",false))return;
  try{JSONObject root=new JSONObject(json);JSONArray rows=root.optJSONArray("history");
   if(memory.size()==0&&rows!=null)for(int i=Math.max(0,rows.length()-30);i<rows.length();i++){
    JSONObject row=rows.optJSONObject(i);if(row!=null)memory.add(row.optString("role"),row.optString("text"));
   }
   List<DialogueMemory.Entry> imported=memory.entries();
   long ceiling=imported.isEmpty()?0:imported.get(imported.size()-1).id;
   prefs.edit().putBoolean("imported",true).putLong("importedThrough",ceiling).apply();saveMemory();
  }catch(JSONException ignored){}
 }
 public void submitText(String text,String id){
  stop(id,"Je lis ton message.");
  if("off".equals(mode)){setState("off","Bonze est en pause.");return;}
  reply(text,false);
 }
 private void reply(String raw,boolean fromVoice){
  String text=DialogueMemory.clean(raw,600).trim();if(text.isEmpty())return;
  final long epoch=workEpoch;
  final long turn=++diagnosticTurn;updateCouncil(text);
  final String prompt=memory.prompt(text),contextData=memory.context(),hint=policyHint;
  journal.add("input",turn,DiagnosticJournal.fields("source",fromVoice?"voice":"text","text",text,"prompt",prompt,"context",contextData,"policyHint",hint,"epoch",epoch));
  memory.add("human",text);saveMemory();lastHeardAt=SystemClock.elapsedRealtime();
  if(fromVoice)session.awaiting();setState("thinking","Je réfléchis à ce que tu viens de me dire.");holdCpu();
  // The neural model classifies only. Every spoken sentence comes from a reviewed card.
  if(!neural||!Arrays.asList("precise","eco").contains(mode)){complete(epoch,scriptedReply(text,"",turn),fromVoice);return;}
  if(!generating.compareAndSet(false,true)){complete(epoch,"Je termine un classement. Redis-moi ça dans un instant ?",fromVoice);return;}
  inference.execute(()->{
   String category="",errorName="";long began=SystemClock.elapsedRealtime(),cpuBegan=SystemClock.currentThreadTimeMillis();
   try{category=BonzeInference.classify(getApplicationContext(),text);}
   catch(Exception|LinkageError error){errorName=error.getClass().getSimpleName();}
   finally{generating.set(false);}
   final String semantic=category,failure=errorName;final long elapsed=SystemClock.elapsedRealtime()-began,cpuTime=SystemClock.currentThreadTimeMillis()-cpuBegan;
   main.post(()->{
    lastLatency=elapsed;lastCpu=cpuTime;
    journal.add("semantic-classification",turn,DiagnosticJournal.fields("candidate",semantic,"error",failure,"latencyMs",elapsed,"discarded",disposed||epoch!=workEpoch));
    if(!disposed&&epoch==workEpoch)complete(epoch,scriptedReply(text,semantic,turn),fromVoice);
   });
  });
 }
 private String scriptedReply(String text,String semantic,long turn){
  if(scripted==null)return lightReply(text);
  try{
   boolean vary="humour".equals(mood)||"curiosite".equals(mood);
   JSONObject result=scripted.choose(text,semantic,council==null?null:council.snapshot(),vary);
   journal.add("repertoire",turn,DiagnosticJournal.fields("card",result.optString("card"),"intent",result.optString("intent"),"role",result.optString("emotion"),"detected",result.optString("detected"),"semanticUsed",result.optBoolean("semanticUsed"),"trace",result.optJSONObject("trace")));
   return result.getString("text");
  }catch(Exception|LinkageError error){
   journal.add("repertoire-error",turn,DiagnosticJournal.fields("error",error.getClass().getSimpleName()));
   return lightReply(text);
  }
 }
 private String lightReply(String text){
  if(text.toLowerCase(Locale.FRANCE).matches(".*comment tu t.appelles.*"))return "Je m'appelle Bonze AI ! Et toi ?";
  return "Je suis en mode léger. Raconte-moi la suite, je t'écoute.";
 }
 private void complete(long epoch,String answer,boolean fromVoice){
  if(epoch!=workEpoch||disposed)return;
  memory.add("bot",answer);journal.add("published",diagnosticTurn,DiagnosticJournal.fields("answer",answer));saveMemory();setState("waiting","J'ai une réponse pour toi.");
  if(fromVoice&&session.active()||readText&&!"text".equals(mode)&&!"off".equals(mode))speak(answer,fromVoice,epoch,0);
  else{releaseCpu();setState("off","Réponse écrite disponible.");}
 }
 private void listen(){
  if(!session.canListen()||recording||disposed)return;
  if(!localSupported()){stop(request,"Moteur local indisponible.");return;}
  holdCpu();final long epoch=session.epoch();
  try{
   final SpeechRecognizer source=SpeechRecognizer.createOnDeviceSpeechRecognizer(this);recognizer=source;recording=true;
   source.setRecognitionListener(new RecognitionListener(){
    private boolean valid(){return recognizer==source&&session.current(epoch)&&!disposed;}
    @Override public void onReadyForSpeech(Bundle p){if(valid())setState("listening","Je t'écoute, même écran éteint.");}
    @Override public void onBeginningOfSpeech(){}
    @Override public void onRmsChanged(float r){}
    @Override public void onBufferReceived(byte[] b){}
    @Override public void onEndOfSpeech(){if(valid())setState("waiting","Je termine ta phrase.");}
    @Override public void onError(int error){
     if(!valid())return;releaseRecognizer(false);
     if(error==SpeechRecognizer.ERROR_NO_MATCH||error==SpeechRecognizer.ERROR_SPEECH_TIMEOUT){noSpeech++;retryListen(epoch);}
     else stop(request,"Écoute interrompue (code "+error+"). Tu peux réessayer dans Bonze.");
    }
    @Override public void onResults(Bundle b){
     if(!valid())return;ArrayList<String> matches=b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);releaseRecognizer(false);
     String text=matches!=null&&!matches.isEmpty()?matches.get(0):"";
     if(text.trim().isEmpty()){noSpeech++;retryListen(epoch);return;}
     noSpeech=0;reply(text,true);
    }
    @Override public void onPartialResults(Bundle b){}
    @Override public void onEvent(int t,Bundle b){}
   });
   Intent i=new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
    .putExtra(RecognizerIntent.EXTRA_LANGUAGE,"fr-FR").putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS,false).putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE,true);
   source.startListening(i);
  }catch(RuntimeException error){stop(request,"Écoute locale impossible. Tu peux écrire.");}
 }
 private void retryListen(long epoch){
  if(!session.current(epoch))return;
  if(SystemClock.elapsedRealtime()-lastHeardAt>600_000L){stop(request,"Long silence : je mets notre conversation en pause.");return;}
  setState("waiting",noSpeech>2?"Je reste disponible. Arrêter est accessible dans la notification.":"Je t'écoute quand tu veux.");
  main.postDelayed(()->{if(session.current(epoch))listen();},noSpeech>5?5000:noSpeech>2?1800:650);
 }
 private void releaseRecognizer(boolean cancel){
  SpeechRecognizer old=recognizer;recognizer=null;recording=false;
  if(old!=null){if(cancel)try{old.cancel();}catch(RuntimeException ignored){}try{old.destroy();}catch(RuntimeException ignored){}}
 }
 private boolean acquireFocus(){
  final long focusToken=++focusSerial;
  focus=new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
   .setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ASSISTANT).setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build())
   .setOnAudioFocusChangeListener(change->{if(change<0)main.post(()->{if(!disposed&&focusToken==focusSerial&&focus!=null)stop(request,"Une autre source audio interrompt Bonze.");});},main).build();
  return audio.requestAudioFocus(focus)==AudioManager.AUDIOFOCUS_REQUEST_GRANTED;
 }
 private void abandonFocus(){focusSerial++;if(focus!=null){audio.abandonAudioFocusRequest(focus);focus=null;}}
 private void prepareVoice(){
  tts=new TextToSpeech(getApplicationContext(),code->{
   voiceInitFinished=true;if(code!=TextToSpeech.SUCCESS||tts==null||disposed)return;
   selectVoice(voiceName);
   tts.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ASSISTANT).setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build());
   tts.setOnUtteranceProgressListener(new UtteranceProgressListener(){
    @Override public void onStart(String id){main.post(()->{
     if(!validSpeech(id))return;
     int part=partIndex(id);if(part<0||part>=speechChunks.size())return;
     speechId=id;speechText=speechChunks.get(part);journal.add("speech",diagnosticTurn,DiagnosticJournal.fields("engine","android","id",id,"text",speechText));speechBegan=SystemClock.elapsedRealtime();
     setState("speaking","Je te réponds.");speechEvent("speech-start",id,0,0);
    });}
    @Override public void onRangeStart(String id,int start,int end,int frame){main.post(()->{if(id.equals(speechId)&&validSpeech(id))speechEvent("speech-range",id,start,end);});}
    @Override public void onDone(String id){main.post(()->{
     if(!validSpeech(id))return;
     if(id.equals(speechId)){speechEvent("speech-end",id,0,0);speechId="";speechText="";}
     if(partIndex(id)==speechChunks.size()-1){speechPrefix="";abandonFocus();
      if(speechConversation&&session.active()){session.finished();retryListen(session.epoch());}
      else{releaseCpu();setState("off","Lecture terminée.");}
     }
    });}
    @Override public void onError(String id){main.post(()->{if(validSpeech(id))stop(request,"La voix locale a été interrompue.");});}
    @Override public void onStop(String id,boolean interrupted){main.post(()->{if(validSpeech(id))stop(request,"Lecture arrêtée.");});}
   });publish();
  });
 }
 private List<Voice> localVoices(){
  List<Voice> voices=new ArrayList<>();Set<Voice> all=tts==null?null:tts.getVoices();
  if(all!=null)for(Voice v:all)if(v!=null&&v.getLocale()!=null&&"fr".equals(v.getLocale().getLanguage())&&!v.isNetworkConnectionRequired())voices.add(v);
  voices.sort(Comparator.comparingInt((Voice v)->Locale.FRANCE.equals(v.getLocale())?0:1).thenComparing(Comparator.comparingInt(Voice::getQuality).reversed()).thenComparing(Voice::getName));return voices;
 }
 private void selectVoice(String preferred){
  if(tts==null||!voiceInitFinished)return;List<Voice> all=localVoices();Voice choice=null;
  for(Voice v:all)if(v.getName().equals(preferred)){choice=v;break;}
  if(choice==null&&!all.isEmpty())choice=all.get(0);
  localVoiceReady=choice!=null&&tts.setVoice(choice)==TextToSpeech.SUCCESS;
  if("piper-mls".equals(preferred))voiceName=preferred;else if(localVoiceReady)voiceName=choice.getName();prefs.edit().putString("voiceChoiceV2",voiceName).putString("voice",voiceName).apply();
 }
 public void describe(String text,String id){stop(id,"Lecture demandée.");if(!"off".equals(mode)&&!"text".equals(mode))speak(text,false,workEpoch,0);}
 private void speak(String text,boolean conversation,long epoch,int attempt){
  if(disposed||epoch!=workEpoch)return;
  if(!acquireFocus()){stop(request,"Son indisponible pour le moment.");return;}
  releaseRecognizer(true);if(conversation)session.talking();speechConversation=conversation;
  speechChunks="piper-mls".equals(voiceName)?SpeechPlan.piperChunks(text):SpeechPlan.chunks(text);if(speechChunks.isEmpty()){stop(request,"Lecture vide.");return;}
  speechPrefix="BONZE_"+(++speechSerial)+"_";final String prefix=speechPrefix;final long voiceBegan=SystemClock.elapsedRealtime();
  if("piper-mls".equals(voiceName)){
   speechEngine="piper-mls";setState("waiting","Je prépare ma voix locale.");
   piper.speak(speechChunks,prefix,"calme".equals(mood)?.94f:"joie".equals(mood)?1.02f:.98f,new PiperVoice.Events(){
    public void start(String id,String content){main.post(()->{if(epoch!=workEpoch||!validSpeech(id))return;speechId=id;speechText=content;speechBegan=SystemClock.elapsedRealtime();journal.add("speech",diagnosticTurn,DiagnosticJournal.fields("engine","piper-mls","text",content,"id",id,"firstAudioLatencyMs",partIndex(id)==0?SystemClock.elapsedRealtime()-voiceBegan:JSONObject.NULL));setState("speaking","Je te réponds.");speechEvent("speech-start",id,0,0);});}
    public void level(String id,double value,int frame){main.post(()->{if(epoch!=workEpoch||!validSpeech(id)||listener==null)return;JSONObject e=base("speech-level");try{e.put("id",id).put("level",value).put("frame",frame);listener.onEvent(e.toString());}catch(JSONException ignored){}});}
    public void done(){main.post(()->{if(epoch!=workEpoch||!prefix.equals(speechPrefix))return;finishSpeech();});}
    public void failed(String reason,boolean hadAudio){main.post(()->{if(epoch!=workEpoch||!prefix.equals(speechPrefix))return;journal.add("speech-fallback",diagnosticTurn,DiagnosticJournal.fields("reason",reason,"hadAudio",hadAudio));if(hadAudio)stop(request,"Lecture interrompue. Tu peux réessayer.");else androidSpeech(epoch,0);});}
   });
  }else androidSpeech(epoch,0);
 }
 private void androidSpeech(long epoch,int attempt){
  if(disposed||epoch!=workEpoch||speechPrefix.isEmpty())return;
  if(!voiceInitFinished&&attempt<10){main.postDelayed(()->androidSpeech(epoch,attempt+1),300);return;}
  if(!localVoiceReady||tts==null){stop(request,"Voix française locale indisponible. Tu peux continuer par écrit.");return;}
  speechEngine="android";tts.setSpeechRate("calme".equals(mood)?.94f:"joie".equals(mood)||"humour".equals(mood)?1.02f:.98f);tts.setPitch("joie".equals(mood)?1.03f:1f);
  for(int i=0;i<speechChunks.size();i++){String id=speechPrefix+i;if(tts.speak(speechChunks.get(i),i==0?TextToSpeech.QUEUE_FLUSH:TextToSpeech.QUEUE_ADD,null,id)!=TextToSpeech.SUCCESS){stop(request,"Synthèse locale impossible.");return;}if(i<speechChunks.size()-1)tts.playSilentUtterance(170,TextToSpeech.QUEUE_ADD,"pause_"+id);}
 }
 private void finishSpeech(){if(!speechId.isEmpty())speechEvent("speech-end",speechId,0,0);speechId="";speechText="";speechPrefix="";abandonFocus();if(speechConversation&&session.active()){session.finished();retryListen(session.epoch());}else{releaseCpu();setState("off","Lecture terminée.");}}
 private boolean validSpeech(String id){return !disposed&&!speechPrefix.isEmpty()&&id!=null&&id.startsWith(speechPrefix);}
 private int partIndex(String id){try{return Integer.parseInt(id.substring(speechPrefix.length()));}catch(RuntimeException e){return -1;}}
 private void speechEvent(String type,String id,int start,int end){
  if(listener==null)return;JSONObject e=base(type);try{e.put("id",id).put("text",speechText).put("start",start).put("end",end);}catch(JSONException ignored){}listener.onEvent(e.toString());
 }
 private JSONObject base(String type){JSONObject o=new JSONObject();try{o.put("type",type).put("boot",boot).put("seq",++sequence).put("request",request);}catch(JSONException ignored){}return o;}
 private JSONObject snapshotObject(){
  JSONObject o=base("snapshot");try{
   if(council!=null)o.put("council",council.snapshot());
   o.put("active",session.active()).put("state",state).put("busy","thinking".equals(state)).put("status",status).put("voice",voiceName);
   JSONArray rows=new JSONArray();for(DialogueMemory.Entry e:memory.entries())rows.put(new JSONObject().put("id",e.id).put("role",e.role).put("text",e.text));o.put("history",rows).put("importedThrough",prefs.getLong("importedThrough",0));
   JSONArray voices=new JSONArray();voices.put(new JSONObject().put("name","piper-mls").put("quality",400));if(voiceInitFinished&&tts!=null)for(Voice v:localVoices())voices.put(new JSONObject().put("name",v.getName()).put("quality",v.getQuality()));o.put("voices",voices);
   if(prefs.contains("restoredWeb")){o.put("restoredWeb",new JSONObject(prefs.getString("restoredWeb","{}")));o.put("restoreWeights",new JSONObject(prefs.getString("restoredWeights","{}")));o.put("restoreJournal",journal.copy());}
   if(!speechId.isEmpty())o.put("speech",new JSONObject().put("id",speechId).put("text",speechText).put("ageMs",SystemClock.elapsedRealtime()-speechBegan));
  }catch(JSONException ignored){}return o;
 }
 private void publish(){if(listener!=null&&!disposed)listener.onEvent(snapshotObject().toString());}
 private void setState(String next,String message){state=next;status=message;notifyState();publish();}
 private void saveMemory(){
  JSONArray rows=new JSONArray();for(DialogueMemory.Entry e:memory.entries())try{rows.put(new JSONObject().put("id",e.id).put("role",e.role).put("text",e.text));}catch(JSONException ignored){}
  prefs.edit().putString("history",rows.toString()).putString("scene",memory.scene()).apply();
 }
 private void loadMemory(){
  try{JSONArray rows=new JSONArray(prefs.getString("history","[]"));for(int i=Math.max(0,rows.length()-30);i<rows.length();i++){JSONObject r=rows.optJSONObject(i);if(r!=null)memory.add(r.optLong("id",System.currentTimeMillis()+i),r.optString("role"),r.optString("text"));}memory.setScene(prefs.getString("scene",""));}catch(JSONException ignored){}
 }

 private void updateCouncil(String text){if(council==null)return;long now=SystemClock.elapsedRealtime();try{JSONObject r=council.run(text,DiagnosticJournal.fields("familiar",memory.size()>0,"scene",!memory.scene().isEmpty()),Math.min(30,(now-councilAt)/1000.0),state);councilAt=now;policyHint=r.optString("hint");JSONObject forces=r.getJSONObject("state").getJSONObject("forces");double max=-1;for(Iterator<String> it=forces.keys();it.hasNext();){String k=it.next();if(forces.optDouble(k)>max){max=forces.optDouble(k);mood=k;}}journal.add("council",diagnosticTurn,r);}catch(Exception e){journal.add("council-error",diagnosticTurn,DiagnosticJournal.fields("error",e.getClass().getSimpleName()));}}
 private void councilTick(){if(disposed)return;if(session.active()||listener!=null){updateCouncil("");if(listener!=null&&council!=null){JSONObject e=base("emotion-state");try{e.put("council",council.snapshot());listener.onEvent(e.toString());}catch(JSONException ignored){}}}main.postDelayed(this::councilTick,10000);}
 public void configureCouncil(String json)throws JSONException{if(council==null)throw new IllegalStateException();council.configure(new JSONObject(json));journal.add("admin-council",diagnosticTurn,council.snapshot());publish();}
 public JSONObject diagnostics(){return DiagnosticJournal.fields("council",council==null?JSONObject.NULL:council.snapshot(),"journal",journal.copy(),"resources",resourceObject(),"engine",speechEngine,"preferredVoice",voiceName,"model","LFM2.5-230M classification only; authored replies");}
 private JSONObject resourceObject(){try{return new JSONObject(resources());}catch(JSONException e){return new JSONObject();}}
 public JSONObject backupData(){
  JSONArray rows=new JSONArray();for(DialogueMemory.Entry e:memory.entries())rows.put(DiagnosticJournal.fields("id",e.id,"role",e.role,"text",e.text));
  return DiagnosticJournal.fields("council",council==null?JSONObject.NULL:council.snapshot(),"native",DiagnosticJournal.fields("schema",1,"history",rows,"scene",memory.scene(),"mode",mode,"neural",neural,"readText",readText,"voice",voiceName,"mood",mood),"journal",journal.copy(),"repertoire",scripted==null?JSONObject.NULL:scripted.state());
 }
 public void acknowledgeRestore(){prefs.edit().remove("restoredWeb").remove("restoredWeights").apply();}
 public void restoreBackup(String data) throws Exception {
  if(data.length()>4*1024*1024)throw new IllegalArgumentException("size");
  JSONObject root=new JSONObject(data),web=root.getJSONObject("web"),identity=web.getJSONObject("identity");
  if(root.getInt("schema")!=1||identity.getInt("version")!=1||identity.getString("seed").isEmpty()||identity.getString("seed").length()>128)throw new IllegalArgumentException("schema");
  JSONObject n=root.optJSONObject("native");if(n==null)n=DiagnosticJournal.fields("schema",1,"history",web.optJSONArray("history"),"scene","","mode",web.optString("resourceMode","text"),"neural",web.optBoolean("neuralEnabled",false),"readText",false,"voice","");
  String nextMode=n.getString("mode");JSONArray rows=n.getJSONArray("history"),trace=root.getJSONArray("journal");
  if(n.getInt("schema")!=1||!Arrays.asList("precise","eco","light","text","off").contains(nextMode)||rows.length()>30||trace.length()>200||trace.toString().length()>1000000)throw new IllegalArgumentException("data");
  for(int j=0;j<rows.length();j++){JSONObject r=rows.getJSONObject(j);if(!Arrays.asList("human","bot").contains(r.getString("role"))||r.getString("text").length()>1200)throw new IllegalArgumentException("history");}
  JSONObject nextWeights=root.optJSONObject("weights");if(nextWeights!=null&&nextWeights.length()==0)nextWeights=null;JSONObject backupCouncil=root.optJSONObject("council");if(backupCouncil==null)backupCouncil=DiagnosticJournal.fields("state",DiagnosticJournal.fields("version",1,"forces",identity.getJSONObject("acquired").getJSONObject("forces"),"globalEndurance",identity.getJSONObject("acquired").optDouble("endurance",.85)));JSONObject nextCouncil=council==null?null:council.validate(backupCouncil,nextWeights);
  JSONObject restoredRepertoire=root.optJSONObject("repertoire");if(restoredRepertoire==null)restoredRepertoire=web.optJSONObject("scriptedState");
  if(restoredRepertoire!=null){
   // An initial 032 state may have a seed but no choice history yet; upgrade it safely.
   restoredRepertoire=ScriptedDialogue.canonical(restoredRepertoire);
   if(restoredRepertoire.optInt("version",0)!=1||restoredRepertoire.toString().length()>4096)throw new IllegalArgumentException("repertoire");
   JSONArray recent=restoredRepertoire.optJSONArray("recent"),families=restoredRepertoire.optJSONArray("families");
   if(recent==null||families==null||recent.length()>16||families.length()>8||!restoredRepertoire.has("seed")||!restoredRepertoire.has("turns"))throw new IllegalArgumentException("repertoire");
   if(restoredRepertoire.optJSONArray("associations")!=null&&restoredRepertoire.optJSONArray("associations").length()>24)throw new IllegalArgumentException("repertoire");
   if(restoredRepertoire.optJSONArray("recentForms")!=null&&restoredRepertoire.optJSONArray("recentForms").length()>8)throw new IllegalArgumentException("repertoire");
   for(int k=0;k<recent.length();k++)if(!(recent.opt(k) instanceof String)||recent.optString(k).length()>80)throw new IllegalArgumentException("repertoire");
   for(int k=0;k<families.length();k++)if(!(families.opt(k) instanceof String)||families.optString(k).length()>80)throw new IllegalArgumentException("repertoire");
  }
  // Validate everything before stopping/writing. One preferences transaction is canonical;
  // restoredWeb stays pending until the WebView acknowledges its own durable write.
  JSONObject old=backupData();String previousWeb=prefs.getString("lastWeb","{}");
  JSONObject rollback=DiagnosticJournal.fields("schema",1,"web",new JSONObject(previousWeb),"native",old.getJSONObject("native"),"council",old.optJSONObject("council"),"journal",old.getJSONArray("journal"),"weights",new JSONObject(prefs.getString("lastWeights","{}")),"repertoire",old.optJSONObject("repertoire"));
  stop(request,"Restauration : micro arrêté.");
  boolean committed=prefs.edit().putString("rollback",rollback.toString()).putString("restoredWeb",web.toString())
   .putString("restoredWeights",root.optJSONObject("weights")==null?"{}":root.optJSONObject("weights").toString()).putString("history",rows.toString()).putString("scene",n.optString("scene","")).putString("mode",nextMode)
   .putBoolean("neural",n.optBoolean("neural",false)).putBoolean("readText",n.optBoolean("readText",false)).putString("voice",n.optString("voice",""))
   .putBoolean("imported",true).putLong("importedThrough",0).putString("journal",trace.toString())
    .putString("bonze-repertoire-v1",restoredRepertoire==null?prefs.getString("bonze-repertoire-v1","{}"):restoredRepertoire.toString()).putString("lastWeb",web.toString()).putString("lastWeights",nextWeights==null?"{}":nextWeights.toString()).putString("council-state",nextCouncil==null?"{}":nextCouncil.getJSONObject("state").toString()).putString("council-params",nextCouncil==null?"{}":nextCouncil.getJSONObject("params").toString()).putString("voiceChoiceV2",n.optString("voice","piper-mls")).commit();
  if(!committed)throw new java.io.IOException("Storage");
  mode=nextMode;economy="eco".equals(mode);neural=n.optBoolean("neural",false);readText=n.optBoolean("readText",false);mood=n.optString("mood","curiosite");
  memory.clear();loadMemory();journal.reload();if(scripted!=null&&restoredRepertoire!=null)scripted.adopt(restoredRepertoire);if(council!=null&&nextCouncil!=null)council.adopt(nextCouncil,nextWeights);selectVoice(n.optString("voice",""));publish();
 }
 public void rollbackBackup() throws Exception {String saved=prefs.getString("rollback","");if(saved.isEmpty())throw new IllegalArgumentException("Aucun retour arrière");restoreBackup(saved);}
 public void saveWebState(String state){if(state.length()<2*1024*1024)try{JSONObject o=new JSONObject(state),w=o.getJSONObject("web");if(w.has("identity"))prefs.edit().putString("lastWeb",w.toString()).putString("lastWeights",o.optJSONObject("weights")==null?"{}":o.optJSONObject("weights").toString()).apply();}catch(JSONException ignored){}}
 public String resources(){
  try{ActivityManager.MemoryInfo m=new ActivityManager.MemoryInfo();((ActivityManager)getSystemService(ACTIVITY_SERVICE)).getMemoryInfo(m);
   return new JSONObject().put("availableMiB",m.availMem/1048576).put("totalMiB",m.totalMem/1048576).put("pssMiB",Debug.getPss()/1024)
    .put("lastLatencyMs",lastLatency<0?JSONObject.NULL:lastLatency).put("lastCpuMs",lastCpu<0?JSONObject.NULL:lastCpu).toString();
  }catch(JSONException e){return "{}";}
 }
 @Override public void onTrimMemory(int level){super.onTrimMemory(level);if(level==TRIM_MEMORY_RUNNING_CRITICAL||level>=TRIM_MEMORY_MODERATE){stop(request,"Mémoire critique : conversation arrêtée.");piper.unload();inference.execute(BonzeInference::release);}}
 @Override public void onTaskRemoved(Intent root){stop(request,"Bonze fermé.");stopSelf();}
 @Override public void onDestroy(){
  stop(request,"Service arrêté.");disposed=true;listener=null;try{unregisterReceiver(unplugged);}catch(RuntimeException ignored){}
  if(piper!=null)piper.close();if(tts!=null){tts.shutdown();tts=null;}releaseCpu();inference.execute(BonzeInference::release);inference.shutdown();super.onDestroy();
 }
}

