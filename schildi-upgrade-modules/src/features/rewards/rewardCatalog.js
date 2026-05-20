const rewardAsset = (path) => `${import.meta.env.BASE_URL}rewards/${path}`;

export const REWARD_WORLDS = [
  {
    id: "dino-freunde",
    name: "Schildis Dino-Freunde",
    shortName: "Dinos",
    description: "Schildi sammelt freundliche Dinos, die bei perfekten Runden tanzen und jubeln.",
    primary: true,
  },
  {
    id: "rettungshelden",
    name: "Rettungshelden",
    shortName: "Rettung",
    description: "Feuerwehr, Polizei und Krankenwagen als spätere zweite Sammelwelt.",
    primary: false,
  },
  {
    id: "tierpark",
    name: "Schildis Tierpark",
    shortName: "Tiere",
    description: "Sanfte Tierfreunde als ruhige Alternative zu Action-Belohnungen.",
    primary: false,
  },
];

export const REWARDS = [
  {
    id: "dino-bruno",
    worldId: "dino-freunde",
    name: "Bruno Bronto",
    rarity: "start",
    emoji: "🦕",
    image: rewardAsset("dinos/dino-bruno.svg"),
    color: "#81c784",
    motion: "dance",
    message: "Bruno macht lange Hälse vor Freude. Du hast richtig stark gerechnet!",
  },
  {
    id: "dino-trixi",
    worldId: "dino-freunde",
    name: "Trixi Triceratops",
    rarity: "start",
    emoji: "🦖",
    image: rewardAsset("dinos/dino-trixi.svg"),
    color: "#ffcc80",
    motion: "hop",
    message: "Trixi stampft vor Begeisterung. Eine perfekte Runde!",
  },
  {
    id: "dino-pico",
    worldId: "dino-freunde",
    name: "Pico Ptero",
    rarity: "normal",
    emoji: "🪽",
    image: rewardAsset("dinos/dino-pico.svg"),
    color: "#80deea",
    motion: "float",
    message: "Pico flattert durch die Zahlenluft. Du hebst ab!",
  },
  {
    id: "dino-nora",
    worldId: "dino-freunde",
    name: "Nora Nadelrücken",
    rarity: "normal",
    emoji: "🌿",
    image: rewardAsset("dinos/dino-nora.svg"),
    color: "#a5d6a7",
    motion: "wiggle",
    message: "Nora wackelt mit den Stacheln. Das war schildkrötenstark!",
  },
  {
    id: "dino-roxi",
    worldId: "dino-freunde",
    name: "Roxi Raptor",
    rarity: "rare",
    emoji: "⭐",
    image: rewardAsset("dinos/dino-roxi.svg"),
    color: "#ffab91",
    motion: "spin",
    message: "Roxi macht einen Jubelsprung. Volltreffer in der Dino-Sammlung!",
  },
  {
    id: "dino-lumi",
    worldId: "dino-freunde",
    name: "Lumi Leuchtdino",
    rarity: "rare",
    emoji: "✨",
    image: rewardAsset("dinos/dino-lumi.svg"),
    color: "#ce93d8",
    motion: "glow",
    message: "Lumi leuchtet, weil du so konzentriert gerechnet hast.",
  },
];

export const PRIMARY_REWARD_WORLD_ID = "dino-freunde";

export function getRewardsForWorld(worldId = PRIMARY_REWARD_WORLD_ID) {
  return REWARDS.filter((reward) => reward.worldId === worldId);
}

export function getRewardById(rewardId) {
  return REWARDS.find((reward) => reward.id === rewardId) ?? null;
}

export function getRewardWorld(worldId) {
  return REWARD_WORLDS.find((world) => world.id === worldId) ?? REWARD_WORLDS[0];
}
