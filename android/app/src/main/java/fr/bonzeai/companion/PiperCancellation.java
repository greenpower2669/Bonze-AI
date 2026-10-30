package fr.bonzeai.companion;
import java.util.concurrent.atomic.AtomicLong;
import kotlin.jvm.functions.Function1;
/** sherpa JNI looks up invoke(float[]) returning Integer, not an erased indy lambda. */
public final class PiperCancellation implements Function1<float[],Integer> {
 private final AtomicLong serial;private final long token;
 public PiperCancellation(AtomicLong value,long expected){serial=value;token=expected;}
 @Override public Integer invoke(float[] samples){return serial.get()==token?1:0;}
}
