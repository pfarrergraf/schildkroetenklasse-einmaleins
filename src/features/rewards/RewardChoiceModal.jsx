import AnimatedDino from "./AnimatedDino";

export default function RewardChoiceModal({ choices, onChoose, onClose, soundEnabled = true, achievementTitle = null }) {
  if (!choices?.length) return null;

  return (
    <div className="reward-modal-backdrop" role="presentation">
      <section className="reward-modal" role="dialog" aria-modal="true" aria-labelledby="reward-title">
        <p className="reward-kicker">{achievementTitle ?? "10 von 10 richtig"}</p>
        <h2 id="reward-title">Schildkrötenstark!</h2>
        <p className="reward-intro">Du hast alle Aufgaben richtig gelöst. Such dir einen echten Dino für deine Sammlung aus.</p>

        <div className="reward-choice-grid">
          {choices.map((reward) => (
            <article key={reward.id} className="reward-choice-card">
              <AnimatedDino reward={reward} size="choice" celebrate soundEnabled={soundEnabled} />
              <strong>{reward.name}</strong>
              <span>{reward.shortLabel}</span>
              <p>{reward.praise}</p>

              <button type="button" className="reward-choice-select" onClick={() => onChoose(reward)}>
                Diesen Dino wählen
              </button>
            </article>
          ))}
        </div>

        <button type="button" className="reward-later-button" onClick={onClose}>Später aussuchen</button>
      </section>
    </div>
  );
}
