import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CollectionView,
  RewardChoiceModal,
  RewardVideoModal,
  RewardStatusCard,
  ChallengeModal,
  addBonusStar,
  appendRewardEvent,
  buildRewardOffer,
  clearPendingRewardOffer,
  createDefaultRewardBackendStatus,
  createRewardCheckpoint,
  getRewardBackendStatusText,
  hydrateRewardCheckpoint,
  loadBonusStars,
  loadPendingRewardOffer,
  loadRewardedTableCount,
  loadUnlockedRewardIds,
  loadCompletedAchievementIds,
  addCompletedAchievementIds,
  playDinoRewardSound,
  persistRewardCheckpoint,
  saveRewardedTableCount,
  savePendingRewardOffer,
  shouldOfferReward,
  checkNewAchievements,
  ACHIEVEMENTS,
  unlockRewardId,
} from "./features/rewards";
import { loadLearningState, recordAnswerAttempt, recordRoundSummary } from "./features/learning";
import "./features/rewards/dinoRewardStyles.css";
import "./features/learning/learningStyles.css";
import halloImage from "../assets/Hallo.png";
import happyImage from "../assets/gut.png";
import sadImage from "../assets/schlecht.png";
import warningImage from "../assets/Achtung.png";

const helloFrameModules = import.meta.glob("../assets/Hallo/*.png", { eager: true, import: "default" });
const happyFrameModules = import.meta.glob("../assets/gut/*.png", { eager: true, import: "default" });
const sadFrameModules = import.meta.glob("../assets/schlecht/*.png", { eager: true, import: "default" });
const warningFrameModules = import.meta.glob("../assets/Achtung/*.png", { eager: true, import: "default" });

const TABLES = Array.from({ length: 11 }, (_, i) => i);
const ROUNDS_PER_GAME = 10;
const STORAGE_KEY = "schildkroetenklasse-einmaleins-bestscore";
const SELECTED_TABLES_STORAGE_KEY = "schildkroetenklasse-selected-tables-v1";
const DEFAULT_TABLES = [1, 2, 5, 10];
const START_TEXT = "Hallo Schildkrötenklasse! Ich bin Schildi und übe mit dir.";
const READY_TEXT = "Ich bin bereit für die nächste Aufgabe.";
const FINISH_STRONG_TEXT = "Fertig! Das war schildkrötenstark.";
const FINISH_SOFT_TEXT = "Fertig! Noch eine Runde und wir werden stärker.";
const INPUT_WARNING_TEXT = "Bitte eine Zahl von 0 bis 100 eingeben.";
const WRONG_TEXT = "Probiere es noch einmal.";
const DOUBLE_WRONG_TEXT = "Gu gu ga ga!";
const AUDIO_BASE_URL = `${import.meta.env.BASE_URL}audio/`;
const LIP_SYNC_SILENCE_FLOOR = 0.02;
const LIP_SYNC_FULL_OPEN = 0.16;
const LIP_SYNC_SMOOTHING = 0.68;
const FRAME_ALIGNMENT = {
  "../assets/Hallo/ChatGPT Image May 19, 2026, 08_08_16 PM (1).png": { x: "-0.040%", y: "0.000%" },
  "../assets/Hallo/ChatGPT Image May 19, 2026, 08_08_16 PM (2).png": { x: "-0.040%", y: "0.000%" },
  "../assets/Hallo/ChatGPT Image May 19, 2026, 08_08_17 PM (3).png": { x: "0.040%", y: "0.000%" },
  "../assets/Hallo/ChatGPT Image May 19, 2026, 08_08_17 PM (4).png": { x: "0.080%", y: "0.000%" },
  "../assets/gut/ChatGPT Image May 19, 2026, 08_02_07 PM (1).png": { x: "-0.498%", y: "0.558%" },
  "../assets/gut/ChatGPT Image May 19, 2026, 08_02_07 PM (2).png": { x: "0.020%", y: "-0.080%" },
  "../assets/gut/ChatGPT Image May 19, 2026, 08_02_08 PM (3).png": { x: "0.020%", y: "0.000%" },
  "../assets/gut/ChatGPT Image May 19, 2026, 08_02_08 PM (4).png": { x: "-0.020%", y: "0.000%" },
  "../assets/schlecht/ChatGPT Image May 19, 2026, 08_02_08 PM (5).png": { x: "0.279%", y: "-0.159%" },
  "../assets/schlecht/ChatGPT Image May 19, 2026, 08_02_09 PM (6).png": { x: "-0.279%", y: "0.000%" },
  "../assets/schlecht/ChatGPT Image May 19, 2026, 08_02_09 PM (7).png": { x: "0.279%", y: "0.080%" },
  "../assets/schlecht/ChatGPT Image May 19, 2026, 08_02_09 PM (8).png": { x: "-0.359%", y: "0.000%" },
  "../assets/Achtung/ChatGPT Image May 19, 2026, 07_31_26 PM (1).png": { x: "0.080%", y: "-0.239%" },
  "../assets/Achtung/ChatGPT Image May 19, 2026, 07_31_27 PM (2).png": { x: "0.399%", y: "0.239%" },
  "../assets/Achtung/ChatGPT Image May 19, 2026, 07_31_27 PM (3).png": { x: "0.638%", y: "0.877%" },
  "../assets/Achtung/ChatGPT Image May 19, 2026, 07_31_27 PM (4).png": { x: "-0.239%", y: "-0.558%" },
  "../assets/Achtung/ChatGPT Image May 19, 2026, 07_31_28 PM (5).png": { x: "-0.159%", y: "-0.558%" },
  "../assets/Achtung/ChatGPT Image May 19, 2026, 07_31_28 PM (6).png": { x: "-0.080%", y: "0.239%" },
};

function loadFrames(frameModules, fallbackImage) {
  const frames = Object.entries(frameModules)
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }))
    .map(([sourcePath, src]) => ({
      src,
      shiftX: FRAME_ALIGNMENT[sourcePath]?.x ?? "0%",
      shiftY: FRAME_ALIGNMENT[sourcePath]?.y ?? "0%",
    }));

  return frames.length > 0 ? frames : [{ src: fallbackImage, shiftX: "0%", shiftY: "0%" }];
}

const HELLO_FRAMES = loadFrames(helloFrameModules, halloImage);
const HAPPY_FRAMES = loadFrames(happyFrameModules, happyImage);
const SAD_FRAMES = loadFrames(sadFrameModules, sadImage);
const WARNING_FRAMES = loadFrames(warningFrameModules, warningImage);

const SCENES = {
  hello: {
    frames: HELLO_FRAMES,
    badge: "Hallo",
    motion: "float",
    bubbleTone: "hello",
    frameMs: 220,
  },
  idle: {
    frames: HELLO_FRAMES,
    badge: "Bereit",
    motion: "breathe",
    bubbleTone: "hello",
    frameMs: 240,
  },
  happy: {
    frames: HAPPY_FRAMES,
    badge: "Super",
    motion: "celebrate",
    bubbleTone: "happy",
    frameMs: 140,
  },
  sad: {
    frames: SAD_FRAMES,
    badge: "Schade",
    motion: "comfort",
    bubbleTone: "sad",
    frameMs: 170,
  },
  warning: {
    frames: WARNING_FRAMES,
    badge: "Achtung",
    motion: "alert",
    bubbleTone: "warning",
    frameMs: 150,
  },
  finish: {
    frames: HAPPY_FRAMES,
    badge: "Geschafft",
    motion: "celebrate",
    bubbleTone: "happy",
    frameMs: 150,
  },
};

