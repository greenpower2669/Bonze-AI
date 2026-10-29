import fr.bonzeai.companion.PendingStart;
public class PendingStartTest {
 static void check(boolean b){if(!b)throw new AssertionError();}
 public static void main(String[] args){
  PendingStart p=new PendingStart();p.request("grant");p.grant();check(p.consumeIfVisible(false)==null);
  check("grant".equals(p.consumeIfVisible(true)));check(p.consumeIfVisible(true)==null);
  p.request("cancel");p.cancel();p.grant();check(p.consumeIfVisible(true)==null);
  p.request("not granted");check(p.consumeIfVisible(true)==null);
  p.cancel();System.out.println("Permission pause/grant/resume/Stop tests passed");
 }
}
