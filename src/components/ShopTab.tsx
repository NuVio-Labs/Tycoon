import { useState } from "react";
import { motion } from "framer-motion";
import type { RoomUpgrade } from "../types/upgrade";
import { skins } from "../data/skins";

type ShopTabProps = {
  upgrades: RoomUpgrade[];
  epoch: number; // welche Zimmer-Upgrades angezeigt werden
  experience: number;
  ownedSkins: string[];
  activeSkin: string;
  onBuy: (id: string) => void;
  onBuySkin: (id: string) => void;
  onSetSkin: (id: string) => void;
};

const EFFECT_LABEL: Record<string, string> = {
  focusMax:          "+Max Fokus",
  focusRegen:        "+Fokus/Sek",
  knowledgePerClick: "+Wissen/Klick",
};

const GROUP_TITLE: Record<string, string> = {
  "focus-max":     "Fokus Maximum",
  "focus-regen":   "Fokus Regeneration",
  "knowledge":     "Wissen pro Klick",
  "a-focus-max":   "Fokus Maximum",
  "a-focus-regen": "Fokus Regeneration",
  "a-knowledge":   "Wissen pro Klick",
};

type SubTab = "zimmer" | "skins";

function TierDots({ total, owned }: { total: number; owned: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-4 rounded-full transition-colors ${
            i < owned ? "bg-accent" : "bg-overlay/15"
          }`}
        />
      ))}
    </div>
  );
}

function SkinPreview({ colors }: { colors: [string, string, string] }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-overlay/15 overflow-hidden">
      <div className="flex h-full w-full">
        {colors.map((c, i) => (
          <div key={i} className="h-full flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}

function ShopTab({ upgrades, epoch, experience, ownedSkins, activeSkin, onBuy, onBuySkin, onSetSkin }: ShopTabProps) {
  const [sub, setSub] = useState<SubTab>("zimmer");

  // Nur Upgrades der aktuellen Epoche; eine Karte pro Gruppe
  const epochUpgrades = upgrades.filter((u) => (u.epoch ?? 1) === epoch);
  const groups = [...new Set(epochUpgrades.map((u) => u.groupId))];
  const groupCards = groups.map((groupId) => {
    const tiers = epochUpgrades
      .filter((u) => u.groupId === groupId)
      .sort((a, b) => a.tier - b.tier);
    const ownedCount = tiers.filter((u) => u.owned).length;
    const next = tiers.find((u) => !u.owned) ?? null;
    return { groupId, tiers, ownedCount, next };
  });

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">Shop</h2>
        <p className="mt-0.5 text-[11px] text-muted/60">
          Guthaben: <span className="text-accent font-bold">{experience.toLocaleString("de-DE")} XP</span>
        </p>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex gap-2 rounded-2xl border border-overlay/8 bg-card p-1">
        {(["zimmer", "skins"] as SubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSub(t)}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              sub === t ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {t === "zimmer" ? "🛋️ Zimmer" : "🎨 Skins"}
          </button>
        ))}
      </div>

      {/* Zimmer Upgrades */}
      {sub === "zimmer" && (
        <div className="space-y-2">
          {groupCards.map(({ groupId, tiers, ownedCount, next }, i) => {
            const maxed = !next;
            const canBuy = !maxed && experience >= (next?.cost ?? 0);
            const tooExpensive = !maxed && !canBuy;

            return (
              <motion.div
                key={groupId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-2xl border p-4 transition-colors ${
                  maxed
                    ? "border-accent/30 bg-accent/5"
                    : "border-overlay/8 bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5">
                    {maxed ? tiers[tiers.length - 1].icon : next!.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm">
                        {GROUP_TITLE[groupId]}
                      </span>
                      <span className={`text-[9px] font-semibold shrink-0 rounded-lg px-2 py-0.5 ${
                        maxed ? "bg-accent/20 text-accent" : "bg-overlay/10 text-muted"
                      }`}>
                        {maxed
                          ? "MAX"
                          : `${EFFECT_LABEL[next!.effect.type]} +${next!.effect.value}`}
                      </span>
                    </div>

                    {/* Tier dots */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <TierDots total={tiers.length} owned={ownedCount} />
                      <span className="text-[9px] text-muted/60">
                        Stufe {ownedCount}/{tiers.length}
                      </span>
                    </div>

                    {/* Current upgrade name + description */}
                    {!maxed && (
                      <>
                        <p className="mt-2 text-[10px] font-semibold text-foreground/70">
                          Stufe {next!.tier}: {next!.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted leading-relaxed">
                          {next!.description}
                        </p>
                      </>
                    )}

                    {/* Buy row */}
                    <div className="mt-3 flex items-center justify-between">
                      {maxed ? (
                        <span className="text-xs font-bold text-accent">✓ Vollständig ausgebaut</span>
                      ) : (
                        <>
                          <span className={`text-xs font-bold ${tooExpensive ? "text-foreground/30" : "text-foreground"}`}>
                            {next!.cost.toLocaleString("de-DE")} XP
                          </span>
                          <button
                            onClick={() => onBuy(next!.id)}
                            disabled={!canBuy}
                            className={`rounded-xl px-4 py-1.5 text-xs font-black transition-all ${
                              canBuy
                                ? "bg-accent text-accent-foreground hover:scale-105 active:scale-95"
                                : "bg-overlay/8 text-foreground/25 cursor-not-allowed"
                            }`}
                          >
                            Kaufen
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Skins */}
      {sub === "skins" && (
        <div className="space-y-2">
          {skins.map((skin, i) => {
            const owned = ownedSkins.includes(skin.id);
            const active = activeSkin === skin.id;
            const canBuy = !owned && experience >= skin.price;

            return (
              <motion.div
                key={skin.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border p-4 transition-colors ${
                  active
                    ? "border-accent/50 bg-accent/8 shadow-lg shadow-accent/10"
                    : "border-overlay/8 bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <SkinPreview colors={skin.preview} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm">
                        {skin.icon} {skin.name}
                      </span>
                      {active ? (
                        <span className="text-[9px] font-black shrink-0 rounded-lg px-2 py-0.5 bg-accent/20 text-accent">
                          ● AKTIV
                        </span>
                      ) : owned ? (
                        <span className="text-[9px] font-semibold shrink-0 rounded-lg px-2 py-0.5 bg-overlay/10 text-muted">
                          Gekauft
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold shrink-0 rounded-lg px-2 py-0.5 bg-overlay/10 text-muted">
                          {skin.price.toLocaleString("de-DE")} XP
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-muted">{skin.description}</p>

                    <div className="mt-3 flex justify-end">
                      {active ? (
                        <span className="text-xs font-bold text-accent">✓ Ausgewählt</span>
                      ) : owned ? (
                        <button
                          onClick={() => onSetSkin(skin.id)}
                          className="rounded-xl border border-accent/30 px-4 py-1.5 text-xs font-black text-accent hover:bg-accent/10 transition-all"
                        >
                          Aktivieren
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuySkin(skin.id)}
                          disabled={!canBuy}
                          className={`rounded-xl px-4 py-1.5 text-xs font-black transition-all ${
                            canBuy
                              ? "bg-accent text-accent-foreground hover:scale-105 active:scale-95"
                              : "bg-overlay/8 text-foreground/25 cursor-not-allowed"
                          }`}
                        >
                          {canBuy ? "Kaufen" : `🔒 ${skin.price.toLocaleString("de-DE")} XP`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ShopTab;
