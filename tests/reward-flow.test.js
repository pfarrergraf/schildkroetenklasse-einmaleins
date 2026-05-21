import test from "node:test";
import assert from "node:assert/strict";

import { buildRewardOffer, checkNewAchievements } from "../src/features/rewards/rewardLogic.js";
import {
  applyRewardCheckpoint,
  createRewardCheckpoint,
  loadCompletedAchievementIds,
  loadConsecutivePerfectRounds,
  loadPendingRewardOffer,
  loadRewardEvents,
  savePendingRewardOffer,
} from "../src/features/rewards/rewardStorage.js";
import {
  hydrateRewardCheckpoint,
  persistRewardCheckpoint,
  resolveRewardBackendConfig,
} from "../src/features/rewards/rewardBackend.js";
import {
  ANSWER_MODES,
  buildTypedModeRecommendation,
  getCorrectAnswerFeedback,
  getModeIntroFeedback,
  getModeSwitchFeedback,
  getReadyFeedback,
  getWrongAnswerFeedback,
} from "../src/features/learning/sessionSupport.js";

class MemoryStorage {
  constructor() {
    this.data = new Map();
  }

  getItem(key) {
    return this.data.has(key) ? this.data.get(key) : null;
  }

  setItem(key, value) {
    this.data.set(key, String(value));
  }

  removeItem(key) {
    this.data.delete(key);
  }

  clear() {
    this.data.clear();
  }
}

test.beforeEach(() => {
  global.window = { localStorage: new MemoryStorage() };
  Object.defineProperty(globalThis, "navigator", {
    value: { onLine: true },
    configurable: true,
    writable: true,
  });
});

test.afterEach(() => {
  delete global.window;
  delete global.navigator;
});

test("reward offers stay deterministic for the same seed", () => {
  const firstOffer = buildRewardOffer([], { seed: "tables-1-2-5-10" }).choices.map((reward) => reward.id);
  const secondOffer = buildRewardOffer([], { seed: "tables-1-2-5-10" }).choices.map((reward) => reward.id);

  assert.deepEqual(secondOffer, firstOffer);
  assert.equal(firstOffer.length, 3);
});

test("pending rewards survive checkpoint round-trips", () => {
  savePendingRewardOffer({
    offerId: "offer-1",
    choiceIds: ["bruno-bronto", "trixi-triceratops", "pico-pteranodon"],
    createdAt: "2026-05-20T10:00:00.000Z",
    selectedTableCount: 4,
  });

  const checkpoint = applyRewardCheckpoint(
    createRewardCheckpoint({
      rewardEvents: [
        {
          id: "event-1",
          type: "reward-offer-created",
          createdAt: "2026-05-20T10:00:01.000Z",
          data: { offerId: "offer-1" },
        },
      ],
      updatedAt: "2026-05-20T10:00:02.000Z",
    })
  );

  assert.equal(checkpoint.pendingRewardOffer.offerId, "offer-1");
  assert.deepEqual(checkpoint.pendingRewardOffer.choiceIds, ["bruno-bronto", "trixi-triceratops", "pico-pteranodon"]);
  assert.equal(loadPendingRewardOffer().offerId, "offer-1");
  assert.equal(loadRewardEvents().length, 1);
});

test("checkpoint round-trips achievements and consecutive perfect rounds", () => {
  const checkpoint = applyRewardCheckpoint(
    createRewardCheckpoint({
      unlockedRewardIds: ["bruno-bronto"],
      completedAchievementIds: ["perfect-any", "core-mix"],
      consecutivePerfectRounds: 2,
      updatedAt: "2026-05-20T10:00:02.000Z",
    })
  );

  assert.deepEqual(checkpoint.completedAchievementIds, ["perfect-any", "core-mix"]);
  assert.equal(checkpoint.consecutivePerfectRounds, 2);
  assert.deepEqual(loadCompletedAchievementIds(), ["perfect-any", "core-mix"]);
  assert.equal(loadConsecutivePerfectRounds(), 2);
});

