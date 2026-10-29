package fr.bonzeai.companion

import android.content.Context
import dev.ffmpegkit.llama.Llama
import dev.ffmpegkit.llama.LlamaConfig
import dev.ffmpegkit.llama.LlamaModel
import kotlinx.coroutines.runBlocking
import java.io.File
import java.io.FileOutputStream

/**
 * Vraie inférence GGUF, 100 % locale, sur un seul modèle partagé.
 * L'appelant exécute les fonctions sur un thread de fond unique.
 * Ce modèle dense N'EST PAS un MoE ; le routeur MoE émotionnel réside dans core/.
 */
object BonzeInference {
    private const val MODEL = "LFM2.5-230M-Q4_K_M.gguf"
    private var loaded: LlamaModel? = null
    @Volatile private var economy = false

    @JvmStatic fun setEconomy(enabled: Boolean) { economy = enabled }

    @JvmStatic @Synchronized
    fun reply(context: Context, text: String, contextData: String, hint: String): String = runBlocking {
        val model = loaded ?: run {
            val path = ensureModel(context)
            Llama.loadModel(
                path.absolutePath,
                LlamaConfig(contextSize = 2048, threads = 3, temperature = 0.45f,
                    topP = 0.9f, topK = 50, gpuLayers = 0)
            ).also { loaded = it }
        }
        val personality = "Tu t'appelles Bonze AI. Réponds en français, brièvement, au dernier message. " +
            "Participe aux jeux imaginaires. Reste gentil et sincère sur tes capacités. " + hint.take(110) +
            "\nContexte mémorisé (il peut être incomplet) : " + contextData.take(950)
        val result = Llama.complete(model, prompt = text.take(2200),
            systemPrompt = personality, maxTokens = if (economy) 72 else 144)
        result.text.trim().ifEmpty {
            "Je n'ai pas réussi à formuler une réponse. Tu veux me réexpliquer ?"
        }.take(1200)
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
    }
}


