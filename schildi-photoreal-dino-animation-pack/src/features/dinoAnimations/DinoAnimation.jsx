import React, { useEffect, useMemo, useRef, useState } from "react";
import { getDinoAnimation } from "./dinoAnimationCatalog.js";

export default function DinoAnimation({
  speciesId,
  rewardId,
  size = "card",
  active = true,
  playSound = false,
  labelVisible = false,
  className = "",
}) {
  const dino = getDinoAnimation(speciesId || rewardId);
  const [frameIndex, setFrameIndex] = useState(0);
  const audioRef = useRef(null);

  const frames = dino?.frames?.length ? dino.frames : [];
  const frameMs = useMemo(() => {
    if (dino?.motion === "stomp") return 135;
    if (dino?.motion === "wing-float") return 115;
    return 150;
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

  useEffect(() => {
    if (!playSound || !dino?.sound) return;

    const audio = new Audio(dino.sound);
    audio.volume = 0.55;
    audioRef.current = audio;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [playSound, dino?.sound]);

  if (!dino || frames.length === 0) {
    return (
      <div className={`dino-animation dino-placeholder size-${size} ${className}`}>
        <span>?</span>
      </div>
    );
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
