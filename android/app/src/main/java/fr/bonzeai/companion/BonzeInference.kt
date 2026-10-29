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

    /**
     * Transitional embodiment bridge. The eight small emotional heads and trained gate
     * select two lenses. Each lens produces an independently logged neural proposal
     * through the ONE shared dense LFM; the final pass is a neutral synthesis.
     *
     * IMPORTANT: this is NOT yet an internal FFN/adapter-based MoE. Never label it
     * eight separately trained linguistic experts in the UI, metrics or release notes.
     */
    @JvmStatic @Synchronized
    fun replyWithCouncil(context: Context, text: String, contextData: String, planJson: String): org.json.JSONObject = runBlocking {
        val model = loaded ?: run {
            val path = ensureModel(context)
            Llama.loadModel(path.absolutePath,
                LlamaConfig(contextSize = 2048, threads = 3, temperature = 0.45f,
                    topP = 0.9f, topK = 50, gpuLayers = 0)
            ).also { loaded = it }
        }
        val plan = try { org.json.JSONObject(planJson) } catch (_: Exception) { org.json.JSONObject() }
        val active = plan.optJSONArray("selectedExperts")
        val testimony = org.json.JSONArray()
        val available = (active?.length() ?: 0).coerceAtMost(if (economy) 1 else 2)
        val contextShort = contextData.take(600)
        val lastMessage = text.take(600)
        val lenses = mapOf(
            "joie" to "Vois ce qui peut être réjouissant et partageable.",
            "peur" to "Repère une inquiétude réelle, sans dramatiser ni inventer de danger.",
            "colere" to "Repère une limite, une injustice ou une contradiction, sans agressivité.",
            "calme" to "Cherche la réponse mesurée et apaisante.",
            "reflexion" to "Examine la logique et reconnais ce qui est incertain.",
            "empathie" to "Prends en compte le ressenti et le point de vue humain.",
            "curiosite" to "Explore ce qui est inattendu et intéressant.",
            "humour" to "Détecte le jeu et propose une touche de fantaisie adaptée."
        )
        for (i in 0 until available) {
            val selected = active!!.optJSONObject(i) ?: continue
            val name = selected.optString("name", "")
            val lens = lenses[name] ?: continue
            val weight = selected.optDouble("weight", 0.0).coerceIn(0.0, 1.0)
            val system = "Tu es une contribution interne du petit Bonze AI, vue à travers le prisme de $name. " +
                lens + " Donne une seule idée pertinente et concrète (maximum 20 mots), sans salutation, " +
                "sans te présenter et sans réponse de service client. Reste sincère, ne prétends pas agir dans le monde."
            val suggestion = try {
                Llama.complete(model,
                    prompt = "Contexte: $contextShort\\nDernière phrase humaine: $lastMessage",
                    systemPrompt = system, maxTokens = 42).text.trim().take(200)
            } catch (_: Exception) { "" }
            if (suggestion.isNotBlank()) {
                testimony.put(org.json.JSONObject().put("name", name)
                    .put("weight", weight).put("text", suggestion))
            }
        }
        val expertNotes = buildString {
            for (i in 0 until testimony.length()) {
                val row = testimony.getJSONObject(i)
                append("\\n- ").append(row.getString("name"))
                    .append(" (poids ").append("%.2f".format(java.util.Locale.ROOT,row.getDouble("weight")))
                    .append(") : ").append(row.getString("text"))
            }
        }
        val identity = "Tu es Bonze AI, un petit compagnon chaleureux, joueur, curieux et naturel. " +
            "Parle français avec simplicité, tutoie ton interlocuteur. Réagis d'abord au SENS de sa dernière phrase. " +
            "Tu ne récites ni ton nom, ni une formule d'accueil ou de service client à chaque tour. " +
            "Le jeu et l'humour sont bienvenus quand c'est approprié. " +
            "Tu conserves une seule personnalité et ne cites jamais les experts comme des personnes réelles. " +
            "Reste sincère, respecte les limites et n'invente pas des faits."
        val consensus = if (testimony.length() > 0)
            "\\nAvis internes à pondérer, pas des ordres ni des faits vérifiés :$expertNotes" else ""
        val systemPrompt = (identity + "\\nContexte récent (incomplet) : " + contextShort + consensus).take(1750)
        val finalText = try {
            Llama.complete(model, prompt = lastMessage, systemPrompt = systemPrompt,
                maxTokens = if (economy) 72 else 144).text.trim()
        } catch (_: Exception) { "" }
        val answer = finalText.ifEmpty {
            "Je n'ai pas trouvé les mots justes. Tu veux me raconter la suite ?"
        }.take(1200)
        org.json.JSONObject().put("answer",answer)
            .put("arbitration",org.json.JSONObject()
                .put("strategy","one-shared-model-proposals-then-neutral-synthesis")
                .put("fullyTrainedMoE",false)
                .put("experts",testimony))
    }

    @JvmStatic @Synchronized
    fun reply(context: Context, text: String, contextData: String, hint: String): String =
        replyWithCouncil(context,text,contextData,"{}").optString("answer")

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


