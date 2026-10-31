import java.util.*;
import fr.bonzeai.companion.SynonymChoice;
public final class SynonymChoiceTest {
 private static void ok(boolean condition,String reason){if(!condition)throw new AssertionError(reason);}
 public static void main(String[]args){
  String base="Nous pouvons regarder ensemble ce sujet doucement.";
  List<String> choices=SynonymChoice.candidates(base);
  ok(choices.size()==2,"two synonyms");
  ok(choices.contains("Nous pouvons observer ensemble ce sujet doucement."),"observe");
  ok(choices.contains("Nous pouvons regarder ensemble ce sujet tranquillement."),"calmly");
  ok(SynonymChoice.pick(base,choices,"0").equals(base),"zero means base");
  ok(SynonymChoice.pick(base,choices,"1").equals(choices.get(0)),"valid choice");
  for(String bad:new String[]{"phrase libre","9","-1","1 1","1\n0","0x1",""})
   ok(SynonymChoice.pick(base,choices,bad).equals(base),"reject untrusted model");
  ok(SynonymChoice.candidates("Je ne veux pas continuer.").contains("Je ne veux pas poursuivre."),"negation untouched");
  ok(SynonymChoice.candidates("Doucement !").contains("Tranquillement !"),"case");
  ok(SynonymChoice.candidates("Regarderez-vous ceci ?").isEmpty(),"do not touch partial word");
  ok(SynonymChoice.pick(base,Arrays.asList("Un faux texte"),"1").equals(base),"forged options");
  ok(SynonymChoice.candidates("Nous pouvons maintenant vérifier cela.").contains("Nous pouvons à présent vérifier cela."),"two-word adverb");
  ok(SynonymChoice.candidates("Nous pouvons maintenant vérifier cela.").contains("Nous pouvons maintenant contrôler cela."),"verb substitution");
  ok(SynonymChoice.candidates("Parfois les choses paraissent difficiles.").contains("De temps en temps les choses paraissent difficiles."),"multiword replacement and case");
  ok(SynonymChoice.candidates("Et pourtant, nous devons continuer.").size()>=1,"known replacements are bounded");
  ok(SynonymChoice.candidates("Je termine et je continue, réellement.").size()>=2,"multiple safe variants");
  System.out.println("SynonymChoiceTest OK");
 }
}
