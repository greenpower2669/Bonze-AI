package fr.bonzeai.companion;
import android.content.SharedPreferences;
import org.json.*;
/** Bounded private local trace of operations actually executed; never generated reasoning. */
final class DiagnosticJournal {
 private JSONArray rows=new JSONArray();private final SharedPreferences prefs;
 DiagnosticJournal(SharedPreferences p){prefs=p;try{rows=new JSONArray(p.getString("journal","[]"));}catch(JSONException ignored){}}
 void add(String stage,long turn,JSONObject details){try{
  JSONObject row=new JSONObject().put("at",System.currentTimeMillis()).put("stage",stage).put("turn",turn).put("data",details);
  rows.put(row);while(rows.length()>120||rows.toString().length()>700000)rows.remove(0);
  prefs.edit().putString("journal",rows.toString()).apply();
 }catch(JSONException ignored){}}
 JSONArray copy(){try{return new JSONArray(rows.toString());}catch(JSONException e){return new JSONArray();}}
 /** Publicly exportable diagnostic view: strict allowlist, no dialogue, prompts,
  * arbitrary model outputs, identity, private memories, or exception messages. */
 JSONArray safeCopy(){
  JSONArray result=new JSONArray();
  java.util.Set<String> keys=new java.util.HashSet<>(java.util.Arrays.asList(
   "latencyMs","cpuMs","qualityReason","repairApplied","discarded","repeatPrevious",
   "firstAudioLatencyMs","generationMs","playbackMs","underruns","samples","part",
   "engine","source","hadAudio","ready","selected","error","epoch"));
  for(int i=0;i<rows.length();i++){
   JSONObject old=rows.optJSONObject(i);if(old==null)continue;
   String stage=old.optString("stage","unknown");
   JSONObject data=old.optJSONObject("data"),limited=new JSONObject();
   if(data!=null)for(String k:keys){
    Object v=data.opt(k);
    if(v instanceof Number||v instanceof Boolean)try{limited.put(k,v);}catch(JSONException ignored){}
    else if(v instanceof String&&("qualityReason".equals(k)||"engine".equals(k)||"source".equals(k)||"selected".equals(k)))
      try{limited.put(k,((String)v).replaceAll("[^a-zA-Z0-9_-]","").substring(0,Math.min(48,((String)v).replaceAll("[^a-zA-Z0-9_-]","").length())));}catch(RuntimeException ignored){}
   }
   result.put(fields("at",old.optLong("at"),"turn",old.optLong("turn"),
     "stage",stage.replaceAll("[^a-zA-Z0-9_-]",""),"metrics",limited));
  }
  return result;
 }

 void reload(){try{rows=new JSONArray(prefs.getString("journal","[]"));}catch(JSONException e){rows=new JSONArray();}}
 static JSONObject fields(Object... values){JSONObject o=new JSONObject();try{for(int i=0;i+1<values.length;i+=2)o.put(String.valueOf(values[i]),values[i+1]);}catch(JSONException ignored){}return o;}
}
