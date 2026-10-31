package fr.bonzeai.companion;

import java.text.Normalizer;
import java.util.*;

/** Verifies the semantic shape of local replies before publication. No network or user-data export. */
public final class ReplyQuality {
 private ReplyQuality(){}
 public static final class Result {
  public final String text, reason; public final boolean repaired;
  private Result(String text,String reason,boolean repaired){this.text=text;this.reason=reason;this.repaired=repaired;}
 }
 private static final Set<String> STOP=new HashSet<>(Arrays.asList(
  "les","des","une","pour","dans","avec","mais","plus","nous","vous","elle","elles",
  "dont","comment","pourquoi","quelle","quelles","quels","quel","est","sont","avoir",
  "etre","que","qui","quoi","tout","tous","notre","votre","cette","cela","alors",
  "chez","bien","moi","toi","mon","ton","mes","tes","aux","sur","pas","peux",
  "peut","faire","estce","bonze","juste","comme","veux","fait","dit","sais","encore"));
 static String norm(String value){
  if(value==null)return "";
  return Normalizer.normalize(value.toLowerCase(Locale.FRANCE),Normalizer.Form.NFD)
   .replaceAll("\\p{M}","").replaceAll("[^\\p{L}\\p{N}]+"," ").replaceAll("\\s+"," ").trim();
 }
 private static Set<String> words(String input){
  Set<String> result=new HashSet<>();
  for(String w:norm(input).split(" "))if(w.length()>=3&&!STOP.contains(w))result.add(w);
  return result;
 }
 private static boolean similar(String a,String b){
  String x=norm(a),y=norm(b);
  if(x.isEmpty()||y.isEmpty())return false;
  if(x.equals(y))return true;
  if(Math.min(x.length(),y.length())>=15 && (x.contains(y)||y.contains(x))
    && (double)Math.min(x.length(),y.length())/Math.max(x.length(),y.length())>.7)return true;
  Set<String> sx=words(x),sy=words(y);
  if(sx.size()<3||sy.size()<3)return false;
  int overlap=0;for(String w:sx)if(sy.contains(w))overlap++;
  return (double)overlap/(sx.size()+sy.size()-overlap)>=.70;
 }
 private static boolean quotingRequested(String input){
  String u=norm(input);
  return u.startsWith("repete ")||u.startsWith("repetez ")||u.contains("repete apres moi")
   ||u.contains("cite exactement")||u.contains("redis exactement")
   ||u.contains("dis mot pour mot")||u.contains("copie exactement");
 }
 private static boolean isQuestion(String raw){
  String u=norm(raw);
  return raw!=null&&(raw.contains("?")||
   u.matches("^(qui|que|quoi|quel|quelle|quels|quelles|combien|comment|pourquoi|quand|ou|peux tu|pourrais tu|explique|dis moi|sais tu|est ce que)\\b.*"));
 }
 private static boolean genericDeflection(String output){
  String s=norm(output);
  return s.startsWith("je suis en mode leger")||s.startsWith("raconte moi la suite")
   ||s.startsWith("je cherche encore mes mots")||s.startsWith("je n ai pas reussi a formuler")
   ||s.startsWith("je peux t aider avec")||s.startsWith("je suis bonze ai un compagnon")
   ||s.startsWith("je suis la pour t aider")||s.startsWith("je t ecoute raconte")
   ||s.startsWith("reformule ta demande")||s.startsWith("redis moi ta phrase");
 }
 public static Result review(String input,String output,boolean lastBotRepeat){
  return review(input,output,lastBotRepeat,Collections.emptyList());
 }
 public static Result review(String input,String output,boolean lastBotRepeat,List<String> recentBot){
  String answer=output==null?"":output.trim(),u=norm(input),a=norm(answer);
  if(a.isEmpty())return new Result("","empty",true);
  boolean requested=quotingRequested(input);
  // A short reciprocal greeting is idiomatic, not a long-form parrot response.
  boolean courtesy=u.equals(a)&&Arrays.asList("salut","bonjour","bonsoir","coucou","merci","au revoir").contains(u);
  if(!requested&&!courtesy&&similar(input,answer))return new Result("","user-echo",true);
  if(lastBotRepeat)return new Result("","bot-repeat",true);
  if(recentBot!=null)for(String previous:recentBot)
   if(similar(answer,previous))return new Result("","history-repeat",true);
  if(!requested&&isQuestion(input)&&genericDeflection(answer)
     &&!(u.contains("qui es tu")||u.contains("comment tu t appelles")))
    return new Result("","generic-deflection",true);
  return new Result(answer,requested?"requested-quote":"accepted",false);
 }
}
