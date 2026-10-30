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
        state=old;
        org.mozilla.javascript.Context cx=org.mozilla.javascript.Context.enter();
        try {
            cx.setOptimizationLevel(-1);
            scope=cx.initSafeStandardObjects();
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
        JSONObject request=new JSONObject().put("text",userText).put("semantic",semantic)
            .put("state",state).put("synonyms",synonyms)
            .put("forces",affect.optJSONObject("forces")==null?new JSONObject():affect.optJSONObject("forces"))
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
    JSONObject state(){return state;}
}
