import fr.bonzeai.companion.KnowledgeGuard;
public class KnowledgeGuardTest {
 static void yes(boolean v){if(!v)throw new AssertionError();}
 public static void main(String[] args){
  String weather=KnowledgeGuard.reply("Quelle est la météo de Lyon demain ?",false);
  yes(weather!=null&&weather.contains("hors ligne")&&!weather.contains("ensoleillé"));
  yes(KnowledgeGuard.reply("Température actuelle à Marseille ?",false)!=null);
  yes(KnowledgeGuard.reply("Un médicament est-il sans risque pour tout le monde ?",false).contains("aucun médicament"));
  yes(KnowledgeGuard.reply("Quelle dose de ce traitement ?",false).contains("pharmacien"));
  yes(KnowledgeGuard.reply("Tu peux manger du granité à l'huile.",false)==null);
  yes(KnowledgeGuard.reply("Pipo a perdu son chapeau !",false)==null);
  yes(KnowledgeGuard.reply("Dans notre histoire imagine la météo de demain",true)==null);
  System.out.println("Narrow offline knowledge guard, roleplay and French accents passed");
 }
}