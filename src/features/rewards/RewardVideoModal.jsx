import { useEffect, useRef } from "react";

export default function RewardVideoModal({ reward, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = videoRef.current;
    if (!player || !reward?.videoPath) return undefined;

    player.muted = false;
    player.volume = 1;
    player.currentTime = 0;
    player.play().catch(() => {});

    return () => {
      player.pause();
      player.currentTime = 0;
    };
  }, [reward?.id, reward?.videoPath]);

  if (!reward?.videoPath) return null;

  function replayVideo() {
    const player = videoRef.current;
    if (!player) return;
    player.muted = false;
    player.volume = 1;
    player.currentTime = 0;
    player.play().catch(() => {});
  }

  return (
    <div className="reward-modal-backdrop reward-video-backdrop" role="presentation">
      <section className="reward-video-modal" role="dialog" aria-modal="true" aria-labelledby="reward-video-title">
        <div className="reward-video-header">
          <div>
            <p className="reward-kicker">Neuer Dino</p>
            <h2 id="reward-video-title">{reward.name}</h2>
            <p className="reward-intro">{reward.unlockText} Schau dir deinen Dino jetzt als Original-Video an.</p>
          </div>
          <button type="button" className="reward-later-button reward-video-close" onClick={onClose}>Zur Sammlung</button>
        </div>

        <div className="reward-video-frame">
          <video
            ref={videoRef}
            key={reward.videoPath}
            className="reward-video-player"
            src={reward.videoPath}
            controls
            playsInline
            preload="auto"
          >
            Dein Browser kann dieses Dino-Video leider nicht abspielen.
          </video>
        </div>

        <div className="reward-video-actions">
          <button type="button" className="collection-open-button" onClick={replayVideo}>Nochmal abspielen</button>
          <button type="button" className="reward-later-button" onClick={onClose}>Zur Sammlung</button>
        </div>
      </section>
    </div>
  );
}