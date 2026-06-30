// Persists level unlock state per operation to localStorage.
// A level is unlocked when the player achieves ≥ 8/10 in that level.

const LEVEL_PROGRESS_KEY = "schildi-level-progress-v1";
const OPERATION_KEY = "schildi-active-operation-v1";
const OPERATION_LEVEL_KEY = "schildi-active-level-v1";
const SCHOOL_CLASS_KEY = "schildi-school-class-v1";

function safeLoad(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSave(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/**
 * Load the set of unlocked level IDs (e.g. ["add-1", "sub-1", "mul-1"])
 */
export function loadUnlockedLevels() {
  return safeLoad(LEVEL_PROGRESS_KEY, []);
}

/**
 * Mark a level as unlocked.
 */
export function unlockLevel(levelId) {
  const current = loadUnlockedLevels();
  if (!current.includes(levelId)) {
    safeSave(LEVEL_PROGRESS_KEY, [...current, levelId]);
  }
}

/**
 * Check if a given level is unlocked.
 */
export function isLevelUnlocked(levelId, unlockedLevels) {
  return unlockedLevels.includes(levelId);
}

/**
 * Load the currently active operation.
 */
export function loadActiveOperation() {
  return safeLoad(OPERATION_KEY, "multiplication");
}

/**
 * Save the active operation.
 */
export function saveActiveOperation(operationId) {
  safeSave(OPERATION_KEY, operationId);
}

/**
 * Load the active level id for a given operation.
 */
export function loadActiveLevel(operationId) {
  const map = safeLoad(OPERATION_LEVEL_KEY, {});
  return map[operationId] ?? null;
}

/**
 * Save the active level for a given operation.
 */
export function saveActiveLevel(operationId, levelId) {
  const map = safeLoad(OPERATION_LEVEL_KEY, {});
  safeSave(OPERATION_LEVEL_KEY, { ...map, [operationId]: levelId });
}

/**
 * Load the player's school class (1–4).
 */
export function loadSchoolClass() {
  const val = safeLoad(SCHOOL_CLASS_KEY, 2);
  return typeof val === "number" && val >= 1 && val <= 4 ? val : 2;
}

/**
 * Save the school class.
 */
export function saveSchoolClass(cls) {
  safeSave(SCHOOL_CLASS_KEY, cls);
}
