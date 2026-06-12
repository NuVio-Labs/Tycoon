import { useState } from "react";
import StatCard from "./StatCard";
import { achievements } from "../data/achievements";
import type { Resources, GameStats } from "../types/game";

type EpochProgress = {
  label: string;
  done: number;  // einmalig geschaffte Aufträge (ohne Wiederholungen)
  total: number; // Anzahl normaler Aufträge der Epoche
};

type Props = {
  resources: Resources;
  completedProjects: number;
  failedProjects: number;
  declinedProjects: number;
  currentStreak: number;
  bestStreak: number;
  epochProgress: EpochProgress[];
  stats: GameStats;
  soundEnabled: boolean;
  unlockedAchievements: string[];
  onToggleSound: () => void;
  onReset: () => void;
};

function formatPlaytime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${seconds}s`;
}

function EinstellungenTab({
  resources, completedProjects, failedProjects, declinedProjects,
  currentStreak, bestStreak, epochProgress,
  stats, soundEnabled, unlockedAchievements, onToggleSound, onReset,
}: Props) {
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    onReset();
    setConfirming(false);
    localStorage.removeItem("nuvio-tycoon-save");
    window.location.reload();
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">Einstellungen</h2>

      {/* Sound */}
      <div className="rounded-2xl border border-overlay/8 bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold">Sound-Effekte</p>
            <p className="mt-0.5 text-xs text-muted">Klick-, Erfolgs- und Kauf-Sounds</p>
          </div>
          <button
            onClick={onToggleSound}
            role="switch"
            aria-checked={soundEnabled}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              soundEnabled ? "bg-accent" : "bg-overlay/15"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-card shadow-md transition-all ${
                soundEnabled ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Spielstand */}
      <div className="rounded-2xl border border-overlay/8 bg-card p-4 space-y-4">
        <div>
          <p className="text-sm font-bold">Spielstand</p>
          <p className="mt-0.5 text-xs text-muted">Wird automatisch gespeichert</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Wissen" value={resources.knowledge} accent icon="🧠" />
          <StatCard label="Erfahrung" value={resources.experience} icon="⭐" />
          <StatCard label="Aufträge ✓" value={completedProjects} accent icon="✅" />
          <StatCard label="Gescheitert" value={failedProjects} icon="❌" />
          <StatCard label="Abgelehnt" value={declinedProjects} icon="🚫" />
          <StatCard label="Best Streak" value={`${bestStreak} 🔥`} accent icon="🏆" />
        </div>
        {currentStreak >= 3 && (
          <p className="text-xs text-center text-accent font-semibold">Aktuelle Streak: {currentStreak} 🔥</p>
        )}

        {epochProgress.map((ep) => (
          <div key={ep.label} className="rounded-2xl border border-accent/15 p-4">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">{ep.label}</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-overlay/10">
              <div
                className="h-full rounded-full bg-accent/60 transition-all duration-500"
                style={{ width: `${Math.min((ep.done / ep.total) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-muted">{ep.done} / {ep.total} Aufträge</p>
          </div>
        ))}
      </div>

      {/* Statistiken */}
      <div className="rounded-2xl border border-overlay/8 bg-card p-4 space-y-3">
        <p className="text-sm font-bold">Statistiken</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: "Klicks gesamt", value: stats.totalClicks.toLocaleString("de-DE"), icon: "🖱️" },
            { label: "Wissen verdient", value: stats.totalKnowledge.toLocaleString("de-DE"), icon: "🧠" },
            { label: "XP verdient", value: stats.totalXP.toLocaleString("de-DE"), icon: "⭐" },
            { label: "Spielzeit", value: formatPlaytime(stats.playSeconds), icon: "⏱️" },
            { label: "Tages-Challenges", value: stats.dailiesClaimed.toLocaleString("de-DE"), icon: "📅" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between rounded-xl bg-overlay/4 px-3 py-2.5">
              <span className="text-[11px] text-muted">{row.icon} {row.label}</span>
              <span className="text-xs font-black text-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Erfolge */}
      <div className="rounded-2xl border border-overlay/8 bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Erfolge</p>
          <span className="text-xs font-bold text-accent">
            {unlockedAchievements.length} / {achievements.length}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-overlay/10">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {achievements.map((a) => {
            const unlocked = unlockedAchievements.includes(a.id);
            return (
              <div
                key={a.id}
                className={`flex items-start gap-2.5 rounded-xl border p-3 transition-colors ${
                  unlocked
                    ? "border-accent/25 bg-accent/5"
                    : "border-overlay/5 bg-overlay/4 opacity-50"
                }`}
              >
                <span className="text-lg shrink-0">{unlocked ? a.icon : "🔒"}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${unlocked ? "text-accent" : "text-muted"}`}>{a.name}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-muted">{a.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      <div className="rounded-2xl border border-red-500/20 bg-card p-4 space-y-3">
        <div>
          <p className="text-sm font-bold text-red-400">Spielstand zurücksetzen</p>
          <p className="mt-0.5 text-xs text-muted">Löscht alle Fortschritte unwiderruflich.</p>
        </div>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="w-full rounded-xl border border-red-500/30 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Zurücksetzen
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-center text-muted">Bist du sicher? Das kann nicht rückgängig gemacht werden.</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleReset}
                className="rounded-xl bg-red-500 py-2.5 text-sm font-black text-white hover:bg-red-600 transition-colors"
              >
                Ja, löschen
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded-xl border border-overlay/15 py-2.5 text-sm font-semibold text-foreground hover:border-overlay/30 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EinstellungenTab;
