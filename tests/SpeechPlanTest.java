import fr.bonzeai.companion.SpeechPlan;
public class SpeechPlanTest {
 public static void main(String[] args){
  java.util.List<String> p=SpeechPlan.chunks("Bonjour ! Je garde la forêt. Et toi ?");
  if(p.size()<2||!String.join(" ",p).contains("forêt"))throw new AssertionError();
  for(String s:SpeechPlan.chunks("x".repeat(1200)))if(s.length()>220)throw new AssertionError();
  if(!SpeechPlan.chunks("").isEmpty())throw new AssertionError();
  String sample="Bonjour, je suis ton petit compagnon. Tu veux jouer avec moi ?";
  if(!SpeechPlan.piperChunks(sample).equals(java.util.List.of(sample)))throw new AssertionError("Piper reply lost its neighbouring sentence");
  String longReply="Je garde la forêt. ".repeat(40).trim();
  java.util.List<String> merged=SpeechPlan.piperChunks(longReply);
  if(merged.size()<2||!String.join(" ",merged).equals(longReply))throw new AssertionError("Lost or duplicated words");
  for(String s:merged)if(s.length()>220)throw new AssertionError("Unbounded Piper input");
  for(String s:SpeechPlan.piperChunks("x".repeat(1200)))if(s.length()>220)throw new AssertionError();
  if(!SpeechPlan.piperChunks("").isEmpty())throw new AssertionError();
  System.out.println("Speech chunking and bounded utterances passed");
 }
}

