import fr.bonzeai.companion.PiperPhonetics;import java.util.*;
public class PiperPhoneticsTest{
 public static void main(String[] args){Map<String,String> d=Map.of("bonjour","bɔ̃ʒˈuʁ","compagnon","kɔ̃panjˈɔ̃");String phones=PiperPhonetics.phonemes("Bonjour, compagnon !",d);if(!phones.equals("bɔ̃ʒˈuʁ kɔ̃panjˈɔ̃")||phones.indexOf('\u0303')<0||phones.contains("||"))throw new AssertionError();for(String text:new String[]{"Bonjour Pipo","Bonjour 3","Bonjour ٣","!?"}){try{PiperPhonetics.phonemes(text,d);throw new AssertionError();}catch(IllegalArgumentException expected){}}
  try{PiperPhonetics.speechPhonemes("Bonjour compagnon",d);throw new AssertionError("unstable short speech accepted");}catch(IllegalArgumentException expected){if(!expected.getMessage().equals("piper-short-unstable"))throw expected;}
  String longText="Bonjour compagnon ".repeat(5).trim();if(!PiperPhonetics.speechPhonemes(longText,d).equals(PiperPhonetics.phonemes(longText,d)))throw new AssertionError("long speech changed");
  Map<String,String> french=new HashMap<>(d);String[] words={"je","suis","calme","et","content","tu","peux","me","raconter","une","histoire"};String[] ipa={"ʒə","syˈi","kˈalm","e","kɔ̃tˈɑ̃","ty","pˈø","mə","ʁakɔ̃tˈe","yn","istwˈaʁ"};for(int i=0;i<words.length;i++)french.put(words[i],ipa[i]);
  String stable="Je suis calme et content. Tu peux me raconter une histoire ?";if(!PiperPhonetics.speechPhonemes(stable,french).equals(PiperPhonetics.phonemes(stable,french)))throw new AssertionError("Validated French fixture incorrectly sent to fallback");
  System.out.println("Bounded IPA preserves nasal codepoints, spaces, OOV and unstable-short rejection");}
}
