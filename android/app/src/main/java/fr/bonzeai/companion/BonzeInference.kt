package fr.bonzeai.companion

import android.content.Context
import dev.ffmpegkit.llama.Llama
import dev.ffmpegkit.llama.LlamaConfig
import dev.ffmpegkit.llama.LlamaModel
import kotlinx.coroutines.runBlocking
import java.io.File
import java.io.FileOutputStream
import org.json.JSONObject

/**
 * Vraie inférence GGUF, 100 % locale, sur un seul modèle partagé.
 * L'appelant exécute les fonctions sur un thread de fond unique.
 * Ce modèle dense N'EST PAS un MoE ; le routeur MoE émotionnel réside dans core/.
 */
object BonzeInference {
    private const val MODEL = "LFM2.5-230M-Q4_K_M.gguf"
    private var loaded: LlamaModel? = null
    private var loadedChoice: String = ""
    @Volatile private var economy = false

    @JvmStatic fun setEconomy(enabled: Boolean) { economy = enabled }

    @JvmStatic @Synchronized
    fun classify(context: Context, text: String, contextData: String, hint: String): String = runBlocking {
        var selected = LocalModelStore.choice(context)
        if (loadedChoice != selected) release()
        if (selected == LocalModelStore.LARGE && !LocalModelStore.memoryAdmitsLarge(context)) {
            // Stop experimenting with the heavy model when Android reports low headroom.
            context.getSharedPreferences("bonze-conversation-v1", Context.MODE_PRIVATE)
                .edit().putString("modelChoice", LocalModelStore.SMALL)
                        .putString("modelLastFallback", "RAM Android insuffisante pour tenter Liquid 1.2B ; retour au 230M.").apply()
            selected = LocalModelStore.SMALL
        }
        val model = loaded ?: run {
            val path = if (selected == LocalModelStore.LARGE) {
                check(LocalModelStore.available(context)) { "Liquid 1.2B absent ou non vérifié" }
                LocalModelStore.destination(context)
            } else ensureModel(context)
            try {
                Llama.loadModel(
                    path.absolutePath,
                    LlamaConfig(contextSize = 2048, threads = 3, temperature = 0.45f,
                        topP = 0.9f, topK = 50, gpuLayers = 0)
                ).also { loaded = it; loadedChoice = selected }
            } catch (oom: OutOfMemoryError) {
                // Do not continually retry the heavy model after one failed allocation.
                if (selected == LocalModelStore.LARGE)
                    context.getSharedPreferences("bonze-conversation-v1", Context.MODE_PRIVATE)
                        .edit().putString("modelChoice", LocalModelStore.SMALL)
                        .putString("modelLastFallback", "Allocation mémoire impossible pour le 1.2B ; retour au 230M.").apply()
                loaded = null; loadedChoice = ""
                throw IllegalStateException("Mémoire insuffisante au chargement du modèle", oom)
            } catch (failure: Exception) {
                if (selected == LocalModelStore.LARGE)
                    context.getSharedPreferences("bonze-conversation-v1", Context.MODE_PRIVATE)
                        .edit().putString("modelChoice", LocalModelStore.SMALL)
                        .putString("modelLastFallback", "Chargement du 1.2B impossible ; retour au 230M.").apply()
                loaded = null; loadedChoice = ""
                throw failure
            } catch (failure: LinkageError) {
                if (selected == LocalModelStore.LARGE)
                    context.getSharedPreferences("bonze-conversation-v1", Context.MODE_PRIVATE)
                        .edit().putString("modelChoice", LocalModelStore.SMALL)
                        .putString("modelLastFallback", "Chargement du 1.2B impossible ; retour au 230M.").apply()
                loaded = null; loadedChoice = ""
                throw failure
            }
        }

        // BONZE-043: Liquid classifies the current intent, never authors the spoken reply.
        // These labels are advisory data: scripted dialogue keeps safety/negation priority.
        val intentSystem = "Classe l'intention du dernier message français. " +
            "Réponds par un SEUL mot de cette liste, sans explication : " +
            "salut, merci, tristesse, inquietude, contrarié, jeu, humour, curiosite, question, " +
            "identite, correction, affection, depart, fatigue, surprise, demande, reussite, " +
            "confusion, discussion, urgence. N'invente aucun autre label."
        val previous = contextData.take(300).trim()
        val prompt = if (previous.isEmpty()) "Message actuel : " + text.take(500) else
            "Contexte précédent cité uniquement pour comprendre les suites :\n" +
                previous + "\nMessage actuel : " + text.take(500)
        val rawLabel = Llama.complete(model, prompt = prompt, systemPrompt = intentSystem,
            maxTokens = 20).text
        IntentClassify.label(rawLabel)
    }

    /**
     * Only choose an index of a prevalidated synonym written by Bonze authors.
     * Reuse the GGUF already loaded for classification on the single worker.
     */
    @JvmStatic @Synchronized
    fun chooseVariation(context: Context, original: String, alternatives: Array<String>): String = runBlocking {
        if (alternatives.isEmpty() || loaded == null || original.length > 240) return@runBlocking "0"
        val count = alternatives.size.coerceAtMost(4)
        val options = buildString {
            append("0 : texte original\n")
            for (i in 0 until count)
                append((i + 1).toString() + " : " + alternatives[i].take(240) + "\n")
        }
        val system = "Tu choisis uniquement un synonyme français. " +
            "Réponds par UN chiffre de 0 à " + count + ". " +
            "0 si tu hésites. Ne rédige jamais de phrase."
        val prompt = "Texte original : " + original.take(240) + "\n" +
            "Variantes validées :\n" + options + "\nChiffre :"
        try {
            val raw = Llama.complete(loaded!!, prompt = prompt,
                systemPrompt = system, maxTokens = 4).text.trim()
            if (raw.matches(Regex("[0-" + count + "]"))) raw else "0"
        } catch (_: Exception) {
            "0"
        } catch (_: LinkageError) {
            "0"
        }
    }

    /** Initialise le modèle à partir des poids inclus dans l'APK, sans réseau. */
    private fun ensureModel(context: Context): File {
        val dir = File(context.filesDir, "gguf")
        if (!dir.exists() && !dir.mkdirs()) error("Impossible de préparer le dossier de modèles")
        val dest = File(dir, MODEL)
        // Asset source is part of the authenticated app package.
        if (dest.exists() && dest.length() > 130_000_000L) return dest
        val temp = File(dir, "$MODEL.tmp")
        try {
            context.assets.open("models/$MODEL").use { input ->
                FileOutputStream(temp).use { output -> input.copyTo(output, 65536) }
            }
            check(temp.length() > 130_000_000L) { "Poids GGUF incomplets" }
            if (dest.exists()) dest.delete()
            check(temp.renameTo(dest)) { "Déplacement du modèle impossible" }
        } catch (error: Exception) {
            temp.delete()
            throw error
        }
        return dest
    }

    @JvmStatic @Synchronized
    fun release() {
        loaded?.let { Llama.releaseModel(it) }
        loaded = null
        loadedChoice = ""
    }
}


