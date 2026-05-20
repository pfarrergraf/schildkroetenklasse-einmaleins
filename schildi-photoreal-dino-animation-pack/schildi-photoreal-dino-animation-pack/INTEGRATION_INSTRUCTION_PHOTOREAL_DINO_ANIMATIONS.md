# Integration: fotorealistische Dino-Animationen

## Ziel

Dieses Paket ergänzt die Schildkrötenklasse-App um fotorealistische, animationsfähige Dino-Rewards.

Es enthält pro Dino eine Serie aus 6 PNG-Frames:

- Bruno Bronto: Brachiosaurus altithorax
- Trixi Triceratops: Triceratops horridus
- Pico Pteranodon: Pteranodon longiceps

Die Frames liegen bewusst unter `assets/dinos/...`, weil die bestehende App Schildi ebenfalls über Vite-Imports aus dem `assets`-Ordner lädt.

## Kopieren

Kopiere diese Ordner in das bestehende Repo:

```text
assets/dinos/                      -> assets/dinos/
src/features/dinoAnimations/       -> src/features/dinoAnimations/
public/audio/rewards/              -> public/audio/rewards/
docs/                              -> docs/
```

## CSS registrieren

In `src/main.jsx` ergänzen:

```js
import "./features/dinoAnimations/dinoAnimationStyles.css";
```

Direkt nach:

```js
import "./styles.css";
```

## Reward-Karten anpassen

In der Reward-Auswahl und Sammlung dort, wo bisher Emoji/SVG-Platzhalter gerendert werden, stattdessen verwenden:

```jsx
import { DinoAnimation } from "./features/dinoAnimations";

<DinoAnimation
  speciesId={reward.speciesId}
  size="card"
  active={true}
  playSound={selected}
/>
```

Wenn die Datei tiefer liegt, Importpfad entsprechend anpassen, z. B.:

```js
import { DinoAnimation } from "../dinoAnimations";
```

## Reward-Daten erweitern

Die bestehenden Reward-Objekte sollten diese Felder bekommen:

```js
{
  id: "bruno-bronto",
  speciesId: "brachiosaurus-altithorax",
  name: "Bruno Bronto",
  germanName: "Brachiosaurus",
  scientificName: "Brachiosaurus altithorax"
}
```

Siehe auch:

```text
src/features/dinoAnimations/rewardCatalogPatch.example.js
```

## Nicht verändern

- Schildi-Frames nicht verschieben.
- `import.meta.env.BASE_URL` nicht entfernen.
- GitHub-Pages-Base-Pfad nicht ändern.
- Keine externen Dependencies installieren.
- Keine App-Neuschreibung.

## Build-Test

Nach Integration:

```bash
npm run build
```

Dann lokal prüfen:

```bash
npm run dev
```
