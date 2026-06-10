import type { SkillId } from "./skill";

export type ProjectRequirement = {
  skillId: SkillId;
  requiredLevel: number;
};

export type ProjectReward = {
  knowledge: number;
  experience: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  requirements: ProjectRequirement[];
  rewards: ProjectReward;
  completed: boolean;
  isGraduation?: boolean;
  durationSeconds?: number;
};