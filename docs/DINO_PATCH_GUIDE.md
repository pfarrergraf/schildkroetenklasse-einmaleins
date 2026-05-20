# Dino Patch Guide

## Zielbild

Der Belohnungsdialog soll nicht mehr abstrakte gruen-orangene Platzhalter zeigen, sondern echte Dinos, die zu den Namen passen.

## Wichtigste Codestellen

- `src/App.jsx`: Reward-State, Modal, Sammlung, Handler.
- `src/features/rewards/rewardCatalog.js`: echte Dino-Metadaten.
- `src/features/rewards/AnimatedDino.jsx`: Anzeige und Sound-Button.
- `src/features/rewards/dinoRewardStyles.css`: Animationen.
- `public/rewards/dinos/`: transparente SVG-Dateien.
- `public/audio/rewards/`: Dino-Sounds.

## Minimaler Akzeptanztest

1. App starten.
2. Eine perfekte Runde simulieren oder spielen.
3. Reward-Modal pruefen: Dinos muessen als Brontosaurus, Triceratops usw. erkennbar sein.
4. Dino-Sound nach Klick pruefen.
5. Dino auswaehlen.
6. Sammlung oeffnen und Persistenz nach Reload pruefen.
