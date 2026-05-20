const frameModules = import.meta.glob("../../../assets/dinos/*/frame_*.png", { eager: true, import: "default" });

export const DINO_REWARDS_20 = [
  {
    "id": "brachiosaurus-altithorax",
    "rewardName": "Bruno Brachio",
    "commonName": "Brachiosaurus",
    "scientificName": "Brachiosaurus altithorax",
    "type": "Langhals-Saurier",
    "motionPreset": "slowDance",
    "audioFile": "brachiosaurus-altithorax.wav",
    "kidText": "Bruno Brachio gehört jetzt zu deiner Sammlung.",
    "description": "Brachiosaurus (Brachiosaurus altithorax) - Langhals-Saurier"
  },
  {
    "id": "triceratops-horridus",
    "rewardName": "Trixi Triceratops",
    "commonName": "Triceratops",
    "scientificName": "Triceratops horridus",
    "type": "Dreihorn-Dino",
    "motionPreset": "stomp",
    "audioFile": "triceratops-horridus.wav",
    "kidText": "Trixi Triceratops gehört jetzt zu deiner Sammlung.",
    "description": "Triceratops (Triceratops horridus) - Dreihorn-Dino"
  },
  {
    "id": "pteranodon-longiceps",
    "rewardName": "Pico Pteranodon",
    "commonName": "Pteranodon",
    "scientificName": "Pteranodon longiceps",
    "type": "Flugsaurier",
    "motionPreset": "wingWave",
    "audioFile": "pteranodon-longiceps.wav",
    "kidText": "Pico Pteranodon gehört jetzt zu deiner Sammlung.",
    "description": "Pteranodon (Pteranodon longiceps) - Flugsaurier"
  },
  {
    "id": "stegosaurus-stenops",
    "rewardName": "Nora Nadelrücken",
    "commonName": "Stegosaurus",
    "scientificName": "Stegosaurus stenops",
    "type": "Platten-Dino",
    "motionPreset": "tailWag",
    "audioFile": "stegosaurus-stenops.wav",
    "kidText": "Nora Nadelrücken gehört jetzt zu deiner Sammlung.",
    "description": "Stegosaurus (Stegosaurus stenops) - Platten-Dino"
  },
  {
    "id": "tyrannosaurus-rex",
    "rewardName": "Roxi Rex",
    "commonName": "Tyrannosaurus",
    "scientificName": "Tyrannosaurus rex",
    "type": "Raubdino",
    "motionPreset": "roarBounce",
    "audioFile": "tyrannosaurus-rex.wav",
    "kidText": "Roxi Rex gehört jetzt zu deiner Sammlung.",
    "description": "Tyrannosaurus (Tyrannosaurus rex) - Raubdino"
  },
  {
    "id": "ankylosaurus-magniventris",
    "rewardName": "Lumi Ankylosaurus",
    "commonName": "Ankylosaurus",
    "scientificName": "Ankylosaurus magniventris",
    "type": "Panzer-Dino",
    "motionPreset": "armorHop",
    "audioFile": "ankylosaurus-magniventris.wav",
    "kidText": "Lumi Ankylosaurus gehört jetzt zu deiner Sammlung.",
    "description": "Ankylosaurus (Ankylosaurus magniventris) - Panzer-Dino"
  },
  {
    "id": "parasaurolophus-walkeri",
    "rewardName": "Paula Parasaurolophus",
    "commonName": "Parasaurolophus",
    "scientificName": "Parasaurolophus walkeri",
    "type": "Kamm-Dino",
    "motionPreset": "headBob",
    "audioFile": "parasaurolophus-walkeri.wav",
    "kidText": "Paula Parasaurolophus gehört jetzt zu deiner Sammlung.",
    "description": "Parasaurolophus (Parasaurolophus walkeri) - Kamm-Dino"
  },
  {
    "id": "velociraptor-mongoliensis",
    "rewardName": "Vito Velociraptor",
    "commonName": "Velociraptor",
    "scientificName": "Velociraptor mongoliensis",
    "type": "kleiner Feder-Räuber",
    "motionPreset": "quickStep",
    "audioFile": "velociraptor-mongoliensis.wav",
    "kidText": "Vito Velociraptor gehört jetzt zu deiner Sammlung.",
    "description": "Velociraptor (Velociraptor mongoliensis) - kleiner Feder-Räuber"
  },
  {
    "id": "spinosaurus-aegyptiacus",
    "rewardName": "Spino Spinosaurus",
    "commonName": "Spinosaurus",
    "scientificName": "Spinosaurus aegyptiacus",
    "type": "Segel-Dino",
    "motionPreset": "sailWave",
    "audioFile": "spinosaurus-aegyptiacus.wav",
    "kidText": "Spino Spinosaurus gehört jetzt zu deiner Sammlung.",
    "description": "Spinosaurus (Spinosaurus aegyptiacus) - Segel-Dino"
  },
  {
    "id": "diplodocus-carnegii",
    "rewardName": "Dilo Diplodocus",
    "commonName": "Diplodocus",
    "scientificName": "Diplodocus carnegii",
    "type": "Langschwanz-Saurier",
    "motionPreset": "slowDance",
    "audioFile": "diplodocus-carnegii.wav",
    "kidText": "Dilo Diplodocus gehört jetzt zu deiner Sammlung.",
    "description": "Diplodocus (Diplodocus carnegii) - Langschwanz-Saurier"
  },
  {
    "id": "allosaurus-fragilis",
    "rewardName": "Allo Allosaurus",
    "commonName": "Allosaurus",
    "scientificName": "Allosaurus fragilis",
    "type": "Jäger-Dino",
    "motionPreset": "roarBounce",
    "audioFile": "allosaurus-fragilis.wav",
    "kidText": "Allo Allosaurus gehört jetzt zu deiner Sammlung.",
    "description": "Allosaurus (Allosaurus fragilis) - Jäger-Dino"
  },
  {
    "id": "iguanodon-bernissartensis",
    "rewardName": "Iggi Iguanodon",
    "commonName": "Iguanodon",
    "scientificName": "Iguanodon bernissartensis",
    "type": "Daumenstachel-Dino",
    "motionPreset": "wave",
    "audioFile": "iguanodon-bernissartensis.wav",
    "kidText": "Iggi Iguanodon gehört jetzt zu deiner Sammlung.",
    "description": "Iguanodon (Iguanodon bernissartensis) - Daumenstachel-Dino"
  },
  {
    "id": "pachycephalosaurus-wyomingensis",
    "rewardName": "Paki Pachykopf",
    "commonName": "Pachycephalosaurus",
    "scientificName": "Pachycephalosaurus wyomingensis",
    "type": "Dickschädel-Dino",
    "motionPreset": "nod",
    "audioFile": "pachycephalosaurus-wyomingensis.wav",
    "kidText": "Paki Pachykopf gehört jetzt zu deiner Sammlung.",
    "description": "Pachycephalosaurus (Pachycephalosaurus wyomingensis) - Dickschädel-Dino"
  },
  {
    "id": "carnotaurus-sastrei",
    "rewardName": "Carlo Carnotaurus",
    "commonName": "Carnotaurus",
    "scientificName": "Carnotaurus sastrei",
    "type": "Hörnchen-Räuber",
    "motionPreset": "roarBounce",
    "audioFile": "carnotaurus-sastrei.wav",
    "kidText": "Carlo Carnotaurus gehört jetzt zu deiner Sammlung.",
    "description": "Carnotaurus (Carnotaurus sastrei) - Hörnchen-Räuber"
  },
  {
    "id": "deinonychus-antirrhopus",
    "rewardName": "Dina Deinonychus",
    "commonName": "Deinonychus",
    "scientificName": "Deinonychus antirrhopus",
    "type": "Krallen-Dino",
    "motionPreset": "quickStep",
    "audioFile": "deinonychus-antirrhopus.wav",
    "kidText": "Dina Deinonychus gehört jetzt zu deiner Sammlung.",
    "description": "Deinonychus (Deinonychus antirrhopus) - Krallen-Dino"
  },
  {
    "id": "styracosaurus-albertensis",
    "rewardName": "Stella Styracosaurus",
    "commonName": "Styracosaurus",
    "scientificName": "Styracosaurus albertensis",
    "type": "Stachelkragen-Dino",
    "motionPreset": "stomp",
    "audioFile": "styracosaurus-albertensis.wav",
    "kidText": "Stella Styracosaurus gehört jetzt zu deiner Sammlung.",
    "description": "Styracosaurus (Styracosaurus albertensis) - Stachelkragen-Dino"
  },
  {
    "id": "gallimimus-bullatus",
    "rewardName": "Galli Gallimimus",
    "commonName": "Gallimimus",
    "scientificName": "Gallimimus bullatus",
    "type": "Renn-Dino",
    "motionPreset": "runInPlace",
    "audioFile": "gallimimus-bullatus.wav",
    "kidText": "Galli Gallimimus gehört jetzt zu deiner Sammlung.",
    "description": "Gallimimus (Gallimimus bullatus) - Renn-Dino"
  },
  {
    "id": "archaeopteryx-lithographica",
    "rewardName": "Archi Archaeopteryx",
    "commonName": "Archaeopteryx",
    "scientificName": "Archaeopteryx lithographica",
    "type": "Urvogel",
    "motionPreset": "wingWave",
    "audioFile": "archaeopteryx-lithographica.wav",
    "kidText": "Archi Archaeopteryx gehört jetzt zu deiner Sammlung.",
    "description": "Archaeopteryx (Archaeopteryx lithographica) - Urvogel"
  },
  {
    "id": "euoplocephalus-tutus",
    "rewardName": "Eulo Euoplocephalus",
    "commonName": "Euoplocephalus",
    "scientificName": "Euoplocephalus tutus",
    "type": "Keulenschwanz-Dino",
    "motionPreset": "armorHop",
    "audioFile": "euoplocephalus-tutus.wav",
    "kidText": "Eulo Euoplocephalus gehört jetzt zu deiner Sammlung.",
    "description": "Euoplocephalus (Euoplocephalus tutus) - Keulenschwanz-Dino"
  },
  {
    "id": "compsognathus-longipes",
    "rewardName": "Compi Compsognathus",
    "commonName": "Compsognathus",
    "scientificName": "Compsognathus longipes",
    "type": "Mini-Räuber",
    "motionPreset": "quickStep",
    "audioFile": "compsognathus-longipes.wav",
    "kidText": "Compi Compsognathus gehört jetzt zu deiner Sammlung.",
    "description": "Compsognathus (Compsognathus longipes) - Mini-Räuber"
  }
];

function loadFramesForDino(dinoId) {
  return Object.entries(frameModules)
    .filter(([path]) => path.includes(`/dinos/${dinoId}/`))
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }))
    .map(([, src]) => src);
}

export const DINO_ANIMATION_CATALOG = DINO_REWARDS_20.reduce((acc, dino) => {
  acc[dino.id] = { ...dino, frames: loadFramesForDino(dino.id) };
  return acc;
}, {});

export function getDinoAnimation(dinoId) {
  return DINO_ANIMATION_CATALOG[dinoId] ?? DINO_ANIMATION_CATALOG["brachiosaurus-altithorax"];
}
