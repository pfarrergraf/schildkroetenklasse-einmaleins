# Codex-Instruction: Schildkrötenklasse Einmaleins

Du arbeitest an einer kleinen Vite-React-PWA für ein Grundschulkind und die Schildkrötenklasse.

## Ziel

Die App soll mobil sehr gut funktionieren, per Link teilbar sein und als PWA auf Smartphone-Homescreens installierbar bleiben.

## Wichtige Regeln

- Keine Datenbank.
- Kein Backend.
- Keine externen APIs.
- Keine unnötigen Libraries.
- Kein komplizierter State-Manager.
- Keine Aufgaben außerhalb des kleinen Einmaleins.
- Faktoren nur von 0 bis 10.
- Ergebnisse nur von 0 bis 100.
- Bedienung muss für Kinderfinger groß genug sein.

## Maskottchen

Die Schildkröte „Schildi“ ist Teil des pädagogischen Feedbacks.

Bei richtiger Antwort:

- Schildi freut sich sichtbar.
- Schildi sagt per Web Speech API z. B. „Ja, gut gemacht!“.
- Die Rückmeldung soll freundlich und motivierend sein.

Bei falscher Antwort:

- Schildi schüttelt den Kopf.
- Schildi sagt: „Probiere es noch einmal.“
- Kein Beschämen, keine harte Fehlermeldung.

## Dateien

- `src/App.jsx`: Spiellogik und React-Komponente
- `src/styles.css`: komplettes Styling inkl. Schildkrötenanimation
- `public/manifest.webmanifest`: PWA-Metadaten
- `public/sw.js`: Service Worker
- `public/icon.svg`, `public/icon-192.png`, `public/icon-512.png`: App-Icons

## Testplan

Nach Änderungen ausführen:

```bash
npm install
npm run build
```

Dann manuell prüfen:

1. App startet auf Desktop und Smartphone-Breite.
2. Schildi ist sichtbar.
3. Richtige Antwort löst Freude und Sprache aus.
4. Falsche Antwort löst Kopfschütteln und Sprache aus.
5. Ton-Schalter funktioniert.
6. Ergebnisse bleiben zwischen 0 und 100.
7. PWA-Manifest bleibt gültig.
