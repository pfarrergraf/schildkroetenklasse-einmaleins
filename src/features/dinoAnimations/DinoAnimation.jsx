import React, { useEffect, useMemo, useState } from "react";
import { getDinoAnimation, loadDinoFrames } from "./dinoAnimationCatalog.js";

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
  const [frames, setFrames] = useState([]);
  const [framesReady, setFramesReady] = useState(false);
  const frameMs = useMemo(() => {
    if (dino?.motion === "stomp") return 135;
    if (dino?.motion === "wing-float") return 115;
    return 150;
  }, [dino?.motion]);

  useEffect(() => {
    let cancelled = false;

    if (!dino) {
      setFrames([]);
      setFramesReady(true);
      return undefined;
    }

    setFramesReady(false);
    setFrameIndex(0);

    void loadDinoFrames(dino.id, { limit: active ? undefined : 1 }).then((nextFrames) => {
      if (cancelled) {
        return;
      }
      setFrames(nextFrames);
      setFramesReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [active, dino]);

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
  if (!dino || (framesReady && frames.length === 0)) {
    return (
      <div className={`dino-animation dino-placeholder size-${size} ${className}`}>
        <span>?</span>
      </div>
    );
  }

  if (!framesReady || frames.length === 0) {
    return <div className={`dino-animation dino-placeholder size-${size} ${className}`} aria-hidden="true" />;
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
