// Kernel-Upgrades: permanente Boni über alle Epochen hinweg.
// Bezahlt mit Kernel-Punkten (KP) — verdient durch Epochen-Abschlüsse
// und Erfolgs-Meilensteine (alle 3 Erfolge = 1 KP).

export type KernelEffectType =
  | "passiveKnowledge"  // +X Wissen pro Sekunde, ohne Fokus-Kosten
  | "xpBoost"           // +X% XP aus Aufträgen
  | "focusMax"          // +X maximaler Fokus (global)
  | "focusRegen";       // +X Fokus-Regeneration pro Sekunde (global)

export type KernelUpgrade = {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number; // in Kernel-Punkten
  effect: {
    type: KernelEffectType;
    value: number;
  };
  // Vorgänger-Upgrade, das zuerst gekauft sein muss (Tier-Kette)
  requires?: string;
};
