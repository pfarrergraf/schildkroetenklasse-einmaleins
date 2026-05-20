export const REWARD_COLLECTION_KEY = "schildi-dino-photoreal-v1";
export const BONUS_STAR_KEY = "schildi-dino-bonus-stars-v1";
const BASE_URL = typeof import.meta !== "undefined" && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : "/";

const BRACHIOSAURUS_VIDEO_PATH = new URL(
  "../../../assets/dinos/dinosaur_videos/Brachiosaurus.mp4",
  import.meta.url
).href;
const TRICERATOPS_VIDEO_PATH = new URL(
  "../../../assets/dinos/dinosaur_videos/Triceratops.mp4",
  import.meta.url
).href;
const PTERANODON_VIDEO_PATH = new URL(
  "../../../assets/dinos/dinosaur_videos/Pteranodon.mp4",
  import.meta.url
).href;
const PARASAUROLOPHUS_VIDEO_PATH = new URL(
  "../../../assets/dinos/dinosaur_videos/Parasaurolophus.mp4",
  import.meta.url
).href;
const TRODON_VIDEO_PATH = new URL(
  "../../../assets/dinos/dinosaur_videos/Trodon.mp4",
  import.meta.url
).href;
const STEGOSAURUS_VIDEO_PATH = new URL(
  "../../../assets/dinos/dinosaur_videos/Stegosaurus.mp4",
  import.meta.url
).href;
const TREX_VIDEO_PATH = new URL(
  "../../../assets/dinos/dinosaur_videos/T-Rex.mp4",
  import.meta.url
).href;
const EUOPLOCEPHALUS_VIDEO_PATH = new URL(
  "../../../assets/dinos/dinosaur_videos/Euoplocephalus.mp4",
  import.meta.url
).href;

