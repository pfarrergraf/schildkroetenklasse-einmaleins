import { DINO_REWARDS, pickRewardChoices } from "./rewardCatalog.js";

export const CORE_TABLES = [0, 1, 2, 5, 10];
export const NON_CORE_TABLES = [3, 4, 6, 7, 8, 9];

function includesExactly(selectedTables, expectedTables) {
  return (
    Array.isArray(selectedTables) &&
    selectedTables.length === expectedTables.length &&
    expectedTables.every((table) => selectedTables.includes(table))
  );
}

export const ACHIEVEMENTS = [
  {
    id: "perfect-any",
    title: "10 von 10 richtig",
    shortTitle: "Perfekte Runde",
    description: "Löse alle 10 Aufgaben einer Runde richtig.",
    challengeText: "Wähle eine Reihe und löse alle 10 Aufgaben richtig!",
    schildiText: "Schaffst du es, alle 10 Aufgaben richtig zu lösen? Nimm die Herausforderung an!",
    challengeTablePreset: null,
    challengeTableOptions: null,
    check: ({ finalScore, totalRounds }) => finalScore === totalRounds,
  },
  {
    id: "core-mix",
    title: "Kernaufgaben gemeistert",
    shortTitle: "Kernaufgaben-Mix",
    description: "Löse alle 10 richtig mit allen Kernaufgaben (0, 1, 2, 5, 10) aktiv.",
    challengeText: "Löse 10 von 10 Aufgaben mit allen Kernaufgaben (0, 1, 2, 5, 10) richtig!",
    schildiText: "Ich stelle alle Kernaufgaben ein – kannst du alle 10 von 10 richtig lösen?",
    challengeTablePreset: [0, 1, 2, 5, 10],
    challengeTableOptions: null,
    check: ({ finalScore, totalRounds, selectedTables }) =>
      finalScore === totalRounds && includesExactly(selectedTables, CORE_TABLES),
  },
  {
    id: "non-core-single",
    title: "Schwere Reihe solo",
    shortTitle: "Schwere Solo-Reihe",
    description: "Löse 10 von 10 mit genau einer schweren Reihe: 3, 4, 6, 7, 8 oder 9.",
    challengeText: "Wähle eine Reihe aus 3, 4, 6, 7, 8 oder 9 und löse alle 10 Aufgaben richtig!",
    schildiText: "Such dir eine schwere Reihe aus – 3, 4, 6, 7, 8 oder 9. Schaffst du alle 10 von 10?",
    challengeTablePreset: null,
    challengeTableOptions: NON_CORE_TABLES,
    check: ({ finalScore, totalRounds, selectedTables }) =>
      finalScore === totalRounds &&
      selectedTables.length === 1 &&
      NON_CORE_TABLES.includes(selectedTables[0]),
  },
  {
    id: "double-perfect",
    title: "Doppelt stark",
    shortTitle: "20 am Stück",
    description: "Löse 20 Aufgaben richtig hintereinander – zwei Runden in Folge.",
    challengeText: "Löse zwei Runden hintereinander alle 10 Aufgaben richtig!",
    schildiText: "Kannst du zwei Runden hintereinander alle 10 Aufgaben richtig lösen? Das ist Doppelt-Stark!",
    challengeTablePreset: null,
    challengeTableOptions: null,
    check: ({ consecutivePerfect }) => consecutivePerfect >= 2,
  },
  {
    id: "only-non-core",
    title: "Nur schwere Reihen",
    shortTitle: "Nur schwere Reihen",
    description: "Löse 10 von 10 bei ausschließlich nicht-Kernaufgaben (3, 4, 6, 7, 8, 9).",
    challengeText: "Aktiviere ausschließlich Reihen aus 3, 4, 6, 7, 8, 9 und löse alle 10 richtig!",
    schildiText: "Nur schwere Reihen! Ich stelle 3, 4, 6, 7, 8, 9 ein – schaffst du alle 10 von 10?",
    challengeTablePreset: [3, 4, 6, 7, 8, 9],
    challengeTableOptions: null,
    check: ({ finalScore, totalRounds, selectedTables }) =>
      finalScore === totalRounds &&
      selectedTables.length > 1 &&
      selectedTables.every((t) => NON_CORE_TABLES.includes(t)),
  },
  {
    id: "all-tables",
    title: "Alle Tafeln gemeistert",
    shortTitle: "Alle 11 Reihen",
    description: "Löse 10 von 10 bei allen Tafeln (0–10) gleichzeitig aktiv.",
    challengeText: "Aktiviere alle Tafeln (0–10) und löse alle 10 Aufgaben richtig!",
    schildiText: "Alle Tafeln gleichzeitig – das ist die Königsdisziplin! Schaffst du 10 von 10?",
    challengeTablePreset: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    challengeTableOptions: null,
    check: ({ finalScore, totalRounds, selectedTables }) =>
      finalScore === totalRounds && includesExactly(selectedTables, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  },
];

export function getAchievementById(id) {
  return ACHIEVEMENTS.find((a) => a.id === id) ?? null;
}

export function checkNewAchievements({ finalScore, totalRounds, selectedTables, consecutivePerfect, completedIds }) {
  const completed = new Set(Array.isArray(completedIds) ? completedIds : []);
  return ACHIEVEMENTS.filter(
    (achievement) =>
      !completed.has(achievement.id) &&
      achievement.check({ finalScore, totalRounds, selectedTables, consecutivePerfect })
  );
}

export function shouldOfferReward({ finalScore, totalRounds, selectedTables, consecutivePerfect, completedIds }) {
  return checkNewAchievements({ finalScore, totalRounds, selectedTables, consecutivePerfect, completedIds }).length > 0;
}

export function buildRewardOffer(unlockedIds, { seed } = {}) {
  const choices = pickRewardChoices(unlockedIds, 3, seed);
  return {
    allCollected: choices.length === 0,
    choices,
    total: DINO_REWARDS.length,
    unlockedCount: unlockedIds.length,
  };
}

export function getCollectionProgress(unlockedIds) {
  return {
    total: DINO_REWARDS.length,
    unlocked: unlockedIds.length,
    percent: Math.round((unlockedIds.length / DINO_REWARDS.length) * 100),
  };
}
