import fr.bonzeai.companion.SpeechPlan;
public class SpeechPlanTest {
 public static void main(String[] args){
  java.util.List<String> p=SpeechPlan.chunks("Bonjour ! Je garde la forêt. Et toi ?");
  if(p.size()<2||!String.join(" ",p).contains("forêt"))throw new AssertionError();
  for(String s:SpeechPlan.chunks("x".repeat(1200)))if(s.length()>220)throw new AssertionError();
  if(!SpeechPlan.chunks("").isEmpty())throw new AssertionError();
  System.out.println("Speech chunking and bounded utterances passed");
 }
}
