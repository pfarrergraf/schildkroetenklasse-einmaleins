export async function playDinoRewardSound(_reward, { soundEnabled = true } = {}) {
  if (!soundEnabled) return "sound-off";

  // No fake dinosaur roars in this pack. Use a small WebAudio success cue only.
  if (typeof window === "undefined") return "unavailable";
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return "unavailable";

  try {
    const context = new AudioContextConstructor();
    const now = context.currentTime;
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.18, now + 0.025);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    master.connect(context.destination);

    [392, 523.25, 659.25].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.07);
      oscillator.connect(master);
      oscillator.start(now + index * 0.07);
      oscillator.stop(now + 0.42);
    });

    window.setTimeout(() => context.close().catch(() => {}), 650);
    return "success-cue";
  } catch {
    return "unavailable";
  }
}

export const playSyntheticDinoSound = playDinoRewardSound;
