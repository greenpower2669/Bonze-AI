package fr.bonzeai.companion;

/** Pure session guard, also tested on a host JVM. Main-thread owner. */
public final class VoiceSession {
    private long epoch = 0;
    private boolean foreground, enabled, waiting, speaking;
    public void resume() { foreground = true; }
    public void pause() { foreground = false; stop(); }
    public long begin() {
        stop();
        if (foreground) enabled = true;
        return epoch;
    }
    public void stop() { epoch++; enabled = false; waiting = false; speaking = false; }
    public long epoch() { return epoch; }
    public boolean active() { return foreground && enabled; }
    public boolean current(long id) { return active() && id == epoch; }
    public boolean canListen() { return active() && !waiting && !speaking; }
    public void awaiting() { waiting = true; }
    public void talking() { waiting = false; speaking = true; }
    public void finished() { speaking = false; waiting = false; }
}
