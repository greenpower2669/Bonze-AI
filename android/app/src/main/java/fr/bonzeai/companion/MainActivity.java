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
        @JavascriptInterface public void startLocalSpeech() {
            runOnUiThread(() -> {
                if (!localSupported()) {
                    send("BonzeNativeStatus", "Reconnaissance strictement locale indisponible. Utilise le clavier.");
                    return;
                }
                if (memoryWarning) {
                    send("BonzeNativeStatus", "Mémoire sous pression : écoute suspendue. Utilise le clavier.");
                    return;
                }
                if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                    requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, MIC_PERMISSION);
                } else startRecognizer();
            });
        }
        @JavascriptInterface public void stopLocalSpeech() {
            runOnUiThread(() -> cancelRecognizer("Écoute arrêtée."));
        }
    }

    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(requestCode, permissions, results);
        if (requestCode != MIC_PERMISSION) return;
        if (results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED) startRecognizer();
        else send("BonzeNativeStatus", "Micro refusé : écoute désactivée.");
    }

    private void startRecognizer() {
        if (recording || memoryWarning || !localSupported()) return;
        try {
            // API 31+: guaranteed on-device path, no network permission.
            recognizer = SpeechRecognizer.createOnDeviceSpeechRecognizer(this);
            recognizer.setRecognitionListener(new RecognitionListener() {
                @Override public void onReadyForSpeech(Bundle params) {
                    send("BonzeNativeStatus", "Écoute en cours… parle maintenant.");
                }
                @Override public void onBeginningOfSpeech() {}
                @Override public void onRmsChanged(float rmsdB) {}
                @Override public void onBufferReceived(byte[] buffer) {}
                @Override public void onEndOfSpeech() {
                    send("BonzeNativeStatus", "J'analyse tes mots localement…");
                }
                @Override public void onError(int error) {
                    cancelRecognizer("Je n'ai pas pu transcrire localement (code " + error + "). Réessaie ou écris-moi.");
                }
                @Override public void onResults(Bundle results) {
                    ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                    String value = matches != null && !matches.isEmpty() ? matches.get(0) : "";
                    cancelRecognizer("Écoute terminée.");
                    if (!value.isEmpty()) send("BonzeNativeResult", value);
                    else send("BonzeNativeStatus", "Je n'ai pas compris. Réessaie ou écris-moi.");
                }
                @Override public void onPartialResults(Bundle partial) {}
                @Override public void onEvent(int eventType, Bundle params) {}
            });
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "fr-FR");
            intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
            recording = true;
            recognizer.startListening(intent);
            send("BonzeNativeStatus", "Écoute en cours… parle maintenant.");
        } catch (RuntimeException ex) {
            cancelRecognizer("Moteur local indisponible : utilise le clavier.");
        }
    }

    private void cancelRecognizer(String message) {
        recording = false;
        if (recognizer != null) {
            try { recognizer.cancel(); recognizer.destroy(); }
            catch (RuntimeException ignored) {}
            recognizer = null;
        }
        send("BonzeNativeStatus", message);
    }

    @Override public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        if (level == TRIM_MEMORY_RUNNING_CRITICAL || level >= TRIM_MEMORY_MODERATE) {
            memoryWarning = true;
            cancelRecognizer("Mémoire critique : écoute désactivée. Je reste disponible par écrit.");
            send("BonzeMemoryNotice", "critical");
        } else if (level >= TRIM_MEMORY_RUNNING_LOW && level != TRIM_MEMORY_UI_HIDDEN) {
            memoryWarning = true;
            cancelRecognizer("Mémoire chargée : le clavier reste disponible.");
            send("BonzeMemoryNotice", "high");
        }
    }
    @Override public void onResume() {
        super.onResume();
        memoryWarning = false; // allow explicit retry, never auto-start microphone
    }
    @Override public void onPause() {
        cancelRecognizer("Écoute arrêtée en arrière-plan.");
        super.onPause();
    }
    @Override public void onDestroy() {
        cancelRecognizer("Écoute arrêtée.");
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }
}
