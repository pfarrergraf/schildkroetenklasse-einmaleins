const dinoFrameModules = import.meta.glob("../../../assets/rewards/prehistoric/*/frame_*.png", {
  eager: true,
  import: "default",
});

function getFramesForSpecies(speciesId) {
  return Object.entries(dinoFrameModules)
    .filter(([path]) => path.includes(`/assets/rewards/prehistoric/${speciesId}/`))
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }))
    .map(([, src]) => src);
}

export const DINO_ANIMATIONS = [
  {
    id: "brachiosaurus-altithorax",
    rewardId: "bruno-brachio",
    displayName: "Bruno Brachio",
    germanName: "Brachiosaurus",
    scientificName: "Brachiosaurus altithorax",
    shortText: "Bruno hebt den langen Hals und freut sich ruhig mit dir.",
    motion: "gentle-breathe",
    frames: getFramesForSpecies("brachiosaurus-altithorax"),
  },
  {
    id: "triceratops-horridus",
    rewardId: "trixi-triceratops",
    displayName: "Trixi Triceratops",
    germanName: "Triceratops",
    scientificName: "Triceratops horridus",
    shortText: "Trixi stampft stolz mit drei Hörnern.",
    motion: "steady-stomp",
    frames: getFramesForSpecies("triceratops-horridus"),
  },
  {
    id: "pteranodon-longiceps",
    rewardId: "pico-pteranodon",
    displayName: "Pico Pteranodon",
    germanName: "Pteranodon",
    scientificName: "Pteranodon longiceps",
    shortText: "Pico gleitet mit geöffneten Flügeln durch die Luft.",
    motion: "wing-float",
    frames: getFramesForSpecies("pteranodon-longiceps"),
  },
];

export function getDinoAnimation(speciesIdOrRewardId) {
  return DINO_ANIMATIONS.find(
    (dino) => dino.id === speciesIdOrRewardId || dino.rewardId === speciesIdOrRewardId
  ) ?? null;
}

export function getReadyDinoAnimations() {
  return DINO_ANIMATIONS.filter((dino) => dino.frames.length >= 6);
}
