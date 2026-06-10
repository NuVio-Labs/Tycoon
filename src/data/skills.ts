import type { Skill } from "../types/skill";

export const skills: Skill[] = [
  {
    id: "html",
    name: "HTML",
    description: "Die Grundlage jeder Website.",
    level: 0,
    maxLevel: 100,
    baseCost: 10,
  },
  {
    id: "css",
    name: "CSS",
    description: "Gestalte deine Websites.",
    level: 0,
    maxLevel: 100,
    baseCost: 15,
  },
  {
    id: "javascript",
    name: "JavaScript",
    description: "Mache Websites interaktiv.",
    level: 0,
    maxLevel: 100,
    baseCost: 20,
  },
];