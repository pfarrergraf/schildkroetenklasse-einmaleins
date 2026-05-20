# Codex Implementation Prompt

Kopiere diesen Prompt in Codex, nachdem die Modulordner in das Repository kopiert wurden.

```text
Du bist Senior React/PWA-Entwickler, UI/UX-Engineer und Grundschul-Gamification-Spezialist.

Ziel:
Integriere die neu hinzugefügten Module aus `src/features/rewards`, `src/features/learning` und `src/features/coach` in die bestehende Schildi-Einmaleins-App.

Kontext:
- Repository: pfarrergraf/schildkroetenklasse-einmaleins
- Framework: Vite + React
- Einstieg: src/App.jsx
- Styles: src/styles.css plus neue Feature-CSS-Dateien
- GitHub Pages Base: /schildkroetenklasse-einmaleins/
- Keine neuen Dependencies.
- Keine Server/API/Accounts.
- Fortschritt nur lokal speichern.

Aufgaben:
1. Lies `INTEGRATION_INSTRUCTION.md` und `docs/APP_PATCH_GUIDE.md`.
2. Prüfe zuerst die aktuelle Struktur von `src/App.jsx`, ohne etwas zu ändern.
3. Ergänze Imports für Reward- und Learning-Module.
4. Ergänze States für Reward-Auswahl, Sammlung und Lernfortschritt.
5. Speichere jeden Antwortversuch über `recordAnswerAttempt`.
6. Speichere jede abgeschlossene Runde über `recordRoundSummary`.
7. Bei 10/10 richtigen Aufgaben:
   - wenn noch Dinos gesperrt sind: Reward-Auswahl öffnen
   - sonst Bonus-Stern speichern
8. Wenn ein Dino gewählt wird:
   - Dino per `unlockReward` speichern
   - Reward-Modal schließen
   - Sammlung öffnen
   - Schildi soll sich freuen
9. Füge `RewardChoiceModal` und `CollectionView` in JSX ein.
10. Füge im mobilen Menü einen Button bzw. eine Karte „Meine Sammlung“ ein.
11. Importiere `rewardStyles.css` und `learningStyles.css`.
12. Optional: Integriere die Reward-Cue-Texte aus `src/features/coach/rewardCoachCues.js` in `SPEECH_CUES`, aber nur wenn es ohne große Umbauten passt.
13. Führe `npm run build` aus.
14. Repariere nur echte Build-Fehler, keine kosmetischen Umbauten.

Wichtig:
- Bestehende Schildi-Szenen, Audio, Lip-Sync und Service-Worker-Logik nicht beschädigen.
- Bestehender Bestscore bleibt unter seinem bisherigen localStorage-Key erhalten.
- Neue Daten verwenden eigene localStorage-Keys.
- Kein großes Refactoring.
- Keine UI-Überladung der Hauptspielansicht.
- Sammlung vorzugsweise im mobilen Menü oder als Modal.

Ausgabe:
- Was wurde geändert?
- Welche Dateien wurden neu verwendet?
- Build-Ergebnis
- Kurzer manueller Testplan
- Hinweise für GitHub Pages Deployment
```
