import { motion } from "framer-motion";
import kinderzimmerBg from "../assets/Kinderzimmer background.png";

type Epoche = {
  nr: number;
  title: string;
  subtitle: string;
  bullets: string[];
  image: string | null;
  gradient: string;
};

const EPOCHEN: Epoche[] = [
  {
    nr: 1,
    title: "Kinderzimmer",
    subtitle: "Der Anfang",
    bullets: ["Erster Computer", "Nur die Grundlagen", "Große Träume"],
    image: kinderzimmerBg,
    gradient: "from-amber-900/60 to-black",
  },
  {
    nr: 2,
    title: "Azubi-Zimmer",
    subtitle: "Lernen & Wachsen",
    bullets: ["Neue Technologien", "Erste Tools", "Git & GitHub"],
    image: null,
    gradient: "from-blue-900/60 to-black",
  },
  {
    nr: 3,
    title: "Freelancer Home-Office",
    subtitle: "Erste eigene Projekte",
    bullets: ["Erste Kunden", "Geld verdienen", "Reputation aufbauen"],
    image: null,
    gradient: "from-emerald-900/60 to-black",
  },
  {
    nr: 4,
    title: "Agentur",
    subtitle: "Teams & Prozesse",
    bullets: ["Mitarbeiter einstellen", "Größere Projekte", "Marketing & Vertrieb"],
    image: null,
    gradient: "from-purple-900/60 to-black",
  },
  {
    nr: 5,
    title: "SaaS Unternehmen",
    subtitle: "Produkte & Skalierung",
    bullets: ["Eigene SaaS Produkte", "Abonnenten & Umsatz", "Automatisierung"],
    image: null,
    gradient: "from-rose-900/60 to-black",
  },
  {
    nr: 6,
    title: "Tech-Konzern",
    subtitle: "Global & Innovativ",
    bullets: ["Globale Standorte", "KI & Innovation", "Die Zukunft gestalten"],
    image: null,
    gradient: "from-cyan-900/60 to-black",
  },
];

type EpochenGridProps = {
  currentEpoch: number;     // aktive Epoche (1-basiert)
  maxUnlocked: number;      // höchste freigeschaltete Epoche
  onEnter: (nr: number) => void;
};

function EpochenGrid({ currentEpoch, maxUnlocked, onEnter }: EpochenGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {EPOCHEN.map((epoche, i) => {
        const isActive = epoche.nr === currentEpoch;
        const unlocked = epoche.nr <= maxUnlocked;
        const isLocked = !unlocked;

        return (
          <motion.div
            key={epoche.nr}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => unlocked && onEnter(epoche.nr)}
            className={`group relative overflow-hidden rounded-2xl border transition-all
              ${isActive
                ? "border-accent/50 shadow-lg shadow-accent/10"
                : isLocked
                  ? "border-overlay/5 opacity-50"
                  : "border-overlay/10 hover:border-accent/30"
              }
              ${unlocked ? "cursor-pointer" : "cursor-default"}`}
          >
            {/* Background image or gradient */}
            <div className="relative h-40 w-full overflow-hidden">
              {epoche.image ? (
                <img
                  src={epoche.image}
                  alt={epoche.title}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${epoche.gradient} bg-neutral-900`} />
              )}
              {/* Overlay — bleibt dunkel, liegt über Bild/Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Lock icon */}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-black/60 p-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B9B2A3" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Epoch number top-left */}
              <div className="absolute left-3 top-3">
                <span className="text-[10px] font-black tracking-[0.2em] text-neutral-300">
                  {epoche.nr}. {epoche.title.toUpperCase()}
                </span>
                <p className="text-[9px] text-neutral-400">{epoche.subtitle}</p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-card-2 px-4 py-3">
              <ul className="space-y-1">
                {epoche.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-muted">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between">
                {isActive && (
                  <span className="text-[9px] font-semibold text-accent">● AKTIV</span>
                )}
                <button
                  disabled={isLocked}
                  onClick={(e) => { e.stopPropagation(); unlocked && onEnter(epoche.nr); }}
                  className={`ml-auto rounded-xl px-4 py-1.5 text-xs font-black tracking-wide transition-all
                    ${isLocked
                      ? "bg-overlay/5 text-foreground/20"
                      : isActive
                        ? "bg-accent text-accent-foreground hover:scale-105"
                        : "border border-accent/30 text-accent hover:bg-accent/10"
                    }`}
                >
                  {isLocked ? "Gesperrt" : `Epoche ${epoche.nr}`}
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default EpochenGrid;
