import { Brain, Star, Zap } from "lucide-react";

export type ActiveGoalData = {
  label: string;       // e.g. "HTML" or "Projekt: Homepage"
  current: number;
  required: number;
};

type TopBarProps = {
  knowledge: number;
  experience: number;
  focus: number;
  maxFocus: number;
  knowledgePerClick: number;
  activeGoal: ActiveGoalData;
  goalProgress: number; // 0-100 overall epoch progress for the ring
};

function TopBar({ knowledge, experience, focus, maxFocus, knowledgePerClick, activeGoal, goalProgress }: TopBarProps) {
  const focusPercent = Math.round((focus / maxFocus) * 100);

  // SVG circle progress ring
  const r = 16;
  const circ = 2 * Math.PI * r;
  const dash = circ - (goalProgress / 100) * circ;

  return (
    <header className="flex items-center gap-2">
      {/* Logo */}
      <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-accent/20 bg-card px-3 py-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-black text-accent-foreground text-lg">
          N
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-black leading-none tracking-tight">NuVio</p>
          <p className="text-[9px] font-semibold tracking-[0.2em] text-muted">TYCOON</p>
        </div>
      </div>

      {/* NuVion Avatar */}
      <div className="hidden md:flex shrink-0 items-center gap-2 rounded-2xl border border-accent/20 bg-card px-3 py-2.5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent/50 bg-card-2">
          <span className="text-base font-black text-accent">N</span>
          <div className="absolute bottom-1.5 flex gap-1">
            <div className="h-1 w-1 rounded-full bg-accent" />
            <div className="h-1 w-1 rounded-full bg-accent" />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold leading-none">NuVion</p>
          <p className="text-[9px] text-muted">v0.2.0</p>
        </div>
      </div>

      {/* Ressourcen — flex-1 aufteilen */}
      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* Wissen */}
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-accent/20 bg-card px-3 py-2.5">
          <Brain size={14} className="shrink-0 text-accent" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[9px] font-semibold tracking-[0.15em] text-muted">WISSEN</p>
              {knowledgePerClick > 1 && (
                <span className="text-[8px] font-bold text-accent/70">+{knowledgePerClick}/Klick</span>
              )}
            </div>
            <p className="truncate text-base font-black text-accent leading-none">{knowledge.toLocaleString("de-DE")}</p>
          </div>
        </div>

        {/* Erfahrung */}
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-accent/20 bg-card px-3 py-2.5">
          <Star size={14} className="shrink-0 text-accent" />
          <div className="min-w-0">
            <p className="text-[9px] font-semibold tracking-[0.15em] text-muted">ERFAHRUNG</p>
            <p className="truncate text-base font-black leading-none">{experience.toLocaleString("de-DE")}</p>
          </div>
        </div>

        {/* Fokus */}
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-accent/20 bg-card px-3 py-2.5">
          <Zap size={14} className="shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold tracking-[0.15em] text-muted">FOKUS</p>
              <p className="text-[9px] text-muted">{focus}/{maxFocus}</p>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-overlay/10">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${focusPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aktives Ziel */}
      <div className="hidden lg:flex shrink-0 items-center gap-3 rounded-2xl border border-accent/20 bg-card px-3 py-2.5 min-w-[180px]">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-semibold tracking-[0.15em] text-accent">AKTIVES ZIEL</p>
          <p className="mt-0.5 truncate text-sm font-bold leading-none">{activeGoal.label}</p>
          {activeGoal.required > 0 && (
            <div className="mt-1.5 space-y-0.5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-overlay/10">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${Math.min((activeGoal.current / activeGoal.required) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-muted/60">
                <span>Lv.{activeGoal.current}</span>
                <span>Lv.{activeGoal.required}</span>
              </div>
            </div>
          )}
        </div>
        {/* Overall epoch ring */}
        <div className="relative shrink-0 h-10 w-10">
          <svg width="40" height="40" className="-rotate-90">
            <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" className="text-overlay/10" strokeWidth="3" />
            <circle
              cx="20" cy="20" r={r}
              fill="none"
              stroke="currentColor"
              className="text-accent"
              strokeWidth="3"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-foreground">
            {goalProgress}%
          </span>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
