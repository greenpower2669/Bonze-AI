import fr.bonzeai.companion.IntentClassify;
public final class IntentClassifyTest {
 private static void equal(String raw,String want){
  String actual=IntentClassify.label(raw);
  if(!want.equals(actual))throw new AssertionError(raw+" -> "+actual+" instead of "+want);
 }
 public static void main(String[] args){
  equal("jeu","jeu");
  equal("Intention: contrarié.","contrarié");
  equal("Catégorie = RÉUSSITE","reussite");
  equal("question\nraison : vérifier la lune","question");
  equal("Une histoire de dragons",""); // no fabricated label from model prose
  equal("question ou blague",""); // ambiguous: use lexical fallback
  equal("urgence et jeu",""); // never accept mixed safety instructions
  equal("","");equal(null,"");
  System.out.println("IntentClassifyTest OK");
 }
}
