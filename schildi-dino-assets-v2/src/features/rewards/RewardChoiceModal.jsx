import AnimatedDino from "./AnimatedDino";

export default function RewardChoiceModal({ choices, onChoose, onClose, soundEnabled = true }) {
  if (!choices?.length) return null;

  return (
    <div className="reward-modal-backdrop" role="presentation">
      <section className="reward-modal" role="dialog" aria-modal="true" aria-labelledby="reward-title">
        <p className="reward-kicker">10 von 10 richtig</p>
        <h2 id="reward-title">Schildkroetenstark!</h2>
        <p className="reward-intro">Du hast alle Aufgaben richtig geloest. Such dir einen echten Dino fuer deine Sammlung aus.</p>

        <div className="reward-choice-grid">
          {choices.map((reward) => (
            <button key={reward.id} type="button" className="reward-choice-card" onClick={() => onChoose(reward)}>
              <AnimatedDino reward={reward} size="choice" celebrate soundEnabled={soundEnabled} />
              <strong>{reward.name}</strong>
              <span>{reward.shortLabel}</span>
              <p>{reward.praise}</p>
            </button>
          ))}
        </div>

        <button type="button" className="reward-later-button" onClick={onClose}>Spaeter aussuchen</button>
      </section>
    </div>
  );
}
