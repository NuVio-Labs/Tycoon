import { motion } from "framer-motion";
import { kernelUpgrades } from "../data/kernelUpgrades";
import type { KernelEffectType } from "../types/kernel";

type Props = {
  kernelPoints: number;
  ownedKernelUpgrades: string[];
  onBuy: (id: string) => void;
};

const EFFECT_LABEL: Record<KernelEffectType, (v: number) => string> = {
  passiveKnowledge: (v) => `+${v} Wissen/Sek (passiv)`,
  xpBoost:          (v) => `+${Math.round(v * 100)} % XP`,
  focusMax:         (v) => `+${v} Max Fokus`,
  focusRegen:       (v) => `+${v} Fokus/Sek`,
};

function KernelTab({ kernelPoints, ownedKernelUpgrades, onBuy }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">Kernel</h2>
        <p className="mt-0.5 text-[11px] text-muted/60">Permanente Boni — wirken in jeder Epoche</p>
      </div>

      {/* KP-Guthaben */}
      <div className="flex items-center justify-between rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-card p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          <div>
            <p className="text-[9px] font-semibold tracking-[0.2em] text-muted">KERNEL-PUNKTE</p>
            <p className="text-2xl font-black text-accent leading-tight">{kernelPoints} KP</p>
          </div>
        </div>
        <div className="max-w-[190px] text-right text-[10px] leading-relaxed text-muted">
          KP gibt es für Epochen-Abschlüsse und alle 3 freigeschaltete Erfolge.
        </div>
      </div>

      {/* Upgrades */}
      <div className="space-y-2">
        {kernelUpgrades.map((upgrade, i) => {
          const owned = ownedKernelUpgrades.includes(upgrade.id);
          const lockedByChain = !!upgrade.requires && !ownedKernelUpgrades.includes(upgrade.requires);
          const canBuy = !owned && !lockedByChain && kernelPoints >= upgrade.cost;
          const requiredName = upgrade.requires
            ? kernelUpgrades.find((k) => k.id === upgrade.requires)?.name
            : null;

          return (
            <motion.div
              key={upgrade.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`rounded-2xl border p-4 transition-colors ${
                owned
                  ? "border-accent/30 bg-accent/5"
                  : lockedByChain
                    ? "border-overlay/5 bg-card opacity-55"
                    : "border-overlay/8 bg-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-2xl">{upgrade.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold">{upgrade.name}</span>
                    <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[9px] font-semibold ${
                      owned ? "bg-accent/20 text-accent" : "bg-overlay/10 text-muted"
                    }`}>
                      {EFFECT_LABEL[upgrade.effect.type](upgrade.effect.value)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">{upgrade.description}</p>

                  <div className="mt-3 flex items-center justify-between">
                    {owned ? (
                      <span className="text-xs font-bold text-accent">✓ Aktiv</span>
                    ) : lockedByChain ? (
                      <span className="text-[10px] text-muted">🔒 Benötigt: {requiredName}</span>
                    ) : (
                      <span className={`text-xs font-bold ${canBuy ? "text-foreground" : "text-foreground/30"}`}>
                        {upgrade.cost} KP
                      </span>
                    )}
                    {!owned && !lockedByChain && (
                      <button
                        onClick={() => onBuy(upgrade.id)}
                        disabled={!canBuy}
                        className={`rounded-xl px-4 py-1.5 text-xs font-black transition-all ${
                          canBuy
                            ? "bg-accent text-accent-foreground hover:scale-105 active:scale-95"
                            : "bg-overlay/8 text-foreground/25 cursor-not-allowed"
                        }`}
                      >
                        Kaufen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default KernelTab;
