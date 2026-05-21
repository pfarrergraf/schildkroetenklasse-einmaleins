// Reward-Coach-Cues bleiben als Textbausteine bestehen, auch wenn Reward-
// Sounds inzwischen bewusst deaktiviert sind. Die echten Belohnungen kommen
// jetzt über die Dino-Videos.

export const REWARD_COACH_TEXTS = {
  rewardPerfect: "Wow, du hast alles richtig. Such dir einen Dino aus!",
  rewardUnlocked: "Der Dino gehört jetzt zu deiner Sammlung!",
  rewardCollectionComplete: "Du hast alle Dinos gesammelt. Jetzt sammelst du Bonus-Sterne!",
  rewardAlmost: "Fast perfekt. Du bist ganz nah dran. Noch eine ruhige Runde!",
  rewardGood: "Gut geübt. Jeder Versuch macht dich sicherer.",
};

export function buildRewardSpeechCues() {
  return {
    rewardPerfect: {
      id: "rewardPerfect",
      text: REWARD_COACH_TEXTS.rewardPerfect,
      scene: "happy",
      audioFiles: [],
    },
    rewardUnlocked: {
      id: "rewardUnlocked",
      text: REWARD_COACH_TEXTS.rewardUnlocked,
      scene: "happy",
      audioFiles: [],
    },
    rewardCollectionComplete: {
      id: "rewardCollectionComplete",
      text: REWARD_COACH_TEXTS.rewardCollectionComplete,
      scene: "finish",
      audioFiles: [],
    },
    rewardAlmost: {
      id: "rewardAlmost",
      text: REWARD_COACH_TEXTS.rewardAlmost,
      scene: "idle",
      audioFiles: [],
    },
  };
}
