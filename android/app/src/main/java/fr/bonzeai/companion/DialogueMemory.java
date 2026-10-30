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
 public synchronized String context(){StringBuilder prior=new StringBuilder();int remaining=500;for(int i=entries.size()-1;i>=0&&remaining>40;i--){Entry e=entries.get(i);if(!e.role.equals("human"))continue;String t=clean(e.text,Math.min(180,remaining));prior.insert(0,t+" / ");remaining-=t.length()+3;}return(name.isEmpty()?"":"Ton humain : "+name+". ")+(scene.isEmpty()?"":"Jeu en cours : "+scene+". ")+"Messages précédents : "+prior;}
 public synchronized boolean repeats(String answer){for(int i=entries.size()-1;i>=0;i--)if(entries.get(i).role.equals("bot"))return entries.get(i).text.trim().equalsIgnoreCase(answer.trim());return false;}
}
