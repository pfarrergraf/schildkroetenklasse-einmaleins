import { DINO_REWARDS } from "./rewardCatalog";

export default function RewardStatusCard({ unlockedIds, bonusStars = 0, onOpenCollection }) {
  const unlockedCount = unlockedIds?.length ?? 0;

  return (
    <div className="reward-status-card">
      <div>
        <span>Dino-Sammlung</span>
        <strong>{unlockedCount}/{DINO_REWARDS.length}</strong>
        {bonusStars ? <p>{bonusStars} Bonus-Sterne</p> : <p>10 von 10 schaltet einen Dino frei.</p>}
      </div>
      <button type="button" className="collection-open-button" onClick={onOpenCollection}>Meine Sammlung</button>
    </div>
  );
}
