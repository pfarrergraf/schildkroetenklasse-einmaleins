import React from "react";
import { getDailyPracticeSummary, getDifficultTasks } from "./learningProgress.js";

export function LearningSummaryCard({ learningState }) {
  const today = getDailyPracticeSummary(learningState);
  const difficultTasks = getDifficultTasks(learningState, { limit: 3 });

  return (
    <div className="learning-summary-card">
      <h3>Heute geübt</h3>
      <div className="learning-summary-grid">
        <span>Runden: <strong>{today.rounds}</strong></span>
        <span>Treffer: <strong>{today.accuracy}%</strong></span>
      </div>
      {difficultTasks.length > 0 ? (
        <p>Noch einmal üben: {difficultTasks.map((task) => `${task.a}×${task.b}`).join(", ")}</p>
      ) : (
        <p>Noch keine schwierigen Aufgaben gespeichert.</p>
      )}
    </div>
  );
}
