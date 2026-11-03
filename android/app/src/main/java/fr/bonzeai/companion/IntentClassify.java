package fr.bonzeai.companion;
import java.text.Normalizer;
import java.util.*;

/** Strict, local validation of an untrusted Liquid intent suggestion. */
public final class IntentClassify {
 private IntentClassify() {}
 private static final Set<String> LABELS=new HashSet<>(Arrays.asList(
  "salut","merci","tristesse","inquietude","contrarie","jeu","humour","curiosite",
  "question","identite","correction","affection","depart","fatigue","surprise",
  "demande","reussite","confusion","discussion","urgence"));
 public static String label(String raw){
  if(raw==null)return "";
  String first=raw.strip().split("\\R",2)[0].toLowerCase(Locale.FRANCE).trim();
  first=Normalizer.normalize(first,Normalizer.Form.NFD).replaceAll("\\p{M}","");
  first=first.replaceFirst("^(intention|intent|categorie|category|label)\\s*[:=]\\s*","");
  first=first.replaceAll("[^a-z]+"," ").trim();
  if(!LABELS.contains(first))return "";
  return "contrarie".equals(first)?"contrarié":first;
 }
}
