package fr.bonzeai.companion

import android.content.Context
import android.media.*
import android.os.SystemClock
import com.k2fsa.sherpa.onnx.*
import java.util.Locale
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicLong
import kotlin.math.*

/** Piper VITS weights, sherpa 2.x runtime, MIT dictionary; no eSpeak component. */
class PiperVoice(private val app: Context) {
    interface Events {
        fun start(id: String, text: String)
        fun level(id: String, amplitude: Double, frame: Int)
        fun done()
        fun failed(reason: String, hadAudio: Boolean)
    }
    private val worker = Executors.newSingleThreadExecutor()
    private val serial = AtomicLong()
    private var track: AudioTrack? = null
    private var engine: OfflineTts? = null
    private var dictionary: Set<String>? = null
    private fun prepare(): OfflineTts {
        if (engine == null) {
            dictionary = app.assets.open("piper/lexicon.txt").bufferedReader().useLines { lines ->
                lines.map { it.substringBefore('\t').substringBefore(' ') }.toSet()
            }
            engine = OfflineTts(app.assets, OfflineTtsConfig(model = OfflineTtsModelConfig(
                vits = OfflineTtsVitsModelConfig(noiseScale = .333f, noiseScaleW = .333f, model = "piper/voice.onnx", tokens = "piper/tokens.txt", lexicon = "piper/lexicon.txt"),
                numThreads = 2)))
        }
        return engine!!
    }
    fun speak(chunks: List<String>, prefix: String, speed: Float, events: Events) {
        stop(); val token = serial.get()
        worker.execute {
            var hadAudio = false
            try {
                val tts = prepare()
                // Check the whole utterance first: don't pronounce half a reply and replay it in the fallback.
                val words = Regex("[\\p{L}]+", RegexOption.IGNORE_CASE).findAll(chunks.joinToString(" ").lowercase(Locale.FRANCE)).map { it.value }.toList()
                if (chunks.any { it.any(Char::isDigit) } || words.any { !dictionary!!.contains(it) }) throw IllegalArgumentException("lexicon-oov")
                for ((part, text) in chunks.withIndex()) {
                    if (serial.get() != token) return@execute
                    val generated = tts.generateWithCallback(text, speed = speed, callback = PiperCancellation(serial,token))
                    if (serial.get() != token) return@execute
                    val samples = generated.samples
                    check(samples.size > 100 && samples.size < generated.sampleRate * 45) { "invalid-pcm" }
                    val pcm = ShortArray(samples.size) { (samples[it].coerceIn(-1f,1f)*32767).toInt().toShort() }
                    val id = prefix + part
                    val minBuffer = AudioTrack.getMinBufferSize(generated.sampleRate,AudioFormat.CHANNEL_OUT_MONO,AudioFormat.ENCODING_PCM_16BIT)
                    val player = AudioTrack.Builder().setAudioAttributes(AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ASSISTANT).setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build())
                        .setAudioFormat(AudioFormat.Builder().setEncoding(AudioFormat.ENCODING_PCM_16BIT).setSampleRate(generated.sampleRate).setChannelMask(AudioFormat.CHANNEL_OUT_MONO).build())
                        .setBufferSizeInBytes(max(minBuffer,8192)).setTransferMode(AudioTrack.MODE_STREAM).build()
                    try {
                        if (!attachPlayer(player,token)) return@execute
                        var written=0;var started=false;val deadline=SystemClock.elapsedRealtime()+60000
                        while(serial.get()==token && player.playbackHeadPosition < pcm.size) {
                            if(SystemClock.elapsedRealtime()>deadline)error("playback-timeout")
                            if(written<pcm.size){val n=player.write(pcm,written,min(2048,pcm.size-written),AudioTrack.WRITE_NON_BLOCKING);check(n>=0){"audio-write"};written+=n}
                            val frame=player.playbackHeadPosition.coerceIn(0,samples.size)
                            if(frame>0){if(!started){hadAudio=true;started=true;events.start(id,text)}
                                var sum=0.0;val from=max(0,frame-441);for(i in from until frame)sum+=samples[i]*samples[i]
                                events.level(id,min(1.0,sqrt(sum/max(1,frame-from))*5.0),frame)}
                            Thread.sleep(20)
                        }
                    } finally { releasePlayer(player) }
                    if(serial.get()==token){events.level(id,0.0,pcm.size);Thread.sleep(140)}
                }
                if(serial.get()==token)events.done()
            } catch(e: Exception) { if(serial.get()==token)events.failed(e.message?:e.javaClass.simpleName,hadAudio) }
              catch(e: LinkageError) { if(serial.get()==token)events.failed(e.javaClass.simpleName,hadAudio) }
        }
    }
    // Method monitors avoid a Kotlin/D8 verifier failure with non-local returns in inline synchronized/finally.
    @Synchronized private fun attachPlayer(player: AudioTrack,token: Long): Boolean {if(serial.get()!=token)return false;track=player;player.play();return true}
    @Synchronized private fun releasePlayer(player: AudioTrack){if(track===player)track=null;try{player.pause();player.flush()}catch(_:IllegalStateException){};player.release()}
    @Synchronized fun stop(){serial.incrementAndGet();try{track?.pause();track?.flush()}catch(_:IllegalStateException){}}
    fun unload(){stop();worker.execute{engine?.release();engine=null;dictionary=null}}
    fun close(){stop();worker.execute{engine?.release();engine=null};worker.shutdown()}
}
