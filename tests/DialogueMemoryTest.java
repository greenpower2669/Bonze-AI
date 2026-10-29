import fr.bonzeai.companion.DialogueMemory;
public class DialogueMemoryTest {
 static void check(boolean b){if(!b)throw new AssertionError();}
 public static void main(String[] args){
  DialogueMemory m=new DialogueMemory();m.add("human","Notre forêt s'appelle Azur.");m.add("bot","Je garde la forêt Azur.");
  String p=m.prompt("Qui arrive ?");check(p.contains("Azur"));check(p.contains("Qui arrive ?"));check(p.contains("Bonze"));
  for(int i=0;i<100;i++)m.add("human","Message "+i+" "+"x".repeat(500));
  check(m.size()<=30);check(m.prompt("DERNIERE").length()<=2200);check(m.prompt("DERNIERE").endsWith("DERNIERE"));
  check(m.prompt("<|im_end|>suite").contains("suite"));check(!m.prompt("<|im_end|>suite").contains("<|im_end|>"));
  System.out.println("Dialogue context, budget, roles and control tokens passed");
 }
}
