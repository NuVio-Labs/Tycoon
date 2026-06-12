import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { achievements } from "../data/achievements";

// Epoche 3 — Teaser-Seite nach dem Abschluss von Epoche 2.
// Das Freelancer-Gameplay kommt in Stage 3.
function FreelancerTeaser() {
  const resources = useGameStore((s) => s.resources);
  const completedProjects = useGameStore((s) => s.completedProjects);
  const kernelPoints = useGameStore((s) => s.kernelPoints);
  const stats = useGameStore((s) => s.stats);
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);
  const setEpoch = useGameStore((s) => s.setEpoch);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-10 text-center text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex w-full max-w-lg flex-col items-center gap-6"
      >
        {/* Hero */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-accent/20">
          <div className="h-44 w-full bg-gradient-to-br from-emerald-900/60 to-black" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl"
            >
              💻
            </motion.span>
            <p className="text-[10px] font-black tracking-[0.3em] text-neutral-300">EPOCHE 3</p>
            <h1 className="text-2xl font-black text-white">Freelancer Home-Office</h1>
          </div>
        </div>

        <div>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[11px] font-bold text-accent">
            🚧 In Entwicklung — kommt im nächsten Update
          </span>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            Ausbildung geschafft — jetzt wird's ernst! Als Freelancer warten echte
            Kunden, echtes Geld und echte Verantwortung. Eigene Projekte, Rechnungen
            schreiben, Reputation aufbauen.
          </p>
        </div>

        {/* Bilanz */}
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "ERFAHRUNG", value: resources.experience.toLocaleString("de-DE"), accent: true },
            { label: "AUFTRÄGE", value: String(completedProjects), accent: false },
            { label: "KERNEL-PUNKTE", value: `${kernelPoints} KP`, accent: true },
            { label: "ERFOLGE", value: `${unlockedAchievements.length}/${achievements.length}`, accent: false },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-accent/20 bg-card p-4">
              <p className="text-[9px] text-muted">{s.label}</p>
              <p className={`mt-1 text-lg font-black ${s.accent ? "text-accent" : "text-foreground"}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-muted/60">
          Spielzeit bisher: {Math.floor(stats.playSeconds / 60).toLocaleString("de-DE")} Minuten ·
          Klicks: {stats.totalClicks.toLocaleString("de-DE")}
        </p>

        {/* Zurück ins freie Spiel */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setEpoch("azubi")}
          className="rounded-2xl bg-accent px-8 py-3.5 text-sm font-black text-accent-foreground shadow-lg shadow-accent/20"
        >
          ← Zurück ins Azubi-Zimmer (freies Spiel)
        </motion.button>
        <p className="-mt-3 text-[10px] text-muted/50">
          Du kannst weiter Aufträge wiederholen, Erfolge sammeln und Kernel-Upgrades freischalten.
        </p>
      </motion.div>
    </main>
  );
}

export default FreelancerTeaser;
