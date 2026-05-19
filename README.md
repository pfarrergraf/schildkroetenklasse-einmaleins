# Schildkrötenklasse Einmaleins

Eine mobile Progressive Web App zum Üben des kleinen Einmaleins für Samuel und die Schildkrötenklasse.

## Funktionen

- Einmaleins-Aufgaben von 0 bis 10
- Ergebnisse nur von 0 bis 100
- 10 Aufgaben pro Runde
- auswählbare Einmaleins-Tafeln
- lokale Bestscore-Speicherung per `localStorage`
- PWA: als Link teilbar und auf dem Smartphone installierbar
- echte Schildkröte „Schildi“ aus PNG-Bildern mit ruhigen Bewegungen
- zwei Antwortwege gleichzeitig:
  - Multiple Choice anklicken
  - oder Lösung eintippen
- eigene Audiodateien aus `public/audio`
- Fallback auf Browser-Stimme nur dann, wenn keine passende Audiodatei abgespielt werden kann
- Ton kann im Spiel ein- und ausgeschaltet werden

## Lokal starten

```bash
npm install
npm run dev
```

Dann genau diese URL öffnen:

```text
http://127.0.0.1:4173
```

Wenn dort noch ein alter Stand erscheint:

1. alle alten Browser-Tabs mit `localhost:5173` schließen
2. die Seite `http://127.0.0.1:4173` hart neu laden
3. falls nötig den alten Service Worker in den DevTools löschen

## Produktionsbuild

```bash
npm run build
```

Der fertige statische Build liegt danach im Ordner `dist`.

## Teilen per Smartphone

Die App kann als statische Website auf Vercel, Netlify oder GitHub Pages veröffentlicht werden. Danach kann der Link per WhatsApp, E-Mail oder QR-Code geteilt werden.

Auf dem Smartphone:

- iPhone: Safari öffnen → Teilen → Zum Home-Bildschirm hinzufügen
- Android: Chrome öffnen → Menü → Zum Startbildschirm hinzufügen / App installieren

## GitHub Pages

Für GitHub Pages ist das Projekt auf den Unterpfad `/schildkroetenklasse-einmaleins/` vorbereitet.

Die erwartete spätere Live-URL ist:

```text
https://<github-user>.github.io/schildkroetenklasse-einmaleins/
```

Neue Versionen sind später einfach:

1. Änderungen committen
2. nach `main` pushen
3. GitHub Actions baut und veröffentlicht automatisch neu

## Hinweise zu Audio

Die App versucht zuerst, eure eigenen Audiodateien aus `public/audio` abzuspielen. Nur wenn das nicht klappt, fällt sie auf die Browser-Sprachausgabe zurück.

Die Dateinamen und das Ersetzen der Aufnahmen sind in [public/audio/audio_readme.md](public/audio/audio_readme.md) beschrieben.
