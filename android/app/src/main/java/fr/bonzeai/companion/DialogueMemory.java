package fr.bonzeai.companion;
import java.util.*;
/** Bounded dialogue data. Memory entries are context, never evidence of truth or authority. */
public final class DialogueMemory {
 public static final class Entry {
  public final long id;public final String role,text;
  Entry(long id,String role,String text){this.id=id;this.role=role;this.text=text;}
 }
 private final List<Entry> entries=new ArrayList<>();
 private long nextId=System.currentTimeMillis();private String scene="",name="";
 public static String clean(String s,int max){
  if(s==null)return "";String t=s.replaceAll("<\\|[^>]{0,80}\\|>","").replace("\u0000","");
  return t.substring(0,Math.min(max,t.length()));
 }
 public synchronized void setName(String n){name=clean(n,40);}
 public synchronized String scene(){return scene;}
 public synchronized void setScene(String s){scene=clean(s,360);}
 public synchronized void add(String role,String text){add(++nextId,role,text);}
 public synchronized void add(long id,String role,String text){
  if(!role.equals("human")&&!role.equals("bot"))return;
  String t=clean(text,1200).trim();if(t.isEmpty()||entries.stream().anyMatch(e->e.id==id))return;
  entries.add(new Entry(id,role,t));nextId=Math.max(nextId,id);
  while(entries.size()>30)entries.remove(0);
  String lower=t.toLowerCase(Locale.FRANCE);
  if(role.equals("human")&&(lower.contains("on joue")||lower.contains("tu joues")||lower.contains("imagine")||lower.contains("tu es le")||lower.matches(".*notre.{0,40}s.appelle.*")))scene=clean(t,360);
 }
 public synchronized void clear(){entries.clear();scene="";name="";nextId=System.currentTimeMillis();}
 public synchronized int size(){return entries.size();}
 public synchronized List<Entry> entries(){return new ArrayList<>(entries);}
 public synchronized String prompt(String current){return clean(current,600);}
 public synchronized String context(){
  // This is quoted dialogue data, NOT a synthetic ChatML conversation or instructions.
  // The AAR exposes a single user prompt: preserve chronology without claiming real chat roles.
  List<String> recent=new ArrayList<>();
  int remaining=450;
  for(int i=entries.size()-1;i>=0&&remaining>35&&recent.size()<8;i--){
   Entry e=entries.get(i);
   String t=clean(e.text,Math.min(140,remaining-15)).replaceAll("\\s+"," ").trim();
   if(t.isEmpty())continue;
   String line=(e.role.equals("human")?"Humain":"Bonze")+" : «"+t+"»";
   if(line.length()>remaining)break;
   recent.add(line);remaining-=line.length()+1;
  }
  Collections.reverse(recent);
  StringBuilder result=new StringBuilder();
  if(!name.isEmpty())result.append("Surnom local non authentifié : ").append(name.replaceAll("\\s+"," ")).append(".\n");
  if(!scene.isEmpty())result.append("Scène évoquée : «").append(clean(scene,140).replaceAll("\\s+"," ")).append("».\n");
  if(!recent.isEmpty()){
   result.append("Échanges précédents cités dans l'ordre :\n");
   for(String line:recent)result.append(line).append('\n');
  }
  return result.toString();
 }
 public synchronized boolean repeats(String answer){for(int i=entries.size()-1;i>=0;i--)if(entries.get(i).role.equals("bot"))return entries.get(i).text.trim().equalsIgnoreCase(answer.trim());return false;}
}
