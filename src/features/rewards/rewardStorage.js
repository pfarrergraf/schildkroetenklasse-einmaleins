import { BONUS_STAR_KEY, DINO_REWARDS, REWARD_COLLECTION_KEY, getRewardById } from "./rewardCatalog";

const LEGACY_REWARD_STATE_KEY = "schildkroetenklasse-rewards-v1";
const PREVIOUS_REWARD_COLLECTION_KEY = "schildi-dino-friends-v2";
const REWARDED_TABLE_COUNT_KEY = "schildi-dino-rewarded-table-count-v1";
const PENDING_REWARD_OFFER_KEY = "schildi-dino-pending-offer-v1";
const REWARD_CHECKPOINT_KEY = "schildi-dino-checkpoint-v1";
const REWARD_EVENT_LOG_KEY = "schildi-dino-event-log-v1";
const REWARD_EVENT_LOG_LIMIT = 80;
const LEGACY_REWARD_ID_MAP = {
  "dino-bruno": "bruno-bronto",
  "dino-trixi": "trixi-triceratops",
  "dino-pico": "pico-pteranodon",
  "dino-nora": "nora-nadelruecken",
  "dino-roxi": "roxi-rex",
  "dino-lumi": "lumi-ankylosaurus",
};
const VALID_REWARD_IDS = new Set(DINO_REWARDS.map((reward) => reward.id));

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

function sanitizeRewardIds(ids) {
  return Array.from(
    new Set((Array.isArray(ids) ? ids : []).filter((id) => typeof id === "string" && VALID_REWARD_IDS.has(id)))
  );
}

function sanitizePendingRewardOffer(rawOffer) {
  if (!rawOffer || typeof rawOffer !== "object") {
    return null;
  }

  const sanitizedChoiceIds = sanitizeRewardIds(
    Array.isArray(rawOffer.choiceIds)
      ? rawOffer.choiceIds
      : Array.isArray(rawOffer.choices)
        ? rawOffer.choices.map((choice) => choice?.id)
        : []
  );

  const choices = sanitizedChoiceIds.map((id) => getRewardById(id)).filter(Boolean);
  if (!choices.length) {
    return null;
  }

  return {
    offerId: typeof rawOffer.offerId === "string" ? rawOffer.offerId : `pending-${sanitizedChoiceIds.join("-")}`,
    choiceIds: choices.map((choice) => choice.id),
    choices,
    createdAt: typeof rawOffer.createdAt === "string" ? rawOffer.createdAt : new Date().toISOString(),
    selectedTableCount:
      Number.isInteger(rawOffer.selectedTableCount) && rawOffer.selectedTableCount >= 0 ? rawOffer.selectedTableCount : null,
  };
}

