import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import backgroundPng from "../assets/Kinderzimmer background.png";

type FloatingNumber = {
  id: number;
  x: number;
  y: number;
};

export type SceneId = "kinderzimmer" | "azubi";

type ClickAreaProps = {
  scene: SceneId;
  focus: number;
  knowledgePerClick: number;
  onLearnCode: () => void;
};

let nextId = 0;

type CodeLine = { text: string; color: string };

// Pool of HTML/CSS/JS snippets that appear on screen (Epoche 1)
const CODE_LINES_KINDERZIMMER: CodeLine[] = [
  { text: '<div class="hero">', color: "#E0B84A" },
  { text: "  font-size: 1.5rem;", color: "#7dd3fc" },
  { text: "  const x = 42;", color: "#86efac" },
  { text: '<h1>Hello World</h1>', color: "#E0B84A" },
  { text: "  color: #E0B84A;", color: "#7dd3fc" },
  { text: "  padding: 1rem;", color: "#7dd3fc" },
  { text: "if (x > 0) {", color: "#86efac" },
  { text: '<a href="#">Link</a>', color: "#E0B84A" },
  { text: "  background: #111;", color: "#7dd3fc" },
  { text: "  return true;", color: "#86efac" },
  { text: '<span class="tag">', color: "#E0B84A" },
  { text: "  border-radius: 8px;", color: "#7dd3fc" },
  { text: "  console.log(x);", color: "#86efac" },
  { text: "  margin: 0 auto;", color: "#7dd3fc" },
  { text: "let name = 'NuVion';", color: "#86efac" },
  { text: "</div>", color: "#E0B84A" },
];

// Git/React/TypeScript snippets (Epoche 2)
const CODE_LINES_AZUBI: CodeLine[] = [
  { text: "$ git add .", color: "#fb923c" },
  { text: "$ git commit -m 'feat: navbar'", color: "#fb923c" },
  { text: "const App = () => {", color: "#7dd3fc" },
  { text: "  return <Layout />;", color: "#7dd3fc" },
  { text: "interface Props {", color: "#60a5fa" },
  { text: "  userId: number;", color: "#60a5fa" },
  { text: "}", color: "#60a5fa" },
  { text: "$ git push origin main", color: "#fb923c" },
  { text: "useEffect(() => {", color: "#7dd3fc" },
  { text: "  fetchUser(userId);", color: "#7dd3fc" },
  { text: "}, [userId]);", color: "#7dd3fc" },
  { text: "type User = { name: string };", color: "#60a5fa" },
  { text: "$ npm run build  ✓", color: "#86efac" },
  { text: '<Button variant="primary" />', color: "#7dd3fc" },
  { text: "$ git merge feature/login", color: "#fb923c" },
  { text: "export default App;", color: "#7dd3fc" },
];

// Stadtsilhouette für das Azubi-Bürofenster (deterministisch, kein Math.random im Render)
const SKYLINE = [38, 60, 45, 72, 52, 66, 40, 58];

