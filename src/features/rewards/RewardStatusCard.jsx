import { DINO_REWARDS } from "./rewardCatalog";

export default function RewardStatusCard({ unlockedIds, bonusStars = 0, rewardedTableCount = 0, onOpenCollection }) {
  const unlockedCount = unlockedIds?.length ?? 0;
  const statusText =
    bonusStars > 0
      ? `${bonusStars} Bonus-Sterne`
      : rewardedTableCount > 0
        ? "Nächste Belohnung: 10 von 10 mit mehr aktiven Tafeln."
        : "Die erste Belohnung gibt es für 10 von 10.";

  return (
    <div className="reward-status-card">
      <div>
        <span>Dino-Sammlung</span>
        <strong>{unlockedCount}/{DINO_REWARDS.length}</strong>
        <p>{statusText}</p>
      </div>
      <button type="button" className="collection-open-button" onClick={onOpenCollection}>Meine Sammlung</button>
    </div>
  );
}
