import { useState } from "react";
import StatCard from "./StatCard";
import type { Resources } from "../types/game";

type Props = {
  resources: Resources;
  completedProjects: number;
  failedProjects: number;
  declinedProjects: number;
  currentStreak: number;
  bestStreak: number;
  onReset: () => void;
};

function EinstellungenTab({ resources, completedProjects, failedProjects, declinedProjects, currentStreak, bestStreak, onReset }: Props) {
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    onReset();
    setConfirming(false);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold tracking-[0.25em] text-[#B9B2A3] uppercase">Einstellungen</h2>

      <div className="rounded-2xl border border-white/8 bg-[#111111] p-4 space-y-4">
        <div>
          <p className="text-sm font-bold">Spielstand</p>
          <p className="mt-0.5 text-xs text-[#B9B2A3]">Wird automatisch gespeichert</p>
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
          <p className="text-xs text-center text-[#E0B84A] font-semibold">Aktuelle Streak: {currentStreak} 🔥</p>
        )}

        <div className="rounded-2xl border border-[#E0B84A]/15 p-4">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#B9B2A3] uppercase">Epoche 1 — Kinderzimmer</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#E0B84A]/60 transition-all duration-500"
              style={{ width: `${Math.min((completedProjects / 26) * 100, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-[#B9B2A3]">{completedProjects} / 26 Aufträge</p>
        </div>
      </div>

      {/* Reset */}
      <div className="rounded-2xl border border-red-500/20 bg-[#111111] p-4 space-y-3">
        <div>
          <p className="text-sm font-bold text-red-400">Spielstand zurücksetzen</p>
          <p className="mt-0.5 text-xs text-[#B9B2A3]">Löscht alle Fortschritte unwiderruflich.</p>
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
            <p className="text-xs text-center text-[#B9B2A3]">Bist du sicher? Das kann nicht rückgängig gemacht werden.</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleReset}
                className="rounded-xl bg-red-500 py-2.5 text-sm font-black text-white hover:bg-red-600 transition-colors"
              >
                Ja, löschen
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded-xl border border-white/15 py-2.5 text-sm font-semibold text-[#F5F3EE] hover:border-white/30 transition-colors"
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
