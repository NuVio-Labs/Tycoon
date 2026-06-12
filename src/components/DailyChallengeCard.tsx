import { motion } from "framer-motion";
import type { DailyChallenge } from "../types/challenge";

type Props = {
  challenge: DailyChallenge | null;
  onClaim: () => void;
};

function DailyChallengeCard({ challenge, onClaim }: Props) {
  if (!challenge) return null;

  const pct = Math.min((challenge.current / challenge.required) * 100, 100);
  const done = challenge.current >= challenge.required;
  const claimed = challenge.claimed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 ${
        claimed
          ? "border-accent/20 bg-accent/5"
          : done
          ? "border-accent/50 bg-accent/8 shadow-lg shadow-accent/10"
          : "border-overlay/8 bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <p className="text-[9px] font-semibold tracking-[0.2em] text-accent">TAGES-CHALLENGE</p>
          </div>
          <p className="mt-1 text-sm font-bold leading-snug">{challenge.label}</p>
          <div className="mt-2.5 space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-overlay/10">
              <motion.div
                className="h-full rounded-full bg-accent"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-muted">
              <span>{challenge.current.toLocaleString("de-DE")} / {challenge.required.toLocaleString("de-DE")}</span>
              <span className="text-accent font-semibold">+{challenge.rewardXP} XP</span>
            </div>
          </div>
        </div>

        {/* Claim button */}
        <div className="shrink-0 mt-1">
          {claimed ? (
            <span className="text-xs font-bold text-accent">✓ Erledigt</span>
          ) : done ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClaim}
              className="rounded-xl bg-accent px-3 py-2 text-xs font-black text-accent-foreground shadow-lg shadow-accent/30"
            >
              Abholen!
            </motion.button>
          ) : (
            <span className="text-xs text-muted/50 font-semibold">{Math.round(pct)}%</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default DailyChallengeCard;
