import type { Skill } from "../types/skill";

export const skills: Skill[] = [
  // ── Epoche 1: Kinderzimmer ─────────────────────────────────────────────
  {
    id: "html",
    name: "HTML",
    description: "Die Grundlage jeder Website.",
    level: 0,
    maxLevel: 100,
    baseCost: 10,
    epoch: 1,
  },
  {
    id: "css",
    name: "CSS",
    description: "Gestalte deine Websites.",
    level: 0,
    maxLevel: 100,
    baseCost: 15,
    epoch: 1,
  },
  {
    id: "javascript",
    name: "JavaScript",
    description: "Mache Websites interaktiv.",
    level: 0,
    maxLevel: 100,
    baseCost: 20,
    epoch: 1,
  },

  // ── Epoche 2: Azubi-Zimmer ─────────────────────────────────────────────
  {
    id: "git",
    name: "Git",
    description: "Versionskontrolle — arbeite wie ein Profi im Team.",
    level: 0,
    maxLevel: 100,
    baseCost: 30,
    epoch: 2,
  },
  {
    id: "react",
    name: "React",
    description: "Baue moderne UIs aus Komponenten.",
    level: 0,
    maxLevel: 100,
    baseCost: 40,
    epoch: 2,
  },
  {
    id: "typescript",
    name: "TypeScript",
    description: "Typsicherer Code — weniger Bugs, mehr Vertrauen.",
    level: 0,
    maxLevel: 100,
    baseCost: 50,
    epoch: 2,
  },
];
