"""Convert lexicon IPA units to the actual Piper model token alphabet.
Never drop an unknown phoneme: exclude that word so Android can pronounce it instead.
"""
import pathlib

def convert(lines,alphabet):
 result={}
 for line in lines:
  fields=line.split(maxsplit=1)
  if len(fields)!=2:continue
  word,pronunciation=fields;tokens=[]
  for unit in pronunciation.split():
   if unit in alphabet:tokens.append(unit)
   elif all(char in alphabet for char in unit):tokens.extend(unit)
   else:break
  else:
   if tokens and word not in result:result[word]=tokens
 return result

if __name__=='__main__':
 root=pathlib.Path('android/app/src/main/assets/piper')
 alphabet={line.rsplit(' ',1)[0] for line in (root/'tokens.txt').read_text().splitlines()}
 source=(root/'lexicon.txt').read_text().splitlines();result=convert(source,alphabet)
 assert len(result)>70000
 for word in 'bonjour je suis ton petit compagnon tu veux jouer avec moi bonze'.split():assert word in result,word
 (root/'lexicon.txt').write_text(''.join(word+' || '+' '.join(tokens)+'\n' for word,tokens in result.items()))
 print('PIPER_LEXICON',len(source),'source entries;',len(result),'model-compatible entries; others fall back')
