package fr.bonzeai.companion;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Test;import static org.junit.Assert.*;
import java.util.*;import java.util.concurrent.*;import java.util.concurrent.atomic.*;import org.json.*;
public class OfflineVoiceTest {
 @Test public void frenchPiperPlaysOfflineAndStops()throws Exception{
  android.content.Context app=InstrumentationRegistry.getInstrumentation().getTargetContext();
  assertEquals(Integer.class,PiperCancellation.class.getMethod("invoke",float[].class).getReturnType());PiperVoice voice=new PiperVoice(app);CountDownLatch done=new CountDownLatch(1),started=new CountDownLatch(1);AtomicInteger levels=new AtomicInteger();AtomicReference<String> error=new AtomicReference<>();
  PiperVoice.Events events=new PiperVoice.Events(){public void start(String id,String text){started.countDown();}public void level(String id,double value,int frame){if(value>0)levels.incrementAndGet();}public void done(){done.countDown();}public void failed(String reason,boolean hadAudio){error.set(reason);done.countDown();}};
  try{voice.speak(Arrays.asList("Bonjour, je suis ton petit compagnon. Tu veux jouer avec moi ?"),"test_",.98f,events);assertTrue("French PCM playback completes",done.await(90,TimeUnit.SECONDS));assertNull(error.get());assertEquals(0,started.getCount());assertTrue("nonzero played PCM",levels.get()>10);
   CountDownLatch speaking=new CountDownLatch(1);AtomicBoolean completed=new AtomicBoolean();
   voice.speak(Arrays.asList("Bonjour, je suis ton petit compagnon. Tu veux jouer avec moi ?"),"cancel_",.98f,new PiperVoice.Events(){public void start(String id,String text){speaking.countDown();}public void level(String i,double v,int f){}public void done(){completed.set(true);}public void failed(String r,boolean h){error.set(r);}});
   assertTrue(speaking.await(30,TimeUnit.SECONDS));long before=android.os.SystemClock.elapsedRealtime();voice.stop();assertTrue(android.os.SystemClock.elapsedRealtime()-before<1000);Thread.sleep(500);assertFalse("cancel cannot finish/resume listening",completed.get());assertNull(error.get());
   CountDownLatch refused=new CountDownLatch(1);AtomicReference<String> refusal=new AtomicReference<>();AtomicBoolean shortPlayed=new AtomicBoolean();
   voice.speak(Arrays.asList("Bonjour mon ami. Comment vas tu ?"),"short_",.98f,new PiperVoice.Events(){public void start(String i,String t){shortPlayed.set(true);}public void level(String i,double v,int f){}public void done(){refused.countDown();}public void failed(String r,boolean h){refusal.set(r);if(h)shortPlayed.set(true);refused.countDown();}});
   assertTrue(refused.await(10,TimeUnit.SECONDS));assertEquals("piper-short-unstable",refusal.get());assertFalse("short fallback must precede any audio",shortPlayed.get());
  }finally{voice.close();}
 }
 @Test public void sharedCouncilExecutesAndRestoresOnAndroid()throws Exception{
  android.content.Context app=InstrumentationRegistry.getInstrumentation().getTargetContext();android.content.SharedPreferences p=app.getSharedPreferences("council-test",0);p.edit().clear().commit();
  EmotionalCouncil c=new EmotionalCouncil(app,p);JSONObject r=c.run("On joue au dragon",new JSONObject(),1,"thinking"),trace=r.getJSONObject("trace");assertEquals(8,trace.getJSONArray("contributions").length());
  for(int a=0;a<6;a++){double sum=0;for(int i=0;i<8;i++)sum+=trace.getJSONArray("contributions").getJSONObject(i).getJSONArray("vector").getDouble(a);assertEquals(sum,trace.getJSONArray("totals").getDouble(a),1e-9);}
  JSONObject before=c.snapshot();EmotionalCouncil restarted=new EmotionalCouncil(app,p);assertEquals(before.toString(),restarted.snapshot().toString());assertTrue(r.getString("hint").contains("scène"));
 }
 @Test public void nativeRestoreValidatesBeforeMutationAndCanRollback()throws Exception{
  android.content.Context app=InstrumentationRegistry.getInstrumentation().getTargetContext();CountDownLatch connected=new CountDownLatch(1);AtomicReference<ConversationService> ref=new AtomicReference<>();
  android.content.ServiceConnection connection=new android.content.ServiceConnection(){public void onServiceConnected(android.content.ComponentName name,android.os.IBinder binder){ref.set(((ConversationService.LocalBinder)binder).service());connected.countDown();}public void onServiceDisconnected(android.content.ComponentName name){}};
  app.bindService(new android.content.Intent(app,ConversationService.class),connection,android.content.Context.BIND_AUTO_CREATE);assertTrue(connected.await(20,TimeUnit.SECONDS));AtomicReference<Throwable> failure=new AtomicReference<>();
  try{InstrumentationRegistry.getInstrumentation().runOnMainSync(()->{try{
   ConversationService service=ref.get();service.configureCouncil("{}");JSONObject council=service.backupData().getJSONObject("council"),state=council.getJSONObject("state");
   JSONObject identity=DiagnosticJournal.fields("version",1,"seed","android-restore-fixture","acquired",DiagnosticJournal.fields("forces",state.getJSONObject("forces"),"endurance",.65));
   JSONObject web=DiagnosticJournal.fields("identity",identity,"history",new JSONArray(),"resourceMode","off","neuralEnabled",false);
   service.saveWebState(DiagnosticJournal.fields("web",web).toString());JSONObject previous=service.backupData().getJSONObject("native");
   JSONObject nativeData=DiagnosticJournal.fields("schema",1,"mode","off","history",new JSONArray().put(DiagnosticJournal.fields("id",77,"role","human","text","Souvenir restauré")),"neural",false,"readText",false,"voice","piper-mls");
   JSONObject backup=DiagnosticJournal.fields("schema",1,"web",web,"native",nativeData,"council",council,"journal",new JSONArray());service.restoreBackup(backup.toString());
   assertEquals("Souvenir restauré",service.backupData().getJSONObject("native").getJSONArray("history").getJSONObject(0).getString("text"));assertFalse(service.backupData().getJSONObject("native").getBoolean("neural"));
   String before=service.backupData().toString();nativeData.getJSONArray("history").getJSONObject(0).put("role","unknown");try{service.restoreBackup(backup.toString());throw new AssertionError("corrupt backup accepted");}catch(IllegalArgumentException expected){}assertEquals(before,service.backupData().toString());
   service.rollbackBackup();assertEquals(previous.getJSONArray("history").toString(),service.backupData().getJSONObject("native").getJSONArray("history").toString());assertFalse(new JSONObject(service.snapshot()).getBoolean("active"));
  }catch(Throwable e){failure.set(e);}});if(failure.get()!=null)throw new AssertionError(failure.get());}finally{app.unbindService(connection);}
 }
}
