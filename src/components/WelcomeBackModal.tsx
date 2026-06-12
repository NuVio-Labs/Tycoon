import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";

function formatAway(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d} Tag${d > 1 ? "e" : ""} ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} Minute${m !== 1 ? "n" : ""}`;
}

function WelcomeBackModal() {
  const welcomeBack = useGameStore((s) => s.welcomeBack);
  const dismissWelcomeBack = useGameStore((s) => s.dismissWelcomeBack);

  if (!welcomeBack) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      onClick={dismissWelcomeBack}
    >
      <motion.div
        initial={{ scale: 0.9, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-accent/30 bg-card p-6 text-center shadow-2xl shadow-accent/10"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/50 bg-card-2 text-3xl">
          👋
        </div>
        <p className="mt-4 text-xs font-semibold tracking-[0.25em] text-accent">WILLKOMMEN ZURÜCK</p>
        <h2 className="mt-1 text-xl font-black text-foreground">
          Du warst {formatAway(welcomeBack.awaySeconds)} weg
        </h2>
        <p className="mt-2 text-sm text-muted">
          NuVion hat sich in der Zwischenzeit ausgeruht:
        </p>
        <div className="mt-4 space-y-2">
          {welcomeBack.focusGained > 0 && (
            <div className="rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3">
              <p className="text-2xl font-black text-accent">⚡ +{welcomeBack.focusGained.toLocaleString("de-DE")} Fokus</p>
              <p className="mt-0.5 text-[11px] text-muted">regeneriert während deiner Abwesenheit</p>
            </div>
          )}
          {welcomeBack.knowledgeGained > 0 && (
            <div className="rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3">
              <p className="text-2xl font-black text-accent">🤖 +{welcomeBack.knowledgeGained.toLocaleString("de-DE")} Wissen</p>
              <p className="mt-0.5 text-[11px] text-muted">vom Auto-Compiler gesammelt</p>
            </div>
          )}
        </div>
        <button
          onClick={dismissWelcomeBack}
          className="mt-5 w-full rounded-2xl bg-accent py-3 text-sm font-black text-accent-foreground transition-transform hover:scale-[1.02] active:scale-95"
        >
          Weiter geht's!
        </button>
      </motion.div>
    </motion.div>
  );
}

export default WelcomeBackModal;
