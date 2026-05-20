import { getDinoAnimation } from "./dinoAnimationCatalog.js";

export function playDinoSound(dinoId, enabled = true) {
  if (!enabled || typeof window === "undefined") return;
  const dino = getDinoAnimation(dinoId);
  if (!dino?.audioFile) return;
  const audio = new Audio(`${import.meta.env.BASE_URL}audio/rewards/${dino.audioFile}`);
  audio.volume = 0.5;
  audio.play().catch(() => {});
}
