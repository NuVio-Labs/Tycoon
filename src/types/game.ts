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

export type GameState = {
  resources: Resources;
  skills: Skill[];
  projectPool: Project[];
  activeProject: Project | null;
  completedProjects: number;
  failedProjects: number;
  declinedProjects: number;
  currentEpoch: "kinderzimmer" | "azubi";
  epochTransition: boolean;
  // Upgrades
  roomUpgrades: RoomUpgrade[];
  // Streak
  currentStreak: number;
  bestStreak: number;
  // Daily Challenge
  dailyChallenge: DailyChallenge | null;
};
