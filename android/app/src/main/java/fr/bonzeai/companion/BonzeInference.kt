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

    @JvmStatic @Synchronized
    fun reply(context: Context, text: String, mood: String): String = runBlocking {
        val model = loaded ?: run {
            val path = ensureModel(context)
            Llama.loadModel(
                path.absolutePath,
                LlamaConfig(contextSize = 1024, threads = 3, temperature = 0.1f,
                    topP = 0.9f, topK = 50, gpuLayers = 0)
            ).also { loaded = it }
        }
        val personality = "Tu es Bonze AI, petit compagnon francophone hors ligne, bienveillant, " +
            "curieux et respectueux. Tu es un programme, pas une personne. " +
            "Réponds en français en deux phrases maximum. Si tu ne sais pas, dis-le " +
            "clairement et propose d'apprendre ou de demander à quelqu'un de compétent. " +
            "N'invente pas de faits sur la famille ni de réussites. " +
            "État émotionnel simulé actuel : " + mood.take(70) + "."
        val result = Llama.complete(model, prompt = text.take(600),
            systemPrompt = personality, maxTokens = 96)
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
