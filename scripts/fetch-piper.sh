#!/usr/bin/env bash
set -euo pipefail
mkdir -p android/app/libs android/app/src/main/assets/piper /tmp/bonze-piper-voice /tmp/bonze-piper-lex
curl -fL --retry 3 https://github.com/k2-fsa/sherpa-onnx/releases/download/v2.0.1/sherpa-onnx-2.0.1.aar -o android/app/libs/sherpa-onnx-2.0.1.aar
echo 'a8d09d1d32f3eb8520482c6d3d43fae674681c5b050385967c70a3c2c9bf0ee7  android/app/libs/sherpa-onnx-2.0.1.aar' | sha256sum -c
# MLS was trained from scratch on CC-BY-4.0 data (no Lessac/Ryan fine-tuning).
curl -fL --retry 3 https://huggingface.co/rhasspy/piper-voices/resolve/7e8200c/fr/fr_FR/mls/medium/fr_FR-mls-medium.onnx -o android/app/src/main/assets/piper/voice.onnx
echo '0ed223f78466917f2bae05ee90096ce69ab1fdeb251f55590d0e7422d234e162  android/app/src/main/assets/piper/voice.onnx' | sha256sum -c
curl -fL --retry 3 https://huggingface.co/rhasspy/piper-voices/resolve/7e8200c/fr/fr_FR/mls/medium/fr_FR-mls-medium.onnx.json -o android/app/src/main/assets/piper/voice.onnx.json
curl -fL --retry 3 https://huggingface.co/rhasspy/piper-voices/resolve/7e8200c/fr/fr_FR/mls/medium/MODEL_CARD -o android/app/src/main/assets/piper/MODEL_CARD
python -m pip install onnx==1.19.1
python scripts/prepare-piper-mls.py
curl -fL --retry 3 https://github.com/AACTools/voicegarden-lexicons/releases/download/v0.3.1/fr.tar.gz -o /tmp/bonze-piper-lex.tar.gz
echo 'bceed22dc3bcceaf922bec81e81bd7999e08f858bd04690c647d8b4e685fa7b4  /tmp/bonze-piper-lex.tar.gz' | sha256sum -c
tar xf /tmp/bonze-piper-lex.tar.gz -C /tmp/bonze-piper-lex
# Only this lexicon and notices, no eSpeak data or external binary phonemizer.
cp "$(find /tmp/bonze-piper-lex -name lexicon.txt -print -quit)" android/app/src/main/assets/piper/lexicon.txt
cp "$(find /tmp/bonze-piper-lex -name NOTICE -print -quit)" android/app/src/main/assets/piper/LEXICON_NOTICE
# Application names, explicitly authored IPA additions.
printf '\nbonze\tb ɔ̃ z\n' >> android/app/src/main/assets/piper/lexicon.txt
python scripts/prepare-piper-lexicon.py
if find android/app/src/main/assets/piper -iname '*espeak*' | grep -q .; then exit 1; fi
