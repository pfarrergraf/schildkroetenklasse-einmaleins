import test from "node:test";
import assert from "node:assert/strict";

import { buildRewardOffer } from "../src/features/rewards/rewardLogic.js";
import {
  applyRewardCheckpoint,
  createRewardCheckpoint,
  loadPendingRewardOffer,
  loadRewardEvents,
  savePendingRewardOffer,
} from "../src/features/rewards/rewardStorage.js";
import {
  hydrateRewardCheckpoint,
  persistRewardCheckpoint,
  resolveRewardBackendConfig,
} from "../src/features/rewards/rewardBackend.js";

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
  global.navigator = { onLine: true };
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

test("remote mode without url stays local", () => {
  const config = resolveRewardBackendConfig({ VITE_REWARD_BACKEND_MODE: "remote" });

  assert.equal(config.remoteEnabled, false);
  assert.equal(config.configuredMode, "remote");
});