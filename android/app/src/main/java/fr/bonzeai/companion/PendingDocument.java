package fr.bonzeai.companion;
/** A document result may outlive the Activity that prepared it. Never open/truncate without data. */
public final class PendingDocument {
 private String text="";
 public void prepare(String value){if(value==null||value.isEmpty())throw new IllegalArgumentException();text=value;}
 public String consume(){String value=text;text="";if(value.isEmpty())throw new IllegalStateException("Export perdu ou périmé : recommence l’exportation.");return value;}
 public void cancel(){text="";}
}
