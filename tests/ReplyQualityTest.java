public final class ReplyQualityTest {
 private static void yes(boolean ok,String what){if(!ok)throw new AssertionError(what);}
 public static void main(String[]args){
  var a=fr.bonzeai.companion.ReplyQuality.review("ah oui non mais là tu es vraiment naze","Ah oui non mais là tu es vraiment naze.",false);
  yes(a.repaired&&a.reason.equals("user-echo"),"parrot insult");
  yes(!a.text.contains("vraiment naze"),"not echo");
  yes(fr.bonzeai.companion.ReplyQuality.review("Peux-tu expliquer pourquoi la lune paraît si grande ?","Pourquoi la lune paraît si grande ?",false).repaired,"partial echo");
  yes(!fr.bonzeai.companion.ReplyQuality.review("Bonjour","Bonjour !",false).repaired,"greetings");
  yes(!fr.bonzeai.companion.ReplyQuality.review("Répète après moi : c'est chouette","C'est chouette",false).repaired,"asked repeat");
  yes(fr.bonzeai.companion.ReplyQuality.review("Autre question","Réponse répétée",true).repaired,"same answer");
  yes(!fr.bonzeai.companion.ReplyQuality.review("Parle-moi des étoiles","Les étoiles sont très nombreuses dans notre galaxie.",false).repaired,"real reply");
  yes(fr.bonzeai.companion.ReplyQuality.review("Dis quelque chose","",false).repaired,"empty");
  System.out.println("ReplyQualityTest OK");
 }
}
