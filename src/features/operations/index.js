export {
  OPERATIONS,
  OPERATION_IDS,
  CLASS_OPERATIONS,
  CLASS_LABELS,
  getOperation,
  getLevelById,
  getDefaultLevelId,
  getNextLevelId,
  isLastLevel,
} from "./operationConfig.js";

export {
  generateTask,
  generateOperationOptions,
  getAnswerRange,
} from "./taskGenerator.js";

export {
  loadUnlockedLevels,
  unlockLevel,
  isLevelUnlocked,
  loadActiveOperation,
  saveActiveOperation,
  loadActiveLevel,
  saveActiveLevel,
  loadSchoolClass,
  saveSchoolClass,
} from "./levelProgress.js";
