package fr.bonzeai.companion;
/** A foreground start can only consume one explicit, still-authorized request. */
public final class PendingStart {
 private String id="";private boolean granted;
 public void request(String token){id=token;granted=false;}
 public void grant(){if(!id.isEmpty())granted=true;}
 public void cancel(){id="";granted=false;}
 public String id(){return id;}
 public String consumeIfVisible(boolean visible){if(!visible||!granted||id.isEmpty())return null;String result=id;cancel();return result;}
}
