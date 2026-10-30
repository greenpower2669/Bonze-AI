package fr.bonzeai.companion;

import android.content.Context;
import android.app.ActivityManager;
import android.net.Uri;
import android.os.StatFs;
import java.io.*;
import java.security.MessageDigest;
import java.util.Locale;

/** Offline, explicit model import. No URLs, network permission, or arbitrary model paths. */
public final class LocalModelStore {
 public static final String SMALL="230m",LARGE="12b";
 public static final String LARGE_FILE="LFM2.5-1.2B-Instruct-Q4_K_M.gguf";
 public static final String LARGE_SHA256="b1b3de114215d9507409a662a501a631095a479a419584e8a2ded6304b19b4f5";
 private static final long MIN_BYTES=680_000_000L,MAX_BYTES=830_000_000L;
 private LocalModelStore(){}
 public static File destination(Context context){return new File(new File(context.getFilesDir(),"gguf"),LARGE_FILE);}
 public static boolean available(Context context){
  File file=destination(context);
  // Trust the verified marker only after an atomic file rename in private app storage.
  return file.isFile()&&file.length()>=MIN_BYTES&&file.length()<=MAX_BYTES
   &&context.getSharedPreferences("bonze-conversation-v1",Context.MODE_PRIVATE)
     .getString("largeModelSha","").equals(LARGE_SHA256);
 }
 /**
  * Conservative admission guard only; not a prediction of peak llama/Piper memory.
  * A passing check never proves that Android can load the model safely.
  */
 public static boolean memoryAdmitsLarge(Context context){
  ActivityManager manager=(ActivityManager)context.getSystemService(Context.ACTIVITY_SERVICE);
  if(manager==null)return false;
  ActivityManager.MemoryInfo info=new ActivityManager.MemoryInfo();manager.getMemoryInfo(info);
  return !info.lowMemory&&info.availMem>=1_250_000_000L;
 }
 public static String choice(Context context){
  String selected=context.getSharedPreferences("bonze-conversation-v1",Context.MODE_PRIVATE).getString("modelChoice",SMALL);
  return LARGE.equals(selected)&&available(context)?LARGE:SMALL;
 }
 public static String install(Context context,Uri uri)throws Exception{
  if(uri==null||!"content".equals(uri.getScheme()))throw new IOException("Source locale SAF uniquement");
  if(available(context))return "Liquid 1.2B est déjà installé et vérifié : aucun remplacement nécessaire.";
  File dest=destination(context),folder=dest.getParentFile();
  if(!folder.isDirectory()&&!folder.mkdirs())throw new IOException("Dossier de modèles inaccessible");
  StatFs fs=new StatFs(folder.getAbsolutePath());
  if(fs.getAvailableBytes()<1_200_000_000L)throw new IOException("Espace insuffisant : prévoir au moins 1,2 Go libres");
  File temp=new File(folder,LARGE_FILE+".import");
  MessageDigest digest=MessageDigest.getInstance("SHA-256");
  long bytes=0;
  try{
   try(InputStream in=context.getContentResolver().openInputStream(uri);
       FileOutputStream out=new FileOutputStream(temp)){
    if(in==null)throw new IOException("Fichier inaccessible");
    byte[] chunk=new byte[65536];int len;
    while((len=in.read(chunk))!=-1){
     if(Thread.currentThread().isInterrupted())throw new IOException("Import interrompu");
     bytes+=len;
     if(bytes>MAX_BYTES)throw new IOException("Fichier GGUF trop volumineux");
     digest.update(chunk,0,len);out.write(chunk,0,len);
    }
    out.getFD().sync();
   }
   if(bytes<MIN_BYTES)throw new IOException("Fichier GGUF incomplet");
   StringBuilder hex=new StringBuilder();
   for(byte b:digest.digest())hex.append(String.format(Locale.ROOT,"%02x",b&255));
   if(!LARGE_SHA256.equals(hex.toString()))throw new IOException("Empreinte SHA-256 invalide : fichier refusé");
   // Do not clobber a valid existing model when a new import fails.
   if(dest.exists()&&!dest.delete())throw new IOException("Ancien modèle verrouillé");
   if(!temp.renameTo(dest))throw new IOException("Import atomique impossible");
   if(!context.getSharedPreferences("bonze-conversation-v1",Context.MODE_PRIVATE)
       .edit().putString("largeModelSha",LARGE_SHA256).commit())throw new IOException("Validation persistante impossible");
   return "Liquid 1.2B Q4 vérifié et installé localement ("+bytes+" octets).";
  }finally{temp.delete();}
 }
}
