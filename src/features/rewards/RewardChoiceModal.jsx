import AnimatedDino from "./AnimatedDino";

export default function RewardChoiceModal({
  choices,
  onChoose,
  onClose,
  achievementTitle = null,
  claimInFlight = false,
}) {
  if (!choices?.length) return null;

  return (
    <div
      className="reward-modal-backdrop"
      role="presentation"
      onClick={claimInFlight ? undefined : onClose}
    >
      <section
        className="reward-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="reward-kicker">{achievementTitle ?? "10 von 10 richtig"}</p>
        <h2 id="reward-title">Schildkrötenstark!</h2>
        <p className="reward-intro">Du hast alle Aufgaben richtig gelöst. Such dir einen echten Dino für deine Sammlung aus.</p>

        <div className="reward-choice-grid">
          {choices.map((reward, index) => (
            <article key={reward.id} className="reward-choice-card">
              <AnimatedDino
                reward={reward}
                size="choice"
                celebrate
                active={!claimInFlight && index === 0}
              />
              <strong>{reward.name}</strong>
              <span>{reward.shortLabel}</span>
              <p>{reward.praise}</p>

              <button type="button" className="reward-choice-select" onClick={() => onChoose(reward)} disabled={claimInFlight}>
                {claimInFlight ? "Wird gespeichert..." : "Diesen Dino wählen"}
              </button>
            </article>
          ))}
        </div>

        <button type="button" className="reward-later-button" onClick={onClose} disabled={claimInFlight}>Später aussuchen</button>
      </section>
    </div>
  );
}
