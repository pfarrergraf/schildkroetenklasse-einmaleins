# Schildi-Audio

Die App sucht die Audiodateien automatisch in diesem Ordner: `public/audio/`

## So funktioniert es

1. Sprich den Text aus einer `.txt`-Datei mit deiner eigenen Stimme ein.
2. Speichere die Aufnahme mit exakt demselben Dateinamen, aber als `.mp3` oder `.wav`.
3. Du kannst die gleichnamige `.txt`-Datei liegen lassen oder später löschen.

## Beispiele

- `Ja gut gemacht.txt` -> `Ja gut gemacht.mp3`
- `Probiere es noch einmal.txt` -> `Probiere es noch einmal.wav`
- `Klasse Samuel.txt` -> `Klasse Samuel.mp3`

## Wichtig

- Die App prüft zuerst `.mp3`, dann `.wav`.
- Der Dateiname muss exakt passen, inklusive Leerzeichen.
- Umlaute wurden absichtlich aus den Dateinamen herausgenommen, damit die Dateien auf allen Systemen unkompliziert bleiben.
- Wenn keine passende Audiodatei gefunden wird, verwendet die App automatisch weiter die Browser-Stimme.

## Nach dem Austauschen testen

Im Projektordner ausführen:

```bash
npm run dev
```

Dann im Browser eine richtige und eine falsche Antwort anklicken und prüfen, ob deine Aufnahme abgespielt wird.
