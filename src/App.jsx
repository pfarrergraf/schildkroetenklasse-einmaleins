import React, { useEffect, useMemo, useRef, useState } from "react";
import halloImage from "../assets/Hallo.png";
import happyImage from "../assets/gut.png";
import sadImage from "../assets/schlecht.png";
import warningImage from "../assets/Achtung.png";

const TABLES = Array.from({ length: 11 }, (_, i) => i);
const ROUNDS_PER_GAME = 10;
const STORAGE_KEY = "schildkroetenklasse-einmaleins-bestscore";
const DEFAULT_TABLES = [1, 2, 5, 10];
const START_TEXT = "Hallo Schildkrötenklasse! Ich bin Schildi und übe mit dir.";
const READY_TEXT = "Ich bin bereit für die nächste Aufgabe.";
const FINISH_STRONG_TEXT = "Fertig! Das war schildkrötenstark.";
const FINISH_SOFT_TEXT = "Fertig! Noch eine Runde und wir werden stärker.";
const INPUT_WARNING_TEXT = "Bitte gib eine Zahl von 0 bis 100 ein.";
const CORRECT_TEXTS = ["Ja, gut gemacht!", "Super gerechnet!", "Klasse, Samuel!", "Richtig! Schildkrötenstark!"];
const WRONG_TEXT = "Probiere es noch einmal.";
const AUDIO_FILES = {
  [START_TEXT]: ["/audio/Hallo%20Schildkroetenklasse%20ich%20bin%20Schildi%20und%20uebe%20mit%20dir.wav"],
  [READY_TEXT]: ["/audio/Ich%20bin%20bereit%20fuer%20die%20naechste%20Aufgabe.wav"],
  [FINISH_STRONG_TEXT]: ["/audio/Fertig%20das%20war%20schildkroetenstark.mp3"],
  [FINISH_SOFT_TEXT]: ["/audio/Fertig%20noch%20eine%20Runde%20und%20wir%20werden%20staerker.wav"],
  [INPUT_WARNING_TEXT]: [
    "/audio/Bitte%20eine%20Zahl%20von%200%20bis%20100%20eingeben.mp3",
    "/audio/Bitte%20eine%20Zahl%20von%200%20bis%20100%20eingeben.wav",
  ],
  "Ja, gut gemacht!": ["/audio/Ja%20gut%20gemacht.wav"],
  "Super gerechnet!": ["/audio/Super%20gerechnet.wav"],
  "Klasse, Samuel!": ["/audio/Klasse%20Samuel.wav"],
  "Richtig! Schildkrötenstark!": ["/audio/Richtig%20Schildkroetenstark.wav"],
  [WRONG_TEXT]: ["/audio/Probier%20es%20noch%20einmal.wav"],
};
const TURTLE_SCENES = {
  hello: {
    image: halloImage,
    badge: "Hallo",
    motion: "float",
    bubbleTone: "hello",
  },
  idle: {
    image: halloImage,
    badge: "Bereit",
    motion: "breathe",
    bubbleTone: "hello",
  },
  happy: {
    image: happyImage,
    badge: "Super",
    motion: "celebrate",
    bubbleTone: "happy",
  },
  sad: {
    image: sadImage,
    badge: "Schade",
    motion: "comfort",
    bubbleTone: "sad",
  },
  warning: {
    image: warningImage,
    badge: "Achtung",
    motion: "alert",
    bubbleTone: "warning",
  },
  finish: {
    image: happyImage,
    badge: "Geschafft",
    motion: "celebrate",
    bubbleTone: "happy",
  },
};

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

function randomPraise() {
  return CORRECT_TEXTS[Math.floor(Math.random() * CORRECT_TEXTS.length)];
}

