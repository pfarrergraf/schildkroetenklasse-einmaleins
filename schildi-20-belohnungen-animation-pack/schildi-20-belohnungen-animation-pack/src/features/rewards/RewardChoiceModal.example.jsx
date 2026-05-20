import React from "react";
import { DinoAnimation, playDinoSound } from "../dinoAnimations/index.js";

export default function RewardChoiceModal({ choices, onChoose, onLater, soundEnabled = true }) {
  return (
    <div className="reward-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reward-title">
      <section className="reward-modal">
        <p className="reward-kicker">10 von 10 richtig</p>
        <h2 id="reward-title">Schildkrötenstark!</h2>
        <p>Du hast alle Aufgaben richtig gelöst. Such dir einen Dino für deine Sammlung aus.</p>
        <div className="reward-choice-grid">
          {choices.map((reward) => (
            <button key={reward.id} type="button" className="reward-choice-card" onClick={() => { playDinoSound(reward.dinoId, soundEnabled); onChoose(reward.id); }}>
              <DinoAnimation dinoId={reward.dinoId} size="medium" playing={true} label={false} />
              <strong>{reward.name}</strong>
              <span>{reward.scientificName}</span>
              <p>{reward.shortText}</p>
            </button>
          ))}
        </div>
        <button type="button" className="reward-later-button" onClick={onLater}>Später aussuchen</button>
      </section>
    </div>
  );
}
