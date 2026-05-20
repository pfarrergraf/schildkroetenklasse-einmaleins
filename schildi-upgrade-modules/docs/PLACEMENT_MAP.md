# Placement Map

Diese Datei zeigt, wohin die neuen Dateien im bestehenden Repository gehören.

| Paket-Datei/-Ordner | Ziel im Repo | Zweck |
|---|---|---|
| `src/features/rewards/` | `src/features/rewards/` | Dino-Sammlung, Reward-State, Modal, Collection |
| `src/features/learning/` | `src/features/learning/` | Fehler- und Lernfortschritt lokal speichern |
| `src/features/coach/` | `src/features/coach/` | neue Schildi-Cue-Texte für Belohnungen |
| `public/rewards/dinos/` | `public/rewards/dinos/` | einfache SVG-Dino-Platzhalter, später durch PNG/WebP ersetzbar |
| `public/audio/rewards/` | `public/audio/rewards/` | Aufnahmevorlagen für neue Belohnungssätze |
| `docs/` | `docs/` | Analyse, Patch-Guide, Codex-Prompt |
| `INTEGRATION_INSTRUCTION.md` | `INTEGRATION_INSTRUCTION.md` | Hauptanweisung für Codex |

## Bestehende Dateien, die Codex ändern muss

- `src/App.jsx`

## Bestehende Dateien, die Codex nur falls nötig ändern sollte

- `src/styles.css` nur für kleine Anschlusskorrekturen
- `README.md` nur um das neue Feature zu dokumentieren

## Bestehende Dateien, die Codex nicht anfassen soll

- `vite.config.js`, außer der Build bricht wegen Base-Pfad
- `src/main.jsx`, außer Service Worker bricht
- vorhandene `assets/Hallo`, `assets/gut`, `assets/schlecht`, `assets/Achtung`
- vorhandene Audiodateien