const FRAME_WARMUP_SOURCES = Array.from(
  new Set([HELLO_FRAMES[0]?.src, HAPPY_FRAMES[0]?.src, SAD_FRAMES[0]?.src, WARNING_FRAMES[0]?.src].filter(Boolean)),
);

const SPEECH_CUES = {
  start: {
    id: "start",
    text: START_TEXT,
    scene: "hello",
    audioFiles: [`${AUDIO_BASE_URL}Hallo%20Schildkroetenklasse%20ich%20bin%20Schildi%20und%20uebe%20mit%20dir.wav`],
  },
  ready: {
    id: "ready",
    text: READY_TEXT,
    scene: "idle",
    audioFiles: [`${AUDIO_BASE_URL}Ich%20bin%20bereit%20fuer%20die%20naechste%20Aufgabe.wav`],
  },
  finishStrong: {
    id: "finishStrong",
    text: FINISH_STRONG_TEXT,
    scene: "finish",
    audioFiles: [`${AUDIO_BASE_URL}Fertig%20das%20war%20schildkroetenstark.mp3`],
  },
  finishSoft: {
    id: "finishSoft",
    text: FINISH_SOFT_TEXT,
    scene: "finish",
    audioFiles: [`${AUDIO_BASE_URL}Fertig%20noch%20eine%20Runde%20und%20wir%20werden%20staerker.wav`],
  },
  inputWarning: {
    id: "inputWarning",
    text: INPUT_WARNING_TEXT,
    scene: "warning",
    audioFiles: [
      `${AUDIO_BASE_URL}Bitte%20eine%20Zahl%20von%200%20bis%20100%20eingeben.mp3`,
      `${AUDIO_BASE_URL}Bitte%20eine%20Zahl%20von%200%20bis%20100%20eingeben.wav`,
    ],
  },
  wrong: {
    id: "wrong",
    text: WRONG_TEXT,
    scene: "sad",
    audioFiles: [`${AUDIO_BASE_URL}Probier%20es%20noch%20einmal.wav`],
  },
  doubleWrong: {
    id: "doubleWrong",
    text: DOUBLE_WRONG_TEXT,
    scene: "sad",
    audioFiles: [`${AUDIO_BASE_URL}gugugaga.wav`],
  },
  correctJa: {
    id: "correctJa",
    text: "Ja, gut gemacht!",
    scene: "happy",
    audioFiles: [`${AUDIO_BASE_URL}Ja%20gut%20gemacht.wav`],
  },
  correctSuper: {
    id: "correctSuper",
    text: "Super gerechnet!",
    scene: "happy",
    audioFiles: [`${AUDIO_BASE_URL}Super%20gerechnet.wav`],
  },
  correctKlasse: {
    id: "correctKlasse",
    text: "Klasse, Samuel!",
    scene: "happy",
    audioFiles: [`${AUDIO_BASE_URL}Klasse%20Samuel.wav`],
  },
  correctStrong: {
    id: "correctStrong",
    text: "Richtig! Schildkrötenstark!",
    scene: "happy",
    audioFiles: [`${AUDIO_BASE_URL}Richtig%20Schildkroetenstark.wav`],
  },
};

const CORRECT_CUE_IDS = ["correctJa", "correctSuper", "correctKlasse", "correctStrong"];
const INITIAL_PENDING_REWARD_OFFER = loadPendingRewardOffer();

function createTask(selectedTables, previousTask) {
  const pool = selectedTables.length ? selectedTables : TABLES;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const a = pool[Math.floor(Math.random() * pool.length)];
    const b = Math.floor(Math.random() * 11);
    const task = { a, b, answer: a * b };

    if (!previousTask || previousTask.a !== task.a || previousTask.b !== task.b) {
      return task;
    }
  }

  const a = pool[Math.floor(Math.random() * pool.length)];
  const b = Math.floor(Math.random() * 11);
  return { a, b, answer: a * b };
}

function createOptions(correctAnswer) {
  const options = new Set([correctAnswer]);
  const deltas = [-20, -15, -12, -10, -9, -8, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 20];

  while (options.size < 4) {
    const delta = deltas[Math.floor(Math.random() * deltas.length)];
    const candidate = correctAnswer + delta;

    if (candidate >= 0 && candidate <= 100) {
      options.add(candidate);
    } else {
      options.add(Math.floor(Math.random() * 101));
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}

function cleanAnswer(value) {
  const normalized = String(value).trim().replace(",", ".");
  if (!normalized) return null;

  const number = Number(normalized);
  if (!Number.isInteger(number)) return null;
  if (number < 0 || number > 100) return null;
  return number;
}

function encouragement(score, round) {
  if (round === 0) return "Starte in Ruhe. Genauigkeit ist wichtiger als Tempo.";

  const ratio = score / round;
  if (ratio >= 0.9) return "Bärenstark. Du rechnest schon sehr sicher.";
  if (ratio >= 0.7) return "Sehr gut. Das kleine Einmaleins sitzt immer besser.";
  if (ratio >= 0.5) return "Prima dranbleiben. Jeder Versuch macht dich sicherer.";
  return "Ganz ruhig. Schritt für Schritt wird das immer leichter.";
}

function randomCorrectCueId() {
  return CORRECT_CUE_IDS[Math.floor(Math.random() * CORRECT_CUE_IDS.length)];
}

function buildFrameSequence(frameCount) {
  if (frameCount <= 1) {
    return [0];
  }

  const forward = Array.from({ length: frameCount }, (_, index) => index);
  const backward = Array.from({ length: Math.max(0, frameCount - 2) }, (_, index) => frameCount - 2 - index);

  return [...forward, ...backward];
}

function mapLipSyncLevelToFrame(level, frameCount) {
  if (frameCount <= 1) {
    return 0;
  }

  const normalized = Math.max(0, Math.min(1, (level - LIP_SYNC_SILENCE_FLOOR) / (LIP_SYNC_FULL_OPEN - LIP_SYNC_SILENCE_FLOOR)));
  const eased = normalized * normalized * (3 - 2 * normalized);

  return Math.min(frameCount - 1, Math.round(eased * (frameCount - 1)));
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function analyzeAudioBufferForLipSync(audioBuffer) {
  const channelCount = Math.max(1, audioBuffer.numberOfChannels);
  const channels = Array.from({ length: channelCount }, (_, index) => audioBuffer.getChannelData(index));
  const sampleRate = audioBuffer.sampleRate;
  const samplesPerStep = Math.max(512, Math.round(sampleRate * 0.036));
  const rawLevels = [];

  for (let start = 0; start < audioBuffer.length; start += samplesPerStep) {
    const end = Math.min(audioBuffer.length, start + samplesPerStep);
    let sumSquares = 0;
    let peak = 0;

    for (let sampleIndex = start; sampleIndex < end; sampleIndex += 1) {
      let sample = 0;

      for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
        sample += channels[channelIndex][sampleIndex] || 0;
      }

      sample /= channelCount;

      const absoluteSample = Math.abs(sample);
      sumSquares += sample * sample;
      if (absoluteSample > peak) {
        peak = absoluteSample;
      }
    }

    const sampleCount = Math.max(1, end - start);
    const rms = Math.sqrt(sumSquares / sampleCount);
    rawLevels.push(Math.max(rms * 2, peak * 0.95));
  }

  const sortedLevels = [...rawLevels].sort((left, right) => left - right);
  const low = sortedLevels[Math.floor(sortedLevels.length * 0.15)] ?? 0;
  const high = sortedLevels[Math.floor(sortedLevels.length * 0.9)] ?? 0.08;
  const range = Math.max(0.0001, high - low);

  return {
    stepMs: (samplesPerStep / sampleRate) * 1000,
    levels: rawLevels.map((level) => clamp01((level - low) / range)),
  };
}

function toAbsoluteAudioUrl(url) {
  return new URL(url, window.location.href).href;
}

function createAudioPlayers(cue) {
  return cue.audioFiles.map((url) => {
    const player = new Audio();
    player.preload = "metadata";
    player.src = url;
    return player;
  });
}

function buildAudioBank() {
  return new Map();
}

function shouldWarmHeavyMedia() {
  if (typeof window === "undefined") {
    return false;
  }

  const connection = navigator.connection;
  const smallScreen = window.matchMedia("(max-width: 860px)").matches;
  const saveData = connection?.saveData;
  const slowConnection = ["slow-2g", "2g", "3g"].includes(connection?.effectiveType);

  return !smallScreen && !saveData && !slowConnection;
}

function warmImageSources(sources) {
  sources.forEach((src) => {
    const image = new window.Image();
    image.decoding = "async";
    image.src = src;
    image.decode?.().catch(() => {});
  });
}

function getInitialKeyboardEnabled() {
  if (typeof window === "undefined") {
    return true;
  }

  return !window.matchMedia("(max-width: 860px) and (pointer: coarse)").matches;
}

function sanitizeSelectedTables(value) {
  if (!Array.isArray(value)) {
    return DEFAULT_TABLES;
  }

  const normalized = value
    .map((entry) => Number(entry))
    .filter((entry, index, array) => Number.isInteger(entry) && entry >= 0 && entry <= 10 && array.indexOf(entry) === index)
    .sort((left, right) => left - right);

  return normalized.length > 0 ? normalized : DEFAULT_TABLES;
}

function loadSelectedTables() {
  if (typeof window === "undefined") {
    return DEFAULT_TABLES;
  }

  try {
    const raw = window.localStorage.getItem(SELECTED_TABLES_STORAGE_KEY);
    return raw ? sanitizeSelectedTables(JSON.parse(raw)) : DEFAULT_TABLES;
  } catch {
    return DEFAULT_TABLES;
  }
}

function saveSelectedTables(selectedTables) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SELECTED_TABLES_STORAGE_KEY, JSON.stringify(sanitizeSelectedTables(selectedTables)));
}

