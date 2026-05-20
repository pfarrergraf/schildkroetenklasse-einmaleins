import { DINO_REWARDS } from "./rewardCatalog";
import { getCollectionProgress } from "./rewardLogic";
import AnimatedDino from "./AnimatedDino";

export default function CollectionView({ unlockedIds, bonusStars = 0, onClose, soundEnabled = true }) {
  const unlocked = new Set(unlockedIds);
  const progress = getCollectionProgress(unlockedIds);

  return (
    <div className="collection-panel">
      <div className="collection-header">
        <div>
          <p className="reward-kicker">Meine Sammlung</p>
          <h2>Schildis Dino-Freunde</h2>
          <p>{progress.unlocked} von {progress.total} Dinos gesammelt{bonusStars ? ` · ${bonusStars} Bonus-Sterne` : ""}</p>
        </div>
        {onClose ? <button type="button" className="reward-later-button" onClick={onClose}>Schließen</button> : null}
      </div>

      <div className="collection-progress-track" aria-label={`${progress.percent} Prozent der Dino-Sammlung geschafft`}>
        <div style={{ width: `${progress.percent}%` }} />
      </div>

      <div className="collection-grid">
        {DINO_REWARDS.map((reward) => {
          const isUnlocked = unlocked.has(reward.id);
          return (
            <article key={reward.id} className={isUnlocked ? "collection-card unlocked" : "collection-card locked"}>
              {isUnlocked ? (
                <AnimatedDino reward={reward} size="collection" soundEnabled={soundEnabled} active={false} />
              ) : (
                <div className="dino-silhouette" aria-hidden="true">?</div>
              )}
              <strong>{isUnlocked ? reward.name : "Noch geheim"}</strong>
              <span>{isUnlocked ? reward.species : "Schaffe 10 von 10"}</span>
            </article>
          );
        })}
      </div>
    </div>
  );
}
