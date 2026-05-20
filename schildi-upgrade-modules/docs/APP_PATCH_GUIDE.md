# App.jsx Patch Guide

Diese Anleitung beschreibt die minimalen Änderungen an `src/App.jsx`.

## 1. Imports ergänzen

Direkt unter den bestehenden Imports ergänzen:

```jsx
import {
  CollectionView,
  RewardChoiceModal,
  RewardStatusCard,
  loadRewardState,
  pickRewardChoices,
  recordPerfectRoundWithoutNewReward,
  shouldOfferReward,
  unlockReward,
} from "./features/rewards";
import { loadLearningState, recordAnswerAttempt, recordRoundSummary } from "./features/learning";
import "./features/rewards/rewardStyles.css";
import "./features/learning/learningStyles.css";
```

Optional später:

```jsx
import { buildRewardSpeechCues } from "./features/coach/rewardCoachCues";
```

## 2. Neue States in `App()` ergänzen

Nach `const [bestScore, setBestScore] = useState(0);` ergänzen:

```jsx
const [rewardState, setRewardState] = useState(() => loadRewardState());
const [rewardChoices, setRewardChoices] = useState([]);
const [rewardModalOpen, setRewardModalOpen] = useState(false);
const [collectionOpen, setCollectionOpen] = useState(false);
const [learningState, setLearningState] = useState(() => loadLearningState());
```

## 3. Fehler/Lernfortschritt speichern

In `checkAnswer(answer)` direkt nach `const isCorrect = number === task.answer;` ergänzen:

```jsx
setLearningState((current) =>
  recordAnswerAttempt(current, {
    a: task.a,
    b: task.b,
    givenAnswer: number,
    correctAnswer: task.answer,
    isCorrect,
  })
);
```

## 4. Rundenabschluss erweitern

In `finishGame(finalScore, flowToken)` direkt nach Bestscore-Speicherung ergänzen:

```jsx
setLearningState((current) =>
  recordRoundSummary(current, {
    score: finalScore,
    totalRounds: ROUNDS_PER_GAME,
    selectedTables,
  })
);

setRewardState((current) => {
  if (shouldOfferReward({ score: finalScore, totalRounds: ROUNDS_PER_GAME, rewardState: current })) {
    const choices = pickRewardChoices(current, { choiceCount: 3 });
    setRewardChoices(choices);
    setRewardModalOpen(true);
    return current;
  }

  if (finalScore === ROUNDS_PER_GAME) {
    return recordPerfectRoundWithoutNewReward(current);
  }

  return current;
});
```

Wenn Reward-Audio integriert ist, bei 10/10 zusätzlich `await playCue("rewardPerfect")` abspielen.

## 5. Handler ergänzen

Innerhalb von `App()` ergänzen:

```jsx
function handleChooseReward(reward) {
  setRewardState((current) => unlockReward(current, reward.id, { score, total: ROUNDS_PER_GAME }));
  setRewardModalOpen(false);
  setCollectionOpen(true);
  void playCue("correctStrong");
}
```

Wenn Reward-Audio integriert ist, statt `correctStrong` später `rewardUnlocked` verwenden.

## 6. UI einfügen

Kurz vor dem schließenden `</main>` bzw. innerhalb von `<main className="app-shell">` am Ende ergänzen:

```jsx
<RewardChoiceModal
  open={rewardModalOpen}
  choices={rewardChoices}
  onChoose={handleChooseReward}
  onClose={() => setRewardModalOpen(false)}
/>

<CollectionView
  open={collectionOpen}
  rewardState={rewardState}
  onClose={() => setCollectionOpen(false)}
/>
```

## 7. Button „Meine Sammlung“ einfügen

In der mobilen Utility-Schublade unter `Mein Punktestand` oder `Top-Actions` ergänzen:

```jsx
<RewardStatusCard rewardState={rewardState} onOpenCollection={() => setCollectionOpen(true)} />
```

## 8. Build testen

```bash
npm run build
```
