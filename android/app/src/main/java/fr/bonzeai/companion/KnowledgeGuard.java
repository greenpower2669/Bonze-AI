package fr.bonzeai.companion;
import java.util.Locale;
/** Narrow offline knowledge boundary; authored facts are not presented as LLM reasoning. */
public final class KnowledgeGuard {
 private KnowledgeGuard(){}
 public static String reply(String input, boolean pretend){
  if(pretend||input==null)return null;
  String t=java.text.Normalizer.normalize(input.toLowerCase(Locale.FRANCE),java.text.Normalizer.Form.NFD)
   .replaceAll("\\p{M}","").replaceAll("\\s+"," ");
  boolean weather=t.contains("meteo")||t.contains("temperature")||t.contains("prevision");
  boolean relative=t.contains("demain")||t.contains("aujourd'hui")||t.contains("actuell")
   ||t.contains("ce soir")||t.contains("ce weekend")||t.contains("cette semaine");
  if(weather&&relative)return "Je suis hors ligne, donc je ne connais pas la météo de ce moment ou de demain. Tu peux me la raconter si tu l'as vue !";
  boolean medicine=t.contains("medicament")||t.contains("traitement")||t.contains("posologie");
  if(medicine&&(t.contains("sans risque")||t.contains("pour tout le monde")||t.contains("aucun danger")))
   return "Non, aucun médicament n'est garanti sans risque pour tout le monde. Pour un cas personnel, demande conseil à un professionnel de santé.";
  if(medicine&&(t.contains("quelle dose")||t.contains("combien de mg")||t.contains("quel dosage")))
   return "Je ne peux pas vérifier un dosage personnel hors ligne. Vérifie la prescription ou demande à un pharmacien ou à un médecin.";
  return null;
 }
}