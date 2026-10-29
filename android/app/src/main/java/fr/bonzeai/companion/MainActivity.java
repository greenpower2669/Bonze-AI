package fr.bonzeai.companion;

import android.Manifest;
import android.app.Activity;
import android.app.ActivityManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.*;
import android.speech.*;
import android.speech.tts.*;
import android.webkit.*;
import android.graphics.Color;
import androidx.webkit.WebViewAssetLoader;
import org.json.JSONObject;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

/** Offline Android shell. No cloud recognizer or network TTS fallback. */
public final class MainActivity extends Activity {
    private static final int MIC_PERMISSION = 411;
    private WebView web;
    private SpeechRecognizer recognizer;
    private boolean recording;
    private volatile boolean memoryWarning, foreground, destroyed;
    private final ExecutorService inferenceQueue = Executors.newSingleThreadExecutor();
    private final AtomicBoolean generating = new AtomicBoolean(false);
    private final AtomicLong inferenceEpoch = new AtomicLong(0);
    private volatile boolean neuralEnabled = true;
    private volatile long lastLatencyMs = -1, lastCpuMs = -1;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final VoiceSession voice = new VoiceSession();
    private long permissionEpoch = -1, utteranceSerial;
    private int consecutiveNoSpeech;
    private TextToSpeech tts;
    private volatile boolean localVoiceReady;
    private String utteranceId = "";
    private String clientSession = "";
    private boolean utteranceConversation;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(16,35,45));
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true); settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false); settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        WebView.setWebContentsDebuggingEnabled(false);
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/",new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request) {
                WebResourceResponse resource=loader.shouldInterceptRequest(request.getUrl());
                if(resource!=null)return resource;
                return new WebResourceResponse("text/plain","UTF-8",403,"Offline only",Collections.emptyMap(),new java.io.ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request) {
                return !request.getUrl().toString().startsWith("https://appassets.androidplatform.net/assets/");
            }
        });
        web.addJavascriptInterface(new SpeechBridge(),"BonzeAndroid");
        prepareOfflineVoice(); setContentView(web);
        web.loadUrl("https://appassets.androidplatform.net/assets/docs/index.html");
    }
    private boolean localSupported() {
        return Build.VERSION.SDK_INT>=31 && SpeechRecognizer.isOnDeviceRecognitionAvailable(this);
    }
    private void send(String function,String content) {
        boolean sessionEvent=function.equals("BonzeConversationState")||function.equals("BonzeNativeResult")||function.equals("BonzeNativeStatus");
        sendArgs(function,JSONObject.quote(content)+(sessionEvent?","+JSONObject.quote(clientSession):""));
    }
    private void sendArgs(String function,String arguments) {
        runOnUiThread(()->{ if(web!=null&&!destroyed)web.evaluateJavascript("window."+function+"("+arguments+")",null); });
    }
    private void inferenceResult(String function,String text,String token,long epoch) {
        runOnUiThread(()->{if(!destroyed&&foreground&&inferenceEpoch.get()==epoch)
            sendArgs(function,JSONObject.quote(text)+","+JSONObject.quote(token));});
    }
    private final class SpeechBridge {
        @JavascriptInterface public boolean localSpeechAvailable() { return localSupported(); }
        @JavascriptInterface public boolean localVoiceAvailable() { return localVoiceReady; }
        @JavascriptInterface public void beginHandsFree(String session) { runOnUiThread(()->{
            if(!foreground||destroyed)return;
            clientSession=session;
            if(!localSupported()||memoryWarning){stopConversation("Écoute locale indisponible : utilise le clavier.");return;}
            stopConversation("Préparation de la conversation.",false);
            voice.begin(); consecutiveNoSpeech=0; startAfterPermission();
        }); }
        @JavascriptInterface public void stopHandsFree() { runOnUiThread(()->stopConversation("Conversation arrêtée par toi.")); }
        @JavascriptInterface public void speakReply(String reply,String mood,String session) { runOnUiThread(()->{
            if(voice.active()&&session.equals(clientSession))speakOffline(reply,mood,true);
        }); }
        @JavascriptInterface public void speakDescription(String description) { runOnUiThread(()->{
            if(foreground&&!destroyed)speakOffline(description,"calme",false);
        }); }
        @JavascriptInterface public void generateLocalReply(String text,String mood,String token) {
            final long epoch=inferenceEpoch.get();
            if(!neuralEnabled){inferenceResult("BonzeAIError","Neurones désactivés par toi.",token,epoch);return;}
            if(memoryWarning){inferenceResult("BonzeAIError","Mémoire chargée : mode léger.",token,epoch);return;}
            if(!generating.compareAndSet(false,true)){inferenceResult("BonzeAIError","La précédente génération se termine encore.",token,epoch);return;}
            if(inferenceQueue.isShutdown()){generating.set(false);return;}
            inferenceQueue.execute(()->{
                long start=SystemClock.elapsedRealtime(), cpu=SystemClock.currentThreadTimeMillis();
                String output; boolean failed=false;
                try {
                    if(epoch!=inferenceEpoch.get()||!neuralEnabled)return;
                    output=BonzeInference.reply(getApplicationContext(),text,mood);
                } catch(Exception|LinkageError error) {
                    output="Neurones indisponibles : "+error.getClass().getSimpleName()+". Mode léger disponible.";failed=true;
                } finally { generating.set(false); }
                lastLatencyMs=SystemClock.elapsedRealtime()-start;
                lastCpuMs=SystemClock.currentThreadTimeMillis()-cpu;
                inferenceResult(failed?"BonzeAIError":"BonzeAIResult",output,token,epoch);
            });
        }
        @JavascriptInterface public void setNeuralEnabled(boolean enabled) {
            neuralEnabled=enabled;
            if(!enabled){inferenceEpoch.incrementAndGet();releaseModel();}
        }
        @JavascriptInterface public void setEconomyMode(boolean enabled) { BonzeInference.setEconomy(enabled); }
        @JavascriptInterface public boolean hasBundledWeights() {
            try(java.io.InputStream input=getAssets().open("models/LFM2.5-230M-Q4_K_M.gguf")){return input!=null;}
            catch(Exception error){return false;}
        }
        @JavascriptInterface public String resourceSnapshot() {
            try {
                ActivityManager.MemoryInfo m=new ActivityManager.MemoryInfo();
                ((ActivityManager)getSystemService(ACTIVITY_SERVICE)).getMemoryInfo(m);
                JSONObject r=new JSONObject();
                r.put("availableMiB",m.availMem/(1024*1024));r.put("totalMiB",m.totalMem/(1024*1024));
                r.put("pssMiB",Debug.getPss()/1024);r.put("lowMemory",m.lowMemory);
                r.put("lastLatencyMs",lastLatencyMs<0?JSONObject.NULL:lastLatencyMs);
                r.put("lastCpuMs",lastCpuMs<0?JSONObject.NULL:lastCpuMs);
                return r.toString();
            }catch(Exception error){return "{}";}
        }
    }
    private void releaseModel() {
        if(!inferenceQueue.isShutdown())inferenceQueue.execute(BonzeInference::release);
    }
    @Override public void onRequestPermissionsResult(int code,String[] permissions,int[] results) {
        super.onRequestPermissionsResult(code,permissions,results);
        if(code!=MIC_PERMISSION)return;
        final long requested=permissionEpoch;permissionEpoch=-1;
        if(!voice.current(requested))return;
        if(results.length>0&&results[0]==PackageManager.PERMISSION_GRANTED)startRecognizer();
        else stopConversation("Microphone refusé : le clavier reste disponible.");
    }
    private void startAfterPermission() {
        if(!voice.canListen()||recording||destroyed)return;
        if(!localSupported()||memoryWarning){stopConversation("Écoute locale indisponible.");return;}
        if(checkSelfPermission(Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED){
            permissionEpoch=voice.epoch();requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO},MIC_PERMISSION);
        } else startRecognizer();
    }
    private void startRecognizer() {
        if(!voice.canListen()||recording||memoryWarning||!localSupported()||destroyed)return;
        final long epoch=voice.epoch();
        try {
            final SpeechRecognizer source=SpeechRecognizer.createOnDeviceSpeechRecognizer(this);
            recognizer=source;recording=true;
            source.setRecognitionListener(new RecognitionListener() {
                private boolean valid(){return recognizer==source&&voice.current(epoch)&&!destroyed;}
                @Override public void onReadyForSpeech(Bundle params){if(valid()){send("BonzeConversationState","listening");send("BonzeNativeStatus","Je t'écoute. Parle naturellement.");}}
                @Override public void onBeginningOfSpeech(){}
                @Override public void onRmsChanged(float rms){}
                @Override public void onBufferReceived(byte[] bytes){}
                @Override public void onEndOfSpeech(){if(valid())send("BonzeNativeStatus","Je termine de transcrire ta phrase.");}
                @Override public void onError(int error){
                    if(!valid())return;releaseRecognizer();
                    if((error==SpeechRecognizer.ERROR_NO_MATCH||error==SpeechRecognizer.ERROR_SPEECH_TIMEOUT)&&++consecutiveNoSpeech<3)retryListen(epoch);
                    else stopConversation("Écoute arrêtée (code "+error+"). Tu peux réessayer ou écrire.");
                }
                @Override public void onResults(Bundle results){
                    if(!valid())return;
                    ArrayList<String> matches=results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                    String value=matches!=null&&!matches.isEmpty()?matches.get(0):"";
                    releaseRecognizer();
                    if(value.isBlank()){
                        if(++consecutiveNoSpeech<3)retryListen(epoch);else stopConversation("Je n'ai rien entendu. Conversation arrêtée.");return;
                    }
                    consecutiveNoSpeech=0;voice.awaiting();
                    send("BonzeConversationState","thinking");send("BonzeNativeResult",value);
                }
                @Override public void onPartialResults(Bundle partial){}
                @Override public void onEvent(int type,Bundle params){}
            });
            Intent intent=new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE,"fr-FR");
            intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS,false);
            intent.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE,true);
            source.startListening(intent);
        }catch(RuntimeException error){stopConversation("Écoute locale impossible. Tu peux écrire.");}
    }
    private void retryListen(long epoch) { mainHandler.postDelayed(()->{if(voice.current(epoch))startAfterPermission();},600); }
    private void releaseRecognizer() {
        SpeechRecognizer old=recognizer;recognizer=null;recording=false;
        if(old!=null)try{old.destroy();}catch(RuntimeException ignored){}
    }
    private void stopConversation(String message) { stopConversation(message,true); }
    private void stopConversation(String message,boolean notify) {
        voice.stop();permissionEpoch=-1;inferenceEpoch.incrementAndGet();
        mainHandler.removeCallbacksAndMessages(null);consecutiveNoSpeech=0;
        // Invalidate callback ownership BEFORE cancel(), which may call back synchronously.
        SpeechRecognizer old=recognizer;recognizer=null;recording=false;
        if(old!=null){try{old.cancel();}catch(RuntimeException ignored){}try{old.destroy();}catch(RuntimeException ignored){}}
        utteranceId="";if(tts!=null)tts.stop();
        if(notify){send("BonzeNativeStatus",message);send("BonzeConversationState","off");}
    }
    private void prepareOfflineVoice() {
        tts=new TextToSpeech(getApplicationContext(),status->{
            if(status!=TextToSpeech.SUCCESS||tts==null||destroyed)return;
            Set<Voice> voices=tts.getVoices();Voice chosen=null;
            if(voices!=null)for(Voice v:voices)if(v!=null&&v.getLocale()!=null&&"fr".equals(v.getLocale().getLanguage())&&!v.isNetworkConnectionRequired()){
                chosen=v;if(Locale.FRANCE.equals(v.getLocale()))break;
            }
            if(chosen!=null)localVoiceReady=tts.setVoice(chosen)==TextToSpeech.SUCCESS;
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener(){
                @Override public void onStart(String id){runOnUiThread(()->{if(id.equals(utteranceId)&&foreground)send("BonzeConversationState","speaking");});}
                @Override public void onDone(String id){runOnUiThread(()->{
                    if(!id.equals(utteranceId)||!foreground)return;
                    utteranceId="";
                    if(utteranceConversation&&voice.active()){
                        voice.finished();send("BonzeConversationState","waiting");retryListen(voice.epoch());
                    }else send("BonzeConversationState","off");
                });}
                @Override public void onError(String id){runOnUiThread(()->{if(id.equals(utteranceId))stopConversation("Voix locale interrompue. Tu peux écrire.");});}
            });
        });
    }
    private void speakOffline(String text,String mood,boolean conversation) {
        if(!foreground||destroyed)return;
        if(!localVoiceReady||tts==null){stopConversation("Voix française locale indisponible. Continue en texte.");return;}
        // One coherent voice; modest rate variation only, not neural emotional prosody.
        tts.setSpeechRate("joie".equals(mood)||"humour".equals(mood)?1.01f:"calme".equals(mood)?.92f:.96f);
        releaseRecognizer();utteranceConversation=conversation;
        if(conversation)voice.talking();
        utteranceId="BONZE_"+(++utteranceSerial);
        if(tts.speak(text.substring(0,Math.min(1200,text.length())),TextToSpeech.QUEUE_FLUSH,null,utteranceId)!=TextToSpeech.SUCCESS)
            stopConversation("Voix locale indisponible.");
    }
    @Override public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        if(level==TRIM_MEMORY_RUNNING_CRITICAL||level>=TRIM_MEMORY_MODERATE){
            memoryWarning=true;stopConversation("Mémoire critique : écoute arrêtée.");send("BonzeMemoryNotice","critical");releaseModel();
        }else if(level>=TRIM_MEMORY_RUNNING_LOW&&level!=TRIM_MEMORY_UI_HIDDEN){
            memoryWarning=true;stopConversation("Mémoire chargée : écoute arrêtée.");send("BonzeMemoryNotice","high");releaseModel();
        }
    }
    @Override public void onResume(){super.onResume();foreground=true;voice.resume();memoryWarning=false;}
    @Override public void onPause(){foreground=false;voice.pause();stopConversation("Application en arrière-plan : écoute arrêtée.");super.onPause();}
    @Override public void onDestroy(){
        stopConversation("Écoute arrêtée.");destroyed=true;
        if(tts!=null){tts.shutdown();tts=null;}releaseModel();inferenceQueue.shutdown();
        if(web!=null){web.destroy();web=null;}super.onDestroy();
    }
}