function ClickArea({ scene, focus, knowledgePerClick, onLearnCode }: ClickAreaProps) {
  const [floaters, setFloaters] = useState<FloatingNumber[]>([]);
  const [clicking, setClicking] = useState(false);
  const [codeLines, setCodeLines] = useState<{ id: number; line: CodeLine }[]>([]);
  const codeRef = useRef<HTMLDivElement>(null);
  const lineCounter = useRef(0);

  const linePool = scene === "azubi" ? CODE_LINES_AZUBI : CODE_LINES_KINDERZIMMER;

  // Auto-scroll monitor to bottom whenever new lines appear
  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [codeLines]);

  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Core fire — works without a mouse event (used by keyboard too)
  const fireClick = useCallback(
    (cx?: number, cy?: number) => {
      if (focus <= 0) return;
      onLearnCode();

      const line = linePool[lineCounter.current % linePool.length];
      lineCounter.current++;
      const lineId = nextId++;
      setCodeLines((prev) => [...prev.slice(-30), { id: lineId, line }]);

      const x = cx ?? 80;
      const y = cy ?? 40;
      const floatId = nextId++;
      setFloaters((prev) => [...prev, { id: floatId, x, y }]);
      setClicking(true);
      setTimeout(() => setClicking(false), 180);
      setTimeout(() => setFloaters((prev) => prev.filter((f) => f.id !== floatId)), 800);
    },
    [focus, onLearnCode, linePool]
  );

  // Always-current ref so the interval never captures a stale closure
  const fireClickRef = useRef(fireClick);
  useEffect(() => { fireClickRef.current = fireClick; }, [fireClick]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      fireClick(e.clientX - rect.left, e.clientY - rect.top);
    },
    [fireClick]
  );

  // Spacebar support: single press = one click, held = repeated clicks
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      fireClickRef.current();
      if (!holdInterval.current) {
        holdInterval.current = setInterval(() => fireClickRef.current(), 120);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (holdInterval.current) {
        clearInterval(holdInterval.current);
        holdInterval.current = null;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (holdInterval.current) clearInterval(holdInterval.current);
    };
  }, []);

  const depleted = focus <= 0;

  // Scrollender Code — wird in beiden Szenen auf dem Monitor angezeigt
  const codeScreen = (
    <>
      {/* Scanline effect */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
        }}
      />
      {/* Code scroll area */}
      <div
        ref={codeRef}
        className="h-full w-full overflow-hidden px-2 py-1.5"
        style={{ fontFamily: "monospace" }}
      >
        {codeLines.length === 0 ? (
          <span className="text-[8px] text-green-500/40">{"_ "}</span>
        ) : (
          codeLines.map(({ id, line }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[7px] leading-[1.6] md:text-[9px]"
              style={{ color: line.color }}
            >
              {line.text}
            </motion.div>
          ))
        )}
        {/* blinking cursor */}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-[7px] text-green-400 md:text-[9px]"
        >
          █
        </motion.span>
      </div>
    </>
  );

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-accent/15 shadow-2xl">
      {scene === "kinderzimmer" ? (
        <>
          {/* Background image */}
          <img
            src={backgroundPng}
            alt="Kinderzimmer"
            className="block h-[340px] w-full object-cover object-center md:h-[420px]"
            draggable={false}
          />

          {/* Monitor screen overlay — positioned over the monitor in the PNG */}
          <div
            className="absolute overflow-hidden rounded-sm"
            style={{
              left: "42.5%",
              top: "22%",
              width: "21%",
              height: "40%",
              background: "rgba(0, 10, 5, 0.82)",
              boxShadow: "inset 0 0 18px rgba(0,0,0,0.8)",
            }}
          >
            {codeScreen}
          </div>
        </>
      ) : (
        /* ── Azubi-Büro bei Nacht — komplett aus CSS gebaut ──────────────── */
        <div className="relative h-[340px] w-full md:h-[420px] bg-gradient-to-b from-[#0b1322] via-[#0d1626] to-[#0a0f1c]">
          {/* Fenster mit Stadt-Skyline */}
          <div className="absolute right-[7%] top-[8%] h-[42%] w-[30%] overflow-hidden rounded-lg border-4 border-[#1e293b] bg-gradient-to-b from-[#16264a] to-[#0c142b] shadow-[inset_0_0_24px_rgba(0,0,0,0.6)]">
            {/* Mond */}
            <div className="absolute right-[14%] top-[12%] h-5 w-5 rounded-full bg-[#e8e4d8] shadow-[0_0_14px_rgba(232,228,216,0.5)]" />
            {/* Sterne */}
            <div className="absolute left-[18%] top-[18%] h-0.5 w-0.5 rounded-full bg-white/70" />
            <div className="absolute left-[42%] top-[10%] h-0.5 w-0.5 rounded-full bg-white/50" />
            <div className="absolute left-[64%] top-[26%] h-0.5 w-0.5 rounded-full bg-white/60" />
            {/* Skyline */}
            <div className="absolute bottom-0 flex w-full items-end justify-around">
              {SKYLINE.map((h, i) => (
                <div key={i} className="relative w-[10%] bg-[#0a1020]" style={{ height: `${h}px` }}>
                  <div className="absolute left-1 top-1.5 h-1 w-1 bg-amber-200/60" />
                  <div className="absolute right-1 top-4 h-1 w-1 bg-amber-200/40" />
                  {h > 50 && <div className="absolute left-1 top-7 h-1 w-1 bg-amber-200/30" />}
                </div>
              ))}
            </div>
            {/* Fensterkreuz */}
            <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-[#1e293b]" />
            <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-[#1e293b]" />
          </div>

          {/* Regal mit Büchern + Pflanze (links oben) */}
          <div className="absolute left-[6%] top-[14%] w-[20%]">
            <div className="flex items-end gap-1 px-2">
              <div className="h-9 w-2.5 rounded-sm bg-[#7c3aed]/70" />
              <div className="h-7 w-2.5 rounded-sm bg-[#0ea5e9]/70" />
              <div className="h-10 w-2.5 rounded-sm bg-[#f59e0b]/70" />
              <div className="h-8 w-2.5 rounded-sm bg-[#10b981]/70" />
              <span className="ml-1 text-base leading-none">🪴</span>
            </div>
            <div className="mt-0.5 h-1.5 w-full rounded-sm bg-[#3b2f23]" />
          </div>

          {/* PixelWerk-Poster */}
          <div className="absolute left-[8%] top-[42%] flex h-[16%] w-[13%] items-center justify-center rounded-sm border border-white/10 bg-[#101a30]">
            <p className="text-center text-[7px] font-black tracking-widest text-cyan-300/80 md:text-[9px]">PIXEL<br />WERK</p>
          </div>

          {/* Schreibtischplatte */}
          <div className="absolute bottom-[16%] left-[4%] right-[4%]">
            <div className="h-2.5 w-full rounded-sm bg-gradient-to-b from-[#4a3826] to-[#33271a] shadow-lg" />
            <div className="mx-[6%] flex justify-between">
              <div className="h-14 w-2 bg-[#2a2015] md:h-20" />
              <div className="h-14 w-2 bg-[#2a2015] md:h-20" />
            </div>
          </div>

          {/* Haupt-Monitor mit Code — links, damit NuVion ihn nicht verdeckt */}
          <div className="absolute bottom-[22%] left-[20%] w-[32%]">
            <div className="relative h-[110px] w-full overflow-hidden rounded-md border-4 border-[#1b1f2a] bg-[rgba(2,8,16,0.92)] shadow-[0_0_30px_rgba(56,189,248,0.12),inset_0_0_18px_rgba(0,0,0,0.8)] md:h-[150px]">
              {codeScreen}
            </div>
            {/* Standfuß */}
            <div className="mx-auto h-3 w-3 bg-[#1b1f2a]" />
            <div className="mx-auto h-1.5 w-16 rounded-sm bg-[#1b1f2a]" />
          </div>

          {/* Laptop rechts auf dem Tisch */}
          <div className="absolute bottom-[19.5%] right-[9%] w-[14%]">
            <div className="h-8 w-full rounded-t-sm border-2 border-[#222a38] bg-gradient-to-b from-[#0e2233] to-[#081420] md:h-11">
              <div className="mx-1.5 mt-1.5 h-1 rounded-full bg-cyan-400/30" />
              <div className="mx-1.5 mt-1 h-1 w-2/3 rounded-full bg-cyan-400/20" />
            </div>
            <div className="h-1 w-full rounded-b-sm bg-[#222a38]" />
          </div>

          {/* Kaffee links auf dem Tisch */}
          <span className="absolute bottom-[20%] left-[13%] text-lg md:text-xl">☕</span>

          {/* Ambient-Licht vom Monitor */}
          <div className="pointer-events-none absolute bottom-[10%] left-[16%] h-[40%] w-[44%] rounded-full bg-cyan-400/5 blur-2xl" />
        </div>
      )}

      {/* Dark overlay — bleibt dunkel, liegt über der Szene */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* NuVion + click button */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
        {/* NuVion floating */}
        <motion.div
          className="mb-4 flex flex-col items-center select-none pointer-events-none"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/60 bg-card/90 shadow-lg shadow-accent/10">
            <span className="text-2xl font-black text-accent">N</span>
            <div className="absolute bottom-3 flex gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
            {/* Azubi-NuVion trägt ein Headset */}
            {scene === "azubi" && (
              <div className="absolute -top-1.5 left-1/2 h-3 w-10 -translate-x-1/2 rounded-t-full border-2 border-accent/50 border-b-0" />
            )}
          </div>
          <div className="mt-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
            NuVion
          </div>
        </motion.div>

        {/* Click button */}
        <button onClick={handleClick} disabled={depleted} className="relative">
          <motion.div
            animate={clicking ? { scale: 0.93 } : { scale: 1 }}
            transition={{ duration: 0.12 }}
            className={`rounded-2xl px-8 py-4 font-black text-base tracking-wide shadow-lg transition-shadow
              ${depleted
                ? "cursor-not-allowed bg-white/10 text-white/30"
                : "bg-accent text-accent-foreground shadow-accent/30 hover:shadow-accent/50"
              }`}
          >
            {depleted ? "Kein Fokus…" : `Code lernen  +${knowledgePerClick}`}
          </motion.div>
        </button>

        {depleted && (
          <p className="mt-2 text-[11px] text-white/70">Fokus regeneriert sich automatisch</p>
        )}
      </div>

      {/* Floating +1 */}
      <AnimatePresence>
        {floaters.map((f) => (
          <motion.span
            key={f.id}
            initial={{ opacity: 1, y: f.y, x: f.x - 16, scale: 1 }}
            animate={{ opacity: 0, y: f.y - 50, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pointer-events-none absolute text-lg font-black text-accent drop-shadow-lg"
            style={{ top: 0, left: 0 }}
          >
            +{knowledgePerClick}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ClickArea;
