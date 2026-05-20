# Schildi Upgrade Modules

Modulares Ergänzungspaket für `pfarrergraf/schildkroetenklasse-einmaleins`.

Ziel: Die bestehende Schildi-App wird nicht neu gebaut. Dieses Paket ergänzt sie um:

1. Dino-Belohnungssystem
2. Sammlung/Galerie
3. lokale Fortschrittsspeicherung
4. optionale Lernstatistik und Fehlerwiederholung
5. Codex-Integrationsanweisung

## Inhalt

```text
src/features/rewards/
  rewardCatalog.js
  rewardStorage.js
  rewardLogic.js
  RewardChoiceModal.jsx
  CollectionView.jsx
  RewardStatusCard.jsx
  rewardStyles.css
  index.js

src/features/learning/
  learningProgress.js
  LearningSummaryCard.jsx
  learningStyles.css
  index.js

src/features/coach/
  rewardCoachCues.js

public/rewards/dinos/
  dino-*.svg

public/audio/rewards/
  *.txt
  README.md

docs/
  PRODUCT_ANALYSIS.md
  CODEX_IMPLEMENTATION_PROMPT.md
  APP_PATCH_GUIDE.md

INTEGRATION_INSTRUCTION.md
```

## Einbauziel

Alle Ordner aus diesem Paket werden in das bestehende Repo kopiert. Danach lässt Codex die Integration nach `INTEGRATION_INSTRUCTION.md` durchführen.
