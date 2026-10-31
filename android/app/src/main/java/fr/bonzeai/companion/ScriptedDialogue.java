package fr.bonzeai.companion;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONObject;
import org.json.JSONException;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;

/** Authored replies selected by the same pure JavaScript on Android and Web.
 * No neural language generation, network permission, or implicit user-memory ingestion.
 * Confined to the service main thread; callers may classify on the inference worker first.
 */
final class ScriptedDialogue {
    private final SharedPreferences prefs;
    private final Scriptable scope;
    private final Function select;
    private JSONObject state;
    ScriptedDialogue(Context context, SharedPreferences p) throws Exception {
        prefs=p;
        JSONObject old;
        try {old=new JSONObject(p.getString("bonze-repertoire-v1", "{}"));}
        catch (JSONException invalid) {old=new JSONObject();}
        if (!old.has("seed")) old.put("seed", new SecureRandom().nextInt());
        state=canonical(old);
        org.mozilla.javascript.Context cx=org.mozilla.javascript.Context.enter();
        try {
            cx.setOptimizationLevel(-1);
            scope=cx.initSafeStandardObjects();
            try(Reader r=new InputStreamReader(context.getAssets().open("core/repertoire-corpus.js"),StandardCharsets.UTF_8)){
                cx.evaluateReader(scope,r,"bonze-corpus",1,null);
            }
            try(Reader r=new InputStreamReader(context.getAssets().open("core/repertoire.js"),StandardCharsets.UTF_8)){
                cx.evaluateReader(scope,r,"bonze-repertoire",1,null);
            }
            Scriptable namespace=(Scriptable)ScriptableObject.getProperty(scope,"BonzeRepertoire");
            select=(Function)ScriptableObject.getProperty(namespace,"run");
        } finally {org.mozilla.javascript.Context.exit();}
    }
    JSONObject choose(String userText, String semantic, JSONObject emotionalState, boolean synonyms) throws JSONException {
        JSONObject affect=emotionalState==null?new JSONObject():emotionalState.optJSONObject("state");
        if (affect==null)affect=new JSONObject();
        // Persona preference biases presentation only; never rewrites the
        // persisted emotional strengths or the private council's state.
        JSONObject presentationForces=new JSONObject();
        JSONObject stateForces=affect.optJSONObject("forces");
        if(stateForces!=null)presentationForces=new JSONObject(stateForces.toString());
        try {
            JSONObject style=new JSONObject(prefs.getString("personalizationStyleV1","{}"));
            String preset=style.optString("preset","naturel");
            String preferred="doux".equals(preset)?"empathie":
                "joueur".equals(preset)?"joie":
                "enqueteur".equals(preset)?"reflexion":
                "calme".equals(preset)?"calme":"";
            if(!preferred.isEmpty())
                presentationForces.put(preferred,Math.max(.85,presentationForces.optDouble(preferred,.38)));
        } catch(JSONException ignored) {}
        JSONObject request=new JSONObject().put("text",userText).put("semantic",semantic)
            .put("state",state).put("synonyms",synonyms)
            .put("forces",presentationForces)
            .put("endurances",affect.optJSONObject("endurances")==null?new JSONObject():affect.optJSONObject("endurances"));
        org.mozilla.javascript.Context cx=org.mozilla.javascript.Context.enter();
        try {
            cx.setOptimizationLevel(-1);
            String output=org.mozilla.javascript.Context.toString(select.call(cx,scope,scope,new Object[]{request.toString()}));
            JSONObject result=new JSONObject(output);
            String text=result.getString("text");
            if(text.isEmpty()||text.length()>1200)throw new JSONException("invalid selected text");
            state=result.getJSONObject("state");
            prefs.edit().putString("bonze-repertoire-v1",state.toString()).apply();
            return result;
        } finally {org.mozilla.javascript.Context.exit();}
    }
    static JSONObject canonical(JSONObject raw) throws JSONException {
        JSONObject result=new JSONObject(raw==null?"{}":raw.toString());
        if(!result.has("version"))result.put("version",1);
        if(result.optInt("version")!=1)throw new JSONException("repertoire-version");
        if(!result.has("seed"))result.put("seed",new SecureRandom().nextInt());
        if(!result.has("turns"))result.put("turns",0);
        if(!result.has("recent"))result.put("recent",new org.json.JSONArray());
        if(!result.has("families"))result.put("families",new org.json.JSONArray());
        if(result.optJSONArray("recent")==null||result.optJSONArray("families")==null)throw new JSONException("repertoire-list");
        return result;
    }
    void adopt(JSONObject restored) throws JSONException {if(restored!=null)state=canonical(restored);}
    JSONObject state(){return state;}
}
