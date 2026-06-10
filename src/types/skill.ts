export type SkillId = "html" | "css" | "javascript";

export type Skill = {
  id: SkillId;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
};