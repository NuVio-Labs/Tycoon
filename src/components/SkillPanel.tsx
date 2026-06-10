import { motion } from "framer-motion";
import type { Skill, SkillId } from "../types/skill";

type SkillPanelProps = {
  skills: Skill[];
  knowledge: number;
  getSkillCost: (id: SkillId) => number;
  onBuy: (id: SkillId) => void;
};

const SKILL_ICONS: Record<string, string> = {
  html: "🏗️",
  css: "🎨",
  javascript: "⚡",
};

const SKILL_COLORS: Record<string, string> = {
  html: "from-orange-500 to-[#E0B84A]",
  css: "from-blue-500 to-cyan-400",
  javascript: "from-yellow-400 to-[#E0B84A]",
};

const MILESTONES = [25, 50, 75, 100];

function SkillBar({ level, maxLevel, colorClass }: { level: number; maxLevel: number; colorClass: string }) {
  const pct = (level / maxLevel) * 100;

  return (
    <div className="relative mt-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
      {/* Fill */}
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      {/* Milestone ticks */}
      {MILESTONES.slice(0, -1).map((m) => (
        <div
          key={m}
          className="absolute top-0 h-full w-px bg-black/40"
          style={{ left: `${m}%` }}
        />
      ))}
    </div>
  );
}

function SkillPanel({ skills, knowledge, getSkillCost, onBuy }: SkillPanelProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold tracking-[0.25em] text-[#B9B2A3] uppercase">Skills</h2>

      {skills.map((skill, i) => {
        const cost = getSkillCost(skill.id);
        const maxed = skill.level >= skill.maxLevel;
        const canBuy = !maxed && knowledge >= cost;
        const pct = Math.round((skill.level / skill.maxLevel) * 100);

        return (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/8 bg-[#111111] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-xl shrink-0">{SKILL_ICONS[skill.id] ?? "💡"}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm">{skill.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Visual fill indicator via colored blocks */}
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 10 }).map((_, idx) => {
                          const threshold = (idx + 1) * 10;
                          const filled = pct >= threshold;
                          const partial = !filled && pct > idx * 10;
                          const fillPct = partial ? ((pct - idx * 10) / 10) * 100 : 0;
                          return (
                            <div key={idx} className="relative h-2.5 w-2 overflow-hidden rounded-sm bg-white/10">
                              {(filled || partial) && (
                                <div
                                  className={`absolute left-0 top-0 h-full bg-gradient-to-r ${SKILL_COLORS[skill.id] ?? "from-[#E0B84A] to-[#E0B84A]"}`}
                                  style={{ width: filled ? "100%" : `${fillPct}%` }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-[10px] font-semibold text-[#B9B2A3]">Lv.{skill.level}</span>
                    </div>
                  </div>

                  <SkillBar
                    level={skill.level}
                    maxLevel={skill.maxLevel}
                    colorClass={SKILL_COLORS[skill.id] ?? "from-[#E0B84A] to-[#E0B84A]"}
                  />

                  {/* Milestone labels */}
                  <div className="relative mt-0.5 w-full">
                    {MILESTONES.map((m) => (
                      <span
                        key={m}
                        className={`absolute text-[8px] -translate-x-1/2 transition-colors ${
                          skill.level >= m ? "text-[#E0B84A]/60" : "text-white/20"
                        }`}
                        style={{ left: `${m}%` }}
                      >
                        {m === 100 ? "MAX" : m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onBuy(skill.id)}
                disabled={!canBuy}
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition-all ml-2
                  ${maxed
                    ? "bg-[#E0B84A]/20 text-[#E0B84A] cursor-default"
                    : canBuy
                      ? "bg-[#E0B84A] text-[#050505] hover:scale-105 active:scale-95"
                      : "bg-white/8 text-white/30 cursor-not-allowed"
                  }`}
              >
                {maxed ? "MAX" : `${cost} W`}
              </button>
            </div>

            {!maxed && (
              <p className="mt-2 text-[11px] text-[#B9B2A3]">{skill.description}</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default SkillPanel;
