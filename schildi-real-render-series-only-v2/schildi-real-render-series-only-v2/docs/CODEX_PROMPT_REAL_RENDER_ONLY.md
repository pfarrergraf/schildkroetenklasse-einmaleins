Du bist Senior React/PWA-Entwickler.

Ziel:
Integriere ausschließlich echte realitätsnahe Dino-Render-Serien in das bestehende Belohnungssystem.

Regeln:
- Keine Platzhalter.
- Keine SVG-Monster.
- Keine Dummy-Dinos.
- Keine neuen Dependencies.
- Schildi-Animation, Schildi-Audio, Lip-Sync und PWA-Base-Pfad nicht umbauen.
- Bestehende App-Funktion erhalten.

Dateien aus diesem Paket:
- assets/rewards/prehistoric/*
- src/features/dinoAnimations/*
- src/features/rewards/rewardCatalog.js
- src/features/rewards/dinoSound.js

Aufgaben:
1. Kopiere die Assets und Module ins Repo.
2. Stelle sicher, dass `DinoAnimation` über `import.meta.glob("../../../assets/rewards/prehistoric/*/frame_*.png")` lädt.
3. Stelle sicher, dass der Reward-Katalog nur echte `assetReady: true` Rewards enthält.
4. Entferne alte Platzhalter-Dino-SVGs aus dem sichtbaren Reward-Flow.
5. Prüfe, dass RewardChoiceModal und CollectionView weiterhin funktionieren.
6. Führe `npm run build` aus.
7. Berichte geänderte Dateien und Testergebnis.
