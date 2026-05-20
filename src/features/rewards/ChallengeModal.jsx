import { useState } from "react";
import { ACHIEVEMENTS } from "./rewardLogic";

export default function ChallengeModal({ completedIds = [], onAccept, onClose }) {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [chosenTable, setChosenTable] = useState(null);

  const completedSet = new Set(completedIds);

  function handleSelect(challenge) {
    setSelectedChallenge(challenge);
    setChosenTable(null);
  }

  function handleBack() {
    setSelectedChallenge(null);
    setChosenTable(null);
  }

  function handleAccept() {
    if (!selectedChallenge) return;
    let tables = selectedChallenge.challengeTablePreset;
    if (selectedChallenge.challengeTableOptions) {
      tables = chosenTable !== null ? [chosenTable] : null;
    }
    onAccept(selectedChallenge, tables);
  }

  const acceptDisabled =
    selectedChallenge?.challengeTableOptions != null && chosenTable === null;

  if (selectedChallenge) {
    return (
      <div className="reward-modal-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose?.()}>
        <section
          className="reward-modal challenge-detail-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="challenge-detail-title"
        >
          <p className="reward-kicker">
            {completedSet.has(selectedChallenge.id) ? "✓ Bereits geschafft" : "Herausforderung"}
          </p>
          <h2 id="challenge-detail-title">{selectedChallenge.title}</h2>

          <div className="challenge-schildi-bubble">
            <p>{selectedChallenge.schildiText}</p>
          </div>

          {selectedChallenge.challengeTableOptions ? (
            <div className="challenge-table-choice">
              <p className="challenge-table-choice-label">Wähle deine Reihe:</p>
              <div className="table-grid challenge-table-grid">
                {selectedChallenge.challengeTableOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={chosenTable === t ? "table-button active" : "table-button"}
                    onClick={() => setChosenTable(t)}
                    aria-pressed={chosenTable === t}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : selectedChallenge.challengeTablePreset ? (
            <div className="challenge-preset-info">
              <p>
                Aktive Reihen:{" "}
                <strong>{selectedChallenge.challengeTablePreset.join(", ")}</strong>
              </p>
            </div>
          ) : (
            <div className="challenge-preset-info">
              <p>Du kannst deine Reihen selbst wählen.</p>
            </div>
          )}

          <div className="challenge-detail-actions">
            <button
              type="button"
              className="submit-button"
              onClick={handleAccept}
              disabled={acceptDisabled}
            >
              Ja, Herausforderung annehmen
            </button>
            <button type="button" className="secondary-button" onClick={handleBack}>
              Nein, andere wählen
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="reward-modal-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose?.()}>
      <section
        className="reward-modal challenge-list-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="challenge-list-title"
      >
        <div className="challenge-list-header">
          <div>
            <p className="reward-kicker">Schildi-Herausforderungen</p>
            <h2 id="challenge-list-title">Dino-Herausforderung</h2>
            <p className="reward-intro">
              Wähle eine Herausforderung. Schildi erklärt dir, was zu tun ist.
            </p>
          </div>
          <button type="button" className="reward-video-close secondary-button" onClick={onClose}>
            Schließen
          </button>
        </div>

        <div className="challenge-list">
          {ACHIEVEMENTS.map((achievement) => {
            const done = completedSet.has(achievement.id);
            return (
              <button
                key={achievement.id}
                type="button"
                className={done ? "challenge-card challenge-card-done" : "challenge-card"}
                onClick={() => handleSelect(achievement)}
              >
                <span className="challenge-card-status">{done ? "✓" : "○"}</span>
                <div className="challenge-card-text">
                  <strong>{achievement.title}</strong>
                  <span>{achievement.description}</span>
                </div>
                <span className="challenge-card-arrow">›</span>
              </button>
            );
          })}
        </div>

        <div className="challenge-list-footer">
          <p>
            {completedIds.length} von {ACHIEVEMENTS.length} Herausforderungen geschafft
          </p>
        </div>
      </section>
    </div>
  );
}
