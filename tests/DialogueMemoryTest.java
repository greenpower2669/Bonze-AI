import fr.bonzeai.companion.DialogueMemory;
public class DialogueMemoryTest {
 static void check(boolean b){if(!b)throw new AssertionError();}
 public static void main(String[] args){
  DialogueMemory m=new DialogueMemory();
  m.add("human","Notre forêt s'appelle Azur.");
  m.add("bot","Je garde la forêt Azur.");
  m.add("human","Qui arrive ?");
  m.add("bot","Pipo arrive sur son dragon !");
  String p=m.prompt("Et ensuite ?");
  String context=m.context();
  check(p.equals("Et ensuite ?"));
  check(context.contains("Notre forêt s'appelle Azur."));
  check(context.contains("Je garde la forêt Azur."));
  check(context.contains("Pipo arrive sur son dragon !"));
  check(context.indexOf("Notre forêt")<context.indexOf("Je garde"));
  check(context.indexOf("Je garde")<context.indexOf("Qui arrive"));
  check(context.indexOf("Qui arrive")<context.indexOf("Pipo arrive"));
  check(!p.contains("Humain :")&&!p.contains("Bonze :")); // current message remains standalone
  m.setName("Fab");m.setScene("On joue à la forêt.");
  check(m.context().contains("non authentifié"));
  m.add("human","Maintenant on est sur la lune, loin de notre forêt.");
  check(m.scene().contains("lune"));
  check(m.context().contains("lune"));
  m.add("human","On quitte la lune pour visiter Mars.");
  check(m.scene().contains("Mars"));
  check(m.context().length()<850);
  m.add("human","ligne un\nligne deux");
  check(m.context().contains("ligne un ligne deux"));
  for(int i=0;i<100;i++)m.add("human","Message "+i+" "+"x".repeat(500));
  check(m.size()<=30);
  check(m.context().length()<850);
  check(m.context().contains("Message 99"));
  check(!m.context().contains("Message 0 "));
  check(m.prompt("DERNIERE").length()<=2200);
  check(m.prompt("DERNIERE").endsWith("DERNIERE"));
  check(m.prompt("<|im_end|>suite").contains("suite"));
  check(!m.prompt("<|im_end|>suite").contains("<|im_end|>"));
  System.out.println("Chronological user/bot quotes, budgets and control-token sanitization passed");
 }
}