export default function App() {
  const [selectedTables, setSelectedTables] = useState(() => loadSelectedTables());
  const [task, setTask] = useState(() => createTask(loadSelectedTables()));
  const [options, setOptions] = useState(() => createOptions(task.answer));
  const [typedAnswer, setTypedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState("Wähle eine Antwort oder tippe die Zahl ein.");
  const [lastWasCorrect, setLastWasCorrect] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [unlockedRewardIds, setUnlockedRewardIds] = useState(() => loadUnlockedRewardIds());
  const [bonusStars, setBonusStars] = useState(() => loadBonusStars());
  const [rewardedTableCount, setRewardedTableCount] = useState(() => loadRewardedTableCount());
  const [pendingRewardOffer, setPendingRewardOffer] = useState(() => INITIAL_PENDING_REWARD_OFFER);
  const [rewardModalOpen, setRewardModalOpen] = useState(() => Boolean(INITIAL_PENDING_REWARD_OFFER));
  const [rewardBackendStatus, setRewardBackendStatus] = useState(() => createDefaultRewardBackendStatus());
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [videoReward, setVideoReward] = useState(null);
  const [learningState, setLearningState] = useState(() => loadLearningState());
  const [turtleScene, setTurtleScene] = useState("hello");
  const [turtleSpeech, setTurtleSpeech] = useState(START_TEXT);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpeechMode, setLastSpeechMode] = useState("none");
  const [lastCueId, setLastCueId] = useState("start");
  const [frameIndex, setFrameIndex] = useState(0);
  const [keyboardEnabled, setKeyboardEnabled] = useState(() => getInitialKeyboardEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState(null);
  const [consecutivePerfectRounds, setConsecutivePerfectRounds] = useState(0);
  const [completedAchievementIds, setCompletedAchievementIds] = useState(() => loadCompletedAchievementIds());
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [rewardTriggerTitle, setRewardTriggerTitle] = useState(null);
  const skipTableToggleClickRef = useRef(null);
  const inputRef = useRef(null);
  const answerTimerRef = useRef(null);
  const frameTimerRef = useRef(null);
  const frameStepRef = useRef(0);
  const lipSyncRafRef = useRef(null);
  const lipSyncLevelRef = useRef(0);
  const lipSyncDriverRef = useRef("idle");
  const audioContextRef = useRef(null);
  const decodeAudioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const analyserDataRef = useRef(null);
  const audioSourceMapRef = useRef(new WeakMap());
  const lipTrackCacheRef = useRef(new Map());
  const audioRef = useRef(null);
  const audioBankRef = useRef(new Map());
  const playbackCancelRef = useRef(null);
  const flowTokenRef = useRef(0);
  const startCueUnlockedRef = useRef(false);
  const taskHadMistakeRef = useRef(false);
  const consecutiveWrongAnswersRef = useRef(0);

  const progressPercent = useMemo(() => Math.round((round / ROUNDS_PER_GAME) * 100), [round]);
  const currentPraise = useMemo(() => encouragement(score, round), [score, round]);
  const currentScene = SCENES[turtleScene] ?? SCENES.hello;
  const currentFrame = currentScene.frames[frameIndex % currentScene.frames.length] ?? currentScene.frames[0];
  const rewardBackendStatusText = useMemo(() => getRewardBackendStatusText(rewardBackendStatus), [rewardBackendStatus]);
  const audioStatusText =
    !soundEnabled
      ? "Ton ausgeschaltet"
      : lastSpeechMode === "audio-file"
      ? "Eigene Aufnahme aktiv"
      : lastSpeechMode === "missing-audio"
        ? "Keine passende Audiodatei gefunden"
        : lastCueId === "start"
          ? "Tippe auf Schildi oder auf Nochmal hören"
          : "Ton bereit";

  function blurAnswerInput() {
    inputRef.current?.blur();
  }

  function toggleMobileSection(sectionId) {
    setExpandedMobileSection((current) => (current === sectionId ? null : sectionId));
  }

  function clearAnswerTimer() {
    if (answerTimerRef.current) {
      window.clearTimeout(answerTimerRef.current);
      answerTimerRef.current = null;
    }
  }

  async function persistRewardState(overrides = {}, event = null) {
    const rewardEvents = event ? appendRewardEvent(event) : createRewardCheckpoint().rewardEvents;
    const { checkpoint, status } = await persistRewardCheckpoint(
      createRewardCheckpoint({
        unlockedRewardIds: overrides.unlockedRewardIds ?? unlockedRewardIds,
        bonusStars: overrides.bonusStars ?? bonusStars,
        rewardedTableCount: overrides.rewardedTableCount ?? rewardedTableCount,
        pendingRewardOffer: overrides.pendingRewardOffer ?? pendingRewardOffer,
        rewardEvents,
        updatedAt: new Date().toISOString(),
      })
    );

    setRewardBackendStatus(status);
    return checkpoint;
  }

  function stopFrameLoop(resetFrame = false) {
    if (frameTimerRef.current) {
      window.clearInterval(frameTimerRef.current);
      frameTimerRef.current = null;
    }

    if (lipSyncRafRef.current) {
      window.cancelAnimationFrame(lipSyncRafRef.current);
      lipSyncRafRef.current = null;
    }

    lipSyncLevelRef.current = 0;
    lipSyncDriverRef.current = "idle";

    if (resetFrame) {
      frameStepRef.current = 0;
      setFrameIndex(0);
    }
  }

  async function ensureAudioAnalyser(player) {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor || !player) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextConstructor();
    }

    const context = audioContextRef.current;

    if (context.state === "suspended") {
      try {
        await context.resume();
      } catch {
        return null;
      }
    }

    if (!analyserRef.current) {
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.18;
      analyser.connect(context.destination);
      analyserRef.current = analyser;
      analyserDataRef.current = new Uint8Array(analyser.fftSize);
    }

    let source = audioSourceMapRef.current.get(player);
    if (!source) {
      try {
        source = context.createMediaElementSource(player);
        source.connect(analyserRef.current);
        audioSourceMapRef.current.set(player, source);
      } catch {
        return null;
      }
    }

    return analyserRef.current;
  }

  function getDecodeAudioContext() {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      return null;
    }

    if (!decodeAudioContextRef.current) {
      decodeAudioContextRef.current = new AudioContextConstructor();
    }

    return decodeAudioContextRef.current;
  }

  function getLipSyncTrack(url) {
    if (!url) {
      return Promise.resolve(null);
    }

    const resolvedUrl = toAbsoluteAudioUrl(url);

    const cached = lipTrackCacheRef.current.get(resolvedUrl);
    if (cached) {
      return cached;
    }

    const trackPromise = (async () => {
      const context = getDecodeAudioContext();
      if (!context) {
        return null;
      }

      try {
        const response = await fetch(resolvedUrl);
        if (!response.ok) {
          return null;
        }
        const audioBuffer = await response.arrayBuffer();
        const decodedBuffer = await context.decodeAudioData(audioBuffer.slice(0));
        return analyzeAudioBufferForLipSync(decodedBuffer);
      } catch {
        return null;
      }
    })();

    const resilientPromise = trackPromise.then((result) => {
      if (!result) {
        lipTrackCacheRef.current.delete(resolvedUrl);
      }
      return result;
    });

    lipTrackCacheRef.current.set(resolvedUrl, resilientPromise);
    return resilientPromise;
  }

  function stopCurrentAudio() {
    stopFrameLoop(true);

    if (playbackCancelRef.current) {
      playbackCancelRef.current("interrupted");
      playbackCancelRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsSpeaking(false);
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(STORAGE_KEY) || 0);
    if (Number.isFinite(stored)) setBestScore(stored);

    audioBankRef.current = buildAudioBank();

    let warmupTimeoutId = null;
    let idleCallbackId = null;

    if (shouldWarmHeavyMedia()) {
      const warmMedia = () => warmImageSources(FRAME_WARMUP_SOURCES);

      if ("requestIdleCallback" in window) {
        idleCallbackId = window.requestIdleCallback(warmMedia, { timeout: 1800 });
      } else {
        warmupTimeoutId = window.setTimeout(warmMedia, 1200);
      }
    }

    return () => {
      clearAnswerTimer();
      stopFrameLoop();
      stopCurrentAudio();
      if (warmupTimeoutId) {
        window.clearTimeout(warmupTimeoutId);
      }
      if (idleCallbackId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
      audioBankRef.current.forEach((players) => {
        players.forEach((player) => {
          player.pause();
          player.src = "";
        });
      });
      if (audioContextRef.current?.close) {
        audioContextRef.current.close().catch(() => {});
      }
      if (decodeAudioContextRef.current?.close) {
        decodeAudioContextRef.current.close().catch(() => {});
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    setFrameIndex(0);
    frameStepRef.current = 0;
    stopFrameLoop();

    if (!isSpeaking || currentScene.frames.length <= 1) {
      return;
    }

    let cancelled = false;

    async function startAudioDrivenLipSync() {
      if (lastSpeechMode !== "audio-file" || !audioRef.current) {
        return false;
      }

      const currentPlayer = audioRef.current;
      const lipTrack = await getLipSyncTrack(currentPlayer.currentSrc || currentPlayer.src);
      if (lipTrack?.levels?.length && !cancelled) {
        lipSyncDriverRef.current = `track:${lipTrack.levels.length}`;
        const tickTrack = () => {
          if (cancelled) {
            return;
          }

          if (!audioRef.current || audioRef.current !== currentPlayer || currentPlayer.paused || currentPlayer.ended) {
            lipSyncLevelRef.current = 0;
            setFrameIndex(0);
            return;
          }

          const sampleIndex = Math.min(
            lipTrack.levels.length - 1,
            Math.max(0, Math.floor((currentPlayer.currentTime * 1000) / lipTrack.stepMs)),
          );
          const normalizedLevel = lipTrack.levels[sampleIndex] ?? 0;
          const rawLevel =
            LIP_SYNC_SILENCE_FLOOR + normalizedLevel * (LIP_SYNC_FULL_OPEN - LIP_SYNC_SILENCE_FLOOR);
          const smoothedLevel =
            lipSyncLevelRef.current * LIP_SYNC_SMOOTHING + rawLevel * (1 - LIP_SYNC_SMOOTHING);
          lipSyncLevelRef.current = smoothedLevel;

          const targetFrame = mapLipSyncLevelToFrame(smoothedLevel, currentScene.frames.length);
          setFrameIndex((current) => (current === targetFrame ? current : targetFrame));
          lipSyncRafRef.current = window.requestAnimationFrame(tickTrack);
        };

        tickTrack();
        return true;
      }

      const analyser = await ensureAudioAnalyser(currentPlayer);
      const data = analyserDataRef.current;
      if (!analyser || !data || cancelled) {
        return false;
      }

      lipSyncDriverRef.current = "analyser";
      const tick = () => {
        if (cancelled) {
          return;
        }

        if (!audioRef.current || audioRef.current !== currentPlayer || currentPlayer.paused || currentPlayer.ended) {
          lipSyncLevelRef.current = 0;
          setFrameIndex(0);
          return;
        }

        analyser.getByteTimeDomainData(data);

        let sumSquares = 0;
        let peak = 0;

        for (let index = 0; index < data.length; index += 1) {
          const sample = (data[index] - 128) / 128;
          const absoluteSample = Math.abs(sample);
          sumSquares += sample * sample;
          if (absoluteSample > peak) {
            peak = absoluteSample;
          }
        }

        const rms = Math.sqrt(sumSquares / data.length);
        const rawLevel = Math.max(rms * 1.9, peak * 0.95);
        const smoothedLevel =
          lipSyncLevelRef.current * LIP_SYNC_SMOOTHING + rawLevel * (1 - LIP_SYNC_SMOOTHING);
        lipSyncLevelRef.current = smoothedLevel;

        const targetFrame = mapLipSyncLevelToFrame(smoothedLevel, currentScene.frames.length);
        setFrameIndex((current) => (current === targetFrame ? current : targetFrame));
        lipSyncRafRef.current = window.requestAnimationFrame(tick);
      };

      tick();
      return true;
    }

    void startAudioDrivenLipSync().then((started) => {
      if (started || cancelled) {
        return;
      }

      lipSyncDriverRef.current = "fallback";
      const frameSequence = buildFrameSequence(currentScene.frames.length);
      frameTimerRef.current = window.setInterval(() => {
        frameStepRef.current = (frameStepRef.current + 1) % frameSequence.length;
        setFrameIndex(frameSequence[frameStepRef.current]);
      }, currentScene.frameMs);
    });

    return () => {
      cancelled = true;
      stopFrameLoop();
    };
  }, [currentScene.frameMs, currentScene.frames.length, isSpeaking, lastSpeechMode, turtleScene]);

  useEffect(() => {
    if (!soundEnabled) {
      stopCurrentAudio();
      setLastSpeechMode("sound-off");
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (mobileMenuOpen) {
      blurAnswerInput();
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    function unlockStartCue(event) {
      if (startCueUnlockedRef.current) return;

      const target = event.target instanceof Element ? event.target : null;
      const ignoredInteractive =
        target?.closest(
          ".answer-grid, .answer-form, .table-grid, .top-actions button, .sound-button, .secondary-button, .submit-button, .mobile-menu-toggle, .mobile-utility-drawer button"
        );

      if (ignoredInteractive) {
        return;
      }

      startCueUnlockedRef.current = true;

      if (round === 0 && score === 0 && !gameFinished && lastCueId === "start") {
        void playCue("start");
      }
    }

    window.addEventListener("pointerdown", unlockStartCue, true);
    window.addEventListener("keydown", unlockStartCue, true);

    return () => {
      window.removeEventListener("pointerdown", unlockStartCue, true);
      window.removeEventListener("keydown", unlockStartCue, true);
    };
  }, [gameFinished, lastCueId, round, score]);

  useEffect(() => {
    let ignore = false;

    async function hydrateRewardState() {
      const { checkpoint, status } = await hydrateRewardCheckpoint();
      if (ignore) {
        return;
      }

      setUnlockedRewardIds(checkpoint.unlockedRewardIds);
      setBonusStars(checkpoint.bonusStars);
      setRewardedTableCount(checkpoint.rewardedTableCount);
      setPendingRewardOffer(checkpoint.pendingRewardOffer);
      setRewardModalOpen(Boolean(checkpoint.pendingRewardOffer?.choices?.length));
      setRewardBackendStatus(status);
    }

    void hydrateRewardState();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        mode: gameFinished ? "finish" : "play",
        coordinate_system: "UI layout only, no canvas. Top-to-bottom reading order.",
        task: `${task.a} x ${task.b}`,
        answer: task.answer,
        typedAnswer,
        round,
        totalRounds: ROUNDS_PER_GAME,
        score,
        streak,
        scene: turtleScene,
        sceneFrameIndex: frameIndex,
        sceneFrameCount: currentScene.frames.length,
        speech: turtleSpeech,
        feedback,
        soundEnabled,
        selectedTables,
        checking: isChecking,
        speaking: isSpeaking,
        lastSpeechMode,
        lastCueId,
        rewardBackendMode: rewardBackendStatus.activeMode,
        rewardBackendTransport: rewardBackendStatus.transport,
        rewardPendingOfferId: pendingRewardOffer?.offerId ?? null,
        rewardPendingChoices: pendingRewardOffer?.choiceIds ?? [],
        lipSyncLevel: Number(lipSyncLevelRef.current.toFixed(3)),
        lipSyncDriver: lipSyncDriverRef.current,
        audioCurrentTime: Number((audioRef.current?.currentTime || 0).toFixed(3)),
      });

    return () => {
      delete window.render_game_to_text;
    };
  }, [
    currentScene.frames.length,
    feedback,
    frameIndex,
    gameFinished,
    isChecking,
    isSpeaking,
    lastCueId,
    lastSpeechMode,
    pendingRewardOffer,
    round,
    rewardBackendStatus.activeMode,
    rewardBackendStatus.transport,
    score,
    selectedTables,
    soundEnabled,
    streak,
    task,
    turtleScene,
    turtleSpeech,
    typedAnswer,
  ]);

  async function playCue(cueId) {
    const cue = SPEECH_CUES[cueId];
    if (!cue) return;

    setLastCueId(cueId);
    setTurtleScene(cue.scene);
    setTurtleSpeech(cue.text);
    setFrameIndex(0);
    frameStepRef.current = 0;

    if (!soundEnabled) {
      setIsSpeaking(false);
      setLastSpeechMode("sound-off");
      return;
    }

    let players = audioBankRef.current.get(cue.id);
    if (!players) {
      players = createAudioPlayers(cue);
      audioBankRef.current.set(cue.id, players);
    }

    for (const player of players) {
      try {
        stopCurrentAudio();
        audioRef.current = player;
        player.currentTime = 0;

        const playbackResult = await new Promise((resolve) => {
          let settled = false;

          const finish = (status) => {
            if (settled) return;
            settled = true;
            player.onended = null;
            player.onerror = null;
            if (playbackCancelRef.current === cancelPlayback) {
              playbackCancelRef.current = null;
            }
            setIsSpeaking(false);
            resolve(status);
          };

          const cancelPlayback = (status = "interrupted") => finish(status);
          playbackCancelRef.current = cancelPlayback;
          player.onended = () => finish("ended");
          player.onerror = () => finish("error");

          try {
            const playPromise = player.play();
            setIsSpeaking(true);
            setLastSpeechMode("audio-file");
            if (playPromise && typeof playPromise.then === "function") {
              playPromise.catch(() => finish("error"));
            }
          } catch {
            finish("error");
          }
        });

        if (playbackResult === "ended") {
          return;
        }

        if (playbackResult === "interrupted") {
          return;
        }
      } catch {
        player.pause();
        player.currentTime = 0;
      }
    }

    setIsSpeaking(false);
    setLastSpeechMode("missing-audio");
  }

  async function resetAppCache() {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key.startsWith("schildkroetenklasse-einmaleins")).map((key) => caches.delete(key)));
    }

    window.location.reload();
  }

  function toggleTable(number) {
    if (round > 0 && !gameFinished) return;

    setSelectedTables((current) => {
      if (current.includes(number)) {
        const next = current.filter((item) => item !== number);
        const resolved = next.length ? next : current;
        saveSelectedTables(resolved);
        return resolved;
      }

      const next = [...current, number].sort((a, b) => a - b);
      saveSelectedTables(next);
      return next;
    });
  }

  function handleTableTogglePointerDown(event, number) {
    event.preventDefault();
    skipTableToggleClickRef.current = number;
    toggleTable(number);
  }

  function handleTableToggleClick(number) {
    if (skipTableToggleClickRef.current === number) {
      skipTableToggleClickRef.current = null;
      return;
    }

    toggleTable(number);
  }

  function nextTask() {
    flowTokenRef.current += 1;
    const next = createTask(selectedTables, task);
    taskHadMistakeRef.current = false;
    setTask(next);
    setOptions(createOptions(next.answer));
    setTypedAnswer("");
    setLastWasCorrect(null);
    setFeedback("Nächste Aufgabe. Wähle eine Antwort oder tippe die Zahl ein.");
  }

  async function finishGame(finalScore, flowToken) {
    const strongFinish = finalScore >= 7;
    const currentUnlockedRewardIds = loadUnlockedRewardIds();
    const currentRewardedTableCount = loadRewardedTableCount();
    const currentPendingRewardOffer = loadPendingRewardOffer();
    let rewardSummary = { type: "none" };

    setGameFinished(true);
    setFeedback(`Fertig! Du hast ${finalScore} von ${ROUNDS_PER_GAME} Aufgaben richtig gelöst.`);

    if (finalScore > bestScore) {
      setBestScore(finalScore);
      window.localStorage.setItem(STORAGE_KEY, String(finalScore));
    }

    if (currentPendingRewardOffer) {
      setPendingRewardOffer(currentPendingRewardOffer);
      setRewardModalOpen(true);
      rewardSummary = {
        type: "pending-offer-resumed",
        offerId: currentPendingRewardOffer.offerId,
      };
    } else {
      const nextConsecutivePerfect = finalScore === ROUNDS_PER_GAME ? consecutivePerfectRounds + 1 : 0;
      setConsecutivePerfectRounds(nextConsecutivePerfect);

      const currentCompletedIds = loadCompletedAchievementIds();
      const newAchievements = checkNewAchievements({
        finalScore,
        totalRounds: ROUNDS_PER_GAME,
        selectedTables,
        consecutivePerfect: nextConsecutivePerfect,
        completedIds: currentCompletedIds,
      });

      if (newAchievements.length > 0) {
        const nextCompletedIds = addCompletedAchievementIds(newAchievements.map((a) => a.id));
        setCompletedAchievementIds(nextCompletedIds);

        const titleForModal = newAchievements[0]?.title ?? null;
        setRewardTriggerTitle(titleForModal);

        const offer = buildRewardOffer(currentUnlockedRewardIds, {
          seed: `${selectedTables.join("-")}|${currentUnlockedRewardIds.join("-")}|${currentCompletedIds.length}|${finalScore}`,
        });
        if (offer.allCollected) {
          const nextBonusStars = addBonusStar();
          setBonusStars(nextBonusStars);
          rewardSummary = {
            type: "bonus-star-awarded",
            totalBonusStars: nextBonusStars,
          };
          void persistRewardState(
            { bonusStars: nextBonusStars },
            {
              type: "bonus-star-awarded",
              createdAt: new Date().toISOString(),
              data: { totalBonusStars: nextBonusStars, selectedTableCount: selectedTables.length },
            }
          );
        } else {
          const nextPendingRewardOffer = savePendingRewardOffer({
            offerId: `reward-offer-${Date.now()}`,
            choiceIds: offer.choices.map((reward) => reward.id),
            createdAt: new Date().toISOString(),
            selectedTableCount: selectedTables.length,
          });
          setPendingRewardOffer(nextPendingRewardOffer);
          setRewardModalOpen(Boolean(nextPendingRewardOffer));
          rewardSummary = {
            type: "offer-created",
            offerId: nextPendingRewardOffer?.offerId ?? null,
            choiceIds: nextPendingRewardOffer?.choiceIds ?? [],
          };
          void persistRewardState(
            { pendingRewardOffer: nextPendingRewardOffer },
            {
              type: "reward-offer-created",
              createdAt: new Date().toISOString(),
              data: {
                offerId: nextPendingRewardOffer?.offerId ?? null,
                choiceIds: nextPendingRewardOffer?.choiceIds ?? [],
                achievementIds: newAchievements.map((a) => a.id),
                selectedTableCount: selectedTables.length,
              },
            }
          );
        }
      } else {
        setConsecutivePerfectRounds(nextConsecutivePerfect);
      }
    }

    setLearningState((current) =>
      recordRoundSummary(current, {
        score: finalScore,
        totalRounds: ROUNDS_PER_GAME,
        selectedTables,
        reward: rewardSummary,
      })
    );

    await playCue(strongFinish ? "finishStrong" : "finishSoft");

    if (flowTokenRef.current !== flowToken) {
      return;
    }

    setIsChecking(false);
  }

  async function checkAnswer(answer) {
    if (gameFinished || isChecking) return;

    blurAnswerInput();

    const number = cleanAnswer(answer);
    if (number === null) {
      setFeedback("Bitte gib nur ganze Zahlen zwischen 0 und 100 ein.");
      setLastWasCorrect(false);
      await playCue("inputWarning");
      return;
    }

    const flowToken = flowTokenRef.current + 1;
    flowTokenRef.current = flowToken;
    const isCorrect = number === task.answer;

    setLearningState((current) =>
      recordAnswerAttempt(current, {
        a: task.a,
        b: task.b,
        givenAnswer: number,
        correctAnswer: task.answer,
        isCorrect,
      })
    );

    setIsChecking(true);
    setLastWasCorrect(isCorrect);

    if (!isCorrect) {
      consecutiveWrongAnswersRef.current += 1;
      taskHadMistakeRef.current = true;
      setStreak(0);
      setTypedAnswer("");
      setFeedback(WRONG_TEXT);
      const cueId = consecutiveWrongAnswersRef.current >= 2 ? "doubleWrong" : "wrong";
      await playCue(cueId);

      if (flowTokenRef.current !== flowToken) {
        return;
      }

      setIsChecking(false);
      return;
    }

    consecutiveWrongAnswersRef.current = 0;
    const solvedWithoutMistake = !taskHadMistakeRef.current;
    const nextRound = round + 1;
    const nextScore = score + (solvedWithoutMistake ? 1 : 0);

    setRound(nextRound);
    setScore(nextScore);
    setStreak(solvedWithoutMistake ? streak + 1 : 0);
    setFeedback("Richtig gerechnet. Schildi freut sich mit dir.");
    const cueId = randomCorrectCueId();
    await playCue(cueId);

    if (flowTokenRef.current !== flowToken) {
      return;
    }

    if (nextRound >= ROUNDS_PER_GAME) {
      clearAnswerTimer();
      await sleep(100);

      if (flowTokenRef.current !== flowToken) {
        return;
      }

      await finishGame(nextScore, flowToken);
      return;
    }

    await sleep(100);

    if (flowTokenRef.current !== flowToken) {
      return;
    }

    const next = createTask(selectedTables, task);
    taskHadMistakeRef.current = false;
    setTask(next);
    setOptions(createOptions(next.answer));
    setTypedAnswer("");
    setLastWasCorrect(null);
    setFeedback("Nächste Aufgabe. Wähle eine Antwort oder tippe die Zahl ein.");
    setIsChecking(false);
    await playCue("ready");

    if (flowTokenRef.current !== flowToken) {
      return;
    }
  }

  function resetGame() {
    flowTokenRef.current += 1;
    clearAnswerTimer();
    stopCurrentAudio();
    window.speechSynthesis?.cancel();

    const firstTask = createTask(selectedTables);
    setTask(firstTask);
    setOptions(createOptions(firstTask.answer));
    setTypedAnswer("");
    setScore(0);
    setRound(0);
    setStreak(0);
    setFeedback("Neue Runde. Wähle eine Antwort oder tippe die Zahl ein.");
    setLastWasCorrect(null);
    setGameFinished(false);
    setIsChecking(false);
    setIsSpeaking(false);
    setLastSpeechMode(soundEnabled ? "none" : "sound-off");
    setLastCueId("start");
    setTurtleScene("hello");
    setTurtleSpeech(START_TEXT);
    setFrameIndex(0);
    setMobileMenuOpen(false);
    setExpandedMobileSection(null);
    setRewardModalOpen(false);
    setCollectionOpen(false);
    setVideoReward(null);
    setChallengeModalOpen(false);
    setShowTableSelector(false);
    taskHadMistakeRef.current = false;
    consecutiveWrongAnswersRef.current = 0;
    frameStepRef.current = 0;
  }

  async function handleRewardChoose(reward) {
    const nextIds = unlockRewardId(reward.id);
    setUnlockedRewardIds(nextIds);
    clearPendingRewardOffer();
    setPendingRewardOffer(null);
    setRewardModalOpen(false);
    setFeedback(reward.unlockText ?? `${reward.name} gehört jetzt zu deiner Sammlung.`);
    stopCurrentAudio();

    if (reward.videoPath) {
      setVideoReward(reward);
      void persistRewardState(
        {
          unlockedRewardIds: nextIds,
          pendingRewardOffer: null,
        },
        {
          type: "reward-claimed",
          createdAt: new Date().toISOString(),
          data: {
            rewardId: reward.id,
            via: "video",
          },
        }
      );
      return;
    }

    setCollectionOpen(true);
    await playDinoRewardSound(reward, { soundEnabled });
    await persistRewardState(
      {
        unlockedRewardIds: nextIds,
        pendingRewardOffer: null,
      },
      {
        type: "reward-claimed",
        createdAt: new Date().toISOString(),
        data: {
          rewardId: reward.id,
          via: "sound-only",
        },
      }
    );
  }

  function handleRewardVideoClose() {
    setVideoReward(null);
    setCollectionOpen(true);
  }

  function openPendingRewardOffer() {
    if (pendingRewardOffer?.choices?.length) {
      setRewardModalOpen(true);
    }
  }

  function handleChallengeAccept(challenge, tables) {
    setChallengeModalOpen(false);
    setMobileMenuOpen(false);
    setActiveChallengeId(challenge.id);
    // resetGame first, then override state so React batches correctly
    resetGame();
    setTurtleSpeech(challenge.schildiText);
    setTurtleScene("hello");
    if (tables && tables.length > 0) {
      const sanitized = tables.filter((t) => t >= 0 && t <= 10).sort((a, b) => a - b);
      if (sanitized.length > 0) {
        saveSelectedTables(sanitized);
        setSelectedTables(sanitized);
      }
    }
  }

  function replayCurrentCue() {
    if (lastCueId === "start") {
      startCueUnlockedRef.current = true;
    }
    void playCue(lastCueId);
  }

  function handleOptionClick(option) {
    setTypedAnswer(String(option));
    checkAnswer(option);
  }

  function handleSubmit(event) {
    event.preventDefault();
    checkAnswer(typedAnswer);
  }

  function toggleKeyboardInput() {
    setKeyboardEnabled((current) => {
      const next = !current;

      if (!next) {
        setTypedAnswer("");
        blurAnswerInput();
      }

      return next;
    });
  }

  return (
    <main className="app-shell">
      <section className="app-container">
        <div className="layout-grid">
          <section className="game-card play-panel" aria-label="Spielbereich">
            <div
              className={`turtle-panel scene-${turtleScene} motion-${currentScene.motion}`}
              aria-label="Schildkröten-Maskottchen Schildi"
              data-testid="turtle-panel"
              data-scene={turtleScene}
              data-cue={lastCueId}
              onClick={() => {
                if (lastCueId === "start" || !isSpeaking) {
                  startCueUnlockedRef.current = true;
                  void playCue(lastCueId);
                }
              }}
            >
              <div className={`turtle-speech bubble-${currentScene.bubbleTone}`} aria-live="polite">
                {turtleSpeech}
              </div>

              <div className="turtle-stage" aria-hidden="true">
                <div className="turtle-glow" />
                <div className="turtle-orbit turtle-orbit-left" />
                <div className="turtle-orbit turtle-orbit-right" />
                <div className="turtle-card">
                  <div className="turtle-frame-stack">
                    <div
                      className="turtle-frame-align"
                      style={{
                        "--frame-shift-x": currentFrame?.shiftX ?? "0%",
                        "--frame-shift-y": currentFrame?.shiftY ?? "0%",
                      }}
                    >
                      <img
                        className="turtle-image turtle-image-current"
                        src={currentFrame?.src}
                        alt=""
                        data-testid="turtle-image"
                        data-frame-index={frameIndex}
                      />
                    </div>
                  </div>
                </div>
                <div className="turtle-badge">{currentScene.badge}</div>
              </div>
            </div>

            {!gameFinished ? (
              <>
                <div className="task-card">
                  <p>Rechne aus</p>
                  <div>{task.a} × {task.b}</div>
                </div>

                <div className="answer-grid">
                  {options.map((option) => (
                    <button
                      key={`${task.a}-${task.b}-${option}`}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      className="answer-button"
                      disabled={isChecking}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="finish-card">
                <p>Runde beendet</p>
                <strong>{score}/{ROUNDS_PER_GAME}</strong>
                <span>
                  {score >= 8
                    ? "Klasse Ergebnis. Du kannst jetzt dieselben Tafeln noch einmal sicher üben oder neue dazunehmen."
                    : "Gute Übung. Starte gern direkt noch eine ruhige nächste Runde."}
                </span>

                {showTableSelector ? (
                  <div className="finish-table-selector">
                    <p className="finish-table-label">Welche Reihen möchtest du üben?</p>
                    <div className="table-grid finish-table-grid">
                      {TABLES.map((number) => {
                        const active = selectedTables.includes(number);
                        return (
                          <button
                            key={`finish-${number}`}
                            type="button"
                            onPointerDown={(e) => handleTableTogglePointerDown(e, number)}
                            onClick={() => handleTableToggleClick(number)}
                            className={active ? "table-button active" : "table-button"}
                            aria-pressed={active}
                          >
                            {number}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      className="secondary-button finish-table-done"
                      onClick={() => setShowTableSelector(false)}
                    >
                      Fertig
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="table-switch-hint"
                    onClick={() => setShowTableSelector(true)}
                  >
                    Andere Reihen ausprobieren?
                  </button>
                )}

                <div className="finish-card-actions">
                  <button type="button" onClick={resetGame} className="submit-button">Noch einmal spielen</button>
                  <button
                    type="button"
                    className="challenge-open-hint"
                    onClick={() => setChallengeModalOpen(true)}
                  >
                    🦕 Dino-Herausforderung
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-utility-drawer"
          onClick={() => setMobileMenuOpen((current) => !current)}
        >
          {mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
        </button>

        <div
          className={mobileMenuOpen ? "mobile-utility-backdrop open" : "mobile-utility-backdrop"}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden={mobileMenuOpen ? "false" : "true"}
        />

        <aside
          id="mobile-utility-drawer"
          className={mobileMenuOpen ? "mobile-utility-drawer open" : "mobile-utility-drawer"}
          aria-label="Zusätzliche Einstellungen und Infos"
        >
          <div className="mobile-utility-header">
            <h2>Mehr</h2>
            <button type="button" className="secondary-button" onClick={() => setMobileMenuOpen(false)}>Schließen</button>
          </div>

          <section className="mobile-utility-section">
            <button
              type="button"
              className={expandedMobileSection === "tables" ? "mobile-section-toggle active" : "mobile-section-toggle"}
              onClick={() => toggleMobileSection("tables")}
              aria-expanded={expandedMobileSection === "tables"}
            >
              Tafeln auswählen
            </button>
            {expandedMobileSection === "tables" ? (
              <div className="mobile-section-content">
                <div className="table-grid mobile-table-grid">
                  {TABLES.map((number) => {
                    const active = selectedTables.includes(number);
                    return (
                      <button
                        key={`mobile-${number}`}
                        type="button"
                        onPointerDown={(event) => handleTableTogglePointerDown(event, number)}
                        onClick={() => handleTableToggleClick(number)}
                        disabled={round > 0 && !gameFinished}
                        className={active ? "table-button active" : "table-button"}
                        aria-pressed={active}
                      >
                        {number}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </section>

          <section className="mobile-utility-section">
            <button
              type="button"
              className={expandedMobileSection === "tips" ? "mobile-section-toggle active" : "mobile-section-toggle"}
              onClick={() => toggleMobileSection("tips")}
              aria-expanded={expandedMobileSection === "tips"}
            >
              Tipps
            </button>
            {expandedMobileSection === "tips" ? (
              <div className="mobile-section-content">
                <div className="tip-card mobile-tip-card">
                  <h3>Trainer-Tipp</h3>
                  <p>{currentPraise}</p>
                </div>
                <div className="info-card mobile-info-card">
                  <h3>So übst du gut</h3>
                  <ul>
                    <li>laut oder leise im Kopf mitrechnen</li>
                    <li>erst denken, dann tippen</li>
                    <li>Fehler sind erlaubt und helfen beim Lernen</li>
                    <li>eine Runde hat 10 Aufgaben</li>
                  </ul>
                </div>
              </div>
            ) : null}
          </section>

          <section className="mobile-utility-section">
            <button
              type="button"
              className={expandedMobileSection === "score" ? "mobile-section-toggle active" : "mobile-section-toggle"}
              onClick={() => toggleMobileSection("score")}
              aria-expanded={expandedMobileSection === "score"}
            >
              Mein Punktestand
            </button>
            {expandedMobileSection === "score" ? (
              <div className="mobile-section-content">
                <div className="mobile-score-grid">
                  <div className="mobile-score-card">
                    <span>Bester Lauf</span>
                    <strong>{bestScore}/{ROUNDS_PER_GAME}</strong>
                  </div>
                  <div className="mobile-score-card">
                    <span>Aktuell</span>
                    <strong>{score}/{ROUNDS_PER_GAME}</strong>
                  </div>
                  <div className="mobile-score-card">
                    <span>Aufgabe</span>
                    <strong>{Math.min(round + 1, ROUNDS_PER_GAME)}/{ROUNDS_PER_GAME}</strong>
                  </div>
                  <div className="mobile-score-card">
                    <span>Serie</span>
                    <strong>{streak}</strong>
                  </div>
                </div>
                <RewardStatusCard
                  unlockedIds={unlockedRewardIds}
                  bonusStars={bonusStars}
                  completedAchievementIds={completedAchievementIds}
                  backendStatusText={rewardBackendStatusText}
                  hasPendingReward={Boolean(pendingRewardOffer?.choices?.length)}
                  onOpenCollection={() => setCollectionOpen(true)}
                  onOpenPendingReward={openPendingRewardOffer}
                  onOpenChallenges={() => { setChallengeModalOpen(true); setMobileMenuOpen(false); }}
                />
                <div className="mobile-feedback-card">
                  <span>Hinweis</span>
                  <p>{feedback}</p>
                </div>
              </div>
            ) : null}
          </section>

          <section className="mobile-utility-section">
            <button
              type="button"
              className={expandedMobileSection === "keyboard" ? "mobile-section-toggle active" : "mobile-section-toggle"}
              onClick={() => toggleMobileSection("keyboard")}
              aria-expanded={expandedMobileSection === "keyboard"}
            >
              Tastatur an/aus
            </button>
            {expandedMobileSection === "keyboard" ? (
              <div className="mobile-section-content">
                <div className="toggle-card mobile-toggle-card">
                  <h3>Tastatureingabe</h3>
                  <p>Auf dem Smartphone bleibt die Tastatur ruhig aus, bis du sie bewusst wieder einschaltest.</p>
                  <button
                    type="button"
                    onClick={toggleKeyboardInput}
                    className={keyboardEnabled ? "settings-toggle-button active" : "settings-toggle-button"}
                    aria-pressed={keyboardEnabled}
                  >
                    {keyboardEnabled ? "Tastatur an" : "Tastatur aus"}
                  </button>

                  {keyboardEnabled ? (
                    <form onSubmit={handleSubmit} className="answer-form drawer-answer-form">
                      <label className="answer-label" htmlFor="typed-answer">Deine Antwort</label>
                      <div className="answer-row">
                        <input
                          ref={inputRef}
                          id="typed-answer"
                          inputMode="numeric"
                          min="0"
                          max="100"
                          type="number"
                          value={typedAnswer}
                          onChange={(event) => setTypedAnswer(event.target.value)}
                          placeholder="0 bis 100"
                          className="answer-input"
                          disabled={isChecking}
                          data-testid="answer-input"
                        />
                        <button type="submit" className="submit-button" disabled={isChecking} data-testid="submit-answer">Prüfen</button>
                      </div>
                    </form>
                  ) : (
                    <div className="drawer-keyboard-hint">Solange die Tastatur aus ist, reichen oben die großen Antwortfelder.</div>
                  )}
                </div>
              </div>
            ) : null}
          </section>

          <section className="mobile-utility-section">
            <button
              type="button"
              className="mobile-section-toggle challenge-menu-button"
              onClick={() => { setChallengeModalOpen(true); setMobileMenuOpen(false); }}
            >
              🦕 Dino-Herausforderung
            </button>
          </section>

          <section className="mobile-utility-section">
            <button
              type="button"
              className={expandedMobileSection === "actions" ? "mobile-section-toggle active" : "mobile-section-toggle"}
              onClick={() => toggleMobileSection("actions")}
              aria-expanded={expandedMobileSection === "actions"}
            >
              Top-Actions
            </button>
            {expandedMobileSection === "actions" ? (
              <div className="mobile-section-content mobile-menu-actions">
                <div className={`audio-status ${lastSpeechMode === "missing-audio" ? "missing" : "ok"}`}>
                  {audioStatusText}
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled((value) => !value)}
                  className="sound-button mobile-action-button"
                  aria-pressed={soundEnabled}
                >
                  {soundEnabled ? "Ton an" : "Ton aus"}
                </button>
                <button type="button" onClick={replayCurrentCue} className="secondary-button mobile-action-button">Nochmal hören</button>
                <button type="button" onClick={resetGame} className="secondary-button mobile-action-button">Neu starten</button>
                <button type="button" onClick={resetAppCache} className="secondary-button mobile-action-button">Cache zurücksetzen</button>
              </div>
            ) : null}
          </section>
        </aside>

        <RewardChoiceModal
          choices={rewardModalOpen ? pendingRewardOffer?.choices ?? [] : []}
          onChoose={handleRewardChoose}
          onClose={() => setRewardModalOpen(false)}
          soundEnabled={soundEnabled}
          achievementTitle={rewardTriggerTitle}
        />

        <RewardVideoModal reward={videoReward} onClose={handleRewardVideoClose} />

        {collectionOpen ? (
          <div className="reward-modal-backdrop" role="presentation">
            <CollectionView
              unlockedIds={unlockedRewardIds}
              bonusStars={bonusStars}
              onClose={() => setCollectionOpen(false)}
              soundEnabled={soundEnabled}
            />
          </div>
        ) : null}

        {challengeModalOpen ? (
          <ChallengeModal
            completedIds={completedAchievementIds}
            onAccept={handleChallengeAccept}
            onClose={() => setChallengeModalOpen(false)}
          />
        ) : null}
      </section>
    </main>
  );
}
