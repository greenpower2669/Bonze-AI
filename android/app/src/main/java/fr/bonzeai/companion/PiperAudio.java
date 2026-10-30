package fr.bonzeai.companion;
/** Conservative segment gain, and RMS of the same signal sent to AudioTrack. */
public final class PiperAudio {
 public static float normalize(float[] samples){float peak=0;for(float v:samples){if(!Float.isFinite(v))throw new IllegalArgumentException("non-finite-pcm");peak=Math.max(peak,Math.abs(v));}if(peak<.001f)throw new IllegalArgumentException("silent-pcm");float gain=Math.min(20f,.6f/peak);for(int i=0;i<samples.length;i++)samples[i]=Math.max(-1f,Math.min(1f,samples[i]*gain));return gain;}
 public static double level(float[] samples,int frame){int to=Math.max(0,Math.min(frame,samples.length)),from=Math.max(0,to-441);double sum=0;for(int i=from;i<to;i++)sum+=(double)samples[i]*samples[i];return Math.min(1,Math.sqrt(sum/Math.max(1,to-from))*5);}
}
