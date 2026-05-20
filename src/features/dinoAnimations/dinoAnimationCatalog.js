const dinoFrameModules = import.meta.glob("../../../assets/dinos/*/frame_*.{png,svg,webp}", {
  eager: true,
  import: "default",
});

function assetPath(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function getFramesForSpecies(speciesId, fallbackPath) {
  const frameSequence = Object.entries(dinoFrameModules)
    .filter(([path]) => path.includes(`/assets/dinos/${speciesId}/`))
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }))
    .map(([, src]) => src);

  if (frameSequence.length > 0) return frameSequence;
  if (!fallbackPath) return [];

  return Array.from({ length: 6 }, () => assetPath(fallbackPath));
}

export const DINO_ANIMATIONS = [
  {
    id: "brachiosaurus-altithorax",
    rewardId: "bruno-bronto",
    displayName: "Bruno Bronto",
    germanName: "Brachiosaurus",
    scientificName: "Brachiosaurus altithorax",
    shortText: "Bruno macht lange Hälse vor Freude.",
    motion: "gentle-walk",
    sound: assetPath("audio/rewards/brachiosaurus-altithorax.wav"),
    frames: getFramesForSpecies("brachiosaurus-altithorax", "rewards/dinos/dino-bruno-bronto.svg"),
  },
  {
    id: "triceratops-horridus",
    rewardId: "trixi-triceratops",
    displayName: "Trixi Triceratops",
    germanName: "Triceratops",
    scientificName: "Triceratops horridus",
    shortText: "Trixi stampft vor Begeisterung.",
    motion: "stomp",
    sound: assetPath("audio/rewards/triceratops-horridus.wav"),
    frames: getFramesForSpecies("triceratops-horridus", "rewards/dinos/dino-trixi-triceratops.svg"),
  },
  {
    id: "pteranodon-longiceps",
    rewardId: "pico-pteranodon",
    displayName: "Pico Pteranodon",
    germanName: "Pteranodon",
    scientificName: "Pteranodon longiceps",
    shortText: "Pico schwebt durch die Sammlung.",
    motion: "wing-float",
    sound: assetPath("audio/rewards/pteranodon-longiceps.wav"),
    frames: getFramesForSpecies("pteranodon-longiceps", "rewards/dinos/dino-pico-pteranodon.svg"),
  },
  {
    id: "stegosaurus-stenops",
    rewardId: "nora-nadelruecken",
    displayName: "Nora Nadelrücken",
    germanName: "Stegosaurus",
    scientificName: "Stegosaurus stenops",
    shortText: "Nora wackelt fröhlich mit ihren Rückenplatten.",
    motion: "plate-wiggle",
    sound: assetPath("audio/rewards/dino-nora-nadelruecken.wav"),
    frames: getFramesForSpecies("stegosaurus-stenops", "rewards/dinos/dino-nora-nadelruecken.svg"),
  },
  {
    id: "tyrannosaurus-rex",
    rewardId: "roxi-rex",
    displayName: "Roxi Rex",
    germanName: "Tyrannosaurus Rex",
    scientificName: "Tyrannosaurus rex",
    shortText: "Roxi jubelt mit einem kleinen, freundlichen Rex-Roar.",
    motion: "roar-bounce",
    sound: assetPath("audio/rewards/dino-roxi-rex.wav"),
    frames: getFramesForSpecies("tyrannosaurus-rex", "rewards/dinos/dino-roxi-rex.svg"),
  },
  {
    id: "ankylosaurus-magniventris",
    rewardId: "lumi-ankylosaurus",
    displayName: "Lumi Ankylosaurus",
    germanName: "Ankylosaurus",
    scientificName: "Ankylosaurus magniventris",
    shortText: "Lumi schwingt den Panzer-Schwanz ganz sanft.",
    motion: "tail-swing",
    sound: assetPath("audio/rewards/dino-lumi-ankylosaurus.wav"),
    frames: getFramesForSpecies("ankylosaurus-magniventris", "rewards/dinos/dino-lumi-ankylosaurus.svg"),
  },
];

export function getDinoAnimation(speciesIdOrRewardId) {
  return DINO_ANIMATIONS.find(
    (dino) => dino.id === speciesIdOrRewardId || dino.rewardId === speciesIdOrRewardId
  );
}
