package fr.bonzeai.companion;
import java.util.*;
/** Sentences preserve the words; bounded chunks allow actual playback events and pauses. */
public final class SpeechPlan {
 /** Piper needs enough neighbouring words for stable synthesis; keep ordinary replies together. */
 public static List<String> piperChunks(String input){
  List<String> out=new ArrayList<>();String pending="";
  for(String part:chunks(input)){
   if(pending.isEmpty())pending=part;
   else if(pending.length()+1+part.length()<=220)pending+=" "+part;
   else{out.add(pending);pending=part;}
  }
  if(!pending.isEmpty())out.add(pending);
  return out;
 }
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

