package fr.bonzeai.companion;
import java.util.*;
/** Sentences preserve the words; bounded chunks allow actual playback events and pauses. */
public final class SpeechPlan {
 public static List<String> chunks(String input){
  List<String> out=new ArrayList<>();String text=DialogueMemory.clean(input,1200).trim();
  for(String sentence:text.split("(?<=[.!?;:])\\s+|\\n+")){
   String remaining=sentence.trim();
   while(!remaining.isEmpty()){
    int end=Math.min(220,remaining.length());
    if(end<remaining.length()){int space=remaining.lastIndexOf(' ',end);if(space>100)end=space;}
    out.add(remaining.substring(0,end).trim());remaining=remaining.substring(end).trim();
   }
  }
  return out;
 }
}