test("remote reward persistence falls back to local checkpoint on failure", async () => {
  const result = await persistRewardCheckpoint(
    createRewardCheckpoint({
      unlockedRewardIds: ["bruno-bronto"],
      updatedAt: "2026-05-20T12:00:00.000Z",
    }),
    {
      env: {
        VITE_REWARD_BACKEND_MODE: "remote",
        VITE_REWARD_REMOTE_URL: "https://example.com/api",
        VITE_REWARD_REMOTE_TIMEOUT_MS: "1000",
      },
      fetchImpl: async () => {
        throw new Error("network down");
      },
    }
  );

  assert.equal(result.status.transport, "local-fallback");
  assert.deepEqual(result.checkpoint.unlockedRewardIds, ["bruno-bronto"]);
});

test("remote hydration keeps the newer local checkpoint", async () => {
  applyRewardCheckpoint(
    createRewardCheckpoint({
      unlockedRewardIds: ["bruno-bronto"],
      updatedAt: "2026-05-20T12:00:00.000Z",
    })
  );

  const result = await hydrateRewardCheckpoint({
    env: {
      VITE_REWARD_BACKEND_MODE: "remote",
      VITE_REWARD_REMOTE_URL: "https://example.com/api",
      VITE_REWARD_REMOTE_TIMEOUT_MS: "1000",
    },
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          rewardCheckpoint: {
            unlockedRewardIds: ["trixi-triceratops"],
            bonusStars: 0,
            rewardedTableCount: 0,
            pendingRewardOffer: null,
            rewardEvents: [],
            updatedAt: "2026-05-20T11:00:00.000Z",
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      ),
  });

  assert.equal(result.status.transport, "remote");
  assert.deepEqual(result.checkpoint.unlockedRewardIds, ["bruno-bronto"]);
});

test("remote persistence keeps newer local checkpoint when server echoes stale data", async () => {
  const result = await persistRewardCheckpoint(
    createRewardCheckpoint({
      unlockedRewardIds: ["bruno-bronto"],
      completedAchievementIds: ["perfect-any"],
      updatedAt: "2026-05-20T12:00:00.000Z",
    }),
    {
      env: {
        VITE_REWARD_BACKEND_MODE: "remote",
        VITE_REWARD_REMOTE_URL: "https://example.com/api",
        VITE_REWARD_REMOTE_TIMEOUT_MS: "1000",
        VITE_REWARD_REMOTE_PLAYER_ID: "samuel",
      },
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            rewardCheckpoint: {
              unlockedRewardIds: ["trixi-triceratops"],
              completedAchievementIds: [],
              bonusStars: 0,
              rewardedTableCount: 0,
              consecutivePerfectRounds: 0,
              pendingRewardOffer: null,
              rewardEvents: [],
              updatedAt: "2026-05-20T11:00:00.000Z",
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        ),
    }
  );

  assert.equal(result.status.transport, "remote");
  assert.deepEqual(result.checkpoint.unlockedRewardIds, ["bruno-bronto"]);
  assert.deepEqual(result.checkpoint.completedAchievementIds, ["perfect-any"]);
});

test("remote mode without url stays local", () => {
  const config = resolveRewardBackendConfig({ VITE_REWARD_BACKEND_MODE: "remote" });

  assert.equal(config.remoteEnabled, false);
  assert.equal(config.configuredMode, "remote");
});

test("achievement checks distinguish core mix and single hard row", () => {
  const coreResults = checkNewAchievements({
    finalScore: 10,
    totalRounds: 10,
    selectedTables: [0, 1, 2, 5, 10],
    consecutivePerfect: 1,
    completedIds: [],
  }).map((achievement) => achievement.id);

  const hardRowResults = checkNewAchievements({
    finalScore: 10,
    totalRounds: 10,
    selectedTables: [7],
    consecutivePerfect: 1,
    completedIds: [],
  }).map((achievement) => achievement.id);

  assert.ok(coreResults.includes("core-mix"));
  assert.ok(!coreResults.includes("non-core-single"));
  assert.ok(hardRowResults.includes("non-core-single"));
  assert.ok(!hardRowResults.includes("core-mix"));
});

