import React from "react";

export function RewardChoiceModal({ open, choices, onChoose, onClose, worldName = "Schildis Dino-Freunde" }) {
  if (!open) return null;

  const hasChoices = choices?.length > 0;

  return (
    <div className="reward-backdrop" role="presentation">
      <section className="reward-modal" role="dialog" aria-modal="true" aria-labelledby="reward-title">
        <div className="reward-modal-header">
          <p className="reward-eyebrow">10 von 10 richtig</p>
          <h2 id="reward-title">Schildkrötenstark!</h2>
          <p>
            Du hast alle Aufgaben richtig gelöst. Such dir einen Dino für deine Sammlung aus.
          </p>
        </div>

        {hasChoices ? (
          <div className="reward-choice-grid" aria-label={`Belohnung aus ${worldName} auswählen`}>
            {choices.map((reward) => (
              <button
                key={reward.id}
                type="button"
                className={`reward-choice-card motion-${reward.motion}`}
                onClick={() => onChoose(reward)}
              >
                <span className="reward-choice-glow" style={{ backgroundColor: reward.color }} aria-hidden="true" />
                {reward.image ? (
                  <img className="reward-choice-image" src={reward.image} alt="" loading="lazy" />
                ) : (
                  <span className="reward-choice-emoji" aria-hidden="true">{reward.emoji}</span>
                )}
                <strong>{reward.name}</strong>
                <small>{reward.message}</small>
              </button>
            ))}
          </div>
        ) : (
          <div className="reward-complete-card">
            <span aria-hidden="true">⭐</span>
            <strong>Alle Dinos gesammelt!</strong>
            <p>Perfekte Runden geben jetzt Bonus-Sterne.</p>
          </div>
        )}

        <div className="reward-modal-actions">
          <button type="button" className="reward-secondary-button" onClick={onClose}>
            Später aussuchen
          </button>
        </div>
      </section>
    </div>
  );
}
