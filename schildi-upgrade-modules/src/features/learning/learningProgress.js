export const LEARNING_STORAGE_KEY = "schildkroetenklasse-learning-progress-v1";

const DEFAULT_LEARNING_STATE = {
  version: 1,
  attemptsByTask: {},
  rounds: [],
  dailyPractice: {},
  unlockedTableLevels: [1, 2, 5, 10],
};

function taskKey(a, b) {
  return `${a}x${b}`;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function sanitizeLearningState(rawState) {
  return {
    ...DEFAULT_LEARNING_STATE,
    ...rawState,
    version: 1,
    attemptsByTask: rawState?.attemptsByTask && typeof rawState.attemptsByTask === "object" ? rawState.attemptsByTask : {},
    rounds: Array.isArray(rawState?.rounds) ? rawState.rounds.slice(-80) : [],
    dailyPractice: rawState?.dailyPractice && typeof rawState.dailyPractice === "object" ? rawState.dailyPractice : {},
    unlockedTableLevels: Array.isArray(rawState?.unlockedTableLevels)
      ? rawState.unlockedTableLevels.filter((value, index, array) => Number.isInteger(value) && value >= 0 && value <= 10 && array.indexOf(value) === index)
      : DEFAULT_LEARNING_STATE.unlockedTableLevels,
  };
}

export function loadLearningState() {
  if (!isBrowser()) return DEFAULT_LEARNING_STATE;
  try {
    const raw = window.localStorage.getItem(LEARNING_STORAGE_KEY);
    if (!raw) return DEFAULT_LEARNING_STATE;
    return sanitizeLearningState(JSON.parse(raw));
  } catch {
    return DEFAULT_LEARNING_STATE;
  }
}

export function saveLearningState(state) {
  const sanitized = sanitizeLearningState(state);
  if (isBrowser()) {
    window.localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(sanitized));
  }
  return sanitized;
}

export function recordAnswerAttempt(learningState, { a, b, givenAnswer, correctAnswer, isCorrect }) {
  const key = taskKey(a, b);
  const current = learningState?.attemptsByTask?.[key] ?? {
    key,
    a,
    b,
    correctAnswer,
    attempts: 0,
    correct: 0,
    wrong: 0,
    lastGivenAnswer: null,
    lastResult: null,
    lastSeenAt: null,
  };

  const nextTaskStats = {
    ...current,
    attempts: current.attempts + 1,
    correct: current.correct + (isCorrect ? 1 : 0),
    wrong: current.wrong + (isCorrect ? 0 : 1),
    lastGivenAnswer: givenAnswer,
    lastResult: isCorrect ? "correct" : "wrong",
    lastSeenAt: new Date().toISOString(),
  };

  const date = todayKey();
  const today = learningState?.dailyPractice?.[date] ?? { attempts: 0, correct: 0, rounds: 0 };

  return saveLearningState({
    ...learningState,
    attemptsByTask: {
      ...(learningState?.attemptsByTask ?? {}),
      [key]: nextTaskStats,
    },
    dailyPractice: {
      ...(learningState?.dailyPractice ?? {}),
      [date]: {
        ...today,
        attempts: today.attempts + 1,
        correct: today.correct + (isCorrect ? 1 : 0),
      },
    },
  });
}

export function recordRoundSummary(learningState, { score, totalRounds, selectedTables }) {
  const date = todayKey();
  const today = learningState?.dailyPractice?.[date] ?? { attempts: 0, correct: 0, rounds: 0 };

  return saveLearningState({
    ...learningState,
    rounds: [
      ...(learningState?.rounds ?? []),
      {
        score,
        totalRounds,
        selectedTables,
        perfect: score === totalRounds,
        createdAt: new Date().toISOString(),
      },
    ].slice(-80),
    dailyPractice: {
      ...(learningState?.dailyPractice ?? {}),
      [date]: {
        ...today,
        rounds: today.rounds + 1,
      },
    },
  });
}

export function getDifficultTasks(learningState, { limit = 8 } = {}) {
  return Object.values(learningState?.attemptsByTask ?? {})
    .filter((entry) => entry.wrong > 0)
    .sort((left, right) => {
      const leftWeight = left.wrong * 3 - left.correct;
      const rightWeight = right.wrong * 3 - right.correct;
      return rightWeight - leftWeight;
    })
    .slice(0, limit);
}

export function getDailyPracticeSummary(learningState) {
  const date = todayKey();
  const today = learningState?.dailyPractice?.[date] ?? { attempts: 0, correct: 0, rounds: 0 };
  const accuracy = today.attempts ? Math.round((today.correct / today.attempts) * 100) : 0;

  return {
    date,
    attempts: today.attempts,
    correct: today.correct,
    rounds: today.rounds,
    accuracy,
    dailyGoalReached: today.rounds >= 1,
  };
}

export function suggestNextTables(learningState) {
  const recentPerfectRounds = (learningState?.rounds ?? []).slice(-3).filter((round) => round.perfect);
  if (recentPerfectRounds.length < 2) return learningState?.unlockedTableLevels ?? [1, 2, 5, 10];

  const order = [1, 2, 5, 10, 3, 4, 6, 8, 9, 7, 0];
  const unlocked = new Set(learningState?.unlockedTableLevels ?? [1, 2, 5, 10]);
  const next = order.find((table) => !unlocked.has(table));
  return next === undefined ? [...unlocked].sort((a, b) => a - b) : [...unlocked, next].sort((a, b) => a - b);
}
