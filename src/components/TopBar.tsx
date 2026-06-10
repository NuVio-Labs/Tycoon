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
  activeGoal: ActiveGoalData;
  goalProgress: number; // 0-100 overall epoch progress for the ring
};

function TopBar({ knowledge, experience, focus, maxFocus, activeGoal, goalProgress }: TopBarProps) {
  const focusPercent = Math.round((focus / maxFocus) * 100);

  // SVG circle progress ring
  const r = 16;
  const circ = 2 * Math.PI * r;
  const dash = circ - (goalProgress / 100) * circ;

  return (
    <header className="flex items-center gap-2">
      {/* Logo */}
      <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-[#E0B84A]/20 bg-[#111111] px-3 py-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0B84A] font-black text-black text-lg">
          N
        </div>
        <div>
          <p className="text-sm font-black leading-none tracking-tight">NuVio</p>
          <p className="text-[9px] font-semibold tracking-[0.2em] text-[#B9B2A3]">TYCOON</p>
        </div>
      </div>

      {/* NuVion Avatar */}
      <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-[#E0B84A]/20 bg-[#111111] px-3 py-2.5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#E0B84A]/50 bg-[#1A1A1A]">
          <span className="text-base font-black text-[#E0B84A]">N</span>
          <div className="absolute bottom-1.5 flex gap-1">
            <div className="h-1 w-1 rounded-full bg-[#E0B84A]" />
            <div className="h-1 w-1 rounded-full bg-[#E0B84A]" />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold leading-none">NuVion</p>
          <p className="text-[9px] text-[#B9B2A3]">v0.1.0</p>
        </div>
      </div>

      {/* Ressourcen — flex-1 aufteilen */}
      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* Wissen */}
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#E0B84A]/20 bg-[#111111] px-3 py-2.5">
          <Brain size={14} className="shrink-0 text-[#E0B84A]" />
          <div className="min-w-0">
            <p className="text-[9px] font-semibold tracking-[0.15em] text-[#B9B2A3]">WISSEN</p>
            <p className="truncate text-base font-black text-[#E0B84A] leading-none">{knowledge.toLocaleString("de-DE")}</p>
          </div>
        </div>

        {/* Erfahrung */}
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#E0B84A]/20 bg-[#111111] px-3 py-2.5">
          <Star size={14} className="shrink-0 text-[#E0B84A]" />
          <div className="min-w-0">
            <p className="text-[9px] font-semibold tracking-[0.15em] text-[#B9B2A3]">ERFAHRUNG</p>
            <p className="truncate text-base font-black leading-none">{experience.toLocaleString("de-DE")}</p>
          </div>
        </div>

        {/* Fokus */}
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#E0B84A]/20 bg-[#111111] px-3 py-2.5">
          <Zap size={14} className="shrink-0 text-[#E0B84A]" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold tracking-[0.15em] text-[#B9B2A3]">FOKUS</p>
              <p className="text-[9px] text-[#B9B2A3]">{focus}/{maxFocus}</p>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#E0B84A] transition-all duration-300"
                style={{ width: `${focusPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aktives Ziel */}
      <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#E0B84A]/20 bg-[#111111] px-3 py-2.5 min-w-[180px]">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-semibold tracking-[0.15em] text-[#E0B84A]">AKTIVES ZIEL</p>
          <p className="mt-0.5 truncate text-sm font-bold leading-none">{activeGoal.label}</p>
          {activeGoal.required > 0 && (
            <div className="mt-1.5 space-y-0.5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#E0B84A] transition-all duration-500"
                  style={{ width: `${Math.min((activeGoal.current / activeGoal.required) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-[#B9B2A3]/60">
                <span>Lv.{activeGoal.current}</span>
                <span>Lv.{activeGoal.required}</span>
              </div>
            </div>
          )}
        </div>
        {/* Overall epoch ring */}
        <div className="relative shrink-0 h-10 w-10">
          <svg width="40" height="40" className="-rotate-90">
            <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle
              cx="20" cy="20" r={r}
              fill="none"
              stroke="#E0B84A"
              strokeWidth="3"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-[#F5F3EE]">
            {goalProgress}%
          </span>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
