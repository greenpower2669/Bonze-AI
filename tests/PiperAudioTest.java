import fr.bonzeai.companion.PiperAudio;
public class PiperAudioTest {
 public static void main(String[] args){float[] samples={.02f,-.01f,0,.01f};float gain=PiperAudio.normalize(samples);if(gain!=20||Math.abs(samples[0]-.4)>1e-6||Math.abs(samples[1]+.2)>1e-6)throw new AssertionError();if(PiperAudio.level(samples,0)!=0||PiperAudio.level(samples,4)<=.5)throw new AssertionError();float[] loud={2,-1};PiperAudio.normalize(loud);if(Math.abs(loud[0]-.6)>1e-6)throw new AssertionError();for(float bad:new float[]{0,Float.NaN,Float.POSITIVE_INFINITY}){try{PiperAudio.normalize(new float[]{bad});throw new AssertionError();}catch(IllegalArgumentException expected){}}System.out.println("PCM gain, relative amplitude, played-window RMS and invalid/silent signal checks passed");}
}
