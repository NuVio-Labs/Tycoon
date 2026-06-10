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
          ? "border-[#E0B84A]/20 bg-[#E0B84A]/5"
          : done
          ? "border-[#E0B84A]/50 bg-[#E0B84A]/8 shadow-lg shadow-[#E0B84A]/10"
          : "border-white/8 bg-[#111111]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <p className="text-[9px] font-semibold tracking-[0.2em] text-[#E0B84A]">TAGES-CHALLENGE</p>
          </div>
          <p className="mt-1 text-sm font-bold leading-snug">{challenge.label}</p>
          <div className="mt-2.5 space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-[#E0B84A]"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-[#B9B2A3]">
              <span>{challenge.current.toLocaleString("de-DE")} / {challenge.required.toLocaleString("de-DE")}</span>
              <span className="text-[#E0B84A] font-semibold">+{challenge.rewardXP} XP</span>
            </div>
          </div>
        </div>

        {/* Claim button */}
        <div className="shrink-0 mt-1">
          {claimed ? (
            <span className="text-xs font-bold text-[#E0B84A]">✓ Erledigt</span>
          ) : done ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClaim}
              className="rounded-xl bg-[#E0B84A] px-3 py-2 text-xs font-black text-[#050505] shadow-lg shadow-[#E0B84A]/30"
            >
              Abholen!
            </motion.button>
          ) : (
            <span className="text-xs text-[#B9B2A3]/50 font-semibold">{Math.round(pct)}%</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default DailyChallengeCard;
