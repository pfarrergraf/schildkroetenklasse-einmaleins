# Integration Instruction: echte Dino-Belohnungen V2

Ziel: Die bisherigen Platzhalter-Figuren im Belohnungssystem durch echte Dinosaurier ersetzen: Bruno Bronto, Trixi Triceratops, Pico Pteranodon, Nora Nadelruecken, Roxi Rex und Lumi Ankylosaurus.

Wichtig:
- Bestehende Schildi-, Audio- und Lip-Sync-Logik nicht umbauen.
- Keine neuen Dependencies installieren.
- GitHub-Pages-Base-Pfad nicht aendern.
- Keine Accounts, keine APIs, keine externen Assets.
- Alles bleibt lokal/PWA-faehig.

## Dateien kopieren

Kopiere diese Ordner ins Repo:

```text
src/features/rewards/*        -> src/features/rewards/
public/rewards/dinos/*        -> public/rewards/dinos/
public/audio/rewards/*        -> public/audio/rewards/
docs/*                        -> docs/
```

Wenn `src/features/rewards/` schon existiert: Dateien gezielt ersetzen oder zusammenfuehren. Ziel ist, dass der Catalog echte Dino-SVGs und Dino-Sounds nutzt.

## Minimaler Import in App.jsx

Oben in `src/App.jsx` ergaenzen:

```js
import "./features/rewards/dinoRewardStyles.css";
import {
  RewardChoiceModal,
  CollectionView,
  RewardStatusCard,
  buildRewardOffer,
  shouldOfferReward,
  loadUnlockedRewardIds,
  unlockRewardId,
  loadBonusStars,
  addBonusStar,
  playDinoRewardSound,
} from "./features/rewards";
```

## State in App() ergaenzen

In `App()` nach den bestehenden useState-Zeilen:

```js
const [unlockedRewardIds, setUnlockedRewardIds] = useState(() => loadUnlockedRewardIds());
const [bonusStars, setBonusStars] = useState(() => loadBonusStars());
const [rewardChoices, setRewardChoices] = useState([]);
const [collectionOpen, setCollectionOpen] = useState(false);
```

## Nach perfekter Runde Reward anbieten

In `finishGame(finalScore, flowToken)` nach Bestscore-Speicherung und vor oder nach `playCue(...)`:

```js
if (shouldOfferReward(finalScore, ROUNDS_PER_GAME)) {
  const offer = buildRewardOffer(unlockedRewardIds);
  if (offer.allCollected) {
    setBonusStars(addBonusStar());
  } else {
    setRewardChoices(offer.choices);
  }
}
```

Achtung: Falls Codex wegen stale state meckert, `unlockedRewardIds` ueber Ref oder direkt `loadUnlockedRewardIds()` lesen.

## Reward-Auswahlhandler in App() ergaenzen

```js
async function handleRewardChoose(reward) {
  const nextIds = unlockRewardId(reward.id);
  setUnlockedRewardIds(nextIds);
  setRewardChoices([]);
  setCollectionOpen(true);
  await playDinoRewardSound(reward, { soundEnabled });
}
```

## JSX ergaenzen

Innerhalb von `<section className="app-container">` moeglichst am Ende vor `</section>` einfuegen:

```jsx
<RewardChoiceModal
  choices={rewardChoices}
  onChoose={handleRewardChoose}
  onClose={() => setRewardChoices([])}
  soundEnabled={soundEnabled}
/>

{collectionOpen ? (
  <div className="reward-modal-backdrop" role="presentation">
    <CollectionView
      unlockedIds={unlockedRewardIds}
      bonusStars={bonusStars}
      onClose={() => setCollectionOpen(false)}
      soundEnabled={soundEnabled}
    />
  </div>
) : null}
```

Im Mobile-Menue im Abschnitt "Mein Punktestand" oder "Top-Actions" ergaenzen:

```jsx
<RewardStatusCard
  unlockedIds={unlockedRewardIds}
  bonusStars={bonusStars}
  onOpenCollection={() => setCollectionOpen(true)}
/>
```

## Build-Test

```bash
npm run build
```

Danach lokal testen:
- 10 richtige Antworten -> Reward-Modal erscheint.
- Drei echte Dinos werden angezeigt.
- Dino-Sound Button funktioniert nach Nutzerklick.
- Auswahl speichert den Dino lokal.
- Sammlung zeigt freigeschaltete und gesperrte Dinos.
- GitHub Pages Pfade laden SVG und WAV korrekt.
