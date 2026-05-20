# Dino Animation Asset Map

## Enthaltene Arten

| Reward | Deutscher Name | Fachbegriff | Ordner | Frames | Status |
|---|---|---|---|---:|---|
| Bruno Bronto | Brachiosaurus | Brachiosaurus altithorax | assets/dinos/brachiosaurus-altithorax/ | 6 | fotorealistische Frame-Serie |
| Trixi Triceratops | Triceratops | Triceratops horridus | assets/dinos/triceratops-horridus/ | 6 | fotorealistische Frame-Serie |
| Pico Pteranodon | Pteranodon | Pteranodon longiceps | assets/dinos/pteranodon-longiceps/ | 6 | fotorealistische Frame-Serie |
| Nora Nadelrücken | Stegosaurus | Stegosaurus stenops | assets/dinos/stegosaurus-stenops/ | 6 | vorbereitet, SVG-Fallback vorhanden |
| Roxi Rex | Tyrannosaurus Rex | Tyrannosaurus rex | assets/dinos/tyrannosaurus-rex/ | 6 | vorbereitet, SVG-Fallback vorhanden |
| Lumi Ankylosaurus | Ankylosaurus | Ankylosaurus magniventris | assets/dinos/ankylosaurus-magniventris/ | 6 | vorbereitet, SVG-Fallback vorhanden |

## Frame-Konzept

Alle Dinos verwenden dieselbe Dateistruktur:

```text
frame_01_idle.png
frame_02_lift.png
frame_03_left.png
frame_04_emphasis.png
frame_05_right.png
frame_06_settle.png
```

Alternativ funktionieren auch:

```text
frame_01_idle.svg
frame_02_lift.svg
frame_03_left.svg
frame_04_emphasis.svg
frame_05_right.svg
frame_06_settle.svg
frame_01_idle.webp
...
```

Der Katalog lädt passende Dateien über `import.meta.glob("../../../assets/dinos/*/frame_*.{png,svg,webp}")`. Dadurch können neue Serien ergänzt werden, ohne die React-Komponente umzubauen.

## Fallback-Verhalten

Wenn für eine Art noch keine Frame-Dateien unter `assets/dinos/<species-id>/` liegen, verwendet der Katalog automatisch das vorhandene Dino-SVG aus `public/rewards/dinos/`. So bleibt die Sammlung vollständig sichtbar, auch bevor eine Premium-Frame-Serie erzeugt wurde.

## Bewegungsprofile

| Motion | Einsatz |
|---|---|
| gentle-walk | große Langhälse, ruhiges Wippen |
| stomp | schwere Boden-Dinos, kräftiges Stampfen |
| wing-float | Flugsaurier, Schweben/Flattern |
| plate-wiggle | Stegosaurus, Rückenplatten-Wackeln |
| roar-bounce | T-Rex, freundlicher Jubel-Roar |
| tail-swing | Ankylosaurus, sanftes Schwanz-Schwingen |

## Nächste echte Frame-Serien

Für die vorbereiteten Dinos sollten als Nächstes je sechs konsistente Bilder erzeugt und hier abgelegt werden:

```text
assets/dinos/stegosaurus-stenops/frame_01_idle.png
assets/dinos/stegosaurus-stenops/frame_02_lift.png
assets/dinos/stegosaurus-stenops/frame_03_left.png
assets/dinos/stegosaurus-stenops/frame_04_emphasis.png
assets/dinos/stegosaurus-stenops/frame_05_right.png
assets/dinos/stegosaurus-stenops/frame_06_settle.png

assets/dinos/tyrannosaurus-rex/frame_01_idle.png
...

assets/dinos/ankylosaurus-magniventris/frame_01_idle.png
...
```

## Hinweis zur Bildqualität

Die vorhandenen fotorealistischen Frames sind app-taugliche Cutout-Frames. Für spätere Premium-Serien können dieselben Ordner durch echte, konsistent gerenderte 3D-Frame-Sequenzen ersetzt werden. Die Dateinamen und Komponentenschnittstelle bleiben gleich.
