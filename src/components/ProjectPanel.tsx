import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Project } from "../types/project";
import type { Skill } from "../types/skill";

type ProjectPanelProps = {
  activeProject: Project | null;
  skills: Skill[];
  successChance: number;
  onGenerate: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onGraduationComplete: () => void;
};

function chanceBadgeColor(chance: number) {
  if (chance >= 80) return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
  if (chance >= 50) return "text-accent border-accent/30 bg-accent/10";
  return "text-red-400 border-red-400/30 bg-red-400/10";
}

function ProjectPanel({ activeProject, skills, successChance, onGenerate, onAccept, onDecline, onGraduationComplete }: ProjectPanelProps) {
  const [graduationRunning, setGraduationRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const duration = activeProject?.durationSeconds ?? 90;

  // Reset timer state when project changes
  useEffect(() => {
    setGraduationRunning(false);
    setTimeLeft(activeProject?.durationSeconds ?? 90);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  }, [activeProject?.id]);

  const startGraduation = () => {
    setGraduationRunning(true);
    setTimeLeft(duration);
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalRef.current!);
          setGraduationRunning(false);
          onGraduationComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const progress = graduationRunning ? ((duration - timeLeft) / duration) * 100 : 0;

  if (!activeProject) {
    return (
      <div className="space-y-3">
        <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">Auftragseingang</h2>
        <div className="rounded-2xl border border-overlay/8 bg-card p-6 text-center">
          <p className="text-muted text-sm">Keine neuen Aufträge verfügbar.</p>
          <p className="mt-1 text-xs text-muted/60">Alle Aufträge abgeschlossen!</p>
        </div>
      </div>
    );
  }

  const isGrad = !!activeProject.isGraduation;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">
          {isGrad ? "🎓 Abschlussauftrag" : "Auftragseingang"}
        </h2>
        {!isGrad && (
          <button
            onClick={onGenerate}
            className="rounded-lg border border-overlay/10 px-2.5 py-1 text-[11px] text-muted hover:border-accent/30 hover:text-accent transition-colors"
          >
            Neuer Auftrag
          </button>
        )}
      </div>

      <motion.div
        key={activeProject.id}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`rounded-2xl border p-4 space-y-4 ${
          isGrad
            ? "border-accent/40 bg-gradient-to-br from-accent/10 to-card"
            : "border-overlay/8 bg-card"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold">{activeProject.name}</p>
              {activeProject.completed && (
                <span className="rounded-md bg-overlay/8 px-1.5 py-0.5 text-[9px] font-semibold text-muted">
                  Wiederholungsauftrag · ¼ XP
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">{activeProject.description}</p>
          </div>
          {!isGrad && (
            <span className={`shrink-0 rounded-lg border px-2 py-1 text-xs font-bold ${chanceBadgeColor(successChance)}`}>
              {successChance}%
            </span>
          )}
        </div>

        {/* Graduation timer */}
        {isGrad && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted">
              <span>{graduationRunning ? "Auftrag läuft…" : "Auftragsdauer"}</span>
              <span className={`font-black ${graduationRunning ? "text-accent" : ""}`}>
                {graduationRunning
                  ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`
                  : `${duration}s`}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-overlay/10">
              <motion.div
                className="h-full rounded-full bg-accent"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "linear" }}
              />
            </div>
          </div>
        )}

        {/* Success bar for normal projects */}
        {!isGrad && (
          <div>
            <div className="mb-1 flex justify-between text-[10px] text-muted">
              <span>Erfolgschance</span>
              <span>{successChance}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-overlay/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${successChance}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  successChance >= 80 ? "bg-emerald-400" : successChance >= 50 ? "bg-accent" : "bg-red-400"
                }`}
              />
            </div>
          </div>
        )}

        {/* Requirements */}
        <div className="rounded-xl bg-overlay/4 p-3 space-y-2">
          <p className="text-[10px] font-semibold tracking-[0.15em] text-muted uppercase">Geforderte Skills</p>
          {activeProject.requirements.map((req) => {
            const skill = skills.find((s) => s.id === req.skillId);
            const met = (skill?.level ?? 0) >= req.requiredLevel;
            return (
              <div key={req.skillId} className="flex items-center justify-between text-sm">
                <span className={met ? "text-foreground" : "text-muted"}>{skill?.name ?? req.skillId}</span>
                <span className={`font-bold ${met ? "text-emerald-400" : "text-accent"}`}>
                  {skill?.level ?? 0} / {req.requiredLevel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Rewards — only XP */}
        <div className="rounded-xl bg-overlay/5 px-3 py-2 text-center text-xs">
          <p className="text-muted">Erfahrung</p>
          <p className="font-bold text-foreground">+{activeProject.rewards.experience} XP</p>
        </div>

        {/* Actions */}
        {isGrad ? (
          <button
            onClick={startGraduation}
            disabled={graduationRunning}
            className="w-full rounded-xl bg-accent py-3 text-sm font-black text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 transition-transform"
          >
            {graduationRunning ? "Auftrag läuft…" : "Abschlussauftrag starten"}
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onAccept}
              className="rounded-xl bg-accent py-3 text-sm font-black text-accent-foreground hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Annehmen
            </button>
            <button
              onClick={onDecline}
              className="rounded-xl border border-overlay/15 py-3 text-sm font-semibold text-foreground hover:border-overlay/30 transition-colors"
            >
              Ablehnen
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ProjectPanel;
