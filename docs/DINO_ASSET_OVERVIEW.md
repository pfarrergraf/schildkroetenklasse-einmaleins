# Dino Asset Overview

Dieses Paket ersetzt die abstrakten Reward-Platzhalter durch echte Dinosaurier.

## Dinos

| id | Name | Echter Typ | Bewegung | Sound |
|---|---|---|---|---|
| bruno-bronto | Bruno Bronto | Brontosaurus/Langhals | ruhiges Schritt-Wippen | tiefer freundlicher Ruf |
| trixi-triceratops | Trixi Triceratops | Triceratops/Dreihorn | Stampfen | kurzes freudiges Schnauben |
| pico-pteranodon | Pico Pteranodon | Pteranodon/Flugsaurier | Flattern | heller Flugruf |
| nora-nadelruecken | Nora Nadelruecken | Stegosaurus | Platten-Wackeln | warmes Grummeln |
| roxi-rex | Roxi Rex | Tyrannosaurus Rex | kleiner Jubel-Roar | etwas tieferer Roar |
| lumi-ankylosaurus | Lumi Ankylosaurus | Ankylosaurus/Panzerfreund | Schwanz-Schwingen | weiches Panzerbrummen |

## Paedagogischer Zweck

Die Dinos sind Belohnungsanker nach einer perfekten Runde, nicht nach jeder Antwort. Das schuetzt vor reiner Belohnungs-Konditionierung und bindet die Belohnung an Konzentration, Genauigkeit und Durchhalten.

## Technische Entscheidung

- SVG statt PNG: klein, transparent, scharf auf Handy-Displays.
- CSS-Bewegung statt Video/GIF: deutlich kleiner, besser fuer PWA und offline.
- WAV-Sounds plus WebAudio-Fallback: funktioniert ohne externe APIs.
