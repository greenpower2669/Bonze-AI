package fr.bonzeai.companion;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.graphics.Color;
import androidx.webkit.WebViewAssetLoader;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.Locale;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Thin, offline-only Android shell. The cognition stays in /core/bonze.mjs.
 * NEVER fall back to a cloud SpeechRecognizer.
 */
public final class MainActivity extends Activity {
    private static final int MIC_PERMISSION = 411;
    private WebView web;
    private SpeechRecognizer recognizer;
    private boolean recording = false;
    private boolean memoryWarning = false;
    private final ExecutorService inferenceQueue = Executors.newSingleThreadExecutor();
    private final AtomicBoolean generating = new AtomicBoolean(false);
    private volatile boolean neuralEnabled = true;
    // Conversation only starts from a deliberate on-screen tap; never on app launch.
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private boolean handsFreeRequested = false;
    private boolean awaitingResponse = false;
    private boolean speakingReply = false;
    private int consecutiveNoSpeech = 0;
    private TextToSpeech tts;
    private boolean localVoiceReady = false;
    private boolean voiceInitFinished = false;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(16, 35, 45));
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        WebView.setWebContentsDebuggingEnabled(false);
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();
        web.setWebViewClient(new WebViewClient() {
            @Override public android.webkit.WebResourceResponse shouldInterceptRequest(
                WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !request.getUrl().toString()
                    .startsWith("https://appassets.androidplatform.net/assets/");
            }
        });
        web.addJavascriptInterface(new SpeechBridge(), "BonzeAndroid");
        prepareOfflineVoice();
        setContentView(web);
        web.loadUrl("https://appassets.androidplatform.net/assets/docs/index.html");
    }

    private boolean localSupported() {
        return Build.VERSION.SDK_INT >= 31
            && SpeechRecognizer.isOnDeviceRecognitionAvailable(this);
    }

    private void send(String function, String content) {
        if (web == null) return;
        final String script = "window." + function + "(" + JSONObject.quote(content) + ")";
        runOnUiThread(() -> web.evaluateJavascript(script, null));
    }

    private final class SpeechBridge {
        @JavascriptInterface public boolean localSpeechAvailable() {
            return localSupported();
        }
        @JavascriptInterface public void beginHandsFree() {
            runOnUiThread(() -> {
                if (!localSupported()) {
                    send("BonzeConversationState", "indisponible");
                    send("BonzeNativeStatus", "Le moteur d'écoute hors ligne manque sur cet appareil. Le clavier reste disponible.");
                    return;
                }
                if (memoryWarning) {
                    send("BonzeNativeStatus", "Mémoire sous pression : conversation vocale impossible maintenant.");
                    send("BonzeConversationState", "off");
                    return;
                }
                handsFreeRequested = true;
                awaitingResponse = false;
                consecutiveNoSpeech = 0;
                startAfterPermission();
            });
        }
        @JavascriptInterface public void stopHandsFree() {
            runOnUiThread(() -> stopConversation("Conversation arrêtée par toi."));
        }
        @JavascriptInterface public void speakReply(String reply) {
            runOnUiThread(() -> speakOffline(reply));
        }
        @JavascriptInterface public boolean localVoiceAvailable() { return localVoiceReady; }
        @JavascriptInterface public void startLocalSpeech() {
            runOnUiThread(() -> {
                handsFreeRequested = false;
                startAfterPermission();
            });
        }
        @JavascriptInterface public void generateLocalReply(String text, String mood) {
            if (!neuralEnabled) {
                send("BonzeAIError", "Modèle neuronal désactivé par l'humain.");
                return;
            }
            if (memoryWarning) {
                send("BonzeAIError", "Mémoire chargée : j'utilise le mode léger.");
                return;
            }
            if (!generating.compareAndSet(false, true)) {
                send("BonzeAIError", "Je réfléchis déjà. Attends un petit instant.");
                return;
            }
            inferenceQueue.execute(() -> {
                try {
                    String result = BonzeInference.reply(
                        getApplicationContext(), text, mood);
                    send("BonzeAIResult", result);
                } catch (Exception | LinkageError error) {
                    send("BonzeAIError", "Impossible de charger les neurones locaux : "
                        + error.getClass().getSimpleName() + ". Mode léger disponible.");
                } finally {
                    generating.set(false);
                }
            });
        }
        @JavascriptInterface public void setNeuralEnabled(boolean enabled) {
            neuralEnabled = enabled;
            if (!enabled) inferenceQueue.execute(BonzeInference::release);
        }
        @JavascriptInterface public boolean hasBundledWeights() {
            try (java.io.InputStream input = getAssets().open("models/LFM2.5-230M-Q4_K_M.gguf")) { return input != null; }
            catch (Exception e) { return false; }
        }
        @JavascriptInterface public void stopLocalSpeech() {
            runOnUiThread(() -> stopConversation("Écoute arrêtée."));
        }
    }

    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(requestCode, permissions, results);
        if (requestCode != MIC_PERMISSION) return;
        if (results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED) startRecognizer();
        else stopConversation("Accès au microphone refusé. Le clavier reste disponible.");
    }


    private void startAfterPermission() {
        if (!localSupported()) {
            stopConversation("Moteur de reconnaissance vocale locale indisponible.");
            return;
        }
        if (memoryWarning) {
            stopConversation("Mémoire chargée, écoute arrêtée.");
            return;
        }
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, MIC_PERMISSION);
        } else startRecognizer();
    }

    private void startRecognizer() {
        if (recording || awaitingResponse || speakingReply || memoryWarning || !localSupported()) return;
        try {
            recognizer = SpeechRecognizer.createOnDeviceSpeechRecognizer(this);
            recognizer.setRecognitionListener(new RecognitionListener() {
                @Override public void onReadyForSpeech(Bundle params) {
                    send("BonzeNativeStatus", "Je t'écoute. Parle naturellement.");
                    send("BonzeConversationState", "listening");
                }
                @Override public void onBeginningOfSpeech() {}
                @Override public void onRmsChanged(float rmsdB) {}
                @Override public void onBufferReceived(byte[] buffer) {}
                @Override public void onEndOfSpeech() {
                    send("BonzeNativeStatus", "Je termine de transcrire ta phrase.");
                }
                @Override public void onError(int error) {
                    releaseRecognizer();
                    if (handsFreeRequested && (error == SpeechRecognizer.ERROR_NO_MATCH ||
                        error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT) && consecutiveNoSpeech++ < 2) {
                        send("BonzeNativeStatus", "Je n'ai rien entendu, je réessaie.");
                        mainHandler.postDelayed(() -> {
                            if (handsFreeRequested && !awaitingResponse) startAfterPermission();
                        }, 600);
                    } else {
                        stopConversation("Je n'ai pas pu comprendre ta voix (code " + error +
                            "). L'écoute est arrêtée. Tu peux réessayer ou écrire.");
                    }
                }
                @Override public void onResults(Bundle results) {
                    ArrayList<String> matches =
                        results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                    String value = matches != null && !matches.isEmpty() ? matches.get(0) : "";
                    releaseRecognizer();
                    if (!value.isBlank()) {
                        consecutiveNoSpeech = 0;
                        awaitingResponse = handsFreeRequested;
                        send("BonzeConversationState", "thinking");
                        send("BonzeNativeResult", value);
                    } else if (handsFreeRequested) {
                        if (++consecutiveNoSpeech < 3) mainHandler.postDelayed(
                            () -> { if (handsFreeRequested) startAfterPermission(); }, 600);
                        else stopConversation("Je n'ai rien entendu. Conversation arrêtée.");
                    } else send("BonzeNativeStatus", "Je n'ai pas compris. Tu peux recommencer.");
                }
                @Override public void onPartialResults(Bundle partial) {}
                @Override public void onEvent(int eventType, Bundle params) {}
            });
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "fr-FR");
            intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
            intent.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true);
            recording = true;
            recognizer.startListening(intent);
            send("BonzeNativeStatus", "Je t'écoute. Dis-moi ce que tu veux.");
        } catch (RuntimeException error) {
            stopConversation("Le moteur vocal local n'a pas démarré. Le clavier reste disponible.");
        }
    }

    private void releaseRecognizer() {
        recording = false;
        if (recognizer != null) {
            try { recognizer.destroy(); } catch (RuntimeException ignored) {}
            recognizer = null;
        }
    }

    private void stopConversation(String message) {
        handsFreeRequested = false;
        awaitingResponse = false;
        consecutiveNoSpeech = 0;
        if (recognizer != null) try { recognizer.cancel(); } catch (RuntimeException ignored) {}
        releaseRecognizer();
        if (tts != null && speakingReply) tts.stop();
        speakingReply = false;
        send("BonzeConversationState", "off");
        send("BonzeNativeStatus", message);
    }

    private void prepareOfflineVoice() {
        tts = new TextToSpeech(getApplicationContext(), status -> {
            voiceInitFinished = true;
            if (status != TextToSpeech.SUCCESS || tts == null) {
                localVoiceReady = false;
                return;
            }
            Set<Voice> voices = tts.getVoices();
            Voice chosen = null;
            if (voices != null) {
                for (Voice voice : voices) {
                    if (voice != null && voice.getLocale() != null
                            && "fr".equals(voice.getLocale().getLanguage())
                            && !voice.isNetworkConnectionRequired()) {
                        chosen = voice;
                        if (Locale.FRANCE.equals(voice.getLocale())) break;
                    }
                }
            }
            if (chosen != null && tts.setVoice(chosen) == TextToSpeech.SUCCESS) {
                localVoiceReady = true;
                tts.setSpeechRate(.96f);
            }
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String id) { runOnUiThread(() -> {
                    speakingReply = true;
                    send("BonzeConversationState", "speaking");
                }); }
                @Override public void onDone(String id) { runOnUiThread(() -> completeSpeech()); }
                @Override public void onError(String id) { runOnUiThread(() ->
                    stopConversation("La voix locale a échoué. Conversation arrêtée.")); }
            });
        });
    }
    private void speakOffline(String text) {
        if (!handsFreeRequested) return;
        awaitingResponse = false;
        if (!voiceInitFinished || !localVoiceReady || tts == null) {
            stopConversation("La voix française hors ligne est indisponible. Continue en mode texte.");
            return;
        }
        speakingReply = true;
        send("BonzeConversationState", "speaking");
        int result = tts.speak(text.substring(0, Math.min(text.length(), 1200)),
            TextToSpeech.QUEUE_FLUSH, null, "BONZE_REPLY");
        if (result != TextToSpeech.SUCCESS) {
            stopConversation("Synthèse vocale locale impossible. Conversation arrêtée.");
        }
    }
    private void completeSpeech() {
        speakingReply = false;
        send("BonzeConversationState", handsFreeRequested ? "waiting" : "off");
        if (handsFreeRequested) mainHandler.postDelayed(() -> {
            if (handsFreeRequested && !speakingReply && !awaitingResponse &&
                    !isFinishing()) startAfterPermission();
        }, 600);
    }

    @Override public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        if (level == TRIM_MEMORY_RUNNING_CRITICAL || level >= TRIM_MEMORY_MODERATE) {
            memoryWarning = true;
            stopConversation("Mémoire critique : écoute arrêtée, mode texte disponible.");
            send("BonzeMemoryNotice", "critical");
            inferenceQueue.execute(BonzeInference::release);
        } else if (level >= TRIM_MEMORY_RUNNING_LOW && level != TRIM_MEMORY_UI_HIDDEN) {
            memoryWarning = true;
            stopConversation("Mémoire chargée : écoute arrêtée, le clavier reste disponible.");
            send("BonzeMemoryNotice", "high");
        }
    }
    @Override public void onResume() {
        super.onResume();
        memoryWarning = false; // allow explicit retry, never auto-start microphone
    }
    @Override public void onPause() {
        stopConversation("Écoute suspendue : application en arrière-plan.");
        super.onPause();
    }
    @Override public void onDestroy() {
        stopConversation("Écoute arrêtée.");
        if (tts != null) { tts.shutdown(); tts = null; }
        inferenceQueue.execute(BonzeInference::release);
        inferenceQueue.shutdown();
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }
}