export const DINO_REWARDS = [
  {
    id: "bruno-bronto",
    name: "Bruno Bronto",
    speciesId: "brachiosaurus-altithorax",
    species: "Brachiosaurus",
    germanName: "Brachiosaurus",
    scientificName: "Brachiosaurus altithorax",
    shortLabel: "Langhals",
    imagePath: `${BASE_URL}rewards/dinos/dino-bruno-bronto.svg`,
    soundPath: `${BASE_URL}audio/rewards/brachiosaurus-altithorax.wav`,
    videoPath: BRACHIOSAURUS_VIDEO_PATH,
    animation: "bronto-step",
    theme: "green",
    praise: "Bruno macht lange Hälse vor Freude. Du hast richtig stark gerechnet!",
    unlockText: "Bruno Bronto kommt in deine Sammlung!",
  },
  {
    id: "trixi-triceratops",
    name: "Trixi Triceratops",
    speciesId: "triceratops-horridus",
    species: "Triceratops",
    germanName: "Triceratops",
    scientificName: "Triceratops horridus",
    shortLabel: "Dreihorn",
    imagePath: `${BASE_URL}rewards/dinos/dino-trixi-triceratops.svg`,
    soundPath: `${BASE_URL}audio/rewards/triceratops-horridus.wav`,
    videoPath: TRICERATOPS_VIDEO_PATH,
    animation: "trixi-stomp",
    theme: "orange",
    praise: "Trixi stampft vor Begeisterung. Eine perfekte Runde!",
    unlockText: "Trixi Triceratops gehört jetzt zu dir!",
  },
  {
    id: "pico-pteranodon",
    name: "Pico Pteranodon",
    speciesId: "pteranodon-longiceps",
    species: "Pteranodon",
    germanName: "Pteranodon",
    scientificName: "Pteranodon longiceps",
    shortLabel: "Flugsaurier",
    imagePath: `${BASE_URL}rewards/dinos/dino-pico-pteranodon.svg`,
    soundPath: `${BASE_URL}audio/rewards/pteranodon-longiceps.wav`,
    videoPath: PTERANODON_VIDEO_PATH,
    animation: "pico-fly",
    theme: "blue",
    praise: "Pico flattert los. Deine Zahlen fliegen!",
    unlockText: "Pico Pteranodon fliegt in deine Sammlung!",
  },
  {
    id: "paula-parasaurolophus",
    name: "Paula Parasaurolophus",
    speciesId: "parasaurolophus-walkeri",
    species: "Parasaurolophus",
    germanName: "Parasaurolophus",
    scientificName: "Parasaurolophus walkeri",
    shortLabel: "Kamm-Dino",
    imagePath: "",
    soundPath: `${BASE_URL}audio/rewards/parasaurolophus-walkeri.wav`,
    videoPath: PARASAUROLOPHUS_VIDEO_PATH,
    animation: "parasauro-prance",
    theme: "amber",
    praise: "Paula trägt ihren Kamm ganz stolz. Das war eine starke Runde!",
    unlockText: "Paula Parasaurolophus ist jetzt in deiner Sammlung!",
  },
  {
    id: "vito-velociraptor",
    name: "Vito Velociraptor",
    speciesId: "velociraptor-mongoliensis",
    species: "Velociraptor",
    germanName: "Velociraptor",
    scientificName: "Velociraptor mongoliensis",
    shortLabel: "Feder-Räuber",
    imagePath: "",
    soundPath: `${BASE_URL}audio/rewards/velociraptor-mongoliensis.wav`,
    videoPath: TRODON_VIDEO_PATH,
    animation: "raptor-prance",
    theme: "teal",
    praise: "Vito stellt seine Krallen auf. Du hast blitzschnell gerechnet!",
    unlockText: "Vito Velociraptor ist jetzt freigeschaltet!",
  },
  {
    id: "nora-nadelruecken",
    name: "Nora Nadelrücken",
    speciesId: "stegosaurus-stenops",
    species: "Stegosaurus",
    germanName: "Stegosaurus",
    scientificName: "Stegosaurus stenops",
    shortLabel: "Plattenrücken",
    imagePath: "",
    soundPath: `${BASE_URL}audio/rewards/stegosaurus-stenops.wav`,
    videoPath: STEGOSAURUS_VIDEO_PATH,
    animation: "nora-wiggle",
    theme: "violet",
    praise: "Nora wackelt mit ihren Rückenplatten. Das war schildkrötenstark!",
    unlockText: "Nora Nadelrücken ist jetzt in deiner Sammlung!",
  },
  {
    id: "roxi-rex",
    name: "Roxi Rex",
    speciesId: "tyrannosaurus-rex",
    species: "Tyrannosaurus",
    germanName: "Tyrannosaurus",
    scientificName: "Tyrannosaurus rex",
    shortLabel: "T-Rex",
    imagePath: "",
    soundPath: `${BASE_URL}audio/rewards/tyrannosaurus-rex.wav`,
    videoPath: TREX_VIDEO_PATH,
    animation: "roxi-roar",
    theme: "red",
    praise: "Roxi zeigt ihre Zähne und freut sich riesig. Zehn von zehn!",
    unlockText: "Roxi Rex stampft in deine Sammlung!",
  },
  {
    id: "eulo-euoplocephalus",
    name: "Eulo Euoplocephalus",
    speciesId: "euoplocephalus-tutus",
    species: "Euoplocephalus",
    germanName: "Euoplocephalus",
    scientificName: "Euoplocephalus tutus",
    shortLabel: "Keulenschwanz",
    imagePath: "",
    soundPath: `${BASE_URL}audio/rewards/euoplocephalus-tutus.wav`,
    videoPath: EUOPLOCEPHALUS_VIDEO_PATH,
    animation: "eulo-sway",
    theme: "mint",
    praise: "Eulo schwingt fröhlich seine Schwanzkeule. Ganz stark gerechnet!",
    unlockText: "Eulo Euoplocephalus ist jetzt freigeschaltet!",
  },
];

export function getRewardById(id) {
  return DINO_REWARDS.find((reward) => reward.id === id) ?? null;
}

export function getLockedRewards(unlockedIds) {
  const unlocked = new Set(unlockedIds);
  return DINO_REWARDS.filter((reward) => !unlocked.has(reward.id));
}

function hashSeed(seed) {
  const source = String(seed ?? "reward-seed");
  let hash = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed) {
  let current = hashSeed(seed) || 1;

  return () => {
    current += 0x6d2b79f5;
    let mixed = Math.imul(current ^ (current >>> 15), current | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickRewardChoices(unlockedIds, count = 3, seed = "reward-seed") {
  const locked = getLockedRewards(unlockedIds);
  const random = createSeededRandom(`${seed}|${locked.map((reward) => reward.id).join("|")}`);
  const shuffled = [...locked];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[nextIndex]] = [shuffled[nextIndex], shuffled[index]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}
