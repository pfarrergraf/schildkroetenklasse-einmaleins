import { DinoAnimation } from "../dinoAnimations";
import { playDinoRewardSound } from "./dinoSound";

export default function AnimatedDino({
  reward,
  size = "large",
  celebrate = false,
  soundEnabled = true,
  active = true,
  showSoundButton = true,
  onSoundPlayed,
}) {
  if (!reward) return null;

  const photorealSize = size === "collection" ? "collection" : "card";
  const hasPhotorealAnimation = Boolean(reward.speciesId);

  async function handleSoundClick(event) {
    event.stopPropagation();
    const result = await playDinoRewardSound(reward, { soundEnabled });
    onSoundPlayed?.(result);
  }

  return (
    <div className={`animated-dino animated-dino-${size} dino-theme-${reward.theme} ${celebrate ? "celebrate" : ""}`}>
      {hasPhotorealAnimation ? (
        <DinoAnimation speciesId={reward.speciesId} size={photorealSize} active={active} className="animated-dino-photoreal" />
      ) : (
        <img
          src={reward.imagePath}
          alt={`${reward.name}, ${reward.species}`}
          className={`animated-dino-image dino-motion-${reward.animation}`}
          draggable="false"
        />
      )}
      {showSoundButton ? (
        <button type="button" className="dino-sound-button" onClick={handleSoundClick} aria-label={`Dino-Sound von ${reward.name} abspielen`}>
          Dino-Sound
        </button>
      ) : null}
    </div>
  );
}
