import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { achievements } from "../data/achievements";

function AchievementToast() {
  const achievementQueue = useGameStore((s) => s.achievementQueue);
  const shiftAchievement = useGameStore((s) => s.shiftAchievement);

  const currentId = achievementQueue[0];
  const achievement = achievements.find((a) => a.id === currentId);

  // Jeder Toast bleibt 3,5 Sekunden sichtbar
  useEffect(() => {
    if (!currentId) return;
    const t = window.setTimeout(shiftAchievement, 3500);
    return () => window.clearTimeout(t);
  }, [currentId, shiftAchievement]);

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-50 -translate-x-1/2">
      <AnimatePresence mode="wait">
        {achievement && (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-card/95 px-4 py-3 shadow-2xl shadow-accent/20 backdrop-blur-sm"
          >
            <span className="text-2xl">{achievement.icon}</span>
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] text-accent">ERFOLG FREIGESCHALTET</p>
              <p className="text-sm font-bold text-foreground">{achievement.name}</p>
              <p className="text-[10px] text-muted">{achievement.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AchievementToast;
