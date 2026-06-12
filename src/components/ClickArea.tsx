import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import backgroundPng from "../assets/Kinderzimmer background.png";
import azubiPng from "../assets/epoche2.png";

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
        <>
          {/* Azubi-Büro — eigenes Hintergrundbild */}
          <img
            src={azubiPng}
            alt="Azubi-Zimmer"
            className="block h-[340px] w-full object-cover object-center md:h-[420px]"
            draggable={false}
          />

          {/* Code-Overlay — über dem linken Monitor im Bild */}
          <div
            className="absolute overflow-hidden rounded-sm"
            style={{
              left: "26.5%",
              top: "24%",
              width: "19%",
              height: "34%",
              background: "rgba(2, 8, 16, 0.85)",
              boxShadow: "inset 0 0 18px rgba(0,0,0,0.8)",
            }}
          >
            {codeScreen}
          </div>
        </>
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
