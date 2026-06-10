import { motion } from "framer-motion";
import kinderzimmerBg from "../assets/Kinderzimmer background.png";

type Epoche = {
  nr: number;
  title: string;
  subtitle: string;
  bullets: string[];
  image: string | null;
  gradient: string;
  unlocked: boolean;
};

const EPOCHEN: Epoche[] = [
  {
    nr: 1,
    title: "Kinderzimmer",
    subtitle: "Der Anfang",
    bullets: ["Erster Computer", "Nur die Grundlagen", "Große Träume"],
    image: kinderzimmerBg,
    gradient: "from-amber-900/60 to-[#050505]",
    unlocked: true,
  },
  {
    nr: 2,
    title: "Azubi-Zimmer",
    subtitle: "Lernen & Wachsen",
    bullets: ["Neue Technologien", "Erste Tools", "Git & GitHub"],
    image: null,
    gradient: "from-blue-900/60 to-[#050505]",
    unlocked: false,
  },
  {
    nr: 3,
    title: "Freelancer Home-Office",
    subtitle: "Erste eigene Projekte",
    bullets: ["Erste Kunden", "Geld verdienen", "Reputation aufbauen"],
    image: null,
    gradient: "from-emerald-900/60 to-[#050505]",
    unlocked: false,
  },
  {
    nr: 4,
    title: "Agentur",
    subtitle: "Teams & Prozesse",
    bullets: ["Mitarbeiter einstellen", "Größere Projekte", "Marketing & Vertrieb"],
    image: null,
    gradient: "from-purple-900/60 to-[#050505]",
    unlocked: false,
  },
  {
    nr: 5,
    title: "SaaS Unternehmen",
    subtitle: "Produkte & Skalierung",
    bullets: ["Eigene SaaS Produkte", "Abonnenten & Umsatz", "Automatisierung"],
    image: null,
    gradient: "from-rose-900/60 to-[#050505]",
    unlocked: false,
  },
  {
    nr: 6,
    title: "Tech-Konzern",
    subtitle: "Global & Innovativ",
    bullets: ["Globale Standorte", "KI & Innovation", "Die Zukunft gestalten"],
    image: null,
    gradient: "from-cyan-900/60 to-[#050505]",
    unlocked: false,
  },
];

type EpochenGridProps = {
  currentEpoch: number;
  onEnter: (nr: number) => void;
};

function EpochenGrid({ currentEpoch, onEnter }: EpochenGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {EPOCHEN.map((epoche, i) => {
        const isActive = epoche.nr === currentEpoch;
        const isLocked = !epoche.unlocked && epoche.nr > currentEpoch;

        return (
          <motion.div
            key={epoche.nr}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => epoche.unlocked && onEnter(epoche.nr)}
            className={`group relative overflow-hidden rounded-2xl border transition-all
              ${isActive
                ? "border-[#E0B84A]/50 shadow-lg shadow-[#E0B84A]/10"
                : isLocked
                  ? "border-white/5 opacity-50"
                  : "border-white/10 hover:border-[#E0B84A]/30"
              }
              ${epoche.unlocked ? "cursor-pointer" : "cursor-default"}`}
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
                <div className={`h-full w-full bg-gradient-to-br ${epoche.gradient} bg-[#111111]`} />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />

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
                <span className="text-[10px] font-black tracking-[0.2em] text-[#B9B2A3]">
                  {epoche.nr}. {epoche.title.toUpperCase()}
                </span>
                <p className="text-[9px] text-[#B9B2A3]/70">{epoche.subtitle}</p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-[#0e0e0e] px-4 py-3">
              <ul className="space-y-1">
                {epoche.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-[#B9B2A3]">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-[#E0B84A]/60" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between">
                {isActive && (
                  <span className="text-[9px] font-semibold text-[#E0B84A]">● AKTIV</span>
                )}
                <button
                  disabled={isLocked}
                  onClick={(e) => { e.stopPropagation(); epoche.unlocked && onEnter(epoche.nr); }}
                  className={`ml-auto rounded-xl px-4 py-1.5 text-xs font-black tracking-wide transition-all
                    ${isLocked
                      ? "bg-white/5 text-white/20"
                      : isActive
                        ? "bg-[#E0B84A] text-[#050505] hover:scale-105"
                        : "border border-[#E0B84A]/30 text-[#E0B84A] hover:bg-[#E0B84A]/10"
                    }`}
                >
                  {isLocked ? "Gesperrt" : isActive ? `Epoche ${epoche.nr}` : `Epoche ${epoche.nr}`}
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
