import { getDailyPracticeSummary } from "./learningProgress.js";

export const ANSWER_MODE_CHOICE = "choice";
export const ANSWER_MODE_TYPED = "typed";

const DIFFICULTIES = ["beginner", "easy", "medium", "hard", "expert"];
const DEFAULT_DAILY_SUMMARY = { attempts: 0, accuracy: 0, rounds: 0 };

function clampDifficultyIndex(index) {
  return Math.max(0, Math.min(DIFFICULTIES.length - 1, index));
}

function buildTaskKey(task) {
  return `${task?.a ?? 0}x${task?.b ?? 0}`;
}

function getTaskStats(learningState, task) {
  return learningState?.attemptsByTask?.[buildTaskKey(task)] ?? {
    attempts: 0,
    correct: 0,
    wrong: 0,
  };
}

function getTaskAccuracy(taskStats) {
  if (!taskStats.attempts) {
    return 0;
  }

  return taskStats.correct / taskStats.attempts;
}

function getRecentPerfectRounds(learningState) {
  return (learningState?.rounds ?? []).slice(-3).filter((round) => round?.perfect || round?.score >= round?.totalRounds - 1).length;
}

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

function uniqueCandidates(values, correctAnswer) {
  return Array.from(new Set(values)).filter((value) => isNonNegativeInteger(value) && value !== correctAnswer);
}

function sortByDistance(values, correctAnswer) {
  return [...uniqueCandidates(values, correctAnswer)].sort((left, right) => {
    const leftDistance = Math.abs(left - correctAnswer);
    const rightDistance = Math.abs(right - correctAnswer);
    return leftDistance - rightDistance || left - right;
  });
}

function farthestFirst(values, correctAnswer) {
  return [...sortByDistance(values, correctAnswer)].reverse();
}

function getNeighborFactCandidates(task) {
  const { a, b, answer } = task;
  return sortByDistance([(a - 1) * b, (a + 1) * b, a * (b - 1), a * (b + 1)], answer);
}

function getFactorStepCandidates(task) {
  const { a, b, answer } = task;
  return sortByDistance([answer - a, answer + a, answer - b, answer + b], answer);
}

function getSmallOffsetCandidates(task) {
  const { answer } = task;
  return {
    close: sortByDistance([answer - 1, answer + 1, answer - 2, answer + 2, answer - 5, answer + 5], answer),
    medium: sortByDistance([answer - 5, answer + 5, answer - 10, answer + 10, answer - 2, answer + 2], answer),
    wide: farthestFirst([answer - 10, answer + 10, answer - 5, answer + 5, answer - 12, answer + 12], answer),
  };
}

function getPlaceValueCandidates(task) {
  const { a, b, answer } = task;
  const usesTen = a === 10 || b === 10;
  const values = [];

  if (answer > 0 && (usesTen || answer % 10 === 0 || answer < 10) && answer <= 60) {
    values.push(answer * 10);
  }

  if (answer >= 10 && (usesTen || answer % 10 === 0)) {
    values.push(Math.round(answer / 10));
  }

  return uniqueCandidates(values, answer);
}

function getDigitReversalCandidates(task) {
  const { answer } = task;
  if (answer < 10 || answer > 99) {
    return [];
  }

  const digits = String(answer).split("");
  const reversed = Number(digits.reverse().join(""));
  if (!Number.isInteger(reversed) || reversed === answer || reversed < 10) {
    return [];
  }

  return [reversed];
}

function getAdditionConfusionCandidates(task) {
  const { a, b, answer } = task;
  return uniqueCandidates([a + b], answer);
}

function getDoubleOrHalfCandidates(task) {
  const { answer } = task;
  const values = [];

  if (answer > 0 && answer * 2 <= 100) {
    values.push(answer * 2);
  }

  if (answer > 1 && answer % 2 === 0) {
    values.push(answer / 2);
  }

  return uniqueCandidates(values, answer);
}

function getFallbackCandidates(task) {
  const { answer } = task;
  return {
    close: sortByDistance([answer - 3, answer + 3, answer - 4, answer + 4, answer - 6, answer + 6], answer),
    any: sortByDistance([answer - 7, answer + 7, answer - 8, answer + 8, answer - 9, answer + 9, answer - 15, answer + 15], answer),
    wide: farthestFirst([answer - 20, answer + 20, answer - 25, answer + 25, answer - 30, answer + 30], answer),
  };
}

