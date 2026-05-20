# Produkt- und Pädagogik-Analyse

## Befund aus dem aktuellen Repo

Die App ist bereits eine solide PWA für Grundschulkinder: Vite/React, GitHub-Pages-Base, Service Worker, mobile Bedienung, Schildi-PNG-Frames, eigene Audiodateien und lokale Speicherung sind vorhanden.

Stärken:

- klare Einmaleins-Aufgaben von 0 bis 10
- Ergebnisse bleiben bei 0 bis 100
- 10 Aufgaben pro Runde
- große Multiple-Choice-Felder
- Schildi als sympathischer Lerncoach
- Audiodateien plus Fallback
- Lip-Sync-Logik für Schildi-Frames
- mobile Utility-Schublade statt überladener Hauptansicht

Schwächen / nächste Wachstumsfelder:

- Fortschritt ist aktuell fast nur punktuell über Bestscore sichtbar
- Fehler werden nicht langfristig als Lernchance gespeichert
- nach einer guten Runde fehlt ein emotionaler Abschluss mit Sammelwert
- kein Tagesziel und kein Wochengefühl
- keine gezielte Wiederholung schwieriger Aufgaben
- Belohnungssystem fehlt noch als langfristiger Motivationsanker

## Pädagogischer Kern

Die App sollte nicht primär schnelleres Tippen belohnen, sondern konzentriertes, wiederholtes, angstfreies Üben. Belohnungen müssen deshalb an echte Lernleistung gekoppelt sein: perfekte Runde, Dranbleiben, Wiederholung schwieriger Aufgaben, Tagesziel.

## Empfohlenes erstes Belohnungssystem

Start mit „Schildis Dino-Freunde“.

Warum:

- Dinos sind stark motivierend für viele Grundschulkinder.
- Es ist emotional klar: perfekte Runde → neuer Dino.
- Die Technik ist klein: sechs Belohnungen, localStorage, CSS-Animation.
- Später können Feuerwehr, Polizei, Tiere oder Schildkröteninsel mit derselben Datenstruktur ergänzt werden.

## Mechanik Version 1

- 10/10 richtige Aufgaben: Kind darf einen von drei noch gesperrten Dinos auswählen.
- Dino wird lokal gespeichert.
- Sammlung zeigt freigeschaltete und gesperrte Dinos.
- Sind alle Dinos gesammelt, geben perfekte Runden Bonus-Sterne.
- Bei 8/10 oder 9/10: kein Dino, aber ermutigender Schildi-Text: „Fast perfekt. Du bist ganz nah dran.“

## Mechanik Version 2

- Fehlerliste speichert schwierige Aufgaben.
- „Nochmal üben“-Modus zeigt zuerst die Aufgaben, die zuletzt falsch waren.
- Tagesziel: eine Runde am Tag.
- sanfter Level-Aufbau: 1,2,5,10 → 3 → 4 → 6 → 8 → 9 → 7 → 0.

## Belohnungssysteme im Vergleich

| System | Motivation | Pädagogischer Nutzen | Aufwand | Risiko |
|---|---:|---:|---:|---:|
| Dino-Sammlung | sehr hoch | gut | niedrig | mittel |
| Feuerwehr/Rettung | hoch | gut | mittel | mittel |
| Tiere | hoch | gut | niedrig | niedrig |
| Schildkröteninsel | mittel-hoch | sehr gut | mittel | niedrig |
| Stickeralbum | mittel | gut | niedrig | niedrig |
| Schatztruhe | mittel | mittel | niedrig | mittel |
| Garten/Insel wächst | mittel | sehr gut | mittel | niedrig |

Empfehlung: Dino-Sammlung zuerst, danach Schildkröteninsel oder Tierpark als ruhigere Erweiterung.
