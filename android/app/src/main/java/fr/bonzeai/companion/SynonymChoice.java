package fr.bonzeai.companion;
import java.util.*;
import java.util.regex.*;
/** Authored synonyms. A model may pick an index, never author the spoken sentence. */
public final class SynonymChoice {
 private SynonymChoice(){}
 private static final String[][] PAIRS={
  {"doucement","tranquillement"},{"regarder","observer"},
  {"continuer","poursuivre"},{"réellement","vraiment"}
 };
 public static List<String> candidates(String source){
  if(source==null||source.isEmpty())return Collections.emptyList();
  List<String> options=new ArrayList<>();
  for(String[] pair:PAIRS)for(int direction=0;direction<2;direction++){
   String from=pair[direction],to=pair[1-direction];
   Matcher match=Pattern.compile("(?<!\\p{L})"+Pattern.quote(from)+"(?!\\p{L})",
     Pattern.CASE_INSENSITIVE|Pattern.UNICODE_CASE).matcher(source);
   if(!match.find())continue;
   if(Character.isUpperCase(match.group().codePointAt(0)))
     to=Character.toUpperCase(to.charAt(0))+to.substring(1);
   String changed=source.substring(0,match.start())+to+source.substring(match.end());
   if(!source.equals(changed)&&!options.contains(changed))options.add(changed);
   if(options.size()==4)return options;
  }
  return options;
 }
 public static String pick(String original,List<String> choices,String modelIndex){
  if(modelIndex==null||!modelIndex.trim().matches("[0-4]"))return original;
  int index=Integer.parseInt(modelIndex.trim());
  if(index==0||choices==null||index>choices.size())return original;
  String candidate=choices.get(index-1);
  return candidates(original).contains(candidate)?candidate:original;
 }
}
