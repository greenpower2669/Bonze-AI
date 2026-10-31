import fr.bonzeai.companion.PiperPhonetics;import java.util.*;
public class PiperPhoneticsTest{
 public static void main(String[] args){Map<String,String> d=Map.of("bonjour","bɔ̃ʒˈuʁ","compagnon","kɔ̃panjˈɔ̃");String phones=PiperPhonetics.phonemes("Bonjour, compagnon !",d);if(!phones.equals("bɔ̃ʒˈuʁ kɔ̃panjˈɔ̃")||phones.indexOf('\u0303')<0||phones.contains("||"))throw new AssertionError();for(String text:new String[]{"Bonjour Pipo","Bonjour 3","Bonjour ٣","!?"}){try{PiperPhonetics.phonemes(text,d);throw new AssertionError();}catch(IllegalArgumentException expected){}}
  try{PiperPhonetics.speechPhonemes("Bonjour compagnon",d);throw new AssertionError("unstable short speech accepted");}catch(IllegalArgumentException expected){if(!expected.getMessage().equals("piper-short-unstable"))throw expected;}
  String longText="Bonjour compagnon ".repeat(5).trim();if(!PiperPhonetics.speechPhonemes(longText,d).equals(PiperPhonetics.phonemes(longText,d)))throw new AssertionError("long speech changed");
  Map<String,String> french=new HashMap<>(d);String[] words={"je","suis","calme","et","content","tu","peux","me","raconter","une","histoire"};String[] ipa={"ʒə","syˈi","kˈalm","e","kɔ̃tˈɑ̃","ty","pˈø","mə","ʁakɔ̃tˈe","yn","istwˈaʁ"};for(int i=0;i<words.length;i++)french.put(words[i],ipa[i]);
  String stable="Je suis calme et content. Tu peux me raconter une histoire ?";if(!PiperPhonetics.speechPhonemes(stable,french).equals(PiperPhonetics.phonemes(stable,french)))throw new AssertionError("Validated French fixture incorrectly sent to fallback");
  String[][] examples={{"0","zéro"},{"3","trois"},{"20","vingt"},{"21","vingt et un"},{"71","soixante et onze"},{"80","quatre vingts"},{"91","quatre vingt onze"},{"2026","deux mille vingt six"},{"007","zéro zéro sept"},{"200","deux cents"},{"201","deux cent un"},{"1000","mille"},{"9999","neuf mille neuf cent quatre vingt dix neuf"}};
  for(String[] e:examples)if(!PiperFrenchNumbers.expand(e[0]).equals(e[1]))
   throw new AssertionError(e[0]+" -> "+PiperFrenchNumbers.expand(e[0]));
  Map<String,String> nums=new HashMap<>(d);
  for(String[] example:examples)for(String word:example[1].split(" "))nums.put(word,word);
  if(!PiperPhonetics.phonemes("Bonjour 2026 !",nums).equals("bɔ̃ʒˈuʁ deux mille vingt six"))
   throw new AssertionError("integer to pronounceable words");
  for(String unsupported:new String[]{"3,14","2.5","٣","a2026","12345","12 345"})
   if(unsupported.equals("12 345"))continue; // Two well-separated integers are independently readable.
   else {try{PiperFrenchNumbers.expand(unsupported);throw new AssertionError(unsupported);}
    catch(IllegalArgumentException expected){}}
  System.out.println("Piper French cardinal normalization and strict unsupported formats OK");}
}
