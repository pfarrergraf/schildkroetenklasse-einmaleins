// Defines all arithmetic operations and their learning levels.
// Levels are ordered from easiest to hardest, mirroring the German
// Grundschule curriculum (classes 1–4).

export const OPERATIONS = {
  addition: {
    id: "addition",
    symbol: "+",
    label: "Addition",
    emoji: "➕",
    minClass: 1,
    levels: [
      {
        id: "add-1",
        label: "bis 10",
        description: "Zahlen bis 10 addieren",
        classHint: "1. Klasse",
        maxA: 10,
        maxB: 10,
        maxResult: 10,
        requireCarry: false,
      },
      {
        id: "add-2",
        label: "bis 20",
        description: "Zahlen bis 20, ohne Zehnerübergang",
        classHint: "1. Klasse",
        maxA: 20,
        maxB: 20,
        maxResult: 20,
        requireCarry: false,
      },
      {
        id: "add-3",
        label: "Zehnerübergang bis 20",
        description: "Über den Zehner addieren (z.B. 7 + 5 = 12)",
        classHint: "1./2. Klasse",
        maxA: 20,
        maxB: 20,
        maxResult: 20,
        requireCarry: true,
      },
      {
        id: "add-4",
        label: "bis 100",
        description: "Zahlen bis 100, ohne Zehnerübergang",
        classHint: "2. Klasse",
        maxA: 100,
        maxB: 100,
        maxResult: 100,
        requireCarry: false,
      },
      {
        id: "add-5",
        label: "Zehnerübergang bis 100",
        description: "Über den Zehner bis 100 (z.B. 45 + 7 = 52)",
        classHint: "2. Klasse",
        maxA: 100,
        maxB: 100,
        maxResult: 100,
        requireCarry: true,
      },
    ],
  },
  subtraction: {
    id: "subtraction",
    symbol: "−",
    label: "Subtraktion",
    emoji: "➖",
    minClass: 1,
    levels: [
      {
        id: "sub-1",
        label: "bis 10",
        description: "Zahlen bis 10 subtrahieren",
        classHint: "1. Klasse",
        maxA: 10,
        maxB: 10,
        maxResult: 10,
        requireBorrow: false,
      },
      {
        id: "sub-2",
        label: "bis 20",
        description: "Zahlen bis 20, ohne Zehnerübergang",
        classHint: "1. Klasse",
        maxA: 20,
        maxB: 20,
        maxResult: 20,
        requireBorrow: false,
      },
      {
        id: "sub-3",
        label: "Zehnerübergang bis 20",
        description: "Über den Zehner subtrahieren (z.B. 13 − 5 = 8)",
        classHint: "1./2. Klasse",
        maxA: 20,
        maxB: 20,
        maxResult: 20,
        requireBorrow: true,
      },
      {
        id: "sub-4",
        label: "bis 100",
        description: "Zahlen bis 100, ohne Zehnerübergang",
        classHint: "2. Klasse",
        maxA: 100,
        maxB: 100,
        maxResult: 100,
        requireBorrow: false,
      },
      {
        id: "sub-5",
        label: "Zehnerübergang bis 100",
        description: "Über den Zehner bis 100 (z.B. 95 − 7 = 88)",
        classHint: "2. Klasse",
        maxA: 100,
        maxB: 100,
        maxResult: 100,
        requireBorrow: true,
        carryExample: "95 − 7",
      },
      {
        id: "sub-6",
        label: "Zweistellig minus Zweistellig",
        description: "Zweistellige Zahlen subtrahieren (z.B. 90 − 17 = 73)",
        classHint: "2./3. Klasse",
        maxA: 100,
        maxB: 100,
        maxResult: 100,
        requireBorrow: true,
        twoDigitMinus: true,
      },
    ],
  },
  multiplication: {
    id: "multiplication",
    symbol: "×",
    label: "Multiplikation",
    emoji: "✖️",
    minClass: 2,
    levels: [
      {
        id: "mul-1",
        label: "Kernreihen",
        description: "Einfache Reihen: 0, 1, 2, 5, 10",
        classHint: "2. Klasse",
        tables: [0, 1, 2, 5, 10],
      },
      {
        id: "mul-2",
        label: "Reihen 3 und 4",
        description: "Reihen 3 und 4 dazunehmen",
        classHint: "2. Klasse",
        tables: [3, 4],
        includeCore: true,
      },
      {
        id: "mul-3",
        label: "Reihen 6 bis 9",
        description: "Alle schweren Reihen: 6, 7, 8, 9",
        classHint: "3. Klasse",
        tables: [6, 7, 8, 9],
        includeCore: true,
      },
      {
        id: "mul-4",
        label: "Alle Reihen",
        description: "Das komplette 1×1 von 0 bis 10",
        classHint: "3. Klasse",
        tables: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    ],
  },
  division: {
    id: "division",
    symbol: "÷",
    label: "Division",
    emoji: "➗",
    minClass: 3,
    levels: [
      {
        id: "div-1",
        label: "Kernreihen",
        description: "Teilen mit 1, 2, 5, 10",
        classHint: "3. Klasse",
        divisors: [1, 2, 5, 10],
      },
      {
        id: "div-2",
        label: "Reihen 3 und 4",
        description: "Teilen mit 3 und 4",
        classHint: "3. Klasse",
        divisors: [3, 4],
        includeCore: true,
      },
      {
        id: "div-3",
        label: "Alle Reihen",
        description: "Teilen durch alle Zahlen von 1 bis 10",
        classHint: "3./4. Klasse",
        divisors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    ],
  },
};

// Which operations are available per school class (Klasse)
export const CLASS_OPERATIONS = {
  1: ["addition", "subtraction", "multiplication", "division"],
  2: ["addition", "subtraction", "multiplication", "division"],
  3: ["addition", "subtraction", "multiplication", "division"],
  4: ["addition", "subtraction", "multiplication", "division"],
};

export const CLASS_LABELS = {
  1: "1. Klasse",
  2: "2. Klasse",
  3: "3. Klasse",
  4: "4. Klasse",
};

export const OPERATION_IDS = Object.keys(OPERATIONS);

export function getOperation(id) {
  return OPERATIONS[id] ?? null;
}

export function getLevelById(operationId, levelId) {
  const op = OPERATIONS[operationId];
  if (!op) return null;
  return op.levels.find((l) => l.id === levelId) ?? null;
}

export function getDefaultLevelId(operationId) {
  const op = OPERATIONS[operationId];
  if (!op || !op.levels.length) return null;
  return op.levels[0].id;
}

export function getNextLevelId(operationId, currentLevelId) {
  const op = OPERATIONS[operationId];
  if (!op) return null;
  const idx = op.levels.findIndex((l) => l.id === currentLevelId);
  if (idx < 0 || idx >= op.levels.length - 1) return null;
  return op.levels[idx + 1].id;
}

export function isLastLevel(operationId, levelId) {
  return getNextLevelId(operationId, levelId) === null;
}
