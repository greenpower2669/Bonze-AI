package fr.bonzeai.companion;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Bounded French cardinal reading for standalone ASCII integers 0..9999. */
public final class PiperFrenchNumbers {
 private PiperFrenchNumbers(){}
 private static final String[] UNITS={
  "zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf",
  "dix","onze","douze","treize","quatorze","quinze","seize"
 };
 private static final String[] TENS={"","","vingt","trente","quarante","cinquante","soixante"};
 private static final Pattern INT=Pattern.compile("(?<![\\p{L}\\p{N}])([0-9]{1,4})(?![\\p{L}\\p{N}])");
 private static final Pattern FRACTION=Pattern.compile("[0-9][.,][0-9]");
 public static String cardinal(int n){
  if(n<0||n>9999)throw new IllegalArgumentException("lexicon-number-range");
  if(n<17)return UNITS[n];
  if(n<20)return "dix "+UNITS[n-10];
  if(n<70){
   int dec=n/10,unit=n%10;
   return TENS[dec]+(unit==0?"":unit==1?" et un":" "+UNITS[unit]);
  }
  if(n<80)return "soixante "+(n==71?"et onze":cardinal(n-60));
  if(n<100){
   int rest=n-80;
   return "quatre "+(rest==0?"vingts":"vingt "+cardinal(rest));
  }
  if(n<1000){
   int cent=n/100,rest=n%100;
   return (cent==1?"cent":UNITS[cent]+" cent"+(rest==0?"s":""))
     +(rest==0?"":" "+cardinal(rest));
  }
  int mille=n/1000,rest=n%1000;
  return (mille==1?"mille":UNITS[mille]+" mille")
    +(rest==0?"":" "+cardinal(rest));
 }
 public static String expand(String input){
  if(input==null||input.length()>1200)throw new IllegalArgumentException("lexicon-number-range");
  if(FRACTION.matcher(input).find())throw new IllegalArgumentException("lexicon-number-format");
  Matcher words=INT.matcher(input);
  StringBuffer result=new StringBuffer();
  while(words.find()){
   String digits=words.group(1),replacement;
   if(digits.length()>1&&digits.charAt(0)=='0'){
    StringBuilder spelled=new StringBuilder();
    for(int i=0;i<digits.length();i++){
     if(i>0)spelled.append(' ');
     spelled.append(UNITS[digits.charAt(i)-'0']);
    }
    replacement=spelled.toString();
   }else replacement=cardinal(Integer.parseInt(digits));
   words.appendReplacement(result,Matcher.quoteReplacement(replacement));
  }
  words.appendTail(result);
  // Prevent accidentally dropping or misreading unsupported Unicode digits,
  // thousands separators or an identifier such as "A123".
  if(result.toString().codePoints().anyMatch(Character::isDigit))
   throw new IllegalArgumentException("lexicon-number-format");
  return result.toString();
 }
}
