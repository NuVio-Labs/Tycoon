import type { GameState } from "../types/game";

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (s: GameState) => boolean;
};

// Fehlendes epoch-Feld bedeutet Epoche 1 (ältere Daten/Spielstände)
const epochOf = (x: { epoch?: number }) => x.epoch ?? 1;
const skillLevel = (s: GameState, id: string) => s.skills.find((sk) => sk.id === id)?.level ?? 0;

export const achievements: Achievement[] = [
  // ── Klicks ─────────────────────────────────────────────────────────────
  {
    id: "hello-world",
    name: "Hallo Welt",
    description: "Dein allererster Klick. Jede Reise beginnt mit einer Zeile Code.",
    icon: "👋",
    check: (s) => s.stats.totalClicks >= 1,
  },
  {
    id: "clicks-100",
    name: "Warmgetippt",
    description: "100 Mal Code gelernt.",
    icon: "⌨️",
    check: (s) => s.stats.totalClicks >= 100,
  },
  {
    id: "clicks-1000",
    name: "Klick-Maschine",
    description: "1.000 Mal Code gelernt.",
    icon: "🤖",
    check: (s) => s.stats.totalClicks >= 1_000,
  },
  {
    id: "clicks-10000",
    name: "Die Tastatur glüht",
    description: "10.000 Mal Code gelernt. Respekt.",
    icon: "🔥",
    check: (s) => s.stats.totalClicks >= 10_000,
  },

  // ── Wissen ─────────────────────────────────────────────────────────────
  {
    id: "knowledge-1000",
    name: "Wissensdurst",
    description: "Insgesamt 1.000 Wissen gesammelt.",
    icon: "🧠",
    check: (s) => s.stats.totalKnowledge >= 1_000,
  },
  {
    id: "knowledge-10000",
    name: "Bücherwurm",
    description: "Insgesamt 10.000 Wissen gesammelt.",
    icon: "📚",
    check: (s) => s.stats.totalKnowledge >= 10_000,
  },

  // ── Aufträge ───────────────────────────────────────────────────────────
  {
    id: "first-project",
    name: "Erster Auftrag",
    description: "Deinen ersten Auftrag erfolgreich abgeschlossen.",
    icon: "🎉",
    check: (s) => s.completedProjects >= 1,
  },
  {
    id: "projects-10",
    name: "Auftragsprofi",
    description: "10 Aufträge erfolgreich abgeschlossen.",
    icon: "💼",
    check: (s) => s.completedProjects >= 10,
  },
  {
    id: "all-projects",
    name: "Vollsortiment",
    description: "Jeden Kinderzimmer-Auftrag mindestens einmal geschafft.",
    icon: "🗂️",
    check: (s) => s.projectPool.filter((p) => !p.isGraduation && epochOf(p) === 1).every((p) => p.completed),
  },

  // ── Streak ─────────────────────────────────────────────────────────────
  {
    id: "streak-5",
    name: "Heiße Serie",
    description: "5 Aufträge in Folge geschafft.",
    icon: "🔥",
    check: (s) => s.bestStreak >= 5,
  },
  {
    id: "streak-10",
    name: "Unaufhaltsam",
    description: "10 Aufträge in Folge geschafft — ×2.0 XP!",
    icon: "⚡",
    check: (s) => s.bestStreak >= 10,
  },

  // ── Skills ─────────────────────────────────────────────────────────────
  {
    id: "skill-max",
    name: "Spezialist",
    description: "Einen Skill auf Level 100 gebracht.",
    icon: "🎯",
    check: (s) => s.skills.some((sk) => sk.level >= sk.maxLevel),
  },
  {
    id: "all-skills-max",
    name: "Grundlagen gemeistert",
    description: "HTML, CSS und JavaScript auf Level 100. Bereit für den Abschluss.",
    icon: "🏆",
    check: (s) => s.skills.filter((sk) => epochOf(sk) === 1).every((sk) => sk.level >= sk.maxLevel),
  },

  // ── Zimmer & Style ─────────────────────────────────────────────────────
  {
    id: "all-upgrades",
    name: "Traum-Setup",
    description: "Alle Kinderzimmer-Upgrades gekauft.",
    icon: "🖥️",
    check: (s) => s.roomUpgrades.filter((u) => epochOf(u) === 1).every((u) => u.owned),
  },
  {
    id: "first-skin",
    name: "Stilbewusst",
    description: "Deinen ersten Skin gekauft.",
    icon: "🎨",
    check: (s) => s.ownedSkins.length > 1,
  },

  // ── Meilensteine ───────────────────────────────────────────────────────
  {
    id: "daily-first",
    name: "Tagesheld",
    description: "Deine erste Tages-Challenge abgeholt.",
    icon: "📅",
    check: (s) => s.stats.dailiesClaimed >= 1,
  },
  {
    id: "graduate",
    name: "Absolvent",
    description: "Das Abschlussprojekt gemeistert. Auf ins Azubi-Zimmer!",
    icon: "🎓",
    check: (s) => s.projectPool.some((p) => p.isGraduation && epochOf(p) === 1 && p.completed),
  },

  // ── Epoche 2: Azubi-Zimmer ─────────────────────────────────────────────
  {
    id: "git-10",
    name: "Versionskontrolliert",
    description: "Git auf Level 10 — nie wieder 'final_v2_NEU_wirklich.zip'.",
    icon: "🌿",
    check: (s) => skillLevel(s, "git") >= 10,
  },
  {
    id: "react-50",
    name: "Komponenten-Denker",
    description: "React auf Level 50 — du siehst die Welt in Komponenten.",
    icon: "⚛️",
    check: (s) => skillLevel(s, "react") >= 50,
  },
  {
    id: "ts-50",
    name: "Typsicher",
    description: "TypeScript auf Level 50 — any ist für dich ein Schimpfwort.",
    icon: "🛡️",
    check: (s) => skillLevel(s, "typescript") >= 50,
  },
  {
    id: "azubi-skills-max",
    name: "Prüfungsreif",
    description: "Git, React und TypeScript auf Level 100. Die Abschlussprüfung wartet.",
    icon: "🎯",
    check: (s) => s.skills.filter((sk) => epochOf(sk) === 2).every((sk) => sk.level >= sk.maxLevel),
  },
  {
    id: "all-projects-2",
    name: "Agentur-Liebling",
    description: "Jeden Azubi-Auftrag mindestens einmal geschafft.",
    icon: "💼",
    check: (s) => s.projectPool.filter((p) => !p.isGraduation && epochOf(p) === 2).every((p) => p.completed),
  },
  {
    id: "all-upgrades-2",
    name: "Premium-Setup",
    description: "Alle Azubi-Zimmer-Upgrades gekauft.",
    icon: "🏢",
    check: (s) => s.roomUpgrades.filter((u) => epochOf(u) === 2).every((u) => u.owned),
  },
  {
    id: "graduate-2",
    name: "Ausgelernt",
    description: "Die Abschlussprüfung bestanden. Die Selbstständigkeit ruft!",
    icon: "🎓",
    check: (s) => s.projectPool.some((p) => p.isGraduation && epochOf(p) === 2 && p.completed),
  },

  // ── Kernel ─────────────────────────────────────────────────────────────
  {
    id: "kernel-first",
    name: "Systemkern",
    description: "Dein erstes Kernel-Upgrade gekauft — ein permanenter Bonus.",
    icon: "⚙️",
    check: (s) => s.ownedKernelUpgrades.length >= 1,
  },
  {
    id: "kernel-all",
    name: "Voll optimiert",
    description: "Alle Kernel-Upgrades freigeschaltet. Dein System läuft perfekt.",
    icon: "🧬",
    check: (s) => s.ownedKernelUpgrades.length >= 7,
  },
];
