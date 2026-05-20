import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const W = 1200;
const H = 630;
const TURTLE_H = 520;

// SVG background layer: gradient + text + floating math symbols
const bg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#14532d"/>
      <stop offset="60%" stop-color="#16a34a"/>
      <stop offset="100%" stop-color="#4ade80"/>
    </linearGradient>
    <!-- soft vignette on right so turtle blends in -->
    <radialGradient id="vig" cx="100%" cy="50%" r="60%">
      <stop offset="0%"  stop-color="#166534" stop-opacity="0"/>
      <stop offset="100%" stop-color="#14532d" stop-opacity="0.35"/>
    </radialGradient>
  </defs>

  <!-- background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>

  <!-- subtle grid of math symbols -->
  <g font-family="sans-serif" fill="white" opacity="0.07" font-size="72" font-weight="bold">
    <text x="30"  y="100">×</text>
    <text x="150" y="200">+</text>
    <text x="60"  y="320">9</text>
    <text x="200" y="420">×</text>
    <text x="80"  y="530">7</text>
    <text x="300" y="120">6</text>
    <text x="350" y="580">×</text>
    <text x="420" y="280">8</text>
    <text x="480" y="480">3</text>
    <text x="520" y="160">×</text>
    <text x="550" y="560">4</text>
    <text x="600" y="80">×</text>
  </g>

  <!-- left-side text block -->
  <!-- app name -->
  <text x="80" y="210"
    font-family="'Segoe UI', Arial, sans-serif"
    font-size="88"
    font-weight="900"
    fill="white"
    letter-spacing="-2">Schildi 1×1</text>

  <!-- tagline line 1 -->
  <text x="82" y="290"
    font-family="'Segoe UI', Arial, sans-serif"
    font-size="38"
    font-weight="400"
    fill="#bbf7d0">Das Einmaleins-Spiel</text>

  <!-- tagline line 2 -->
  <text x="82" y="338"
    font-family="'Segoe UI', Arial, sans-serif"
    font-size="38"
    font-weight="400"
    fill="#bbf7d0">für die Schildkrötenklasse</text>

  <!-- badge pill -->
  <rect x="80" y="390" width="310" height="58" rx="29" fill="white" opacity="0.18"/>
  <text x="235" y="428"
    font-family="'Segoe UI', Arial, sans-serif"
    font-size="30"
    font-weight="700"
    fill="white"
    text-anchor="middle">Jetzt kostenlos spielen ▶</text>

  <!-- bottom tagline -->
  <text x="80" y="580"
    font-family="'Segoe UI', Arial, sans-serif"
    font-size="24"
    fill="#86efac"
    opacity="0.9">Klasse 2 · Zahlenraum bis 100 · Kein Account nötig</text>
</svg>`;

// Resize the turtle PNG keeping aspect ratio, fit within TURTLE_H height
const turtlePath = resolve(root, 'assets/Hallo/ChatGPT Image May 19, 2026, 08_08_16 PM (1).png');

// Get resized dimensions first
const turtleMeta = await sharp(turtlePath)
  .resize({ height: TURTLE_H, fit: 'inside', withoutEnlargement: false })
  .metadata();

const turtlePng = await sharp(turtlePath)
  .resize({ height: TURTLE_H, fit: 'inside', withoutEnlargement: false })
  .png()
  .toBuffer();

// sharp metadata after resize: use the resize target
const tW = Math.round((turtleMeta.width ?? 500) * (TURTLE_H / (turtleMeta.height ?? TURTLE_H)));
const tH = TURTLE_H;

// Position turtle: right side, vertically centered, slightly lower
const turtleLeft = W - tW - 20;
const turtleTop  = Math.round((H - tH) / 2) + 40;

const outPath = resolve(root, 'public/og-preview.png');

await sharp(Buffer.from(bg))
  .resize(W, H)
  .composite([
    { input: turtlePng, left: turtleLeft, top: turtleTop, blend: 'over' },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outPath);

console.log(`✓ og-preview.png written (${W}×${H}) → ${outPath}`);
