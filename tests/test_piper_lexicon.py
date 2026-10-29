import runpy,unittest
convert=runpy.run_path('scripts/prepare-piper-lexicon.py')['convert']
class LexiconTest(unittest.TestCase):
 def test_combining_nasal_is_split_without_losing_it(self):
  out=convert(['bon\tb ɔ̃','bad\tb ?','bon\tz'],{'b','ɔ','̃','z'})
  self.assertEqual(out,{'bon':['b','ɔ','̃']})
 def test_existing_multi_codepoint_token_is_preserved(self):
  self.assertEqual(convert(['bon\tb ɔ̃'],{'b','ɔ̃'}),{'bon':['b','ɔ̃']})
if __name__=='__main__':unittest.main()
