import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import backgroundPng from "../assets/Kinderzimmer background.png";

type FloatingNumber = {
  id: number;
  x: number;
  y: number;
};

type ClickAreaProps = {
  focus: number;
  onLearnCode: () => void;
};

let nextId = 0;

// Pool of HTML/CSS/JS snippets that appear on screen
const CODE_LINES = [
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

function ClickArea({ focus, onLearnCode }: ClickAreaProps) {
  const [floaters, setFloaters] = useState<FloatingNumber[]>([]);
  const [clicking, setClicking] = useState(false);
  const [codeLines, setCodeLines] = useState<{ id: number; line: typeof CODE_LINES[0] }[]>([]);
  const codeRef = useRef<HTMLDivElement>(null);
  const lineCounter = useRef(0);

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

      const line = CODE_LINES[lineCounter.current % CODE_LINES.length];
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
    [focus, onLearnCode]
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

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-[#E0B84A]/15 shadow-2xl">
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
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-[#050505]/20 to-transparent" />

      {/* NuVion + click button */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
        {/* NuVion floating */}
        <motion.div
          className="mb-4 flex flex-col items-center select-none pointer-events-none"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#E0B84A]/60 bg-[#111111]/90 shadow-lg shadow-[#E0B84A]/10">
            <span className="text-2xl font-black text-[#E0B84A]">N</span>
            <div className="absolute bottom-3 flex gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#E0B84A]" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#E0B84A]" />
            </div>
          </div>
          <div className="mt-1 rounded-full bg-[#E0B84A]/10 px-2 py-0.5 text-[10px] font-semibold text-[#E0B84A]">
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
                : "bg-[#E0B84A] text-[#050505] shadow-[#E0B84A]/30 hover:shadow-[#E0B84A]/50"
              }`}
          >
            {depleted ? "Kein Fokus…" : "Code lernen  +1"}
          </motion.div>
        </button>

        {depleted && (
          <p className="mt-2 text-[11px] text-[#B9B2A3]">Fokus regeneriert sich automatisch</p>
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
            className="pointer-events-none absolute text-lg font-black text-[#E0B84A] drop-shadow-lg"
            style={{ top: 0, left: 0 }}
          >
            +1
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ClickArea;
