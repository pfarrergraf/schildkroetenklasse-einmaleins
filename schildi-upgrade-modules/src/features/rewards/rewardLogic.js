import { getRewardsForWorld, PRIMARY_REWARD_WORLD_ID, REWARDS } from "./rewardCatalog.js";
import { saveRewardState } from "./rewardStorage.js";

export function getUnlockedRewards(rewardState) {
  const unlocked = new Set(rewardState?.unlockedRewardIds ?? []);
  return REWARDS.filter((reward) => unlocked.has(reward.id));
}

export function getLockedRewards(rewardState, worldId = PRIMARY_REWARD_WORLD_ID) {
  const unlocked = new Set(rewardState?.unlockedRewardIds ?? []);
  return getRewardsForWorld(worldId).filter((reward) => !unlocked.has(reward.id));
}

export function hasCompletedWorld(rewardState, worldId = PRIMARY_REWARD_WORLD_ID) {
  return getLockedRewards(rewardState, worldId).length === 0;
}

export function getRewardProgress(rewardState, worldId = PRIMARY_REWARD_WORLD_ID) {
  const rewards = getRewardsForWorld(worldId);
  const unlocked = new Set(rewardState?.unlockedRewardIds ?? []);
  const unlockedCount = rewards.filter((reward) => unlocked.has(reward.id)).length;

  return {
    unlockedCount,
    totalCount: rewards.length,
    percent: rewards.length ? Math.round((unlockedCount / rewards.length) * 100) : 0,
    completed: rewards.length > 0 && unlockedCount >= rewards.length,
  };
}

export function pickRewardChoices(rewardState, { worldId = PRIMARY_REWARD_WORLD_ID, choiceCount = 3 } = {}) {
  const lockedRewards = getLockedRewards(rewardState, worldId);
  const shuffled = [...lockedRewards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, choiceCount);
}

export function shouldOfferReward({ score, totalRounds, rewardState, worldId = PRIMARY_REWARD_WORLD_ID }) {
  if (score !== totalRounds) return false;
  return getLockedRewards(rewardState, worldId).length > 0;
}

export function recordPerfectRoundWithoutNewReward(rewardState) {
  return saveRewardState({
    ...rewardState,
    perfectRounds: Number(rewardState?.perfectRounds || 0) + 1,
    bonusStars: Number(rewardState?.bonusStars || 0) + 1,
  });
}

export function unlockReward(rewardState, rewardId, { score = null, total = null } = {}) {
  const currentIds = rewardState?.unlockedRewardIds ?? [];
  const alreadyUnlocked = currentIds.includes(rewardId);
  const unlockedRewardIds = alreadyUnlocked ? currentIds : [...currentIds, rewardId];

  return saveRewardState({
    ...rewardState,
    unlockedRewardIds,
    perfectRounds: Number(rewardState?.perfectRounds || 0) + 1,
    lastUnlockedRewardId: rewardId,
    rewardHistory: [
      ...(rewardState?.rewardHistory ?? []),
      {
        rewardId,
        score,
        total,
        createdAt: new Date().toISOString(),
      },
    ].slice(-50),
  });
}
