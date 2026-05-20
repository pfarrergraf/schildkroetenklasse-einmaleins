Du bist Senior React/PWA-Entwickler. Integriere das Paket `schildi-20-belohnungen-animation-pack` in das bestehende Repository `schildkroetenklasse-einmaleins`.

Arbeite zuerst sicher:
- `git status --short`
- `git branch --show-current`
- kein Refactoring der Schildi-/Audio-/Lip-Sync-Logik

Aufgaben:
1. Kopiere `assets/dinos`, `public/audio/rewards`, `src/features/dinoAnimations`.
2. Importiere `dinoAnimationStyles.css` in `src/main.jsx`.
3. Prüfe, ob `src/features/rewards` bereits existiert. Falls ja: nicht blind überschreiben, sondern `rewardCatalog.js` mergen.
4. Ersetze Reward-Platzhalter im Belohnungsdialog durch `<DinoAnimation dinoId={reward.dinoId} />`.
5. Beim Auswählen eines Dinos `playDinoSound(reward.dinoId, soundEnabled)` verwenden.
6. Sorge dafür, dass die Sammlung 20 Belohnungen anzeigt.
7. Keine neuen Dependencies. Keine Änderung am GitHub-Pages-Base-Pfad.
8. Danach `npm run build` ausführen.

Ausgabe:
- geänderte Dateien
- gemergte Dateien
- Testbefund
- GitHub-Pages-Hinweis
