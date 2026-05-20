export const REWARD_COLLECTION_KEY = "schildi-real-dino-friends-v1";
export const BONUS_STAR_KEY = "schildi-real-dino-bonus-stars-v1";

// Only real render-series rewards are listed here. No placeholders.
export const DINO_REWARDS = [
  {
    id: "bruno-brachio",
    name: "Bruno Brachio",
    speciesId: "brachiosaurus-altithorax",
    species: "Brachiosaurus",
    germanName: "Brachiosaurus",
    scientificName: "Brachiosaurus altithorax",
    shortLabel: "Langhals",
    assetReady: true,
    theme: "green",
    praise: "Bruno hebt seinen langen Hals: Das war eine starke Runde!",
    unlockText: "Bruno Brachio ist jetzt in deiner Sammlung.",
  },
  {
    id: "trixi-triceratops",
    name: "Trixi Triceratops",
    speciesId: "triceratops-horridus",
    species: "Triceratops",
    germanName: "Triceratops",
    scientificName: "Triceratops horridus",
    shortLabel: "Dreihorn",
    assetReady: true,
    theme: "orange",
    praise: "Trixi stampft begeistert: zehn von zehn!",
    unlockText: "Trixi Triceratops ist jetzt in deiner Sammlung.",
  },
  {
    id: "pico-pteranodon",
    name: "Pico Pteranodon",
    speciesId: "pteranodon-longiceps",
    species: "Pteranodon",
    germanName: "Pteranodon",
    scientificName: "Pteranodon longiceps",
    shortLabel: "Flugsaurier",
    assetReady: true,
    theme: "blue",
    praise: "Pico fliegt eine Ehrenrunde für dich.",
    unlockText: "Pico Pteranodon ist jetzt in deiner Sammlung.",
    note: "Pteranodon ist fachlich ein Flugsaurier, kein Dinosaurier. Für die Urzeit-Sammlung ist er trotzdem passend.",
  },
];

export function getRewardById(id) {
  return DINO_REWARDS.find((reward) => reward.id === id) ?? null;
}

export function getLockedRewards(unlockedIds) {
  const unlocked = new Set(unlockedIds);
  return DINO_REWARDS.filter((reward) => reward.assetReady && !unlocked.has(reward.id));
}

export function pickRewardChoices(unlockedIds, count = 3) {
  const locked = getLockedRewards(unlockedIds);
  const shuffled = [...locked].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
