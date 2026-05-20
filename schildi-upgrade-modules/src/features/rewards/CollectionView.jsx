import React from "react";
import { getRewardProgress, getRewardWorld, getRewardsForWorld, PRIMARY_REWARD_WORLD_ID } from "./index.js";

export function CollectionView({ open, rewardState, onClose, worldId = PRIMARY_REWARD_WORLD_ID }) {
  if (!open) return null;

  const world = getRewardWorld(worldId);
  const rewards = getRewardsForWorld(worldId);
  const unlocked = new Set(rewardState?.unlockedRewardIds ?? []);
  const progress = getRewardProgress(rewardState, worldId);

  return (
    <div className="collection-backdrop" role="presentation">
      <section className="collection-panel" role="dialog" aria-modal="true" aria-labelledby="collection-title">
        <div className="collection-header">
          <div>
            <p className="reward-eyebrow">Meine Sammlung</p>
            <h2 id="collection-title">{world.name}</h2>
            <p>{progress.unlockedCount} von {progress.totalCount} Freunden gesammelt</p>
          </div>
          <button type="button" className="reward-close-button" onClick={onClose} aria-label="Sammlung schließen">
            ×
          </button>
        </div>

        <div className="collection-progress" aria-label={`${progress.percent} Prozent gesammelt`}>
          <div style={{ width: `${progress.percent}%` }} />
        </div>

        <div className="collection-grid">
          {rewards.map((reward) => {
            const isUnlocked = unlocked.has(reward.id);
            return (
              <article key={reward.id} className={isUnlocked ? "collection-card unlocked" : "collection-card locked"}>
                <div className={`collection-reward-visual motion-${isUnlocked ? reward.motion : "locked"}`}>
                  {isUnlocked && reward.image ? (
                    <img src={reward.image} alt="" loading="lazy" />
                  ) : (
                    <span aria-hidden="true">{isUnlocked ? reward.emoji : "?"}</span>
                  )}
                </div>
                <strong>{isUnlocked ? reward.name : "Noch geheim"}</strong>
                <p>{isUnlocked ? reward.message : "Schaffe eine perfekte Runde, dann kann hier ein neuer Freund einziehen."}</p>
              </article>
            );
          })}
        </div>

        {progress.completed ? (
          <div className="collection-complete-note">
            <strong>Sammlung komplett!</strong>
            <span>Weitere perfekte Runden sammeln Bonus-Sterne: {rewardState?.bonusStars ?? 0}</span>
          </div>
        ) : null}
      </section>
    </div>
  );
}
