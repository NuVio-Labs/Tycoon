import { motion } from "framer-motion";
import type { Skill, SkillId } from "../types/skill";

type SkillPanelProps = {
  skills: Skill[];
  // Bereits gemeisterte Skills aus früheren Epochen (kompakt angezeigt)
  masteredSkills?: Skill[];
  knowledge: number;
  getSkillCost: (id: SkillId) => number;
  onBuy: (id: SkillId) => void;
};

const SKILL_ICONS: Record<string, string> = {
  html: "🏗️",
  css: "🎨",
  javascript: "⚡",
  git: "🌿",
  react: "⚛️",
  typescript: "🛡️",
};

const SKILL_COLORS: Record<string, string> = {
  html: "from-orange-500 to-accent",
  css: "from-blue-500 to-cyan-400",
  javascript: "from-yellow-400 to-accent",
  git: "from-orange-500 to-red-400",
  react: "from-cyan-400 to-blue-500",
  typescript: "from-blue-500 to-indigo-400",
};

const MILESTONES = [25, 50, 75, 100];

function SkillBar({ level, maxLevel, colorClass }: { level: number; maxLevel: number; colorClass: string }) {
  const pct = (level / maxLevel) * 100;

  return (
    <div className="relative mt-2 h-3 w-full overflow-hidden rounded-full bg-overlay/10">
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

function SkillPanel({ skills, masteredSkills, knowledge, getSkillCost, onBuy }: SkillPanelProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">Skills</h2>

      {/* Gemeisterte Skills aus früheren Epochen — kompakt */}
      {masteredSkills && masteredSkills.length > 0 && (
        <div className="rounded-2xl border border-accent/15 bg-accent/4 px-4 py-3">
          <p className="text-[9px] font-semibold tracking-[0.2em] text-accent">GEMEISTERT — EPOCHE 1</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {masteredSkills.map((s) => (
              <span
                key={s.id}
                className="flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent"
              >
                {SKILL_ICONS[s.id] ?? "💡"} {s.name} ✓
              </span>
            ))}
          </div>
        </div>
      )}

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
            className="rounded-2xl border border-overlay/8 bg-card p-4"
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
                            <div key={idx} className="relative h-2.5 w-2 overflow-hidden rounded-sm bg-overlay/10">
                              {(filled || partial) && (
                                <div
                                  className={`absolute left-0 top-0 h-full bg-gradient-to-r ${SKILL_COLORS[skill.id] ?? "from-accent to-accent"}`}
                                  style={{ width: filled ? "100%" : `${fillPct}%` }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-[10px] font-semibold text-muted">Lv.{skill.level}</span>
                    </div>
                  </div>

                  <SkillBar
                    level={skill.level}
                    maxLevel={skill.maxLevel}
                    colorClass={SKILL_COLORS[skill.id] ?? "from-accent to-accent"}
                  />

                  {/* Milestone labels */}
                  <div className="relative mt-0.5 w-full">
                    {MILESTONES.map((m) => (
                      <span
                        key={m}
                        className={`absolute text-[8px] -translate-x-1/2 transition-colors ${
                          skill.level >= m ? "text-accent/60" : "text-foreground/20"
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
                    ? "bg-accent/20 text-accent cursor-default"
                    : canBuy
                      ? "bg-accent text-accent-foreground hover:scale-105 active:scale-95"
                      : "bg-overlay/8 text-foreground/30 cursor-not-allowed"
                  }`}
              >
                {maxed ? "MAX" : `${cost} W`}
              </button>
            </div>

            {!maxed && (
              <p className="mt-2 text-[11px] text-muted">{skill.description}</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default SkillPanel;
