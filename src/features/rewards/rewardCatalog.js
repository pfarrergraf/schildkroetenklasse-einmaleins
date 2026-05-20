export const REWARD_COLLECTION_KEY = "schildi-dino-friends-v2";
export const BONUS_STAR_KEY = "schildi-dino-bonus-stars-v1";

export const DINO_REWARDS = [
  {
    id: "bruno-bronto",
    name: "Bruno Bronto",
    speciesId: "brachiosaurus-altithorax",
    species: "Brachiosaurus",
    germanName: "Brachiosaurus",
    scientificName: "Brachiosaurus altithorax",
    shortLabel: "Langhals",
    imagePath: `${import.meta.env.BASE_URL}rewards/dinos/dino-bruno-bronto.svg`,
    soundPath: `${import.meta.env.BASE_URL}audio/rewards/brachiosaurus-altithorax.wav`,
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
    imagePath: `${import.meta.env.BASE_URL}rewards/dinos/dino-trixi-triceratops.svg`,
    soundPath: `${import.meta.env.BASE_URL}audio/rewards/triceratops-horridus.wav`,
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
    imagePath: `${import.meta.env.BASE_URL}rewards/dinos/dino-pico-pteranodon.svg`,
    soundPath: `${import.meta.env.BASE_URL}audio/rewards/pteranodon-longiceps.wav`,
    animation: "pico-fly",
    theme: "blue",
    praise: "Pico flattert los. Deine Zahlen fliegen!",
    unlockText: "Pico Pteranodon fliegt in deine Sammlung!",
  },
  {
    id: "nora-nadelruecken",
    name: "Nora Nadelrücken",
    speciesId: "stegosaurus-stenops",
    species: "Stegosaurus",
    germanName: "Stegosaurus",
    scientificName: "Stegosaurus stenops",
    shortLabel: "Plattenrücken",
    imagePath: `${import.meta.env.BASE_URL}rewards/dinos/dino-nora-nadelruecken.svg`,
    soundPath: `${import.meta.env.BASE_URL}audio/rewards/dino-nora-nadelruecken.wav`,
    animation: "nora-wiggle",
    theme: "violet",
    praise: "Nora wackelt mit den Stacheln. Das war schildkrötenstark!",
    unlockText: "Nora Nadelrücken ist freigeschaltet!",
  },
  {
    id: "roxi-rex",
    name: "Roxi Rex",
    speciesId: "tyrannosaurus-rex",
    species: "Tyrannosaurus Rex",
    germanName: "Tyrannosaurus Rex",
    scientificName: "Tyrannosaurus rex",
    shortLabel: "T-Rex",
    imagePath: `${import.meta.env.BASE_URL}rewards/dinos/dino-roxi-rex.svg`,
    soundPath: `${import.meta.env.BASE_URL}audio/rewards/dino-roxi-rex.wav`,
    animation: "roxi-roar",
    theme: "red",
    praise: "Roxi brülljubelt. Zehn von zehn sind stark!",
    unlockText: "Roxi Rex stampft in deine Sammlung!",
  },
  {
    id: "lumi-ankylosaurus",
    name: "Lumi Ankylosaurus",
    speciesId: "ankylosaurus-magniventris",
    species: "Ankylosaurus",
    germanName: "Ankylosaurus",
    scientificName: "Ankylosaurus magniventris",
    shortLabel: "Panzerfreund",
    imagePath: `${import.meta.env.BASE_URL}rewards/dinos/dino-lumi-ankylosaurus.svg`,
    soundPath: `${import.meta.env.BASE_URL}audio/rewards/dino-lumi-ankylosaurus.wav`,
    animation: "lumi-swing",
    theme: "mint",
    praise: "Lumi schwingt den Panzer-Schwanz. Du hast durchgehalten!",
    unlockText: "Lumi Ankylosaurus leuchtet in deiner Sammlung!",
  },
];

export function getRewardById(id) {
  return DINO_REWARDS.find((reward) => reward.id === id) ?? null;
}

export function getLockedRewards(unlockedIds) {
  const unlocked = new Set(unlockedIds);
  return DINO_REWARDS.filter((reward) => !unlocked.has(reward.id));
}

export function pickRewardChoices(unlockedIds, count = 3) {
  const locked = getLockedRewards(unlockedIds);
  const shuffled = [...locked].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
