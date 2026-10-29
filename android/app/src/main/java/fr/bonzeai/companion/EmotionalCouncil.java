package fr.bonzeai.companion;
import android.content.Context;import android.content.SharedPreferences;import org.json.*;import org.mozilla.javascript.*;import java.io.*;import java.nio.charset.StandardCharsets;
/** Same pure controller in the browser and native service, no Java bridge. */
final class EmotionalCouncil {
 private final SharedPreferences prefs;private final Scriptable scope;private final Function function;private JSONObject state,params,weights,temperament=new JSONObject();
 EmotionalCouncil(Context app,SharedPreferences p)throws Exception{prefs=p;state=new JSONObject(p.getString("council-state","{}"));params=new JSONObject(p.getString("council-params","{}"));
 try(InputStream in=app.getAssets().open("core/weights/expert-router-v1.json")){weights=new JSONObject(read(in));}String custom=p.getString("lastWeights","");if(!custom.isEmpty()&&!custom.equals("{}"))weights=new JSONObject(custom);
 org.mozilla.javascript.Context cx=org.mozilla.javascript.Context.enter();try{cx.setOptimizationLevel(-1);scope=cx.initSafeStandardObjects();try(Reader r=new InputStreamReader(app.getAssets().open("core/council.js"),StandardCharsets.UTF_8)){cx.evaluateReader(scope,r,"council",1,null);}function=(Function)ScriptableObject.getProperty((Scriptable)ScriptableObject.getProperty(scope,"BonzeCouncil"),"run");}finally{org.mozilla.javascript.Context.exit();}}
 private static String read(InputStream in)throws IOException{ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] b=new byte[8192];int n;while((n=in.read(b))!=-1)out.write(b,0,n);return out.toString("UTF-8");}
 void seed(JSONObject identity)throws JSONException{temperament=identity.getJSONObject("innate").getJSONObject("temperament");if(!state.has("version"))state=DiagnosticJournal.fields("version",1,"forces",identity.getJSONObject("acquired").getJSONObject("forces"),"globalEndurance",identity.getJSONObject("acquired").optDouble("endurance",.85));}
 JSONObject evaluate(JSONObject s,JSONObject p,JSONObject w,String text,JSONObject context,double dt,String activity)throws JSONException{JSONObject input=DiagnosticJournal.fields("state",s,"params",p,"weights",w,"temperament",temperament,"text",text,"context",context,"seconds",dt,"activity",activity);org.mozilla.javascript.Context cx=org.mozilla.javascript.Context.enter();try{cx.setOptimizationLevel(-1);return new JSONObject(org.mozilla.javascript.Context.toString(function.call(cx,scope,scope,new Object[]{input.toString()})));}finally{org.mozilla.javascript.Context.exit();}}
 JSONObject run(String text,JSONObject context,double dt,String activity)throws JSONException{JSONObject r=evaluate(state,params,weights,text,context,dt,activity);state=r.getJSONObject("state");params=r.getJSONObject("params");save();return r;}
 JSONObject snapshot(){return DiagnosticJournal.fields("state",state,"params",params);}
 JSONObject validate(JSONObject backup,JSONObject w)throws JSONException{return evaluate(backup.optJSONObject("state"),backup.optJSONObject("params"),w==null?weights:w,"",new JSONObject(),0,"off");}
 void configure(JSONObject update)throws JSONException{JSONObject r=validate(update,null);adopt(r,null);save();}
 void adopt(JSONObject r,JSONObject w)throws JSONException{state=r.getJSONObject("state");params=r.getJSONObject("params");if(w!=null)weights=w;}
 void save(){prefs.edit().putString("council-state",state.toString()).putString("council-params",params.toString()).apply();}
}
