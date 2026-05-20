# Dino Animation Asset Map

## Enthaltene Arten

| Reward | Deutscher Name | Fachbegriff | Ordner | Frames |
|---|---|---|---|---|
| Bruno Bronto | Brachiosaurus | Brachiosaurus altithorax | assets/dinos/brachiosaurus-altithorax/ | 6 |
| Trixi Triceratops | Triceratops | Triceratops horridus | assets/dinos/triceratops-horridus/ | 6 |
| Pico Pteranodon | Pteranodon | Pteranodon longiceps | assets/dinos/pteranodon-longiceps/ | 6 |

## Frame-Konzept

Alle Dinos haben:

```text
frame_01_idle.png
frame_02_lift.png
frame_03_left.png
frame_04_emphasis.png
frame_05_right.png
frame_06_settle.png
```

Damit kann Codex einfach eine Frame-Animation bauen:

```js
setFrameIndex((current) => (current + 1) % frames.length)
```

## Hinweis zur Bildqualität

Die Frames wurden aus den vorhandenen fotorealistischen Einzelbildern als app-taugliche Cutout-Frames erzeugt. Für eine spätere Premium-Version können dieselben Ordner durch echte, konsistent gerenderte 3D-Frame-Sequenzen ersetzt werden. Die Dateinamen und Komponentenschnittstelle bleiben gleich.
