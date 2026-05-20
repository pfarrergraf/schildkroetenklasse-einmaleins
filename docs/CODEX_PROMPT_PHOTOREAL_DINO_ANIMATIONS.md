# Codex-Prompt

Du bist Senior React/Vite/PWA-Entwickler.

Ziel:
Integriere die fotorealistischen Dino-Animationsframes in das bestehende Belohnungssystem der Schildkrötenklasse-App.

Arbeitsregeln:
- Keine Neuschreibung der App.
- Keine neuen Dependencies.
- Bestehende Schildi-/Audio-/Lip-Sync-Logik nicht umbauen.
- GitHub-Pages-Base-Pfad unverändert lassen.
- Kleine, nachvollziehbare Änderungen.
- Am Ende `npm run build` ausführen.

Kontext:
Die bestehende App lädt Schildi-Frames über `import.meta.glob("../assets/.../*.png")` aus dem `assets`-Ordner. Das neue Paket nutzt denselben Gedanken für Dino-Frames unter `assets/dinos/<species-id>/frame_*.png`.

Aufgaben:

1. Prüfe, ob folgende Ordner vorhanden sind:
   - `assets/dinos/brachiosaurus-altithorax/`
   - `assets/dinos/triceratops-horridus/`
   - `assets/dinos/pteranodon-longiceps/`
   - `src/features/dinoAnimations/`
   - `public/audio/rewards/`

2. In `src/main.jsx` ergänze:
   ```js
   import "./features/dinoAnimations/dinoAnimationStyles.css";
   ```

3. Finde die Reward-Auswahl-Komponente und die Sammlungsansicht.
   Ersetze dort statische Platzhalter/Emoji/SVG-Dinos durch:
   ```jsx
   <DinoAnimation speciesId={reward.speciesId} size="card" active={true} />
   ```

4. Erweitere den bestehenden Reward-Katalog:
   - `bruno-bronto` bekommt `speciesId: "brachiosaurus-altithorax"`
   - `trixi-triceratops` bekommt `speciesId: "triceratops-horridus"`
   - `pico-pteranodon` bekommt `speciesId: "pteranodon-longiceps"`

5. Optional:
   Beim Auswählen eines Dinos im Belohnungsmodal `playSound={true}` für den gewählten Dino setzen.

6. Prüfe mobile Darstellung.
   Dino darf Reward-Card nicht sprengen.
   Karten müssen weiterhin antippbar sein.

7. Führe aus:
   ```bash
   npm run build
   ```

Ausgabe:
- geänderte Dateien
- kurze Zusammenfassung
- Build-Ergebnis
- offene Punkte
