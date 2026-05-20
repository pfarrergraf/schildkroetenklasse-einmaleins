# Integration: echte Dino-Render-Serien, keine Platzhalter

Dieses Paket ersetzt die bisherigen Dino-Platzhalter durch echte realitätsnahe Render-Frame-Serien.

## Enthalten

- Brachiosaurus altithorax: 6 PNG-Frames
- Triceratops horridus: 6 PNG-Frames
- Pteranodon longiceps: 6 PNG-Frames

## Nicht enthalten

Keine weiteren Dinos als Platzhalter. Keine SVG-Monster. Keine Fake-Grafiken.

## Kopieren ins Repo

```text
assets/rewards/prehistoric/      -> assets/rewards/prehistoric/
src/features/dinoAnimations/     -> src/features/dinoAnimations/
src/features/rewards/rewardCatalog.js -> src/features/rewards/rewardCatalog.js
src/features/rewards/dinoSound.js     -> src/features/rewards/dinoSound.js
```

## Codex-Auftrag

```text
Lies INTEGRATION_INSTRUCTION_REAL_RENDER_SERIES_ONLY.md.
Integriere nur die echten Dino-Render-Serien.
Entferne oder überschreibe alle alten Dino-Platzhalter-Grafiken aus dem Reward-Katalog.
Keine zusätzlichen Platzhalter erzeugen.
Keine neuen Dependencies.
Bestehende Schildi-Animationen, Lip-Sync und PWA-Logik nicht umbauen.
Danach npm run build ausführen.
```

## Erwartung

Nach 10/10 werden nur diese drei echten Belohnungen angeboten, bis weitere echte Render-Sets vorhanden sind.
