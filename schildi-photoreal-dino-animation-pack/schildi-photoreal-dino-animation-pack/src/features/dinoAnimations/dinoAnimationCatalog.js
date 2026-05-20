const dinoFrameModules = import.meta.glob("../../../assets/dinos/*/frame_*.png", {
  eager: true,
  import: "default",
});

function getFramesForSpecies(speciesId) {
  return Object.entries(dinoFrameModules)
    .filter(([path]) => path.includes(`/assets/dinos/${speciesId}/`))
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }))
    .map(([, src]) => src);
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
    sound: `${import.meta.env.BASE_URL}audio/rewards/brachiosaurus-altithorax.wav`,
    frames: getFramesForSpecies("brachiosaurus-altithorax"),
  },
  {
    id: "triceratops-horridus",
    rewardId: "trixi-triceratops",
    displayName: "Trixi Triceratops",
    germanName: "Triceratops",
    scientificName: "Triceratops horridus",
    shortText: "Trixi stampft vor Begeisterung.",
    motion: "stomp",
    sound: `${import.meta.env.BASE_URL}audio/rewards/triceratops-horridus.wav`,
    frames: getFramesForSpecies("triceratops-horridus"),
  },
  {
    id: "pteranodon-longiceps",
    rewardId: "pico-pteranodon",
    displayName: "Pico Pteranodon",
    germanName: "Pteranodon",
    scientificName: "Pteranodon longiceps",
    shortText: "Pico schwebt durch die Sammlung.",
    motion: "wing-float",
    sound: `${import.meta.env.BASE_URL}audio/rewards/pteranodon-longiceps.wav`,
    frames: getFramesForSpecies("pteranodon-longiceps"),
  },
];

export function getDinoAnimation(speciesIdOrRewardId) {
  return DINO_ANIMATIONS.find(
    (dino) => dino.id === speciesIdOrRewardId || dino.rewardId === speciesIdOrRewardId
  );
}
