import { REWARDS } from "./rewardCatalog.js";

export const REWARD_STORAGE_KEY = "schildkroetenklasse-rewards-v1";

const DEFAULT_REWARD_STATE = {
  version: 1,
  unlockedRewardIds: [],
  perfectRounds: 0,
  bonusStars: 0,
  lastUnlockedRewardId: null,
  rewardHistory: [],
};

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function sanitizeRewardState(rawState) {
  const knownRewardIds = new Set(REWARDS.map((reward) => reward.id));
  const unlockedRewardIds = Array.isArray(rawState?.unlockedRewardIds)
    ? rawState.unlockedRewardIds.filter((id, index, array) => knownRewardIds.has(id) && array.indexOf(id) === index)
    : [];

  const rewardHistory = Array.isArray(rawState?.rewardHistory)
    ? rawState.rewardHistory
        .filter((entry) => entry && typeof entry === "object")
        .slice(-50)
        .map((entry) => ({
          rewardId: typeof entry.rewardId === "string" ? entry.rewardId : null,
          score: Number.isFinite(Number(entry.score)) ? Number(entry.score) : null,
          total: Number.isFinite(Number(entry.total)) ? Number(entry.total) : null,
          createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
        }))
    : [];

  return {
    ...DEFAULT_REWARD_STATE,
    ...rawState,
    version: 1,
    unlockedRewardIds,
    perfectRounds: Math.max(0, Number(rawState?.perfectRounds || 0)),
    bonusStars: Math.max(0, Number(rawState?.bonusStars || 0)),
    lastUnlockedRewardId: knownRewardIds.has(rawState?.lastUnlockedRewardId) ? rawState.lastUnlockedRewardId : null,
    rewardHistory,
  };
}

export function loadRewardState() {
  if (!isBrowser()) return DEFAULT_REWARD_STATE;

  try {
    const raw = window.localStorage.getItem(REWARD_STORAGE_KEY);
    if (!raw) return DEFAULT_REWARD_STATE;
    return sanitizeRewardState(JSON.parse(raw));
  } catch {
    return DEFAULT_REWARD_STATE;
  }
}

export function saveRewardState(state) {
  const sanitized = sanitizeRewardState(state);
  if (isBrowser()) {
    window.localStorage.setItem(REWARD_STORAGE_KEY, JSON.stringify(sanitized));
  }
  return sanitized;
}

export function resetRewardState() {
  if (isBrowser()) {
    window.localStorage.removeItem(REWARD_STORAGE_KEY);
  }
  return DEFAULT_REWARD_STATE;
}
