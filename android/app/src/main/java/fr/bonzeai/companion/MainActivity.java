package fr.bonzeai.companion;
import android.Manifest;
import android.app.Activity;
import android.content.*;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.*;
import android.speech.SpeechRecognizer;
import android.webkit.*;
import androidx.webkit.WebViewAssetLoader;
import java.util.*;

/** Offline UI bridge. An authorized conversation belongs to ConversationService. */
public final class MainActivity extends Activity {
 private static final int MIC_PERMISSION=411;
 private WebView web;private volatile ConversationService engine;
 private boolean visible,uiReady,bound,destroyed;
 private final PendingStart pendingStart=new PendingStart();
 private String bootstrap="{}",configuration="{}";
 private final List<Runnable> pending=new ArrayList<>();
 private final ConversationService.Listener observer=json->{
  if(web!=null&&uiReady&&visible&&!destroyed)web.evaluateJavascript("window.BonzeNativeEvent&&window.BonzeNativeEvent("+json+")",null);
 };
 private final ServiceConnection connection=new ServiceConnection(){
  @Override public void onServiceConnected(ComponentName name,IBinder binder){
   if(destroyed)return;engine=((ConversationService.LocalBinder)binder).service();
   if(uiReady){engine.bootstrap(bootstrap);engine.configure(configuration);if(visible)engine.attach(observer);}
   List<Runnable> tasks=new ArrayList<>(pending);pending.clear();for(Runnable task:tasks)task.run();
  }
  @Override public void onServiceDisconnected(ComponentName name){engine=null;}
 };
 @Override public void onCreate(Bundle state){
  super.onCreate(state);web=new WebView(this);web.setBackgroundColor(Color.rgb(16,35,45));
  WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(false);s.setAllowContentAccess(false);s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
  WebView.setWebContentsDebuggingEnabled(false);
  WebViewAssetLoader loader=new WebViewAssetLoader.Builder().addPathHandler("/assets/",new WebViewAssetLoader.AssetsPathHandler(this)).build();
  web.setWebViewClient(new WebViewClient(){
   @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){
    WebResourceResponse response=loader.shouldInterceptRequest(r.getUrl());
    return response!=null?response:new WebResourceResponse("text/plain","UTF-8",403,"Offline only",Collections.emptyMap(),new java.io.ByteArrayInputStream(new byte[0]));
   }
   @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){return !r.getUrl().toString().startsWith("https://appassets.androidplatform.net/assets/");}
  });
  web.addJavascriptInterface(new Bridge(),"BonzeAndroid");setContentView(web);
  bound=bindService(new Intent(this,ConversationService.class),connection,BIND_AUTO_CREATE);
  web.loadUrl("https://appassets.androidplatform.net/assets/docs/index.html");
 }
 private void withService(Runnable task){if(destroyed)return;if(engine!=null)task.run();else pending.add(task);}
 private final class Bridge {
  @JavascriptInterface public boolean localSpeechAvailable(){return Build.VERSION.SDK_INT>=31&&SpeechRecognizer.isOnDeviceRecognitionAvailable(MainActivity.this);}
  @JavascriptInterface public void connectNative(String initial,String config){runOnUiThread(()->{
   bootstrap=initial;configuration=config;uiReady=true;
   withService(()->{engine.bootstrap(bootstrap);engine.configure(configuration);if(visible)engine.attach(observer);});
  });}
  @JavascriptInterface public void configureNative(String config){runOnUiThread(()->{configuration=config;withService(()->engine.configure(config));});}
  @JavascriptInterface public void command(String action,String text,String id){runOnUiThread(()->{
   if("stop".equals(action)){pendingStart.cancel();withService(()->engine.stop(id,"Conversation arrêtée par toi."));}
   else if("start".equals(action)){if(visible&&!destroyed)startAfterPermission(id);}
   else if("text".equals(action)){pendingStart.cancel();withService(()->engine.submitText(text,id));}
   else if("describe".equals(action)){pendingStart.cancel();if(visible)withService(()->engine.describe(text,id));}
   else if("sync".equals(action)){if(visible)withService(()->engine.attach(observer));}
  });}
  @JavascriptInterface public String resourceSnapshot(){ConversationService current=engine;return current==null?"{}":current.resources();}
 }
 private void startAfterPermission(String id){
  pendingStart.request(id);
  List<String> permissions=new ArrayList<>();
  if(checkSelfPermission(Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED)permissions.add(Manifest.permission.RECORD_AUDIO);
  if(Build.VERSION.SDK_INT>=33&&checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)permissions.add(Manifest.permission.POST_NOTIFICATIONS);
  if(!permissions.isEmpty()){requestPermissions(permissions.toArray(new String[0]),MIC_PERMISSION);return;}
  pendingStart.grant();launchConversation();
 }
 private void launchConversation(){
  withService(()->{
   String id=pendingStart.consumeIfVisible(visible&&!destroyed);if(id==null)return;engine.authorizeStart(id);
   try{startForegroundService(new Intent(this,ConversationService.class).setAction(ConversationService.START).putExtra("request",id));}
   catch(RuntimeException error){engine.stop(id,"Le service vocal n'a pas pu démarrer. Réessaie en gardant Bonze ouvert.");}
  });
 }
 @Override public void onRequestPermissionsResult(int code,String[] permissions,int[] results){
  super.onRequestPermissionsResult(code,permissions,results);if(code!=MIC_PERMISSION||pendingStart.id().isEmpty())return;
  String id=pendingStart.id();
  if(checkSelfPermission(Manifest.permission.RECORD_AUDIO)==PackageManager.PERMISSION_GRANTED){pendingStart.grant();launchConversation();}
  else{pendingStart.cancel();withService(()->engine.stop(id,"Micro arrêté. Tu peux relancer la conversation lorsque Bonze est ouvert."));}
 }
 @Override public void onResume(){super.onResume();visible=true;if(uiReady&&engine!=null)engine.attach(observer);launchConversation();}
 @Override public void onPause(){visible=false;if(engine!=null)engine.detach(observer);super.onPause();}
 @Override public void onDestroy(){
  destroyed=true;pendingStart.cancel();pending.clear();if(engine!=null)engine.detach(observer);
  if(bound){unbindService(connection);bound=false;}if(web!=null){web.destroy();web=null;}engine=null;super.onDestroy();
 }
}
