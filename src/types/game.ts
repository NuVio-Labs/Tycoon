import type { Skill } from "./skill";
import type { Project } from "./project";
import type { RoomUpgrade } from "./upgrade";
import type { DailyChallenge } from "./challenge";

export type Resources = {
  knowledge: number;
  experience: number;
  focus: number;
  maxFocus: number;
};

export type GameStats = {
  totalClicks: number;
  totalKnowledge: number;   // insgesamt verdientes Wissen
  totalXP: number;          // insgesamt verdiente XP
  playSeconds: number;      // Spielzeit bei geöffnetem Spiel
  dailiesClaimed: number;   // abgeholte Tages-Challenges
};

export type WelcomeBack = {
  awaySeconds: number;
  focusGained: number;
  knowledgeGained: number;
};

export type GameState = {
  resources: Resources;
  skills: Skill[];
  projectPool: Project[];
  activeProject: Project | null;
  completedProjects: number;
  failedProjects: number;
  declinedProjects: number;
  currentEpoch: "kinderzimmer" | "azubi" | "freelancer";
  epochTransition: boolean;
  // Upgrades
  roomUpgrades: RoomUpgrade[];
  // Streak
  currentStreak: number;
  bestStreak: number;
  // Daily Challenge
  dailyChallenge: DailyChallenge | null;
  // Skins / Themes
  ownedSkins: string[];
  activeSkin: string;
  // Achievements
  unlockedAchievements: string[];
  achievementQueue: string[]; // wartende Toast-Benachrichtigungen
  // Statistiken
  stats: GameStats;
  // Kernel (permanente Boni, bezahlt mit Kernel-Punkten)
  kernelPoints: number;
  kpMilestonesCredited: number; // bereits gutgeschriebene Erfolgs-Meilensteine (alle 3 Erfolge = 1 KP)
  ownedKernelUpgrades: string[];
  // Sound
  soundEnabled: boolean;
  // Offline-Fortschritt
  lastActiveAt: number; // Timestamp (ms)
  welcomeBack: WelcomeBack | null;
};
