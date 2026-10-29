import fr.bonzeai.companion.PiperPhonetics;import java.util.*;
public class PiperPhoneticsTest{
 public static void main(String[] args){Map<String,String> d=Map.of("bonjour","bɔ̃ʒˈuʁ","compagnon","kɔ̃panjˈɔ̃");String phones=PiperPhonetics.phonemes("Bonjour, compagnon !",d);if(!phones.equals("bɔ̃ʒˈuʁ kɔ̃panjˈɔ̃")||phones.indexOf('\u0303')<0||phones.contains("||"))throw new AssertionError();for(String text:new String[]{"Bonjour Pipo","Bonjour 3","Bonjour ٣","!?"}){try{PiperPhonetics.phonemes(text,d);throw new AssertionError();}catch(IllegalArgumentException expected){}}System.out.println("Bounded IPA preserves nasal codepoints, spaces and whole-utterance OOV rejection");}
}