function takeCandidates(result, candidates, limit = 1) {
  let added = 0;

  for (const candidate of candidates) {
    if (result.length >= 3) {
      return;
    }

    if (!result.includes(candidate)) {
      result.push(candidate);
      added += 1;
    }

    if (added >= limit) {
      return;
    }
  }
}

function fillRemainingCandidates(result, candidateGroups) {
  for (const candidates of candidateGroups) {
    takeCandidates(result, candidates, 3);
    if (result.length >= 3) {
      return;
    }
  }
}

function shuffleOptions(options, random = Math.random) {
  const shuffled = [...options];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[nextIndex]] = [shuffled[nextIndex], shuffled[index]];
  }

  return shuffled;
}

export function cleanTypedAnswer(value) {
  const normalized = String(value).trim().replace(",", ".");
  if (!normalized) {
    return null;
  }

  const number = Number(normalized);
  if (!Number.isInteger(number)) {
    return null;
  }

  if (number < 0 || number > 100) {
    return null;
  }

  return number;
}

export function cleanChoiceAnswer(value) {
  const normalized = String(value).trim();
  if (!normalized) {
    return null;
  }

  const number = Number(normalized);
  if (!Number.isInteger(number) || number < 0) {
    return null;
  }

  return number;
}

export function deriveTaskDifficulty({
  task,
  learningState,
  round = 0,
  streak = 0,
  consecutivePerfectRounds = 0,
}) {
  const summary = getDailyPracticeSummary(learningState) ?? DEFAULT_DAILY_SUMMARY;
  const taskStats = getTaskStats(learningState, task);
  const taskAccuracy = getTaskAccuracy(taskStats);
  const recentPerfectRounds = getRecentPerfectRounds(learningState);
  let difficultyIndex = 0;

  if (round >= 2 || streak >= 1 || summary.accuracy >= 60 || taskStats.attempts >= 2) {
    difficultyIndex = 1;
  }

  if (streak >= 2 || summary.accuracy >= 80 || taskStats.correct >= 2 || taskStats.attempts >= 4) {
    difficultyIndex = 2;
  }

  if (
    streak >= 4 ||
    summary.accuracy >= 90 ||
    (taskStats.attempts >= 4 && taskAccuracy >= 0.8) ||
    consecutivePerfectRounds >= 1
  ) {
    difficultyIndex = 3;
  }

  if (
    streak >= 5 ||
    (summary.attempts >= 8 && summary.accuracy >= 90 && recentPerfectRounds >= 1) ||
    (taskStats.attempts >= 5 && taskAccuracy >= 0.85)
  ) {
    difficultyIndex = 4;
  }

  if (taskStats.wrong >= 2 && taskStats.wrong >= taskStats.correct) {
    difficultyIndex -= 2;
  } else if (taskStats.wrong > taskStats.correct && taskStats.attempts >= 3) {
    difficultyIndex -= 1;
  }

  return DIFFICULTIES[clampDifficultyIndex(difficultyIndex)];
}

export function deriveTypedModeReadiness({
  task,
  learningState,
  streak = 0,
  consecutivePerfectRounds = 0,
  selectedTables = [],
}) {
  const summary = getDailyPracticeSummary(learningState) ?? DEFAULT_DAILY_SUMMARY;
  const taskStats = getTaskStats(learningState, task);
  const taskAccuracy = getTaskAccuracy(taskStats);
  const recentPerfectRounds = getRecentPerfectRounds(learningState);
  const difficulty = deriveTaskDifficulty({
    task,
    learningState,
    round: summary.rounds,
    streak,
    consecutivePerfectRounds,
  });
  const strongTaskPerformance = taskStats.attempts >= 4 && taskAccuracy >= 0.75;
  const strongDailyAccuracy = summary.attempts >= 8 && summary.accuracy >= 85;
  const strongRoundHistory = recentPerfectRounds >= 2 || consecutivePerfectRounds >= 1;

  const shouldSuggest =
    difficulty === "hard" ||
    difficulty === "expert" ||
    streak >= 3 ||
    strongDailyAccuracy ||
    strongTaskPerformance ||
    strongRoundHistory;

  const shouldAutoEnable =
    difficulty === "expert" ||
    streak >= 5 ||
    (summary.attempts >= 8 && summary.accuracy >= 90 && strongRoundHistory) ||
    (selectedTables.length === 1 && strongTaskPerformance && streak >= 3);

  let reason = "none";
  if (streak >= 5) {
    reason = "streak";
  } else if (summary.attempts >= 8 && summary.accuracy >= 90) {
    reason = "daily-accuracy";
  } else if (selectedTables.length === 1 && strongTaskPerformance) {
    reason = "single-table-mastery";
  } else if (strongRoundHistory) {
    reason = "recent-rounds";
  } else if (strongTaskPerformance) {
    reason = "task-mastery";
  }

  return {
    difficulty,
    shouldSuggest,
    shouldAutoEnable,
    reason,
    taskAccuracy,
    dailyAccuracy: summary.accuracy,
    recentPerfectRounds,
    strongTaskPerformance,
  };
}

