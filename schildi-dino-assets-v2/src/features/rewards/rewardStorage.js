import { BONUS_STAR_KEY, REWARD_COLLECTION_KEY } from "./rewardCatalog";

function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function loadUnlockedRewardIds() {
  if (typeof window === "undefined") return [];
  return parseJsonArray(window.localStorage.getItem(REWARD_COLLECTION_KEY));
}

export function saveUnlockedRewardIds(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REWARD_COLLECTION_KEY, JSON.stringify(Array.from(new Set(ids))));
}

export function unlockRewardId(id) {
  const current = loadUnlockedRewardIds();
  if (!current.includes(id)) {
    const next = [...current, id];
    saveUnlockedRewardIds(next);
    return next;
  }
  return current;
}

export function loadBonusStars() {
  if (typeof window === "undefined") return 0;
  const stars = Number(window.localStorage.getItem(BONUS_STAR_KEY) || 0);
  return Number.isFinite(stars) ? stars : 0;
}

export function addBonusStar() {
  if (typeof window === "undefined") return 0;
  const next = loadBonusStars() + 1;
  window.localStorage.setItem(BONUS_STAR_KEY, String(next));
  return next;
}
