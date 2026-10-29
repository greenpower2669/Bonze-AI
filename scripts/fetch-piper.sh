#!/usr/bin/env bash
set -euo pipefail
mkdir -p android/app/libs android/app/src/main/assets/piper /tmp/bonze-piper-voice /tmp/bonze-piper-lex
curl -fL --retry 3 https://github.com/k2-fsa/sherpa-onnx/releases/download/v2.0.1/sherpa-onnx-2.0.1.aar -o android/app/libs/sherpa-onnx-2.0.1.aar
echo 'a8d09d1d32f3eb8520482c6d3d43fae674681c5b050385967c70a3c2c9bf0ee7  android/app/libs/sherpa-onnx-2.0.1.aar' | sha256sum -c
curl -fL --retry 3 https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-fr_FR-siwis-medium-int8.tar.bz2 -o /tmp/bonze-piper-voice.tar.bz2
echo '3909cff9b3cfd4820c66aa13bf554315c82e34899c161f0b446ece372bc4b5ec  /tmp/bonze-piper-voice.tar.bz2' | sha256sum -c
curl -fL --retry 3 https://github.com/AACTools/voicegarden-lexicons/releases/download/v0.3.1/fr.tar.gz -o /tmp/bonze-piper-lex.tar.gz
echo 'bceed22dc3bcceaf922bec81e81bd7999e08f858bd04690c647d8b4e685fa7b4  /tmp/bonze-piper-lex.tar.gz' | sha256sum -c
tar xf /tmp/bonze-piper-voice.tar.bz2 -C /tmp/bonze-piper-voice
tar xf /tmp/bonze-piper-lex.tar.gz -C /tmp/bonze-piper-lex
# Whitelist only. Never embed espeak-ng-data from the original voice archive.
cp "$(find /tmp/bonze-piper-voice -name '*.onnx' -print -quit)" android/app/src/main/assets/piper/voice.onnx
cp "$(find /tmp/bonze-piper-voice -name tokens.txt -print -quit)" android/app/src/main/assets/piper/tokens.txt
cp "$(find /tmp/bonze-piper-voice -name MODEL_CARD -print -quit)" android/app/src/main/assets/piper/MODEL_CARD
cp "$(find /tmp/bonze-piper-lex -name lexicon.txt -print -quit)" android/app/src/main/assets/piper/lexicon.txt
cp "$(find /tmp/bonze-piper-lex -name NOTICE -print -quit)" android/app/src/main/assets/piper/LEXICON_NOTICE
# Application names, explicitly authored IPA additions.
printf '\nbonze\tb ɔ̃ z\nai\ta i\n' >> android/app/src/main/assets/piper/lexicon.txt
if find android/app/src/main/assets/piper -iname '*espeak*' | grep -q .; then exit 1; fi
