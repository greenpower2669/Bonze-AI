package fr.bonzeai.companion;
import java.text.Normalizer;
import java.util.*;
/** Deterministic local reply-quality guard. Does not rewrite user input. */
public final class ReplyQuality {
 private ReplyQuality(){}
 public static final class Result {
  public final String text,reason;public final boolean repaired;
  private Result(String t,String r,boolean b){text=t;reason=r;repaired=b;}
 }
 private static String norm(String s){
  if(s==null)return "";
  return Normalizer.normalize(s.toLowerCase(Locale.FRANCE),Normalizer.Form.NFD)
   .replaceAll("\\p{M}","").replaceAll("[^\\p{L}\\p{N}]+"," ").replaceAll("\\s+"," ").trim();
 }
 public static Result review(String input,String output,boolean repeatBot){
  String u=norm(input),a=norm(output);
  if(a.isEmpty())return new Result("Je n'ai pas trouvé mes mots. On peut reprendre autrement ?","empty",true);
  if(u.startsWith("repete ")||u.startsWith("repetez ")||u.contains("repete apres moi")||
    u.contains("cite exactement")||u.contains("redis exactement")||u.contains("dis mot pour mot"))
    return new Result(output,"requested-repeat",false);
  boolean echo=false;
  if(u.length()>=13&&a.length()>=13){
   echo=a.equals(u)||(a.length()<=u.length()+65&&a.contains(u));
   if(!echo&&a.length()<=u.length()*1.5){
    Set<String> su=new HashSet<>(Arrays.asList(u.split(" "))),sa=new HashSet<>(Arrays.asList(a.split(" ")));
    su.removeIf(t->t.length()<3);sa.removeIf(t->t.length()<3);
    if(su.size()>=4&&sa.size()>=4){int common=0;for(String x:su)if(sa.contains(x))common++;
     echo=(double)common/su.size()>=.85&&(double)common/sa.size()>=.72;}
   }
  }
  if(echo)return new Result(
   (u.contains("naze")||u.contains("nul")||u.contains("ridicule"))?
    "Je vois que ma réponse t'a déçu. Dis-moi ce qui cloche, je vais essayer autrement.":
    "Je t'ai répété au lieu de te répondre. Qu'est-ce que tu voulais que je comprenne ?",
   "user-echo",true);
  if(repeatBot)return new Result("Je tourne en rond. Qu'est-ce que tu voudrais explorer autrement ?","bot-repeat",true);
  return new Result(output,"accepted",false);
 }
}
