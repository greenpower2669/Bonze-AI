package fr.bonzeai.companion;

import android.app.*;
import android.content.*;
import android.os.*;
import android.net.Uri;
import android.webkit.WebView;
import org.json.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.*;
import java.util.function.Supplier;

/** Local credential gate + Android document picker. No storage/network permission. */
final class BackupBridge {
 private static final int AUTH=521,WRITE=522,READ=523,MAX=8*1024*1024;
 private final Activity activity;private final WebView web;private final Supplier<ConversationService> service;
 private final AdminGate gate=new AdminGate();private final ExecutorService io=Executors.newSingleThreadExecutor();
 private final PendingDocument document=new PendingDocument();private long challenge;private boolean destroyed;private String operation="",payload="";
 BackupBridge(Activity a,WebView w,Supplier<ConversationService> s){activity=a;web=w;service=s;}
 void command(String action,String value){
  if(destroyed||value.length()>MAX)return;
  if("lock".equals(action)){gate.cancel();event("locked","",null);return;}
  if(!gate.allowed(SystemClock.elapsedRealtime())){authenticate(action,value);return;}execute(action,value);
 }
 private void authenticate(String action,String value){
  KeyguardManager k=(KeyguardManager)activity.getSystemService(Context.KEYGUARD_SERVICE);
  if(!k.isDeviceSecure()){event("error","Configure un code de verrouillage Android pour protéger l'administration et les sauvegardes.",null);return;}
  if(!operation.isEmpty()){event("error","Une authentification est déjà en cours.",null);return;}
  operation=action;payload=value;challenge=gate.challenge();
  Intent intent=k.createConfirmDeviceCredentialIntent("Administration Bonze","Confirme ton code de verrouillage Android. Le geste seul ne donne aucun droit.");
  if(intent==null){operation="";payload="";gate.cancel();event("error","Authentification locale indisponible.",null);return;}
  activity.startActivityForResult(intent,AUTH);
 }
 private void execute(String action,String value){
  ConversationService engine=service.get();if(engine==null){event("error","Service en préparation.",null);return;}
  try{
   switch(action){
    case "unlock": event("unlocked","Administration ouverte pour deux minutes, jusqu'au passage en arrière-plan.",engine.diagnostics());break;
    case "emotion": engine.configureCouncil(value);event("unlocked","Paramètres émotionnels enregistrés.",engine.diagnostics());break;
    case "snapshot": engine.stop(null,"Sauvegarde : conversation arrêtée.");event("snapshot","",engine.backupData());break;
    case "export":
     JSONObject envelope=new JSONObject(value);if(!"bonze-backup".equals(envelope.optString("format"))||envelope.optInt("version")!=1)throw new IllegalArgumentException();
     document.prepare(value);activity.startActivityForResult(new Intent(Intent.ACTION_CREATE_DOCUMENT).setType("application/octet-stream").addCategory(Intent.CATEGORY_OPENABLE).putExtra(Intent.EXTRA_TITLE,"Bonze-AI-sauvegarde-"+System.currentTimeMillis()+".bonze"),WRITE);break;
    case "import": activity.startActivityForResult(new Intent(Intent.ACTION_OPEN_DOCUMENT).setType("*/*").addCategory(Intent.CATEGORY_OPENABLE),READ);break;
    case "restore": engine.restoreBackup(value);event("restored","Restauration enregistrée. Micro arrêté.",null);break;
    case "rollback": engine.rollbackBackup();event("restored","État précédent rétabli. Micro arrêté.",null);break;
    default: event("error","Action inconnue.",null);
   }
  }catch(Exception e){event("error","Opération refusée : "+e.getClass().getSimpleName()+". Les données ne sont pas effacées.",null);}
 }
 void result(int code,int result,Intent data){
  if(code==AUTH){String a=operation,v=payload;operation="";payload="";boolean valid=gate.complete(challenge,result==Activity.RESULT_OK,SystemClock.elapsedRealtime());if(valid)execute(a,v);else event("cancelled","Authentification annulée.",null);return;}
  if(code!=WRITE&&code!=READ)return;
  if(result!=Activity.RESULT_OK||data==null||data.getData()==null){document.cancel();event("cancelled","Choix du fichier annulé.",null);return;}
  Uri uri=data.getData();String content="";if(code==WRITE){try{content=document.consume();}catch(IllegalStateException e){event("error",e.getMessage(),null);return;}}final String text=content;
  io.execute(()->{try{
   if(code==WRITE){try(OutputStream out=activity.getContentResolver().openOutputStream(uri,"wt")){if(out==null)throw new IOException();out.write(text.getBytes(StandardCharsets.UTF_8));out.flush();}event("exported","Sauvegarde chiffrée enregistrée.",null);}
   else{String read;try(InputStream in=activity.getContentResolver().openInputStream(uri);ByteArrayOutputStream out=new ByteArrayOutputStream()){if(in==null)throw new IOException();byte[] b=new byte[16384];int n;while((n=in.read(b))!=-1){if(out.size()+n>MAX)throw new IOException("Taille");out.write(b,0,n);}read=out.toString("UTF-8");}event("imported","Fichier chargé, encore non restauré.",new JSONObject().put("encrypted",read));}
  }catch(Exception e){event("error","Le fichier n'a pas pu être lu ou enregistré. Données de Bonze conservées.",null);}});
 }
 void pause(){gate.lock();event("locked","Administration verrouillée.",null);}
 void destroy(){destroyed=true;gate.cancel();payload="";document.cancel();io.shutdown();}
 private void event(String type,String message,JSONObject data){activity.runOnUiThread(()->{if(destroyed)return;try{JSONObject e=new JSONObject().put("type",type).put("message",message);if(data!=null)e.put("data",data);web.evaluateJavascript("window.BonzeAdminEvent&&window.BonzeAdminEvent("+e+")",null);}catch(JSONException ignored){}});}
}

