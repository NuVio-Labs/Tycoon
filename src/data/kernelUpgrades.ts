import type { KernelUpgrade } from "../types/kernel";

// Kernel-Punkte (KP) verdient man durch:
// - Abschluss Epoche 1: +3 KP
// - Abschluss Epoche 2: +5 KP
// - Erfolgs-Meilensteine: alle 3 freigeschaltete Erfolge = +1 KP

export const kernelUpgrades: KernelUpgrade[] = [
  // ── Auto-Compiler: passives Wissen ───────────────────────────────────────
  {
    id: "kernel-auto-1",
    name: "Auto-Compiler I",
    description: "Ein Hintergrundprozess sammelt Wissen, während du andere Dinge tust. +1 Wissen pro Sekunde — ganz ohne Fokus-Kosten.",
    icon: "🤖",
    cost: 2,
    effect: { type: "passiveKnowledge", value: 1 },
  },
  {
    id: "kernel-auto-2",
    name: "Auto-Compiler II",
    description: "Der Prozess läuft jetzt mehrkernig. +3 Wissen pro Sekunde zusätzlich.",
    icon: "🤖",
    cost: 3,
    effect: { type: "passiveKnowledge", value: 3 },
    requires: "kernel-auto-1",
  },
  {
    id: "kernel-auto-3",
    name: "Auto-Compiler III",
    description: "Verteiltes Lernen auf Cluster-Niveau. +8 Wissen pro Sekunde zusätzlich.",
    icon: "🤖",
    cost: 5,
    effect: { type: "passiveKnowledge", value: 8 },
    requires: "kernel-auto-2",
  },

  // ── XP-Boost ─────────────────────────────────────────────────────────────
  {
    id: "kernel-xp-1",
    name: "Lessons Learned",
    description: "Jede Erfahrung zählt doppelt — naja, fast. +10 % XP aus allen Aufträgen.",
    icon: "📈",
    cost: 1,
    effect: { type: "xpBoost", value: 0.10 },
  },
  {
    id: "kernel-xp-2",
    name: "Retrospektiven-Meister",
    description: "Du reflektierst jedes Projekt und wirst messbar besser. Weitere +25 % XP aus Aufträgen.",
    icon: "📈",
    cost: 3,
    effect: { type: "xpBoost", value: 0.25 },
    requires: "kernel-xp-1",
  },

  // ── Fokus (global) ───────────────────────────────────────────────────────
  {
    id: "kernel-focus-max",
    name: "Flow-State Protokoll",
    description: "Du kennst deinen Kopf inzwischen besser als jede IDE. +25 maximaler Fokus, in jeder Epoche.",
    icon: "🧘",
    cost: 1,
    effect: { type: "focusMax", value: 25 },
  },
  {
    id: "kernel-focus-regen",
    name: "Microbreak-Engine",
    description: "Perfekt getimte Mini-Pausen, vollautomatisch. +1 Fokus-Regeneration pro Sekunde, dauerhaft.",
    icon: "⚡",
    cost: 2,
    effect: { type: "focusRegen", value: 1 },
  },
];
