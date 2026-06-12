// Kleine Sound-Engine auf Web-Audio-Basis — keine Audiodateien nötig.
// Der AudioContext wird lazy beim ersten Sound erzeugt (Browser verlangen
// eine User-Geste, und alle Sounds folgen hier auf Interaktionen).

export type SoundName =
  | "click"
  | "buy"
  | "success"
  | "fail"
  | "levelup"
  | "claim"
  | "achievement";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Note = {
  freq: number;
  start: number;    // Sekunden relativ zu jetzt
  duration: number; // Sekunden
  gain?: number;
  type?: OscillatorType;
};

function play(notes: Note[]) {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  for (const n of notes) {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = n.type ?? "sine";
    osc.frequency.value = n.freq;
    const peak = n.gain ?? 0.08;
    g.gain.setValueAtTime(0, now + n.start);
    g.gain.linearRampToValueAtTime(peak, now + n.start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.duration);
    osc.connect(g).connect(ac.destination);
    osc.start(now + n.start);
    osc.stop(now + n.start + n.duration + 0.02);
  }
}

const SOUNDS: Record<SoundName, () => void> = {
  // Sehr kurz und leise — läuft bei gehaltener Leertaste 8×/Sekunde
  click: () =>
    play([{ freq: 1900 + Math.random() * 250, start: 0, duration: 0.05, gain: 0.025, type: "triangle" }]),

  buy: () =>
    play([
      { freq: 660, start: 0, duration: 0.09, gain: 0.06 },
      { freq: 990, start: 0.07, duration: 0.12, gain: 0.06 },
    ]),

  success: () =>
    play([
      { freq: 523.25, start: 0, duration: 0.12, gain: 0.07 },    // C5
      { freq: 659.25, start: 0.09, duration: 0.12, gain: 0.07 }, // E5
      { freq: 783.99, start: 0.18, duration: 0.2, gain: 0.07 },  // G5
    ]),

  fail: () =>
    play([
      { freq: 311, start: 0, duration: 0.16, gain: 0.06, type: "sawtooth" },
      { freq: 233, start: 0.13, duration: 0.25, gain: 0.05, type: "sawtooth" },
    ]),

  levelup: () =>
    play([
      { freq: 880, start: 0, duration: 0.07, gain: 0.05, type: "triangle" },
      { freq: 1174.66, start: 0.05, duration: 0.1, gain: 0.05, type: "triangle" },
    ]),

  claim: () =>
    play([
      { freq: 783.99, start: 0, duration: 0.1, gain: 0.07 },
      { freq: 1046.5, start: 0.08, duration: 0.18, gain: 0.07 },
    ]),

  achievement: () =>
    play([
      { freq: 523.25, start: 0, duration: 0.1, gain: 0.07 },
      { freq: 659.25, start: 0.08, duration: 0.1, gain: 0.07 },
      { freq: 783.99, start: 0.16, duration: 0.1, gain: 0.07 },
      { freq: 1046.5, start: 0.24, duration: 0.3, gain: 0.08 },
    ]),
};

export function playSound(name: SoundName) {
  SOUNDS[name]();
}