export function shouldAutoSwitchToTyped({
  currentMode,
  typedModeOptOut = false,
  readiness,
}) {
  return currentMode === ANSWER_MODE_CHOICE && !typedModeOptOut && Boolean(readiness?.shouldAutoEnable);
}

export function getToggledAnswerMode(currentMode) {
  return currentMode === ANSWER_MODE_TYPED ? ANSWER_MODE_CHOICE : ANSWER_MODE_TYPED;
}

export function generateAnswerOptions({
  task,
  learningState,
  round = 0,
  streak = 0,
  consecutivePerfectRounds = 0,
  answerMode = ANSWER_MODE_CHOICE,
  difficulty = null,
  random = Math.random,
}) {
  const activeDifficulty =
    difficulty ??
    deriveTaskDifficulty({
      task,
      learningState,
      round,
      streak,
      consecutivePerfectRounds,
    });

  const { answer } = task;
  const neighborFacts = getNeighborFactCandidates(task);
  const factorSteps = getFactorStepCandidates(task);
  const smallOffsets = getSmallOffsetCandidates(task);
  const placeValues = getPlaceValueCandidates(task);
  const digitReversals = getDigitReversalCandidates(task);
  const additionConfusions = getAdditionConfusionCandidates(task);
  const doubleOrHalf = getDoubleOrHalfCandidates(task);
  const fallbacks = getFallbackCandidates(task);
  const distractors = [];

  switch (activeDifficulty) {
    case "beginner":
      takeCandidates(distractors, farthestFirst(neighborFacts, answer), 1);
      takeCandidates(distractors, farthestFirst(factorSteps, answer), 1);
      takeCandidates(distractors, doubleOrHalf, 1);
      fillRemainingCandidates(distractors, [
        smallOffsets.wide,
        additionConfusions,
        placeValues.filter((value) => value <= 100),
        neighborFacts,
        factorSteps,
        fallbacks.wide,
        fallbacks.any,
      ]);
      break;
    case "easy":
      takeCandidates(distractors, neighborFacts, 2);
      takeCandidates(distractors, factorSteps, 1);
      fillRemainingCandidates(distractors, [
        smallOffsets.medium,
        additionConfusions,
        doubleOrHalf,
        fallbacks.any,
        fallbacks.close,
      ]);
      break;
    case "medium":
      takeCandidates(distractors, neighborFacts, 2);
      takeCandidates(distractors, placeValues, 1);
      fillRemainingCandidates(distractors, [
        factorSteps,
        smallOffsets.medium,
        digitReversals,
        fallbacks.close,
        fallbacks.any,
      ]);
      break;
    case "hard":
    case "expert":
      takeCandidates(distractors, neighborFacts, 2);
      takeCandidates(distractors, smallOffsets.close, 1);
      fillRemainingCandidates(distractors, [
        digitReversals,
        factorSteps,
        placeValues,
        fallbacks.close,
        fallbacks.any,
      ]);
      break;
    default:
      fillRemainingCandidates(distractors, [neighborFacts, factorSteps, smallOffsets.medium, fallbacks.any]);
      break;
  }

  fillRemainingCandidates(distractors, [neighborFacts, factorSteps, smallOffsets.medium, placeValues, fallbacks.any, fallbacks.close]);

  const limitedDistractors = distractors.slice(0, 3);
  const options = [answer, ...limitedDistractors];

  if (answerMode === ANSWER_MODE_TYPED) {
    return options;
  }

  return shuffleOptions(options, random);
}
