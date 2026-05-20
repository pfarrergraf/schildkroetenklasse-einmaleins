import { BONUS_STAR_KEY, REWARD_COLLECTION_KEY } from "./rewardCatalog";

const LEGACY_REWARD_STATE_KEY = "schildkroetenklasse-rewards-v1";
const REWARDED_TABLE_COUNT_KEY = "schildi-dino-rewarded-table-count-v1";
const LEGACY_REWARD_ID_MAP = {
  "dino-bruno": "bruno-bronto",
  "dino-trixi": "trixi-triceratops",
  "dino-pico": "pico-pteranodon",
  "dino-nora": "nora-nadelruecken",
  "dino-roxi": "roxi-rex",
  "dino-lumi": "lumi-ankylosaurus",
};

function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function hasStoredValue(key) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key) !== null;
}

function loadLegacyRewardState() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(LEGACY_REWARD_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mapLegacyUnlockedRewardIds(ids) {
  return Array.from(
    new Set(
      (Array.isArray(ids) ? ids : [])
        .map((id) => LEGACY_REWARD_ID_MAP[id] ?? null)
        .filter((id) => typeof id === "string")
    )
  );
}

export function loadUnlockedRewardIds() {
  if (typeof window === "undefined") return [];

  if (hasStoredValue(REWARD_COLLECTION_KEY)) {
    return parseJsonArray(window.localStorage.getItem(REWARD_COLLECTION_KEY));
  }

  const migratedIds = mapLegacyUnlockedRewardIds(loadLegacyRewardState()?.unlockedRewardIds);
  if (migratedIds.length > 0) {
    saveUnlockedRewardIds(migratedIds);
  }
  return migratedIds;
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

  if (hasStoredValue(BONUS_STAR_KEY)) {
    const stars = Number(window.localStorage.getItem(BONUS_STAR_KEY) || 0);
    return Number.isFinite(stars) ? stars : 0;
  }

  const legacyStars = Number(loadLegacyRewardState()?.bonusStars || 0);
  if (Number.isFinite(legacyStars) && legacyStars > 0) {
    window.localStorage.setItem(BONUS_STAR_KEY, String(legacyStars));
    return legacyStars;
  }

  const stars = Number(window.localStorage.getItem(BONUS_STAR_KEY) || 0);
  return Number.isFinite(stars) ? stars : 0;
}

export function addBonusStar() {
  if (typeof window === "undefined") return 0;
  const next = loadBonusStars() + 1;
  window.localStorage.setItem(BONUS_STAR_KEY, String(next));
  return next;
}

export function loadRewardedTableCount() {
  if (typeof window === "undefined") return 0;

  if (hasStoredValue(REWARDED_TABLE_COUNT_KEY)) {
    const storedCount = Number(window.localStorage.getItem(REWARDED_TABLE_COUNT_KEY) || 0);
    return Number.isInteger(storedCount) && storedCount >= 0 ? storedCount : 0;
  }

  const migratedCount = loadUnlockedRewardIds().length;
  if (migratedCount > 0) {
    saveRewardedTableCount(migratedCount);
    return migratedCount;
  }

  return 0;
}

export function saveRewardedTableCount(count) {
  if (typeof window === "undefined") return 0;

  const sanitizedCount = Number.isInteger(count) && count >= 0 ? count : 0;
  window.localStorage.setItem(REWARDED_TABLE_COUNT_KEY, String(sanitizedCount));
  return sanitizedCount;
}
