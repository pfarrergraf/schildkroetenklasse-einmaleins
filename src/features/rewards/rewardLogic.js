import { DINO_REWARDS, pickRewardChoices } from "./rewardCatalog";

export function shouldOfferReward({ finalScore, totalRounds, selectedTableCount, rewardedTableCount }) {
  if (finalScore !== totalRounds) {
    return false;
  }

  return selectedTableCount > rewardedTableCount;
}

export function buildRewardOffer(unlockedIds) {
  const choices = pickRewardChoices(unlockedIds, 3);
  return {
    allCollected: choices.length === 0,
    choices,
    total: DINO_REWARDS.length,
    unlockedCount: unlockedIds.length,
  };
}

export function getCollectionProgress(unlockedIds) {
  return {
    total: DINO_REWARDS.length,
    unlocked: unlockedIds.length,
    percent: Math.round((unlockedIds.length / DINO_REWARDS.length) * 100),
  };
}
