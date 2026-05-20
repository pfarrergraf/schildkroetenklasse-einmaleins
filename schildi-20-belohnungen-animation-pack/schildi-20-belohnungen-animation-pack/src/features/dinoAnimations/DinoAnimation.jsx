import React, { useEffect, useMemo, useState } from "react";
import { getDinoAnimation } from "./dinoAnimationCatalog.js";

export default function DinoAnimation({ dinoId, size = "medium", playing = true, label = true, className = "" }) {
  const dino = useMemo(() => getDinoAnimation(dinoId), [dinoId]);
  const frames = dino?.frames?.length ? dino.frames : [];
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
    if (!playing || frames.length <= 1) return undefined;
    const interval = window.setInterval(() => setFrameIndex((current) => (current + 1) % frames.length), 145);
    return () => window.clearInterval(interval);
  }, [playing, frames.length, dinoId]);

  if (!dino || frames.length === 0) return null;

  return (
    <figure className={`dino-animation dino-${size} motion-${dino.motionPreset} ${className}`}>
      <div className="dino-animation-stage" aria-hidden="true">
        <img src={frames[frameIndex]} alt="" className="dino-animation-frame" draggable="false" />
      </div>
      {label ? (
        <figcaption className="dino-animation-label">
          <strong>{dino.rewardName}</strong>
          <span>{dino.scientificName}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