function sanitizeBonusStars(value) {
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

function sanitizeRewardedTableCount(value) {
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

function sanitizeRewardEvent(rawEvent) {
  if (!rawEvent || typeof rawEvent !== "object") {
    return null;
  }

  return {
    id: typeof rawEvent.id === "string" ? rawEvent.id : `reward-event-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    type: typeof rawEvent.type === "string" ? rawEvent.type : "unknown",
    createdAt: typeof rawEvent.createdAt === "string" ? rawEvent.createdAt : new Date().toISOString(),
    data: rawEvent.data && typeof rawEvent.data === "object" ? rawEvent.data : {},
  };
}

function sanitizeRewardEvents(events) {
  return (Array.isArray(events) ? events : [])
    .map((event) => sanitizeRewardEvent(event))
    .filter(Boolean)
    .slice(-REWARD_EVENT_LOG_LIMIT);
}

function loadStoredRewardCheckpoint() {
  if (typeof window === "undefined" || !hasStoredValue(REWARD_CHECKPOINT_KEY)) {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem(REWARD_CHECKPOINT_KEY) || "null");
  } catch {
    return null;
  }
}

function sanitizeRewardCheckpoint(rawCheckpoint) {
  const sanitizedPendingRewardOffer = sanitizePendingRewardOffer(rawCheckpoint?.pendingRewardOffer);

  return {
    version: 1,
    unlockedRewardIds: sanitizeRewardIds(rawCheckpoint?.unlockedRewardIds),
    bonusStars: sanitizeBonusStars(rawCheckpoint?.bonusStars),
    rewardedTableCount: sanitizeRewardedTableCount(rawCheckpoint?.rewardedTableCount),
    pendingRewardOffer: sanitizedPendingRewardOffer,
    rewardEvents: sanitizeRewardEvents(rawCheckpoint?.rewardEvents),
    updatedAt: typeof rawCheckpoint?.updatedAt === "string" ? rawCheckpoint.updatedAt : new Date().toISOString(),
  };
}

function loadPreviousUnlockedRewardIds() {
  if (typeof window === "undefined" || !hasStoredValue(PREVIOUS_REWARD_COLLECTION_KEY)) {
    return [];
  }

  return sanitizeRewardIds(parseJsonArray(window.localStorage.getItem(PREVIOUS_REWARD_COLLECTION_KEY)));
}

function mergeUnlockedRewardIds(...groups) {
  return sanitizeRewardIds(groups.flat());
}

export function loadUnlockedRewardIds() {
  if (typeof window === "undefined") return [];

  if (hasStoredValue(REWARD_COLLECTION_KEY)) {
    const currentIds = sanitizeRewardIds(parseJsonArray(window.localStorage.getItem(REWARD_COLLECTION_KEY)));
    const mergedIds = mergeUnlockedRewardIds(
      currentIds,
      loadPreviousUnlockedRewardIds(),
      mapLegacyUnlockedRewardIds(loadLegacyRewardState()?.unlockedRewardIds)
    );

    if (mergedIds.length !== currentIds.length) {
      saveUnlockedRewardIds(mergedIds);
    }

    return mergedIds;
  }

  if (hasStoredValue(PREVIOUS_REWARD_COLLECTION_KEY)) {
    const migratedIds = loadPreviousUnlockedRewardIds();
    if (migratedIds.length > 0) {
      saveUnlockedRewardIds(migratedIds);
    }
    return migratedIds;
  }

  const migratedIds = sanitizeRewardIds(mapLegacyUnlockedRewardIds(loadLegacyRewardState()?.unlockedRewardIds));
  if (migratedIds.length > 0) {
    saveUnlockedRewardIds(migratedIds);
  }
  return migratedIds;
}

export function saveUnlockedRewardIds(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REWARD_COLLECTION_KEY, JSON.stringify(sanitizeRewardIds(ids)));
}

export function loadPendingRewardOffer() {
  if (typeof window === "undefined" || !hasStoredValue(PENDING_REWARD_OFFER_KEY)) {
    return null;
  }

  try {
    return sanitizePendingRewardOffer(JSON.parse(window.localStorage.getItem(PENDING_REWARD_OFFER_KEY) || "null"));
  } catch {
    return null;
  }
}

export function savePendingRewardOffer(offer) {
  if (typeof window === "undefined") return null;

  const sanitizedOffer = sanitizePendingRewardOffer(offer);
  if (!sanitizedOffer) {
    window.localStorage.removeItem(PENDING_REWARD_OFFER_KEY);
    return null;
  }

  window.localStorage.setItem(
    PENDING_REWARD_OFFER_KEY,
    JSON.stringify({
      offerId: sanitizedOffer.offerId,
      choiceIds: sanitizedOffer.choiceIds,
      createdAt: sanitizedOffer.createdAt,
      selectedTableCount: sanitizedOffer.selectedTableCount,
    })
  );

  return sanitizedOffer;
}

export function clearPendingRewardOffer() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_REWARD_OFFER_KEY);
}

export function loadRewardEvents() {
  if (typeof window === "undefined" || !hasStoredValue(REWARD_EVENT_LOG_KEY)) {
    return [];
  }

  try {
    return sanitizeRewardEvents(JSON.parse(window.localStorage.getItem(REWARD_EVENT_LOG_KEY) || "[]"));
  } catch {
    return [];
  }
}

export function saveRewardEvents(events) {
  const sanitizedEvents = sanitizeRewardEvents(events);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(REWARD_EVENT_LOG_KEY, JSON.stringify(sanitizedEvents));
  }
  return sanitizedEvents;
}

export function appendRewardEvent(event) {
  const nextEvents = [...loadRewardEvents(), event];
  return saveRewardEvents(nextEvents);
}

export function createRewardCheckpoint(overrides = {}) {
  const storedCheckpoint = loadStoredRewardCheckpoint();

  return sanitizeRewardCheckpoint({
    ...storedCheckpoint,
    ...overrides,
    unlockedRewardIds: overrides.unlockedRewardIds ?? loadUnlockedRewardIds(),
    bonusStars: overrides.bonusStars ?? loadBonusStars(),
    rewardedTableCount: overrides.rewardedTableCount ?? loadRewardedTableCount(),
    pendingRewardOffer: overrides.pendingRewardOffer ?? loadPendingRewardOffer(),
    rewardEvents: overrides.rewardEvents ?? storedCheckpoint?.rewardEvents ?? loadRewardEvents(),
    updatedAt: overrides.updatedAt ?? storedCheckpoint?.updatedAt ?? new Date().toISOString(),
  });
}

export function saveRewardCheckpoint(checkpoint) {
  const sanitizedCheckpoint = sanitizeRewardCheckpoint(checkpoint);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      REWARD_CHECKPOINT_KEY,
      JSON.stringify({
        ...sanitizedCheckpoint,
        pendingRewardOffer: sanitizedCheckpoint.pendingRewardOffer
          ? {
              offerId: sanitizedCheckpoint.pendingRewardOffer.offerId,
              choiceIds: sanitizedCheckpoint.pendingRewardOffer.choiceIds,
              createdAt: sanitizedCheckpoint.pendingRewardOffer.createdAt,
              selectedTableCount: sanitizedCheckpoint.pendingRewardOffer.selectedTableCount,
            }
          : null,
      })
    );
  }

  return sanitizedCheckpoint;
}

export function applyRewardCheckpoint(checkpoint) {
  const sanitizedCheckpoint = createRewardCheckpoint(checkpoint);

  saveUnlockedRewardIds(sanitizedCheckpoint.unlockedRewardIds);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(BONUS_STAR_KEY, String(sanitizedCheckpoint.bonusStars));
  }

  saveRewardedTableCount(sanitizedCheckpoint.rewardedTableCount);
  savePendingRewardOffer(sanitizedCheckpoint.pendingRewardOffer);
  saveRewardEvents(sanitizedCheckpoint.rewardEvents);
  saveRewardCheckpoint(sanitizedCheckpoint);

  return sanitizedCheckpoint;
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

  return 0;
}

export function saveRewardedTableCount(count) {
  if (typeof window === "undefined") return 0;

  const sanitizedCount = Number.isInteger(count) && count >= 0 ? count : 0;
  window.localStorage.setItem(REWARDED_TABLE_COUNT_KEY, String(sanitizedCount));
  return sanitizedCount;
}

const ACHIEVEMENTS_KEY = "schildi-achievements-v1";

export function loadCompletedAchievementIds() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function saveCompletedAchievementIds(ids) {
  if (typeof window === "undefined") return;
  const unique = Array.from(new Set((Array.isArray(ids) ? ids : []).filter((id) => typeof id === "string")));
  window.localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unique));
}

export function addCompletedAchievementIds(newIds) {
  const current = loadCompletedAchievementIds();
  const merged = Array.from(new Set([...current, ...(Array.isArray(newIds) ? newIds : [])]));
  saveCompletedAchievementIds(merged);
  return merged;
}
