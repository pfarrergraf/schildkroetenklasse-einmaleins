import { DINO_REWARDS } from "./rewardCatalog";
import { ACHIEVEMENTS } from "./rewardLogic";

export default function RewardStatusCard({
  unlockedIds,
  bonusStars = 0,
  completedAchievementIds = [],
  backendStatusText = "",
  hasPendingReward = false,
  onOpenCollection,
  onOpenPendingReward,
  onOpenChallenges,
}) {
  const unlockedCount = unlockedIds?.length ?? 0;
  const completedCount = completedAchievementIds?.length ?? 0;
  const statusText =
    hasPendingReward
      ? "Eine offene Belohnung wartet noch auf dich."
      : bonusStars > 0
      ? `${bonusStars} Bonus-Sterne gesammelt!`
      : completedCount > 0
        ? `${completedCount} von ${ACHIEVEMENTS.length} Herausforderungen geschafft.`
        : "Die erste Belohnung gibt es für 10 von 10.";

  return (
    <div className="reward-status-card">
      <div>
        <span>Dino-Sammlung</span>
        <strong>{unlockedCount}/{DINO_REWARDS.length}</strong>
        <p>{statusText}</p>
        {backendStatusText ? <p>{backendStatusText}</p> : null}
      </div>
      <div className="reward-status-actions">
        {hasPendingReward ? (
          <button type="button" className="collection-open-button" onClick={onOpenPendingReward}>Belohnung öffnen</button>
        ) : null}
        <button type="button" className="collection-open-button" onClick={onOpenCollection}>Meine Sammlung</button>
        {onOpenChallenges ? (
          <button type="button" className="collection-open-button challenge-open-button" onClick={onOpenChallenges}>Dino-Herausforderung</button>
        ) : null}
      </div>
    </div>
  );
}
