import java.util.*;
import fr.bonzeai.companion.ReplyQuality;
public final class ReplyQualityTest {
 private static void yes(boolean good,String why){if(!good)throw new AssertionError(why);}
 public static void main(String[] args){
  var echo=ReplyQuality.review("Ah oui non mais là tu es vraiment naze",
   "Ah oui non mais là tu es vraiment naze.",false);
  yes(echo.repaired&&echo.reason.equals("user-echo"),"verbatim echo");
  yes(ReplyQuality.review("Tu n'as pas compris, on parle de la Lune",
   "On parle de la Lune, tu n'as pas compris.",false).repaired,"reordered echo");
  yes(ReplyQuality.review("Tu m'écoutes aujourd'hui ?",
   "Je suis en mode léger. Raconte-moi la suite",false).repaired,"generic deflection");
  yes(ReplyQuality.review("Qu'est-ce que tu veux faire ?",
   "Bonze est avec toi pour jouer à quelque chose.",false,
   Arrays.asList("Bonze est avec toi pour jouer à quelque chose !")).reason.equals("history-repeat"),"history normalized");
  yes(ReplyQuality.review("J'aime les étoiles",
   "On peut regarder ensemble ces belles étoiles.",false,
   Arrays.asList("Il y a des étoiles partout dans le ciel")).repaired==false,"legitimate shared topic");
  yes(ReplyQuality.review("Salut","Salut !",false).repaired==false,"brief salutation");
  yes(ReplyQuality.review("Répète après moi : j'aime les étoiles",
   "J'aime les étoiles",false).repaired==false,"explicit quote");
  yes(ReplyQuality.review("Bonjour","",false).reason.equals("empty"),"empty output");
  yes(ReplyQuality.review("Parle moi du soleil",
   "Notre galaxie contient un grand nombre d'étoiles.",false).repaired==false,"accept unconstrained answer");
  yes(ReplyQuality.review("Peux-tu raconter une blague ?","Je suis là pour t'aider.",false).repaired,"generic help doesn't answer");
  System.out.println("ReplyQualityTest OK");
 }
}
