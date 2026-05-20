import React, { useEffect, useMemo, useState } from "react";
import { getDinoAnimation } from "./dinoAnimationCatalog.js";

export default function DinoAnimation({
  speciesId,
  rewardId,
  size = "card",
  active = true,
  labelVisible = false,
  className = "",
}) {
  const dino = getDinoAnimation(speciesId || rewardId);
  const [frameIndex, setFrameIndex] = useState(0);
  const frames = dino?.frames?.length ? dino.frames : [];

  const frameMs = useMemo(() => {
    if (dino?.motion === "steady-stomp") return 150;
    if (dino?.motion === "wing-float") return 115;
    return 165;
  }, [dino?.motion]);

  useEffect(() => {
    if (!active || frames.length <= 1) {
      setFrameIndex(0);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, frameMs);

    return () => window.clearInterval(timer);
  }, [active, frameMs, frames.length]);

  if (!dino || frames.length === 0) {
    // No placeholder art: render nothing if the real frame set is missing.
    return null;
  }

  return (
    <figure
      className={`dino-animation size-${size} motion-${dino.motion} ${className}`}
      aria-label={`${dino.displayName}, ${dino.scientificName}`}
    >
      <img
        src={frames[frameIndex]}
        alt=""
        className="dino-animation-frame"
        draggable="false"
        data-dino={dino.id}
        data-frame-index={frameIndex}
      />
      {labelVisible ? (
        <figcaption className="dino-animation-caption">
          <strong>{dino.displayName}</strong>
          <span>{dino.scientificName}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
