Du bist Senior React/PWA-Entwickler. Integriere die neuen echten Dino-Belohnungen in das bestehende Repository `pfarrergraf/schildkroetenklasse-einmaleins`.

Arbeite in Phasen:

1. Erst lesen, nicht aendern:
- INTEGRATION_INSTRUCTION_DINO_ASSETS.md
- docs/DINO_ASSET_OVERVIEW.md
- src/App.jsx
- src/styles.css
- vorhandene Dateien in src/features/rewards, falls vorhanden

2. Vor Aenderungen berichten:
- Welche Reward-Dateien existieren schon?
- Welche neuen Dateien werden kopiert/ersetzt?
- Wo wird App.jsx minimal angepasst?

3. Dann integrieren:
- Echte Dino-SVGs aus public/rewards/dinos verwenden.
- Dino-Sounds aus public/audio/rewards verwenden.
- Keine externen Dependencies.
- Keine bestehende Schildi-Audio-/Lip-Sync-Logik zerlegen.
- Bestehende Bestscore- und PWA-Funktion erhalten.
- GitHub-Pages-Base-Pfad unveraendert lassen.

4. Test:
- npm run build
- Falls Buildfehler: nur die kleinste Ursache beheben.
- Kein Refactoring der ganzen App.

5. Ausgabe:
- Geaenderte Dateien
- Neue Dateien
- Build-Ergebnis
- Kurze manuelle Testanleitung fuer Handy und GitHub Pages