export default function App() {
  const [selectedTables, setSelectedTables] = useState(DEFAULT_TABLES);
  const [task, setTask] = useState(() => createTask(DEFAULT_TABLES));
  const [options, setOptions] = useState(() => createOptions(task.answer));
  const [typedAnswer, setTypedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState("Wähle eine Antwort oder tippe die Zahl ein.");
  const [lastWasCorrect, setLastWasCorrect] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [turtleScene, setTurtleScene] = useState("hello");
  const [turtleSpeech, setTurtleSpeech] = useState(START_TEXT);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastSpeechMode, setLastSpeechMode] = useState("none");
  const inputRef = useRef(null);
  const answerTimerRef = useRef(null);
  const audioRef = useRef(null);
  const audioBankRef = useRef(new Map());

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(STORAGE_KEY) || 0);
    if (Number.isFinite(stored)) setBestScore(stored);

    audioBankRef.current = new Map(
      Object.entries(AUDIO_FILES).map(([text, files]) => {
        const players = files.map((url) => {
          const player = new Audio(url);
          player.preload = "auto";
          player.load();
          return player;
        });
        return [text, players];
      })
    );

    window.setTimeout(() => inputRef.current?.focus(), 120);

    return () => {
      if (answerTimerRef.current) window.clearTimeout(answerTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      audioBankRef.current.forEach((players) => {
        players.forEach((player) => {
          player.pause();
          player.src = "";
        });
      });
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (!soundEnabled && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [soundEnabled]);

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
        speech: turtleSpeech,
        feedback,
        soundEnabled,
        selectedTables,
        checking: isChecking,
        lastSpeechMode,
      });

    return () => {
      delete window.render_game_to_text;
    };
  }, [feedback, gameFinished, isChecking, lastSpeechMode, round, score, selectedTables, soundEnabled, streak, task, turtleScene, turtleSpeech, typedAnswer]);

  const progressPercent = useMemo(() => Math.round((round / ROUNDS_PER_GAME) * 100), [round]);
  const currentPraise = useMemo(() => encouragement(score, round), [score, round]);
  const currentScene = TURTLE_SCENES[turtleScene] ?? TURTLE_SCENES.hello;
  const audioStatusText =
    lastSpeechMode === "audio-file"
      ? "Eigene Aufnahme aktiv"
      : lastSpeechMode === "missing-audio"
        ? "Keine passende Audiodatei gefunden"
        : soundEnabled
          ? "Ton bereit"
          : "Ton ausgeschaltet";

  async function speak(text) {
    if (!soundEnabled) return;

    const players = audioBankRef.current.get(text) ?? [];
    for (const player of players) {
      try {
        if (audioRef.current && audioRef.current !== player) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        audioRef.current = player;
        player.pause();
        player.currentTime = 0;
        await player.play();
        setLastSpeechMode("audio-file");
        return;
      } catch {
        player.pause();
        player.currentTime = 0;
      }
    }
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
        return next.length ? next : current;
      }

      return [...current, number].sort((a, b) => a - b);
    });
  }

  function nextTask() {
    const next = createTask(selectedTables, task);
    setTask(next);
    setOptions(createOptions(next.answer));
    setTypedAnswer("");
    setLastWasCorrect(null);
    setIsChecking(false);
    setTurtleScene("idle");
    setTurtleSpeech(READY_TEXT);
    setFeedback("Nächste Aufgabe. Wähle eine Antwort oder tippe die Zahl ein.");
    window.setTimeout(() => inputRef.current?.focus(), 60);
  }

  function finishGame(finalScore) {
    const strongFinish = finalScore >= 7;

    setIsChecking(false);
    setGameFinished(true);
    setTurtleScene(strongFinish ? "finish" : "idle");
    setTurtleSpeech(strongFinish ? FINISH_STRONG_TEXT : FINISH_SOFT_TEXT);
    setFeedback(`Fertig! Du hast ${finalScore} von ${ROUNDS_PER_GAME} Aufgaben richtig gelöst.`);

    if (finalScore > bestScore) {
      setBestScore(finalScore);
      window.localStorage.setItem(STORAGE_KEY, String(finalScore));
    }
  }

  function checkAnswer(answer) {
    if (gameFinished || isChecking) return;

    const number = cleanAnswer(answer);
    if (number === null) {
      setFeedback("Bitte gib nur ganze Zahlen zwischen 0 und 100 ein.");
      setLastWasCorrect(false);
      setTurtleScene("warning");
      setTurtleSpeech(INPUT_WARNING_TEXT);
      speak(INPUT_WARNING_TEXT);
      window.setTimeout(() => inputRef.current?.focus(), 30);
      return;
    }

    const isCorrect = number === task.answer;
    const nextRound = round + 1;
    const nextScore = score + (isCorrect ? 1 : 0);
    const turtleMessage = isCorrect ? randomPraise() : WRONG_TEXT;

    setIsChecking(true);
    setRound(nextRound);
    setScore(nextScore);
    setStreak(isCorrect ? streak + 1 : 0);
    setLastWasCorrect(isCorrect);
    setTurtleScene(isCorrect ? "happy" : "sad");
    setTurtleSpeech(turtleMessage);
    setFeedback(
      isCorrect
        ? "Richtig gerechnet. Schildi freut sich mit dir."
        : `Noch einmal hinschauen: ${task.a} × ${task.b} = ${task.answer}.`
    );
    speak(turtleMessage);

    if (nextRound >= ROUNDS_PER_GAME) {
      answerTimerRef.current = window.setTimeout(() => finishGame(nextScore), 1200);
      return;
    }

    if (answerTimerRef.current) window.clearTimeout(answerTimerRef.current);
    answerTimerRef.current = window.setTimeout(nextTask, 1500);
  }

  function resetGame() {
    if (answerTimerRef.current) window.clearTimeout(answerTimerRef.current);
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
    setTurtleScene("hello");
    setTurtleSpeech(START_TEXT);
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }

  function handleOptionClick(option) {
    setTypedAnswer(String(option));
    checkAnswer(option);
  }

  function handleSubmit(event) {
    event.preventDefault();
    checkAnswer(typedAnswer);
  }

  return (
    <main className="app-shell">
      <section className="app-container">
        <header className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Schildkrötenklasse · Einmaleins-Spiel</p>
            <h1>Samuel rechnet mit Schildi</h1>
            <p className="hero-text">
              Übe das kleine Einmaleins von 0 bis 10. Schildi begleitet dich ruhig, freundlich und mit echter Stimme.
            </p>
          </div>

          <div className="best-card" aria-label={`Bester Lauf ${bestScore} von ${ROUNDS_PER_GAME}`}>
            <span>Bester Lauf</span>
            <strong>{bestScore}/{ROUNDS_PER_GAME}</strong>
          </div>
        </header>

        <div className="layout-grid">
          <section className="game-card" aria-label="Spielbereich">
            <div className="game-topline">
              <div>
                <p className="round-label">Aufgabe {Math.min(round + 1, ROUNDS_PER_GAME)} von {ROUNDS_PER_GAME}</p>
                <p className="score-label">Punkte: {score} · Serie: {streak}</p>
              </div>

              <div className="top-actions">
                <button
                  type="button"
                  onClick={() => setSoundEnabled((value) => !value)}
                  className="sound-button"
                  aria-pressed={soundEnabled}
                >
                  {soundEnabled ? "Ton an" : "Ton aus"}
                </button>
                <button type="button" onClick={resetGame} className="secondary-button">Neu starten</button>
                <button type="button" onClick={resetAppCache} className="secondary-button">Cache zurücksetzen</button>
              </div>
            </div>

            <div className={`audio-status ${lastSpeechMode === "missing-audio" ? "missing" : "ok"}`}>
              {audioStatusText}
            </div>

            <div
              className={`turtle-panel scene-${turtleScene} motion-${currentScene.motion}`}
              aria-label="Schildkröten-Maskottchen Schildi"
              data-testid="turtle-panel"
              data-scene={turtleScene}
            >
              <div className={`turtle-speech bubble-${currentScene.bubbleTone}`} aria-live="polite">
                {turtleSpeech}
              </div>

              <div className="turtle-stage" aria-hidden="true">
                <div className="turtle-glow" />
                <div className="turtle-orbit turtle-orbit-left" />
                <div className="turtle-orbit turtle-orbit-right" />
                <div className="turtle-card">
                  <img className="turtle-image" src={currentScene.image} alt="" />
                </div>
                <div className="turtle-badge">{currentScene.badge}</div>
              </div>
            </div>

            <div className="progress-track" aria-hidden="true" data-testid="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
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

                <form onSubmit={handleSubmit} className="answer-form">
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
                <button type="button" onClick={resetGame} className="submit-button">Noch einmal spielen</button>
              </div>
            )}

            <div
              className={`feedback ${lastWasCorrect === true ? "correct" : lastWasCorrect === false ? "wrong" : "neutral"}`}
              aria-live="polite"
              data-testid="feedback"
            >
              {feedback}
            </div>
          </section>

          <aside className="settings-card" aria-label="Einstellungen">
            <h2>Tafeln auswählen</h2>
            <p>Vor dem Start anklicken. Während einer Runde bleiben die Tafeln bewusst fest.</p>

            <div className="table-grid">
              {TABLES.map((number) => {
                const active = selectedTables.includes(number);
                return (
                  <button
                    key={number}
                    type="button"
                    onClick={() => toggleTable(number)}
                    disabled={round > 0 && !gameFinished}
                    className={active ? "table-button active" : "table-button"}
                    aria-pressed={active}
                  >
                    {number}
                  </button>
                );
              })}
            </div>

            <div className="tip-card">
              <h3>Trainer-Tipp</h3>
              <p>{currentPraise}</p>
            </div>

            <div className="info-card">
              <h3>So übst du gut</h3>
              <ul>
                <li>laut oder leise im Kopf mitrechnen</li>
                <li>erst denken, dann tippen</li>
                <li>Fehler sind erlaubt und helfen beim Lernen</li>
                <li>eine Runde hat 10 Aufgaben</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
