const dinoFrameModules = import.meta.glob("../../../assets/dinos/*/frame_*.png", {
  import: "default",
});

function getFrameEntriesForSpecies(speciesId) {
  return Object.entries(dinoFrameModules)
    .filter(([path]) => path.includes(`/assets/dinos/${speciesId}/`))
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }));
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
  },
  {
    id: "parasaurolophus-walkeri",
    rewardId: "paula-parasaurolophus",
    displayName: "Paula Parasaurolophus",
    germanName: "Parasaurolophus",
    scientificName: "Parasaurolophus walkeri",
    shortText: "Paula nickt fröhlich mit ihrem Kamm.",
    motion: "gentle-walk",
    sound: `${import.meta.env.BASE_URL}audio/rewards/parasaurolophus-walkeri.wav`,
  },
  {
    id: "velociraptor-mongoliensis",
    rewardId: "vito-velociraptor",
    displayName: "Vito Velociraptor",
    germanName: "Velociraptor",
    scientificName: "Velociraptor mongoliensis",
    shortText: "Vito tänzelt blitzschnell vor Freude.",
    motion: "stomp",
    sound: `${import.meta.env.BASE_URL}audio/rewards/velociraptor-mongoliensis.wav`,
  },
  {
    id: "stegosaurus-stenops",
    rewardId: "nora-nadelruecken",
    displayName: "Nora Nadelrücken",
    germanName: "Stegosaurus",
    scientificName: "Stegosaurus stenops",
    shortText: "Nora wackelt mit ihren Rückenplatten.",
    motion: "gentle-walk",
    sound: `${import.meta.env.BASE_URL}audio/rewards/stegosaurus-stenops.wav`,
  },
  {
    id: "tyrannosaurus-rex",
    rewardId: "roxi-rex",
    displayName: "Roxi Rex",
    germanName: "Tyrannosaurus",
    scientificName: "Tyrannosaurus rex",
    shortText: "Roxi brüllt begeistert los.",
    motion: "stomp",
    sound: `${import.meta.env.BASE_URL}audio/rewards/tyrannosaurus-rex.wav`,
  },
  {
    id: "euoplocephalus-tutus",
    rewardId: "eulo-euoplocephalus",
    displayName: "Eulo Euoplocephalus",
    germanName: "Euoplocephalus",
    scientificName: "Euoplocephalus tutus",
    shortText: "Eulo schwingt fröhlich seine Schwanzkeule.",
    motion: "gentle-walk",
    sound: `${import.meta.env.BASE_URL}audio/rewards/euoplocephalus-tutus.wav`,
  },
];

export function getDinoAnimation(speciesIdOrRewardId) {
  return DINO_ANIMATIONS.find(
    (dino) => dino.id === speciesIdOrRewardId || dino.rewardId === speciesIdOrRewardId
  );
}

export async function loadDinoFrames(speciesIdOrRewardId, { limit } = {}) {
  const dino = getDinoAnimation(speciesIdOrRewardId);
  if (!dino) {
    return [];
  }

  const frameEntries = getFrameEntriesForSpecies(dino.id);
  const selectedEntries = typeof limit === "number" ? frameEntries.slice(0, limit) : frameEntries;

  return Promise.all(selectedEntries.map(([, loader]) => loader()));
}
