package fr.bonzeai.companion;
/** Service-owned lifecycle. UI visibility never grants or revokes microphone consent. */
public final class VoiceSession {
 private long epoch;private String authorized="";private boolean enabled,waiting,speaking;
 public long begin(){stop();enabled=true;return epoch;}
 public void authorizeStart(String id){authorized=id;}
 public boolean consumeStart(String id){if(!authorized.equals(id))return false;authorized="";return true;}
 public void stop(){authorized="";epoch++;enabled=false;waiting=false;speaking=false;}
 public long epoch(){return epoch;}
 public boolean active(){return enabled;}
 public boolean current(long id){return enabled&&id==epoch;}
 public boolean canListen(){return enabled&&!waiting&&!speaking;}
 public void awaiting(){waiting=true;}
 public void talking(){waiting=false;speaking=true;}
 public void finished(){waiting=false;speaking=false;}
 public void attachUi(){} // Deliberately no authority to enable the session.
 public void detachUi(){} // The foreground service owns the active conversation.
}
