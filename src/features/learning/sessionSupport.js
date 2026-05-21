import { getDailyPracticeSummary } from "./learningProgress.js";

export const ANSWER_MODES = {
  CHOICE: "choice",
  TYPED: "typed",
};

function getSelectedTableStats(learningState, selectedTables) {
  if (!Array.isArray(selectedTables) || selectedTables.length !== 1) {
    return { attempts: 0, correct: 0, accuracy: 0 };
  }

  const table = selectedTables[0];
  const entries = Object.values(learningState?.attemptsByTask ?? {}).filter((entry) => entry?.a === table || entry?.b === table);
  const attempts = entries.reduce((total, entry) => total + (entry?.attempts ?? 0), 0);
  const correct = entries.reduce((total, entry) => total + (entry?.correct ?? 0), 0);
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

  return { attempts, correct, accuracy };
}

function getRecentPerfectRoundsCount(learningState, limit = 3) {
  return (learningState?.rounds ?? []).slice(-limit).filter((round) => round?.perfect).length;
}

export function getModeIntroFeedback(answerMode) {
  return answerMode === ANSWER_MODES.TYPED
    ? "Neue Runde. Tippe die Antwort in Ruhe ein."
    : "Neue Runde. Wähle die passende Antwort.";
}

export function getReadyFeedback(answerMode) {
  return answerMode === ANSWER_MODES.TYPED
    ? "Nächste Aufgabe. Tippe die Zahl ein."
    : "Nächste Aufgabe. Wähle die passende Antwort.";
}

export function getModeSwitchFeedback(answerMode) {
  return answerMode === ANSWER_MODES.TYPED
    ? "Tippen ist an. Du kannst jederzeit wieder zu den Antwortkarten wechseln."
    : "Antwortkarten sind wieder an. Tippen bleibt jederzeit als neue Herausforderung bereit.";
}

export function getWrongAnswerFeedback(consecutiveWrongAnswers = 1) {
  if (consecutiveWrongAnswers >= 2) {
    return {
      text: "Ganz ruhig. Probier es noch einmal.",
      cueId: "wrongSteady",
    };
  }

  return {
    text: "Guter Versuch. Schau noch mal.",
    cueId: "wrongGentle",
  };
}

const TYPED_PRAISE_ROTATION = [
  {
    text: "Ja. Stark getippt.",
    cueId: "correctJa",
  },
  {
    text: "Super. Du tippst schon sicher.",
    cueId: "correctSuper",
  },
  {
    text: "Richtig. Das hast du selbst gewusst.",
    cueId: "correctStrong",
  },
];

export function getCorrectAnswerFeedback({ answerMode, nextStreak = 0, typedCorrectCount = 0 }) {
  if (answerMode === ANSWER_MODES.TYPED) {
    const nextTypedCorrectCount = Math.max(0, typedCorrectCount) + 1;

    if (nextTypedCorrectCount === 1 || nextTypedCorrectCount % 3 === 0) {
      return {
        text:
          nextTypedCorrectCount === 1
            ? "Stark. Du hast die Antwort selbst eingetippt."
            : "Stark. Du tippst schon ganz sicher.",
        cueId: "typedCelebrate",
      };
    }

    const rotationIndex = (nextTypedCorrectCount - 2) % TYPED_PRAISE_ROTATION.length;
    const rotatedPraise = TYPED_PRAISE_ROTATION[rotationIndex];

    if (nextStreak >= 4) {
      return {
        text: "Super. Deine Tipp-Serie wächst.",
        cueId: "correctSuper",
      };
    }

    return rotatedPraise;
  }

  return {
    text: nextStreak >= 3 ? "Super. Deine Serie wächst." : "Richtig. Stark gerechnet.",
    cueId: nextStreak >= 3 ? "correctSuper" : "correctJa",
  };
}

// Typed mode should feel like an earned option, not a punishment. We use only
// existing practice signals and keep the thresholds gentle so children are
// invited forward after repeated success.
export function buildTypedModeRecommendation({ learningState, streak = 0, selectedTables = [] }) {
  const daily = getDailyPracticeSummary(learningState);
  const recentPerfectRounds = getRecentPerfectRoundsCount(learningState);
  const selectedTableStats = getSelectedTableStats(learningState, selectedTables);
  const focusedTable = selectedTables.length === 1;

  const strongSingleTable = focusedTable && selectedTableStats.attempts >= 6 && selectedTableStats.accuracy >= 85;
  const shouldAutoEnable = (recentPerfectRounds >= 2 && streak >= 4) || (strongSingleTable && streak >= 2);
  const shouldSuggest =
    shouldAutoEnable ||
    streak >= 3 ||
    (daily.attempts >= 8 && daily.accuracy >= 85) ||
    recentPerfectRounds >= 2 ||
    (focusedTable && selectedTableStats.attempts >= 4 && selectedTableStats.accuracy >= 75);

  if (!shouldSuggest) {
    return {
      shouldSuggest: false,
      shouldAutoEnable: false,
      headline: "",
      body: "",
      reason: "",
    };
  }

  if (shouldAutoEnable) {
    return {
      shouldSuggest: true,
      shouldAutoEnable: true,
      headline: "Tippen ist jetzt freigeschaltet.",
      body: "Du rechnest schon sehr sicher. Du kannst jederzeit wieder zu den Antwortkarten wechseln.",
      reason: strongSingleTable ? "Diese Reihe sitzt schon stark." : "Mehrere starke Runden hintereinander.",
    };
  }

  return {
    shouldSuggest: true,
    shouldAutoEnable: false,
    headline: "Bereit für Tippen?",
    body: "Du wirkst schon sicher. Wenn du magst, probiere die nächste Aufgabe ohne Antwortkarten.",
    reason: focusedTable ? "Die aktuelle Reihe klappt schon gut." : "Deine Serie zeigt sichere Antworten.",
  };
}
