import runpy,unittest
module=runpy.run_path('scripts/prepare-piper-lexicon.py');convert=module['convert'];french_units=module['french_units']
class LexiconTest(unittest.TestCase):
 def test_combining_nasal_is_split_without_losing_it(self):
  out=convert(['bon\tb ɔ̃','bad\tb ?','bon\tz'],{'b','ɔ','̃','z'})
  self.assertEqual(out,{'bon':['b','ɔ','̃']})
 def test_existing_multi_codepoint_token_is_preserved(self):
  self.assertEqual(convert(['bon\tb ɔ̃'],{'b','ɔ̃'}),{'bon':['b','ɔ̃']})
 def test_french_training_conventions_and_stress(self):
  self.assertEqual(french_units('suis',['s','ɥ','i']),['s','y','ˈ','i'])
  self.assertEqual(french_units('compagnon',['k','ɔ̃','p','a','ɲ','ɔ̃']),['k','ɔ̃','p','a','n','j','ˈ','ɔ̃'])
  self.assertEqual(french_units('je',['ʒ','ə']),['ʒ','ə'])
if __name__=='__main__':unittest.main()