test("wrong-answer feedback stays gentle and escalates support on repeats", () => {
  assert.deepEqual(getWrongAnswerFeedback(1), {
    text: "Guter Versuch. Schau noch mal.",
    cueId: "wrongGentle",
  });

  assert.deepEqual(getWrongAnswerFeedback(3), {
    text: "Ganz ruhig. Probier es noch einmal.",
    cueId: "wrongSteady",
  });
});

test("mode copy changes with answer mode", () => {
  assert.equal(getModeIntroFeedback(ANSWER_MODES.CHOICE), "Neue Runde. Wähle die passende Antwort.");
  assert.equal(getModeIntroFeedback(ANSWER_MODES.TYPED), "Neue Runde. Tippe die Antwort in Ruhe ein.");
  assert.equal(getReadyFeedback(ANSWER_MODES.CHOICE), "Nächste Aufgabe. Wähle die passende Antwort.");
  assert.equal(getReadyFeedback(ANSWER_MODES.TYPED), "Nächste Aufgabe. Tippe die Zahl ein.");
  assert.equal(
    getModeSwitchFeedback(ANSWER_MODES.TYPED),
    "Tippen ist an. Du kannst jederzeit wieder zu den Antwortkarten wechseln."
  );
});

test("typed correct feedback celebrates first, rotates in between, and returns on every third typed success", () => {
  assert.deepEqual(getCorrectAnswerFeedback({ answerMode: ANSWER_MODES.TYPED, nextStreak: 1, typedCorrectCount: 0 }), {
    text: "Stark. Du hast die Antwort selbst eingetippt.",
    cueId: "typedCelebrate",
  });

  assert.deepEqual(getCorrectAnswerFeedback({ answerMode: ANSWER_MODES.TYPED, nextStreak: 2, typedCorrectCount: 1 }), {
    text: "Ja. Stark getippt.",
    cueId: "correctJa",
  });

  assert.deepEqual(getCorrectAnswerFeedback({ answerMode: ANSWER_MODES.TYPED, nextStreak: 3, typedCorrectCount: 2 }), {
    text: "Stark. Du tippst schon ganz sicher.",
    cueId: "typedCelebrate",
  });
});

test("typed mode recommendation stays quiet without mastery signals", () => {
  const recommendation = buildTypedModeRecommendation({
    learningState: {
      attemptsByTask: {},
      rounds: [],
      dailyPractice: {},
    },
    streak: 0,
    selectedTables: [2, 5],
  });

  assert.equal(recommendation.shouldSuggest, false);
  assert.equal(recommendation.shouldAutoEnable, false);
});

test("typed mode recommendation suggests after a strong streak", () => {
  const today = new Date().toISOString().slice(0, 10);
  const recommendation = buildTypedModeRecommendation({
    learningState: {
      attemptsByTask: {},
      rounds: [],
      dailyPractice: {
        [today]: { attempts: 9, correct: 8, rounds: 1 },
      },
    },
    streak: 3,
    selectedTables: [2, 5],
  });

  assert.equal(recommendation.shouldSuggest, true);
  assert.equal(recommendation.shouldAutoEnable, false);
  assert.match(recommendation.headline, /Tippen/);
});

test("typed mode recommendation can auto-enable after repeated strong practice", () => {
  const today = new Date().toISOString().slice(0, 10);
  const recommendation = buildTypedModeRecommendation({
    learningState: {
      attemptsByTask: {
        "7x3": { a: 7, b: 3, attempts: 3, correct: 3 },
        "7x4": { a: 7, b: 4, attempts: 3, correct: 3 },
      },
      rounds: [
        { perfect: true },
        { perfect: true },
      ],
      dailyPractice: {
        [today]: { attempts: 12, correct: 11, rounds: 2 },
      },
    },
    streak: 4,
    selectedTables: [7],
  });

  assert.equal(recommendation.shouldSuggest, true);
  assert.equal(recommendation.shouldAutoEnable, true);
  assert.match(recommendation.headline, /freigeschaltet/);
});
