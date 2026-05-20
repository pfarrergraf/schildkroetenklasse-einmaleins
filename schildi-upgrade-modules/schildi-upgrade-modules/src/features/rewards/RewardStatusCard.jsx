import React from "react";
import { getRewardProgress, PRIMARY_REWARD_WORLD_ID } from "./index.js";

export function RewardStatusCard({ rewardState, onOpenCollection, worldId = PRIMARY_REWARD_WORLD_ID }) {
  const progress = getRewardProgress(rewardState, worldId);

  return (
    <div className="reward-status-card">
      <div>
        <span>Sammlung</span>
        <strong>{progress.unlockedCount}/{progress.totalCount} Dinos</strong>
      </div>
      <button type="button" onClick={onOpenCollection} className="reward-status-button">
        Meine Sammlung
      </button>
    </div>
  );
}
