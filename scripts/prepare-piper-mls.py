"""Add sherpa metadata and token map to unchanged Piper MLS weights.
Metadata scheme follows k2-fsa/sherpa-onnx scripts/piper/add_meta_data.py v2.0.1.
Bonze adaptation: pinned French MLS model, no phonemizer dependency, no weight retraining.
"""
import json,pathlib,onnx
root=pathlib.Path('android/app/src/main/assets/piper')
config=json.loads((root/'voice.onnx.json').read_text())
assert config['num_speakers']==125 and config['audio']['sample_rate']==22050
with (root/'tokens.txt').open('w') as out:
 for symbol,ids in config['phoneme_id_map'].items():
  if symbol=='\n':continue
  assert isinstance(ids,list) and len(ids)==1
  out.write(f'{symbol} {ids[0]}\n')
model=onnx.load(root/'voice.onnx')
del model.metadata_props[:]
for key,value in dict(model_type='vits',comment='piper',language='French',voice='fr',version=1,has_espeak=1,has_g2pw=0,n_speakers=125,sample_rate=22050).items():
 prop=model.metadata_props.add();prop.key=key;prop.value=str(value)
onnx.save(model,root/'voice.onnx')
