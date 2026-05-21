# Audio einsprechen

Die App ist bereits so verdrahtet, dass sie neue Sprachdateien automatisch nutzt, sobald sie unter [public/audio](C:/ai/schildkroetenklasse-einmaleins-pwa/samuel-einmaleins-pwa/public/audio) liegen. Solange Dateien fehlen, faellt die App sauber auf Sprechblase + Textfeedback zurueck.

Bereits vorhanden und verdrahtet:
- Start, Ready, Input-Warnung, mehrere Lob-Cues, Finish-Cues
- Referenz: [public/audio/audio_readme.md](C:/ai/schildkroetenklasse-einmaleins-pwa/samuel-einmaleins-pwa/public/audio/audio_readme.md)

Neu verdrahtet und jetzt mit Datei vorgesehen:
- `wrongGentle`: [Guter Versuch schau noch mal.wav](C:/ai/schildkroetenklasse-einmaleins-pwa/samuel-einmaleins-pwa/public/audio/Guter%20Versuch%20schau%20noch%20mal.wav)
- `wrongGentle` alternativ: [Guter Versuch schau noch mal.mp3](C:/ai/schildkroetenklasse-einmaleins-pwa/samuel-einmaleins-pwa/public/audio/Guter%20Versuch%20schau%20noch%20mal.mp3)
- `wrongSteady`: [Ganz ruhig probier es noch einmal.wav](C:/ai/schildkroetenklasse-einmaleins-pwa/samuel-einmaleins-pwa/public/audio/Ganz%20ruhig%20probier%20es%20noch%20einmal.wav)
- `wrongSteady` alternativ: [Ganz ruhig probier es noch einmal.mp3](C:/ai/schildkroetenklasse-einmaleins-pwa/samuel-einmaleins-pwa/public/audio/Ganz%20ruhig%20probier%20es%20noch%20einmal.mp3)
- `typedCelebrate`: [Stark du hast die Antwort selbst eingetippt.wav](C:/ai/schildkroetenklasse-einmaleins-pwa/samuel-einmaleins-pwa/public/audio/Stark%20du%20hast%20die%20Antwort%20selbst%20eingetippt.wav)
- `typedCelebrate` alternativ: [Stark du hast die Antwort selbst eingetippt.mp3](C:/ai/schildkroetenklasse-einmaleins-pwa/samuel-einmaleins-pwa/public/audio/Stark%20du%20hast%20die%20Antwort%20selbst%20eingetippt.mp3)
- `typedUnlocked`: [Neue Herausforderung freigeschaltet Tippen.wav](C:/ai/schildkroetenklasse-einmaleins-pwa/samuel-einmaleins-pwa/public/audio/Neue%20Herausforderung%20freigeschaltet%20Tippen.wav)
- `typedUnlocked` alternativ: [Neue Herausforderung freigeschaltet Tippen.mp3](C:/ai/schildkroetenklasse-einmaleins-pwa/samuel-einmaleins-pwa/public/audio/Neue%20Herausforderung%20freigeschaltet%20Tippen.mp3)

Empfohlene Reihenfolge, falls spaeter weitere Varianten dazukommen:
1. `wrongGentle`
2. `wrongSteady`
3. `typedUnlocked`
4. `typedCelebrate`

Hinweis fuer spaeter:
- Eine Datei pro Cue reicht. Die App probiert erst `.wav`, dann `.mp3`, falls beides eingetragen ist.
- Die Dateinamen muessen exakt so bleiben wie oben, dann ist kein weiterer Codeaenderungsbedarf noetig.
