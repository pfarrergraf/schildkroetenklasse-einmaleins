export async function playDinoRewardSound(reward, { soundEnabled = true } = {}) {
  if (!soundEnabled || typeof window === "undefined" || !reward?.soundPath) return "skipped";

  try {
    const audio = new Audio(reward.soundPath);
    audio.volume = 0.55;
    await audio.play();
    return "audio-file";
  } catch {
    return playSyntheticDinoSound(reward.id);
  }
}

export function playSyntheticDinoSound(seed = "dino") {
  if (typeof window === "undefined") return "skipped";

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return "unsupported";

  try {
    const context = new AudioContextConstructor();
    const now = context.currentTime;
    const base = 95 + (seed.length % 6) * 18;
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.16, now + 0.04);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
    master.connect(context.destination);

    [base, base * 1.52, base * 0.72].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 1 ? "triangle" : "sawtooth";
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.58, now + 0.55);
      gain.gain.value = index === 0 ? 0.55 : 0.24;
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(now);
      oscillator.stop(now + 0.62);
    });

    window.setTimeout(() => context.close?.().catch(() => {}), 900);
    return "synthetic";
  } catch {
    return "error";
  }
}
