export type ChallengeType = "completeProjects" | "earnKnowledge" | "gainSkillLevels";

export type DailyChallenge = {
  id: string;
  date: string; // ISO date "YYYY-MM-DD"
  type: ChallengeType;
  label: string;
  required: number;
  current: number;
  rewardXP: number;
  claimed: boolean;
};
