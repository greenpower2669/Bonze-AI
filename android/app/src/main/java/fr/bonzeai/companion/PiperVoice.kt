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
        fun metrics(id: String, generationMs: Long, playbackMs: Long, underruns: Int, samples: Int)
        fun failed(reason: String, hadAudio: Boolean)
    }
    private val worker = Executors.newSingleThreadExecutor()
    private val serial = AtomicLong()
    private var track: AudioTrack? = null
    private var engine: OfflineTts? = null
    private var dictionary: Map<String,String>? = null
    private fun loadDictionary(){
        if(dictionary==null)dictionary=app.assets.open("piper/lexicon.txt").bufferedReader().useLines { lines ->
            lines.filter { "||" in it }.map { val fields=it.split("||",limit=2);fields[0].trim() to fields[1].replace(" ","").trim() }.toMap()
        }
    }
    private fun prepare(): OfflineTts {
        if (engine == null) {
            engine = OfflineTts(app.assets, OfflineTtsConfig(model = OfflineTtsModelConfig(
                vits = OfflineTtsVitsModelConfig(noiseScale = .333f, noiseScaleW = .333f, model = "piper/voice.onnx", tokens = "piper/tokens.txt", lexicon = ""),
                numThreads = 2)))
        }
        return engine!!
    }
    fun speak(chunks: List<String>, prefix: String, speed: Float, events: Events) {
        stop(); val token = serial.get()
        worker.execute {
            var hadAudio = false
            try {
                loadDictionary()
                // Verify every chunk before the first sound, then pass bare IPA directly.
                val phoneticPlan=chunks.map { PiperPhonetics.speechPhonemes(it,dictionary!!) }
                val tts=prepare()
                for ((part, text) in chunks.withIndex()) {
                    if (serial.get() != token) return@execute
                    val synthesisAt=SystemClock.elapsedRealtime()
                    val generation=GenerationConfig(speed=speed, sid=0, phonemeCodepoints=arrayOf(phoneticPlan[part].codePoints().toArray()))
                    val generated = tts.generateWithConfigAndCallback(text,generation,PiperCancellation(serial,token))
                    if (serial.get() != token) return@execute
                    val generatedMs=SystemClock.elapsedRealtime()-synthesisAt
                    val samples = generated.samples
                    check(samples.size > 100 && samples.size < generated.sampleRate * 45) { "invalid-pcm" }
                    PiperAudio.normalize(samples)
                    val pcm = ShortArray(samples.size) { (samples[it].coerceIn(-1f,1f)*32767).toInt().toShort() }
                    val id = prefix + part
                    val minBuffer = AudioTrack.getMinBufferSize(generated.sampleRate,AudioFormat.CHANNEL_OUT_MONO,AudioFormat.ENCODING_PCM_16BIT)
                    check(minBuffer>0) { "audio-buffer-invalid" }
                    val bufferBytes = max(minBuffer*2, 32768)
                    val player = AudioTrack.Builder()
                        .setAudioAttributes(AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ASSISTANT)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build())
                        .setAudioFormat(AudioFormat.Builder().setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                            .setSampleRate(generated.sampleRate).setChannelMask(AudioFormat.CHANNEL_OUT_MONO).build())
                        .setBufferSizeInBytes(bufferBytes).setTransferMode(AudioTrack.MODE_STREAM).build()
                    val playbackAt=SystemClock.elapsedRealtime()
                    var underruns=0
                    try {
                        // Prime the buffer BEFORE play. Non-blocking writes after play can otherwise
                        // starve the device when the process briefly loses CPU time on Android.
                        if (!attachPlayer(player,token)) return@execute
                        val prefill=min(pcm.size,min(generated.sampleRate/3,bufferBytes/4))
                        var written=0
                        while(written<prefill&&serial.get()==token){
                            val count=player.write(pcm,written,min(2048,prefill-written),AudioTrack.WRITE_BLOCKING)
                            check(count>0) { "audio-prefill-write" };written+=count
                        }
                        if(serial.get()!=token)return@execute
                        player.play()
                        val deadline=SystemClock.elapsedRealtime()+max(60000L,1000L*pcm.size/generated.sampleRate+12000L)
                        var started=false
                        while(serial.get()==token&&player.playbackHeadPosition<pcm.size){
                            if(SystemClock.elapsedRealtime()>deadline)error("playback-timeout")
                            if(written<pcm.size){
                                val count=player.write(pcm,written,min(2048,pcm.size-written),AudioTrack.WRITE_BLOCKING)
                                check(count>0) { "audio-write" };written+=count
                            }
                            val frame=player.playbackHeadPosition.coerceIn(0,samples.size)
                            if(frame>0){
                                if(!started){hadAudio=true;started=true;events.start(id,text)}
                                events.level(id,PiperAudio.level(samples,frame),frame)
                            }
                            if(written>=pcm.size)Thread.sleep(12)
                        }
                        underruns=player.underrunCount
                    } finally { releasePlayer(player) }
                    if(serial.get()==token){
                        events.metrics(id,generatedMs,SystemClock.elapsedRealtime()-playbackAt,underruns,pcm.size)
                        events.level(id,0.0,pcm.size)
                        Thread.sleep(55)
                    }
                }
                
                if(serial.get()==token)events.done()
            } catch(e: Exception) { if(serial.get()==token)events.failed(e.message?:e.javaClass.simpleName,hadAudio) }
              catch(e: LinkageError) { if(serial.get()==token)events.failed(e.javaClass.simpleName,hadAudio) }
        }
    }
    // Method monitors avoid a Kotlin/D8 verifier failure with non-local returns in inline synchronized/finally.
    @Synchronized private fun attachPlayer(player: AudioTrack,token: Long): Boolean {if(serial.get()!=token)return false;track=player;return true}
    @Synchronized private fun releasePlayer(player: AudioTrack){if(track===player)track=null;try{player.pause();player.flush()}catch(_:IllegalStateException){};player.release()}
    @Synchronized fun stop(){serial.incrementAndGet();try{track?.pause();track?.flush()}catch(_:IllegalStateException){}}
    fun unload(){stop();worker.execute{engine?.release();engine=null;dictionary=null}}
    fun close(){stop();worker.execute{engine?.release();engine=null};worker.shutdown()}
}
