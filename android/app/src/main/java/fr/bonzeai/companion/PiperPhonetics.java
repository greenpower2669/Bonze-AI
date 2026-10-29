package fr.bonzeai.companion;
import java.util.*;import java.util.regex.*;
/** Bounded dictionary transcription. Returns bare IPA, runtime owns BOS/pad/EOS. */
public final class PiperPhonetics {
 private static final Pattern WORD=Pattern.compile("\\p{L}+");
 public static String phonemes(String text,Map<String,String> dictionary){
  if(text.codePoints().anyMatch(Character::isDigit))throw new IllegalArgumentException("lexicon-number");
  Matcher words=WORD.matcher(text.toLowerCase(Locale.FRANCE));StringBuilder out=new StringBuilder();
  while(words.find()){String p=dictionary.get(words.group());if(p==null||p.isEmpty())throw new IllegalArgumentException("lexicon-oov");if(out.length()>0)out.append(' ');out.append(p);}
  if(out.length()==0)throw new IllegalArgumentException("lexicon-empty");return out.toString();
 }
}
