import fr.bonzeai.companion.VoiceSession;
public final class VoiceSessionTest {
    static void check(boolean b) { if (!b) throw new AssertionError(); }
    public static void main(String[] args) {
        VoiceSession s = new VoiceSession();
        check(!s.canListen()); s.resume(); long first = s.begin(); check(s.canListen());
        s.stop(); check(!s.current(first)); check(!s.canListen()); // permission after stop
        long second = s.begin(); check(s.current(second)); check(!s.current(first));
        s.awaiting(); check(!s.canListen()); s.talking(); check(!s.canListen());
        s.finished(); check(s.canListen()); s.pause(); check(!s.canListen());
        s.begin(); check(!s.canListen()); s.resume(); check(!s.canListen());
        s.begin(); check(s.canListen());
        System.out.println("VoiceSession lifecycle/permission/utterance tests passed");
    }
}
