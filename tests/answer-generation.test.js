import test from "node:test";
import assert from "node:assert/strict";

import {
  ANSWER_MODE_CHOICE,
  ANSWER_MODE_TYPED,
  cleanChoiceAnswer,
  cleanTypedAnswer,
  deriveTaskDifficulty,
  deriveTypedModeReadiness,
  generateAnswerOptions,
  getToggledAnswerMode,
  shouldAutoSwitchToTyped,
} from "../src/features/learning/distractors.js";

function createLearningState({ attemptsByTask = {}, rounds = [], dailyAttempts = 0, dailyCorrect = 0, dailyRounds = 0 } = {}) {
  const today = new Date().toISOString().slice(0, 10);

  return {
    attemptsByTask,
    rounds,
    dailyPractice: {
      [today]: {
        attempts: dailyAttempts,
        correct: dailyCorrect,
        rounds: dailyRounds,
      },
    },
  };
}

function getDistractors(options, correctAnswer) {
  return options.filter((option) => option !== correctAnswer);
}

function averageDistance(options, correctAnswer) {
  const distractors = getDistractors(options, correctAnswer);
  return distractors.reduce((total, option) => total + Math.abs(option - correctAnswer), 0) / distractors.length;
}

test("multiple-choice options always include the correct answer and stay valid", () => {
  const task = { a: 7, b: 6, answer: 42 };
  const options = generateAnswerOptions({
    task,
    learningState: createLearningState(),
    difficulty: "easy",
    answerMode: ANSWER_MODE_CHOICE,
    random: () => 0,
  });

  assert.equal(options.length, 4);
  assert.ok(options.includes(42));
  assert.equal(new Set(options).size, 4);
  assert.ok(options.every((option) => Number.isInteger(option)));
  assert.ok(options.every((option) => option >= 0));
  assert.equal(getDistractors(options, 42).filter((option) => option === 42).length, 0);
});

test("easy distractors use neighboring multiplication facts for 10x5", () => {
  const task = { a: 10, b: 5, answer: 50 };
  const options = generateAnswerOptions({
    task,
    learningState: createLearningState(),
    difficulty: "easy",
    answerMode: ANSWER_MODE_CHOICE,
    random: () => 0,
  });

  assert.ok(options.includes(45));
  assert.ok(options.includes(55));
  assert.ok(options.includes(40) || options.includes(60));
});

test("medium distractors can include a place-value mistake for 10x5", () => {
  const task = { a: 10, b: 5, answer: 50 };
  const options = generateAnswerOptions({
    task,
    learningState: createLearningState(),
    difficulty: "medium",
    answerMode: ANSWER_MODE_CHOICE,
    random: () => 0,
  });

  assert.ok(options.includes(500));
  assert.ok(options.includes(50));
});

test("hard distractors stay closer than beginner distractors", () => {
  const task = { a: 10, b: 5, answer: 50 };
  const beginnerOptions = generateAnswerOptions({
    task,
    learningState: createLearningState(),
    difficulty: "beginner",
    answerMode: ANSWER_MODE_CHOICE,
    random: () => 0,
  });
  const hardOptions = generateAnswerOptions({
    task,
    learningState: createLearningState(),
    difficulty: "hard",
    answerMode: ANSWER_MODE_CHOICE,
    random: () => 0,
  });

  assert.ok(averageDistance(beginnerOptions, 50) > averageDistance(hardOptions, 50));
  assert.ok(getDistractors(hardOptions, 50).some((option) => Math.abs(option - 50) <= 2));
});

test("zero and one edge cases stay nonnegative and plausible", () => {
  const zeroTask = { a: 0, b: 8, answer: 0 };
  const oneTask = { a: 1, b: 7, answer: 7 };

  const zeroOptions = generateAnswerOptions({
    task: zeroTask,
    learningState: createLearningState(),
    difficulty: "beginner",
    answerMode: ANSWER_MODE_CHOICE,
    random: () => 0,
  });
  const oneOptions = generateAnswerOptions({
    task: oneTask,
    learningState: createLearningState(),
    difficulty: "beginner",
    answerMode: ANSWER_MODE_CHOICE,
    random: () => 0,
  });

  assert.ok(zeroOptions.every((option) => option >= 0));
  assert.ok(oneOptions.every((option) => option >= 0));
  assert.ok(oneOptions.every((option) => option !== 96));
});

test("task-specific weak history lowers difficulty even when global signals are strong", () => {
  const task = { a: 7, b: 8, answer: 56 };
  const learningState = createLearningState({
    attemptsByTask: {
      "7x8": { a: 7, b: 8, attempts: 5, correct: 1, wrong: 4 },
    },
    rounds: [{ perfect: true }, { perfect: true }],
    dailyAttempts: 12,
    dailyCorrect: 11,
    dailyRounds: 2,
  });

  const difficulty = deriveTaskDifficulty({
    task,
    learningState,
    round: 6,
    streak: 5,
    consecutivePerfectRounds: 1,
  });

  assert.ok(["beginner", "easy", "medium"].includes(difficulty));
  assert.notEqual(difficulty, "expert");
});

test("typed validation stays capped at 100 while multiple-choice can accept 500", () => {
  assert.equal(cleanTypedAnswer("500"), null);
  assert.equal(cleanTypedAnswer("100"), 100);
  assert.equal(cleanChoiceAnswer("500"), 500);
  assert.equal(cleanChoiceAnswer("50"), 50);
});

test("typed mode readiness stays quiet when mastery is low", () => {
  const readiness = deriveTypedModeReadiness({
    task: { a: 3, b: 4, answer: 12 },
    learningState: createLearningState(),
    streak: 0,
    consecutivePerfectRounds: 0,
    selectedTables: [3, 4],
  });

  assert.equal(readiness.shouldSuggest, false);
  assert.equal(readiness.shouldAutoEnable, false);
});

test("typed mode readiness can auto-enable after strong focused mastery", () => {
  const readiness = deriveTypedModeReadiness({
    task: { a: 7, b: 3, answer: 21 },
    learningState: createLearningState({
      attemptsByTask: {
        "7x3": { a: 7, b: 3, attempts: 5, correct: 5, wrong: 0 },
        "7x4": { a: 7, b: 4, attempts: 4, correct: 4, wrong: 0 },
      },
      rounds: [{ perfect: true }, { perfect: true }],
      dailyAttempts: 12,
      dailyCorrect: 11,
      dailyRounds: 2,
    }),
    streak: 5,
    consecutivePerfectRounds: 1,
    selectedTables: [7],
  });

  assert.equal(readiness.shouldSuggest, true);
  assert.equal(readiness.shouldAutoEnable, true);
});

test("mode helpers support toggling and suppress repeated auto-switch after opt-out", () => {
  assert.equal(getToggledAnswerMode(ANSWER_MODE_CHOICE), ANSWER_MODE_TYPED);
  assert.equal(getToggledAnswerMode(ANSWER_MODE_TYPED), ANSWER_MODE_CHOICE);
  assert.equal(
    shouldAutoSwitchToTyped({
      currentMode: ANSWER_MODE_CHOICE,
      typedModeOptOut: true,
      readiness: { shouldAutoEnable: true },
    }),
    false
  );
  assert.equal(
    shouldAutoSwitchToTyped({
      currentMode: ANSWER_MODE_CHOICE,
      typedModeOptOut: false,
      readiness: { shouldAutoEnable: true },
    }),
    true
  );
});
