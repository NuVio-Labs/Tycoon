export type UpgradeEffectType = "focusMax" | "focusRegen" | "knowledgePerClick";

export type RoomUpgrade = {
  id: string;
  groupId: string;       // groups tiers together (e.g. "focus-regen")
  tier: number;          // 1–5
  name: string;
  description: string;
  icon: string;
  cost: number;          // paid in experience
  owned: boolean;
  effect: {
    type: UpgradeEffectType;
    value: number;
  };
};
