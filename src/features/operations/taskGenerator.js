import { OPERATIONS } from "./operationConfig.js";

// Returns true when a+b crosses a tens boundary (e.g. 7+4=11 crosses 10)
function crossesTen(a, b) {
  const lower = Math.floor(a / 10) * 10;
  return a + b > lower + 10;
}

// Returns true when a-b crosses a tens boundary (e.g. 13-5=8 crosses 10)
function borrowsAcrossTen(a, b) {
  return a % 10 < b % 10;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function taskKey(op, a, b) {
  return `${op}:${a}:${b}`;
}

// Generate an addition task for the given level config
function generateAdditionTask(level, previousKey) {
  const { maxA, maxB, maxResult, requireCarry } = level;

  for (let attempt = 0; attempt < 60; attempt++) {
    let a, b;

    if (requireCarry) {
      // Force a carry: pick a near a tens boundary, then b that pushes over it
      const tensFloor = randomInt(0, Math.floor(maxA / 10) - 1) * 10;
      a = tensFloor + randomInt(1, 9);
      b = randomInt(10 - (a % 10) + 1, Math.min(9, maxB));
      if (b <= 0) continue;
    } else {
      a = randomInt(1, maxA);
      b = randomInt(1, maxB);
    }

    const answer = a + b;
    if (answer > maxResult) continue;
    if (requireCarry && !crossesTen(a, b)) continue;
    if (!requireCarry && maxResult <= 20 && crossesTen(a, b)) continue;

    if (taskKey("add", a, b) !== previousKey) {
      return { a, b, answer, operator: "+" };
    }
  }

  // Fallback (no carry constraint)
  const a = randomInt(1, Math.min(maxA, 9));
  const b = randomInt(1, Math.min(maxB, maxResult - a));
  return { a, b, answer: a + b, operator: "+" };
}

// Generate a subtraction task for the given level config
function generateSubtractionTask(level, previousKey) {
  const { maxA, requireBorrow, twoDigitMinus } = level;

  for (let attempt = 0; attempt < 60; attempt++) {
    let a, b;

    if (twoDigitMinus) {
      // a and b both two-digit, a > b
      a = randomInt(20, maxA);
      b = randomInt(10, a - 1);
    } else if (requireBorrow) {
      // Cross tens boundary: a is in teens (or higher), ones digit of a < ones digit of b
      const tensFloor = randomInt(1, Math.floor(maxA / 10) - 1) * 10;
      a = tensFloor + randomInt(1, 9);
      b = randomInt(a % 10 + 1, 9);
      if (b <= 0 || b >= a) continue;
    } else {
      a = randomInt(1, maxA);
      b = randomInt(0, a);
    }

    const answer = a - b;
    if (answer < 0) continue;
    if (requireBorrow && !borrowsAcrossTen(a, b)) continue;
    if (!requireBorrow && !twoDigitMinus && maxA <= 20 && borrowsAcrossTen(a, b)) continue;

    if (taskKey("sub", a, b) !== previousKey) {
      return { a, b, answer, operator: "−" };
    }
  }

  const a = randomInt(5, Math.min(maxA, 20));
  const b = randomInt(1, a);
  return { a, b, answer: a - b, operator: "−" };
}

// Generate a multiplication task using the selected tables
function generateMultiplicationTask(level, selectedTables, previousKey) {
  const tables = level.tables ?? selectedTables ?? [1, 2, 5, 10];
  const allTables = Array.from({ length: 11 }, (_, i) => i);

  for (let attempt = 0; attempt < 40; attempt++) {
    const a = tables[Math.floor(Math.random() * tables.length)];
    // b is drawn from the full 0-10 range so all facts per table are covered
    const b = allTables[Math.floor(Math.random() * allTables.length)];
    const answer = a * b;

    if (taskKey("mul", a, b) !== previousKey) {
      return { a, b, answer, operator: "×" };
    }
  }

  const a = tables[0];
  const b = 5;
  return { a, b, answer: a * b, operator: "×" };
}

// Generate a division task for the given level config
function generateDivisionTask(level, previousKey) {
  const divisors = level.divisors ?? [2, 5, 10];
  const allTables = Array.from({ length: 11 }, (_, i) => i);

  for (let attempt = 0; attempt < 40; attempt++) {
    const divisor = divisors[Math.floor(Math.random() * divisors.length)];
    if (divisor === 0) continue;
    const quotient = allTables[Math.floor(Math.random() * allTables.length)];
    const dividend = divisor * quotient;
    // Present as: dividend ÷ divisor = quotient
    const a = dividend;
    const b = divisor;
    const answer = quotient;

    if (taskKey("div", a, b) !== previousKey) {
      return { a, b, answer, operator: "÷" };
    }
  }

  return { a: 10, b: 2, answer: 5, operator: "÷" };
}

/**
 * Generate a task for the given operation and level.
 * @param {string} operationId - "addition" | "subtraction" | "multiplication" | "division"
 * @param {string} levelId - level id from operationConfig
 * @param {object|null} previousTask - last task (to avoid repetition)
 * @param {number[]} selectedTables - currently selected tables (for multiplication)
 * @returns {{ a, b, answer, operator }}
 */
export function generateTask(operationId, levelId, previousTask, selectedTables) {
  const op = OPERATIONS[operationId];
  if (!op) return generateMultiplicationTask({ tables: [1, 2, 5, 10] }, null, []);

  const level = op.levels.find((l) => l.id === levelId) ?? op.levels[0];
  const prevKey = previousTask
    ? taskKey(previousTask.operator === "+" ? "add" :
               previousTask.operator === "−" ? "sub" :
               previousTask.operator === "×" ? "mul" : "div",
               previousTask.a, previousTask.b)
    : null;

  switch (operationId) {
    case "addition":
      return generateAdditionTask(level, prevKey);
    case "subtraction":
      return generateSubtractionTask(level, prevKey);
    case "multiplication":
      return generateMultiplicationTask(level, selectedTables, prevKey);
    case "division":
      return generateDivisionTask(level, prevKey);
    default:
      return generateMultiplicationTask(level, selectedTables, prevKey);
  }
}

/**
 * Get the valid answer range for an operation/level combo.
 * Used to set input min/max and validate typed answers.
 */
export function getAnswerRange(operationId, levelId) {
  const op = OPERATIONS[operationId];
  if (!op) return { min: 0, max: 100 };

  switch (operationId) {
    case "addition":
    case "subtraction":
      return { min: 0, max: 100 };
    case "multiplication":
      return { min: 0, max: 100 };
    case "division":
      return { min: 0, max: 10 };
    default:
      return { min: 0, max: 100 };
  }
}

/**
 * Generate multiple-choice answer options for the given task.
 * Creates 3 distractors + correct answer, shuffled.
 */
export function generateOperationOptions(task) {
  const correct = task.answer;
  const distractors = new Set([correct]);

  const add = (v) => {
    if (v >= 0 && v <= 100 && Number.isInteger(v)) distractors.add(v);
  };

  // Nearby values
  add(correct - 1);
  add(correct + 1);
  add(correct - 2);
  add(correct + 2);
  add(correct + 10);
  add(correct - 10);

  // Operation-specific distractors
  if (task.operator === "+") {
    add(task.a - task.b); // subtraction confusion
    add(task.a * task.b <= 100 ? task.a * task.b : -1); // multiplication confusion
    add(task.a + task.b + task.a); // off by one factor
  } else if (task.operator === "−") {
    add(task.a + task.b); // addition confusion
    add(task.b - task.a >= 0 ? task.b - task.a : -1); // reversed
    add(correct + 10);
  } else if (task.operator === "×") {
    add(task.a + task.b); // addition confusion
    add((task.a + 1) * task.b);
    add(task.a * (task.b + 1));
  } else if (task.operator === "÷") {
    add(correct - 1);
    add(correct + 1);
    add(task.b); // divisor confusion
    add(task.a - task.b >= 0 ? task.a - task.b : -1); // subtraction confusion
  }

  const pool = Array.from(distractors).filter((v) => v !== correct);
  const shuffledPool = pool.sort(() => Math.random() - 0.5);
  const chosen = shuffledPool.slice(0, 3);

  const allOptions = [correct, ...chosen];
  return allOptions.sort(() => Math.random() - 0.5);
}
