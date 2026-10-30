package fr.bonzeai.companion;
/** Authentication is granted by the Android credential UI, never by a gesture. */
public final class AdminGate {
 private long until;private long challenge;private boolean pending;
 public long challenge(){pending=true;return ++challenge;}
 public boolean complete(long token,boolean ok,long now){if(!pending||token!=challenge)return false;pending=false;if(ok)until=now+120000;return ok;}
 public boolean allowed(long now){return until>now;}
 public void lock(){until=0;}
 public void cancel(){lock();pending=false;challenge++;}
}
