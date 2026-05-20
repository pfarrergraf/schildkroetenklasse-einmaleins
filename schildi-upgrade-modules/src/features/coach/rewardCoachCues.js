// Diese Cue-Erweiterungen sind bewusst getrennt, damit Codex sie in die bestehende SPEECH_CUES-Struktur in src/App.jsx einfügen kann.
// AUDIO_BASE_URL existiert bereits in App.jsx. Diese Datei ist Vorlage + Datenquelle für die Integration.

export const REWARD_COACH_TEXTS = {
  rewardPerfect: "Wow, du hast alles richtig. Such dir einen Dino aus!",
  rewardUnlocked: "Der Dino gehört jetzt zu deiner Sammlung!",
  rewardCollectionComplete: "Du hast alle Dinos gesammelt. Jetzt sammelst du Bonus-Sterne!",
  rewardAlmost: "Fast perfekt. Du bist ganz nah dran. Noch eine ruhige Runde!",
  rewardGood: "Gut geübt. Jeder Versuch macht dich sicherer.",
};

export function buildRewardSpeechCues(audioBaseUrl) {
  return {
    rewardPerfect: {
      id: "rewardPerfect",
      text: REWARD_COACH_TEXTS.rewardPerfect,
      scene: "happy",
      audioFiles: [`${audioBaseUrl}rewards/Wow%20du%20hast%20alles%20richtig%20such%20dir%20einen%20Dino%20aus.wav`],
    },
    rewardUnlocked: {
      id: "rewardUnlocked",
      text: REWARD_COACH_TEXTS.rewardUnlocked,
      scene: "happy",
      audioFiles: [`${audioBaseUrl}rewards/Der%20Dino%20gehoert%20jetzt%20zu%20deiner%20Sammlung.wav`],
    },
    rewardCollectionComplete: {
      id: "rewardCollectionComplete",
      text: REWARD_COACH_TEXTS.rewardCollectionComplete,
      scene: "finish",
      audioFiles: [`${audioBaseUrl}rewards/Du%20hast%20alle%20Dinos%20gesammelt%20jetzt%20sammelst%20du%20Bonus%20Sterne.wav`],
    },
    rewardAlmost: {
      id: "rewardAlmost",
      text: REWARD_COACH_TEXTS.rewardAlmost,
      scene: "idle",
      audioFiles: [`${audioBaseUrl}rewards/Fast%20perfekt%20du%20bist%20ganz%20nah%20dran.wav`],
    },
  };
}
