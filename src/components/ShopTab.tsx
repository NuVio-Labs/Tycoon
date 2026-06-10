import { useState } from "react";
import { motion } from "framer-motion";
import type { RoomUpgrade } from "../types/upgrade";

type ShopTabProps = {
  upgrades: RoomUpgrade[];
  experience: number;
  onBuy: (id: string) => void;
};

const EFFECT_LABEL: Record<string, string> = {
  focusMax:          "+Max Fokus",
  focusRegen:        "+Fokus/Sek",
  knowledgePerClick: "+Wissen/Klick",
};

const GROUP_TITLE: Record<string, string> = {
  "focus-max":   "Fokus Maximum",
  "focus-regen": "Fokus Regeneration",
  "knowledge":   "Wissen pro Klick",
};

const SKINS = [
  { id: "skin-dark-pro",  name: "Dark Pro",        description: "Dunkleres, kontrastreicheres Theme für die Profis.", icon: "🌑",  price: 500  },
  { id: "skin-retro",     name: "Retro Terminal",   description: "Grüner Phosphor auf Schwarz. Wie 1985.",            icon: "💚",  price: 750  },
  { id: "skin-neon",      name: "Neon City",        description: "Lila & Pink. Cyberpunk trifft Kinderzimmer.",        icon: "🌆",  price: 1000 },
  { id: "skin-minimal",   name: "Minimal White",    description: "Hell, clean, kein Schnickschnack.",                  icon: "⬜",  price: 1200 },
];

type SubTab = "zimmer" | "skins";

function TierDots({ total, owned }: { total: number; owned: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-4 rounded-full transition-colors ${
            i < owned ? "bg-[#E0B84A]" : "bg-white/15"
          }`}
        />
      ))}
    </div>
  );
}

function ShopTab({ upgrades, experience, onBuy }: ShopTabProps) {
  const [sub, setSub] = useState<SubTab>("zimmer");

  // Build one card per group: show the next unowned tier, or "maxed" state
  const groups = ["focus-max", "focus-regen", "knowledge"];
  const groupCards = groups.map((groupId) => {
    const tiers = upgrades
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
        <h2 className="text-xs font-semibold tracking-[0.25em] text-[#B9B2A3] uppercase">Shop</h2>
        <p className="mt-0.5 text-[11px] text-[#B9B2A3]/60">
          Guthaben: <span className="text-[#E0B84A] font-bold">{experience.toLocaleString("de-DE")} XP</span>
        </p>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex gap-2 rounded-2xl border border-white/8 bg-[#111111] p-1">
        {(["zimmer", "skins"] as SubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSub(t)}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              sub === t ? "bg-[#E0B84A] text-[#050505]" : "text-[#B9B2A3] hover:text-[#F5F3EE]"
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
                    ? "border-[#E0B84A]/30 bg-[#E0B84A]/5"
                    : "border-white/8 bg-[#111111]"
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
                        maxed ? "bg-[#E0B84A]/20 text-[#E0B84A]" : "bg-white/10 text-[#B9B2A3]"
                      }`}>
                        {maxed
                          ? "MAX"
                          : `${EFFECT_LABEL[next!.effect.type]} +${next!.effect.value}`}
                      </span>
                    </div>

                    {/* Tier dots */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <TierDots total={tiers.length} owned={ownedCount} />
                      <span className="text-[9px] text-[#B9B2A3]/60">
                        Stufe {ownedCount}/{tiers.length}
                      </span>
                    </div>

                    {/* Current upgrade name + description */}
                    {!maxed && (
                      <>
                        <p className="mt-2 text-[10px] font-semibold text-[#F5F3EE]/70">
                          Stufe {next!.tier}: {next!.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#B9B2A3] leading-relaxed">
                          {next!.description}
                        </p>
                      </>
                    )}

                    {/* Buy row */}
                    <div className="mt-3 flex items-center justify-between">
                      {maxed ? (
                        <span className="text-xs font-bold text-[#E0B84A]">✓ Vollständig ausgebaut</span>
                      ) : (
                        <>
                          <span className={`text-xs font-bold ${tooExpensive ? "text-white/30" : "text-[#F5F3EE]"}`}>
                            {next!.cost.toLocaleString("de-DE")} XP
                          </span>
                          <button
                            onClick={() => onBuy(next!.id)}
                            disabled={!canBuy}
                            className={`rounded-xl px-4 py-1.5 text-xs font-black transition-all ${
                              canBuy
                                ? "bg-[#E0B84A] text-[#050505] hover:scale-105 active:scale-95"
                                : "bg-white/8 text-white/25 cursor-not-allowed"
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
          <div className="rounded-2xl border border-[#E0B84A]/20 bg-[#E0B84A]/5 p-3 text-center">
            <p className="text-xs text-[#E0B84A] font-semibold">Skins kommen bald!</p>
            <p className="mt-0.5 text-[10px] text-[#B9B2A3]">Schalte sie in zukünftigen Updates frei.</p>
          </div>
          {SKINS.map((skin, i) => (
            <motion.div
              key={skin.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/8 bg-[#111111] p-4 opacity-60"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0 mt-0.5">{skin.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm">{skin.name}</span>
                    <span className="text-xs rounded-lg px-2 py-0.5 bg-white/10 text-[#B9B2A3]">
                      🔒 {skin.price.toLocaleString("de-DE")} XP
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#B9B2A3]">{skin.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShopTab;
