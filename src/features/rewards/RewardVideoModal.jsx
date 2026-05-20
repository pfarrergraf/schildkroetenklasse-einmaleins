import { useEffect, useRef } from "react";

export default function RewardVideoModal({ reward, onClose, soundEnabled = true }) {
  const videoRef = useRef(null);
  const rewardAudioRef = useRef(null);

  function stopRewardAudio(resetPosition = true) {
    const player = rewardAudioRef.current;
    if (!player) return;

    player.pause();
    if (resetPosition) {
      player.currentTime = 0;
    }
  }

  async function playRewardAudio({ force = false, restart = true } = {}) {
    const player = rewardAudioRef.current;
    if (!player || !reward?.soundPath || (!force && !soundEnabled)) {
      return;
    }

    stopRewardAudio(restart);
    player.volume = 0.88;
    const playPromise = player.play();
    await playPromise?.catch(() => {});
  }

  async function playRewardMedia({ forceSound = false } = {}) {
    const videoPlayer = videoRef.current;
    if (videoPlayer) {
      const useSeparateRewardSound = Boolean(reward?.soundPath);
      videoPlayer.muted = useSeparateRewardSound;
      videoPlayer.volume = useSeparateRewardSound ? 0 : 1;
      videoPlayer.currentTime = 0;
      const playPromise = videoPlayer.play();
      await playPromise?.catch(() => {});
    }

    await playRewardAudio({ force: forceSound, restart: true });
  }

  useEffect(() => {
    if (!reward?.videoPath) return undefined;

    void playRewardMedia();

    return () => {
      const player = videoRef.current;
      if (player) {
        player.pause();
        player.currentTime = 0;
      }
      stopRewardAudio();
    };
  }, [reward?.id, reward?.videoPath, reward?.soundPath, soundEnabled]);

  useEffect(() => {
    if (soundEnabled) return;
    stopRewardAudio(false);
  }, [soundEnabled]);

  if (!reward?.videoPath) return null;

  function replayVideoWithSound() {
    void playRewardMedia({ forceSound: true });
  }

  async function replayRewardSound() {
    await playRewardAudio({ force: true, restart: true });
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

        {reward.soundPath ? <audio ref={rewardAudioRef} src={reward.soundPath} preload="auto" /> : null}

        <p className="reward-video-hint">Damit der Dino-Ton auf allen Geräten zuverlässig funktioniert, spielt die App ihn separat zum Video ab.</p>

        <div className="reward-video-actions">
          <button type="button" className="collection-open-button" onClick={replayVideoWithSound}>Video und Dino-Sound starten</button>
          <button type="button" className="collection-open-button" onClick={replayRewardSound}>Dino-Sound nochmal</button>
          <button type="button" className="reward-later-button" onClick={onClose}>Zur Sammlung</button>
        </div>
      </section>
    </div>
  );
}