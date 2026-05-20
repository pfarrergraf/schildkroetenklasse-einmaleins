# Später echte fotorealistische Renderings ersetzen

Die App erwartet je Dino diese Struktur:

```text
assets/dinos/<dino-id>/
  frame_01.png
  frame_02.png
  frame_03.png
  frame_04.png
  frame_05.png
  frame_06.png
```

Die ersten drei aus dem vorigen Pack haben teils längere Dateinamen wie `frame_01_01_idle.png`; das ist okay, weil der Code `frame_*.png` lädt. Für neue fotorealistische Ersatzframes möglichst die einfachen Namen `frame_01.png` bis `frame_06.png` verwenden.
