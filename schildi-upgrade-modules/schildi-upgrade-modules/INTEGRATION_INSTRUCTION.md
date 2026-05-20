# INTEGRATION_INSTRUCTION.md für Codex

Du bist Senior React/PWA-Entwickler und sollst die bestehende App `pfarrergraf/schildkroetenklasse-einmaleins` behutsam erweitern.

## Ziel

Integriere das modulare Ergänzungspaket in die bestehende Schildi-Einmaleins-App, ohne die bestehende Schildi-/Audio-/Lip-Sync-Logik zu beschädigen.

## Repo-Befund

Das bestehende Repo ist eine Vite/React-PWA. `src/App.jsx` ist derzeit die zentrale monolithische App-Datei mit Spiellogik, Schildi-Szenen, Audio-Cues und UI. `src/main.jsx` registriert den Service Worker und importiert `src/styles.css`. GitHub Pages nutzt den Base-Pfad `/schildkroetenklasse-einmaleins/`.

## Regeln

- Keine Neuschreibung der App.
- Keine Framework-Migration.
- Keine neuen externen Dependencies.
- Keine Accounts, keine Server, keine APIs.
- Bestehende Funktionen müssen erhalten bleiben.
- Bestscore darf nicht verloren gehen.
- Neue Fortschritte nur per `localStorage` speichern.
- Mobile-first testen.
- Am Ende muss `npm run build` erfolgreich laufen.
- Falls Konflikte auftreten: kleinste sichere Änderung wählen.

## Dateien kopieren

Kopiere diese Ordner 1:1 in das bestehende Repository:

```text
src/features/rewards/
src/features/learning/
src/features/coach/
public/rewards/dinos/
public/audio/rewards/
docs/
```

## Integration

Folge `docs/APP_PATCH_GUIDE.md` Schritt für Schritt.

## Erste Ausbaustufe

1. Dino-Sammlung aktivieren.
2. Bei 10/10 richtigen Antworten Reward-Auswahl anzeigen.
3. Auswahl in `localStorage` speichern.
4. Sammlung mit Button „Meine Sammlung“ öffnen.
5. CSS-Animationen verwenden.
6. Fehler- und Rundenstatistik im Hintergrund speichern.

## Nicht in Phase 1 bauen

- keine komplexe adaptive Aufgabenlogik
- keine Eltern-/Lehreransicht
- keine Online-Synchronisierung
- keine neuen NPM-Pakete
- keine große UI-Neustrukturierung

## Tests

Nach Integration prüfen:

1. `npm run build`
2. App lokal starten
3. Runde mit 10/10 simulieren
4. Reward-Modal erscheint
5. Dino auswählen
6. Sammlung öffnen
7. Seite neu laden: Dino bleibt gespeichert
8. Runde mit 8/10: kein Dino, aber normaler Abschluss
9. Smartphone-Ansicht: Modal und Sammlung sind bedienbar
10. GitHub Pages Build bleibt kompatibel

## Ergebnisbericht

Nach Umsetzung bitte ausgeben:

- geänderte Dateien
- neue Dateien
- ausgeführte Befehle
- Build-Ergebnis
- kurzer manueller Testbericht
- GitHub-Pages-Hinweis
