Original prompt: Direkter Umbau der Schildkrötenklasse-PWA zu einer ruhigen, kinderfreundlichen Einmaleins-App mit echter Bild-Schildkröte aus `assets/`, Audio aus `public/audio/`, deutscher Sprechblase mit korrekten Umlauten, Tipp-Eingabe statt Klick-Antworten und anschließender Browser-Prüfung.

2026-05-19
- Vorhandene PNGs geprüft: `Hallo.png`, `gut.png`, `schlecht.png`, `Achtung.png`.
- Vorhandene Audios in `public/audio/` bestätigt, inklusive Mischlage aus `.mp3` und `.wav`.
- Direktumbau gestartet: CSS-Schildkröte wird durch echte Bilder ersetzt, Audio-Mapping toleriert auch alternative Dateinamenschreibweise bei `Probier/Probiere`.
- Cache-Version im Service Worker wird angehoben, damit alte Browserstände weniger wahrscheinlich stören.
- Umbau abgeschlossen: Bild-Schildkröte mit Zuständen `hello`, `idle`, `happy`, `sad`, `warning`, `finish`; ruhige CSS-Bewegungen statt hektischer Effekte; Tipp-Eingabe als Hauptmodus.
- `window.render_game_to_text` und `data-testid` ergänzt, damit Browser-Checks stabil und reproduzierbar laufen.
- Verifiziert mit `npm run build`.
- Verifiziert im Browser auf `http://127.0.0.1:4173`:
  - Initialzustand korrekt.
  - Leere Eingabe wechselt zu `warning` mit deutscher Hinweis-Sprechblase.
  - Richtige Eingabe wechselt zu `happy`, erhöht Punktestand und geht danach weiter zur nächsten Aufgabe.
  - Falsche Eingabe wechselt zu `sad`, zeigt die korrekte Rechnung an und setzt die Serie zurück.
  - Keine neuen Console-Errors im Playwright-Lauf.
- Nach Nutzerfeedback ergänzt:
  - Multiple Choice und Tipp-Eingabe laufen jetzt parallel.
  - Audio wurde von `HEAD`-Suche auf exakte vorgeladene Dateipfade umgestellt.
  - Diagnosefeld `lastSpeechMode` in `render_game_to_text` ergänzt.
  - Im Dev-Browser-Test sprang `lastSpeechMode` bei Warnung und richtiger Antwort jeweils auf `audio-file`, nicht auf `speech-synthesis`.
  - Turtle-PNGs per Rand-Freistellung transparenter gemacht; Originale liegen in `assets/_original_backups/`.
  - `npm run dev` ist jetzt fest auf Port `4173` mit `--strictPort` eingestellt, damit nicht unbemerkt auf einen anderen Port ausgewichen wird.
  - Zusätzliche Skripte `dev:stop` und `dev:restart` ergänzt.
  - Browser-UI zeigt jetzt sichtbar an, ob gerade `Eigene Aufnahme aktiv` ist oder keine passende Audiodatei gefunden wurde.
  - Für `WRONG_TEXT` wird jetzt direkt die vorhandene Datei `Probier es noch einmal.wav` genutzt, statt erst auf eine nicht vorhandene Variante zu zeigen.
  - Bewegungen verstärkt: Bild, Karte, Badge und Sprechblase animieren nun gemeinsam statt nur vertikal zu wackeln.
  - Zwei Screenshots im Abstand von 1,2 s hatten unterschiedliche Hashes; Animation läuft also technisch im Browser.

TODO
- Optional: echte zusätzliche Raster-Zwischenframes erzeugen, falls statt CSS-Bewegung eine noch filmischere Animation gewünscht ist.
- Optional: falls ein Bildrand noch unsauber aussieht, die Freistellung manuell nachpolieren oder echte transparente Quell-PNGs liefern.
