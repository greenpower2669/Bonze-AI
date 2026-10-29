import fr.bonzeai.companion.VoiceSession;
public final class VoiceSessionTest {
 static void check(boolean b){if(!b)throw new AssertionError();}
 public static void main(String[] args){
  VoiceSession s=new VoiceSession();check(!s.canListen());
  long first=s.begin();check(s.current(first));check(s.canListen());
  s.detachUi();check(s.canListen());s.awaiting();check(!s.canListen());
  s.detachUi();check(s.current(first));s.talking();check(!s.canListen());
  s.finished();check(s.canListen());s.stop();check(!s.current(first));check(!s.canListen());
  s.attachUi();check(!s.canListen());long next=s.begin();check(!s.current(first));check(s.current(next));
  s.stop();s.attachUi();check(!s.canListen());
  s.authorizeStart("late");s.stop();check(!s.consumeStart("late"));
  s.authorizeStart("new");check(!s.consumeStart("late"));check(s.consumeStart("new"));check(!s.consumeStart("new"));
  System.out.println("Voice service epoch, UI detach, stop and late callback tests passed");
 }
}
