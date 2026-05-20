# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A Vite + React PWA for a primary school child to practice the multiplication table (1×1, factors 0–10, results 0–100). No backend, no database, no external APIs, no router, no state manager. Everything runs in the browser.

## Commands

```bash
npm run dev          # Dev server on http://localhost:4173 (fixed port, --strictPort)
npm run dev:stop     # Kill the dev server (PowerShell script)
npm run dev:restart  # Stop then restart
npm run build        # Production build → dist/
npm run preview      # Serve the dist/ folder
```

After any code change: `npm run build` to verify no build errors, then manually test in the browser.

## Architecture

### Single-component app

[src/App.jsx](src/App.jsx) contains the entire game: state, logic, audio engine, and JSX. There is deliberately no component split beyond the two feature modules below. Keep it that way unless complexity clearly demands otherwise.

### Feature modules

| Module | Path | Purpose |
|---|---|---|
| `rewards` | [src/features/rewards/](src/features/rewards/) | Dino character collection unlocked after strong rounds; `rewardCatalog.js` defines all 20 dinos with SVG paths and audio paths; `rewardLogic.js` decides when to offer a reward; `rewardStorage.js` persists to `localStorage` |
| `learning` | [src/features/learning/](src/features/learning/) | Per-cell answer-attempt tracking and round summaries, persisted to `localStorage`; `LearningSummaryCard` renders per-table weakness summary |

### Animation system

Schildi has six scenes (`hello`, `idle`, `happy`, `sad`, `warning`, `finish`). Each scene uses a set of PNGs from `assets/<Emotion>/`. Frame sequences are loaded at build time via `import.meta.glob`. During speech, frames advance via audio-driven lip sync (WebAudio `decodeAudioData` → amplitude track, or a live `AnalyserNode` as fallback). When silent, Schildi stays on frame 0.

`FRAME_ALIGNMENT` in [src/App.jsx](src/App.jsx) contains per-frame pixel-level x/y corrections (in `%`) to compensate for slight misalignment between AI-generated PNG frames.

### Audio cue system

All speech is defined as `SPEECH_CUES` entries with an explicit `scene`, `text`, and `audioFiles` array (URL-encoded paths under `public/audio/`). `playCue(cueId)` plays the first file that succeeds; falls back to `"missing-audio"` status if none loads. The start cue fires only after the first user interaction (browser autoplay policy).

To add custom voice recordings: place a `.wav` or `.mp3` file in `public/audio/` with the exact filename shown in the companion `.txt` file. See [public/audio/audio_readme.md](public/audio/audio_readme.md).

### PWA

[public/sw.js](public/sw.js) is a hand-written service worker. [public/manifest.webmanifest](public/manifest.webmanifest) defines app metadata. The "Cache zurücksetzen" button in the mobile menu unregisters all service workers and clears all matching cache entries.

### localStorage keys

| Key | Content |
|---|---|
| `schildkroetenklasse-einmaleins-bestscore` | Best score (number) |
| `schildkroetenklasse-selected-tables-v1` | Selected multiplication tables (array) |
| `schildi-dino-friends-v2` | Unlocked dino reward IDs (array) |
| `schildi-dino-bonus-stars-v1` | Bonus star count after full collection |

### Automated browser testing

`window.render_game_to_text()` returns a JSON snapshot of the full game state (scene, frame, audio driver, lip-sync level, etc.). Key `data-testid` attributes: `turtle-panel`, `turtle-image`, `answer-input`, `submit-answer`.

## Hard constraints (from CODEX-INSTRUCTION.md)

- Factors only 0–10, results only 0–100
- No new libraries without explicit approval
- All UI text must be in German with correct umlauts
- Touch targets must be large enough for children's fingers (buttons ≥ 52 px tall)
- The PWA manifest must stay valid after every change
