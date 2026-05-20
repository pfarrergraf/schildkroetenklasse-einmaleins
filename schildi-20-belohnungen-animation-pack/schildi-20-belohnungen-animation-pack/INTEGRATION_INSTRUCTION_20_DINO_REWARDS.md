# Integration: 20 Dino-Belohnungen für die Schildkrötenklasse

## Ziel
Dieses Paket ergänzt die bestehende App um insgesamt 20 sammelbare Urzeit-Belohnungen. Jeder Dino hat 6 PNG-Frames, einen lokalen WAV-Sound und Metadaten mit deutschem Belohnungsnamen plus lateinischem Fachbegriff.

## Kopieren
```text
assets/dinos/                    -> assets/dinos/
public/audio/rewards/            -> public/audio/rewards/
src/features/dinoAnimations/     -> src/features/dinoAnimations/
src/features/rewards/            -> src/features/rewards/  (nur nach Prüfung/ggf. mergen)
docs/                            -> docs/
```

## Wichtig für Codex
1. Keine Neuschreibung von `src/App.jsx`.
2. Bestehende Schildi-Frames, Schildi-Audio und Lip-Sync-Logik nicht umbauen.
3. In `src/main.jsx` zusätzlich importieren:
```js
import "./features/dinoAnimations/dinoAnimationStyles.css";
```
4. Im vorhandenen Reward-System die bisherigen Platzhalter durch `DinoAnimation` ersetzen.
5. Die Auswahl nach einer perfekten Runde soll weiterhin 3 nicht freigeschaltete Belohnungen zeigen.
6. LocalStorage-Key nur bewusst migrieren. Empfohlen: `schildi-dino-rewards-v3-20`.
7. Am Ende ausführen: `npm run build`.

## Hinweis zur Bildqualität
Die ersten drei Sets basieren auf den vorhandenen fotorealistischen Renderquellen. Die weiteren 17 Sets sind animationsfertige, transparente PNG-Assets mit artspezifischer Silhouette und Bewegung. Sie sind so gebaut, dass später echte fotorealistische Renderings frameweise ersetzt werden können, ohne Code zu ändern.
