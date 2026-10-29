import fr.bonzeai.companion.PendingDocument;
public class PendingDocumentTest{
 static void rejected(PendingDocument p){try{p.consume();throw new AssertionError();}catch(IllegalStateException expected){}}
 public static void main(String[] args){PendingDocument p=new PendingDocument();rejected(p);p.prepare("encrypted");if(!p.consume().equals("encrypted"))throw new AssertionError();rejected(p);p.prepare("old");p.cancel();rejected(p);p.prepare("survives only current Activity");rejected(new PendingDocument());System.out.println("Stale, duplicate and recreated export results rejected before file open");}
}
