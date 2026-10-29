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
 void reload(){try{rows=new JSONArray(prefs.getString("journal","[]"));}catch(JSONException e){rows=new JSONArray();}}
 static JSONObject fields(Object... values){JSONObject o=new JSONObject();try{for(int i=0;i+1<values.length;i+=2)o.put(String.valueOf(values[i]),values[i+1]);}catch(JSONException ignored){}return o;}
}
