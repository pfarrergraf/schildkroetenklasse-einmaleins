import { DinoAnimation } from "../dinoAnimations";

export default function AnimatedDino({
  reward,
  size = "large",
  celebrate = false,
  active = true,
}) {
  if (!reward) return null;

  const photorealSize = size === "collection" ? "collection" : "card";
  const hasPhotorealAnimation = Boolean(reward.speciesId);

  return (
    <div className={`animated-dino animated-dino-${size} dino-theme-${reward.theme} ${celebrate ? "celebrate" : ""}`}>
      {hasPhotorealAnimation ? (
        <DinoAnimation speciesId={reward.speciesId} size={photorealSize} active={active} className="animated-dino-photoreal" />
      ) : (
        <div className={`dino-silhouette dino-motion-${reward.animation}`} aria-label={`${reward.name}, ${reward.species}`}>
          ?
        </div>
      )}
    </div>
  );
}
