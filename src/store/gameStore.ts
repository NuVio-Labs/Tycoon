import { create } from "zustand";
import { persist } from "zustand/middleware";
import { skills as initialSkills } from "../data/skills";
import { projects as initialProjects } from "../data/projects";
import { roomUpgrades as initialUpgrades } from "../data/roomUpgrades";
import type { GameState } from "../types/game";
import type { Project } from "../types/project";
import type { SkillId } from "../types/skill";
import type { DailyChallenge, ChallengeType } from "../types/challenge";

// ── Helpers ────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const CHALLENGE_TEMPLATES: Array<{
  type: ChallengeType;
  label: (n: number) => string;
  required: number;
  rewardXP: number;
}> = [
  { type: "completeProjects", label: (n) => `${n} Aufträge erfolgreich abschließen`, required: 3, rewardXP: 150 },
  { type: "completeProjects", label: (n) => `${n} Aufträge erfolgreich abschließen`, required: 5, rewardXP: 250 },
  { type: "earnKnowledge",    label: (n) => `${n} Wissen sammeln`,       required: 200, rewardXP: 180 },
  { type: "earnKnowledge",    label: (n) => `${n} Wissen sammeln`,       required: 500, rewardXP: 300 },
  { type: "gainSkillLevels",  label: (n) => `${n} Skill-Level steigern`, required: 3, rewardXP: 200 },
  { type: "gainSkillLevels",  label: (n) => `${n} Skill-Level steigern`, required: 7, rewardXP: 400 },
];

function generateChallenge(): DailyChallenge {
  const tpl = CHALLENGE_TEMPLATES[Math.floor(Math.random() * CHALLENGE_TEMPLATES.length)];
  return {
    id: `challenge-${todayISO()}`,
    date: todayISO(),
    type: tpl.type,
    label: tpl.label(tpl.required),
    required: tpl.required,
    current: 0,
    rewardXP: tpl.rewardXP,
    claimed: false,
  };
}

// Streak → XP multiplier (applied on top of base reward)
function streakMultiplier(streak: number): number {
  if (streak >= 10) return 2.0;
  if (streak >= 5)  return 1.5;
  if (streak >= 3)  return 1.25;
  return 1.0;
}

// ── Types ──────────────────────────────────────────────────────────────────

type GameActions = {
  learnCode: () => void;
  regenFocus: () => void;
  buySkillLevel: (skillId: SkillId) => void;
  getSkillCost: (skillId: SkillId) => number;
  getProjectSuccessChance: (project: Project) => number;
  generateRandomProject: () => void;
  acceptProject: () => void;
  completeGraduation: () => void;
  declineProject: () => void;
  getActiveGoal: () => { label: string; current: number; required: number };
  allSkillsMaxed: () => boolean;
  dismissTransition: () => void;
  buyUpgrade: (upgradeId: string) => void;
  claimDailyReward: () => void;
  checkAndRefreshChallenge: () => void;
  // Derived values
  getKnowledgePerClick: () => number;
  getFocusRegenRate: () => number;
  resetGame: () => void;
};

type GameStore = GameState & GameActions;

const initialState: GameState = {
  resources: { knowledge: 0, experience: 0, focus: 100, maxFocus: 100 },
  skills: initialSkills,
  projectPool: initialProjects,
  activeProject: null,
  completedProjects: 0,
  failedProjects: 0,
  declinedProjects: 0,
  currentEpoch: "kinderzimmer",
  epochTransition: false,
  roomUpgrades: initialUpgrades,
  currentStreak: 0,
  bestStreak: 0,
  dailyChallenge: null,
};

// ── Store ──────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ── Derived upgrade values ───────────────────────────────────────────

      getKnowledgePerClick: () => {
        const bonus = get().roomUpgrades
          .filter((u) => u.owned && u.effect.type === "knowledgePerClick")
          .reduce((sum, u) => sum + u.effect.value, 0);
        return 1 + bonus;
      },

      getFocusRegenRate: () => {
        const bonus = get().roomUpgrades
          .filter((u) => u.owned && u.effect.type === "focusRegen")
          .reduce((sum, u) => sum + u.effect.value, 0);
        return 1 + bonus;
      },

      // ── Core actions ─────────────────────────────────────────────────────

      learnCode: () => {
        const { resources, dailyChallenge, getKnowledgePerClick } = get();
        if (resources.focus <= 0) return;
        const gained = getKnowledgePerClick();
        const newResources = {
          ...resources,
          knowledge: resources.knowledge + gained,
          focus: resources.focus - 1,
        };
        // Daily: earnKnowledge progress
        let newChallenge = dailyChallenge;
        if (dailyChallenge && !dailyChallenge.claimed && dailyChallenge.type === "earnKnowledge") {
          newChallenge = { ...dailyChallenge, current: Math.min(dailyChallenge.current + gained, dailyChallenge.required) };
        }
        set({ resources: newResources, dailyChallenge: newChallenge });
      },

      regenFocus: () => {
        const { resources, getFocusRegenRate } = get();
        if (resources.focus >= resources.maxFocus) return;
        set({
          resources: {
            ...resources,
            focus: Math.min(resources.focus + getFocusRegenRate(), resources.maxFocus),
          },
        });
      },

      getSkillCost: (skillId) => {
        const skill = get().skills.find((s) => s.id === skillId);
        if (!skill) return 0;
        return skill.baseCost * (skill.level + 1);
      },

      buySkillLevel: (skillId) => {
        const { resources, skills, getSkillCost, dailyChallenge } = get();
        const skill = skills.find((s) => s.id === skillId);
        if (!skill || skill.level >= skill.maxLevel) return;
        const cost = getSkillCost(skillId);
        if (resources.knowledge < cost) return;

        // Daily: gainSkillLevels progress
        let newChallenge = dailyChallenge;
        if (dailyChallenge && !dailyChallenge.claimed && dailyChallenge.type === "gainSkillLevels") {
          newChallenge = { ...dailyChallenge, current: Math.min(dailyChallenge.current + 1, dailyChallenge.required) };
        }

        set({
          resources: { ...resources, knowledge: resources.knowledge - cost, experience: resources.experience + 5 },
          skills: skills.map((s) => s.id === skillId ? { ...s, level: s.level + 1 } : s),
          dailyChallenge: newChallenge,
        });
      },

      getProjectSuccessChance: (project) => {
        const { skills } = get();
        const requiredTotal = project.requirements.reduce((sum, r) => sum + r.requiredLevel, 0);
        if (requiredTotal === 0) return 100;
        const playerTotal = project.requirements.reduce((sum, r) => {
          const skill = skills.find((s) => s.id === r.skillId);
          return sum + Math.min(skill?.level ?? 0, r.requiredLevel);
        }, 0);
        return Math.round((playerTotal / requiredTotal) * 100);
      },

      allSkillsMaxed: () => get().skills.every((s) => s.level >= s.maxLevel),

      generateRandomProject: () => {
        const { projectPool, skills, allSkillsMaxed } = get();
        if (allSkillsMaxed()) {
          const grad = projectPool.find((p) => p.isGraduation && !p.completed);
          set({ activeProject: grad ?? null });
          return;
        }

        const fresh = projectPool.filter((p) => !p.completed && !p.isGraduation);
        const pool = fresh.length > 0
          ? fresh
          : projectPool.filter((p) => !p.isGraduation);

        // Weight each project by how close the player is to meeting requirements.
        // maxReq = highest required level across all requirements of that project.
        // Player skill average gives a "center". Projects within ±15 of that center
        // get high weight; too far above get low weight; already-meetable get medium.
        const avgSkill = skills.reduce((s, sk) => s + sk.level, 0) / skills.length;

        const weighted = pool.map((p) => {
          const maxReq = Math.max(...p.requirements.map((r) => r.requiredLevel));
          const diff = maxReq - avgSkill; // positive = harder than current level
          let weight: number;
          if (diff < -20) weight = 1;        // way too easy, rare
          else if (diff <= 15) weight = 10;  // sweet spot: at level or slightly above
          else if (diff <= 30) weight = 4;   // a bit harder, still shows up
          else weight = 1;                   // far out of reach, rare
          return { project: p, weight };
        });

        const totalWeight = weighted.reduce((s, w) => s + w.weight, 0);
        let rand = Math.random() * totalWeight;
        for (const { project, weight } of weighted) {
          rand -= weight;
          if (rand <= 0) {
            set({ activeProject: project });
            return;
          }
        }
        set({ activeProject: pool[0] });
      },

      acceptProject: () => {
        const {
          activeProject, resources, projectPool,
          getProjectSuccessChance, generateRandomProject,
          currentStreak, bestStreak, dailyChallenge,
        } = get();
        if (!activeProject || activeProject.isGraduation) return;

        const chance = getProjectSuccessChance(activeProject);
        const success = Math.random() * 100 <= chance;

        if (!success) {
          set({
            resources: { ...resources, experience: resources.experience + 3 },
            failedProjects: get().failedProjects + 1,
            currentStreak: 0,
          });
          generateRandomProject();
          return;
        }

        const newStreak = currentStreak + 1;
        const multiplier = streakMultiplier(newStreak);
        const isRepeat = activeProject.completed;
        const baseXP = isRepeat
          ? Math.max(5, Math.round(activeProject.rewards.experience * 0.25))
          : activeProject.rewards.experience;
        const earnedXP = Math.round(baseXP * multiplier);

        // Daily: completeProjects progress
        let newChallenge = dailyChallenge;
        if (dailyChallenge && !dailyChallenge.claimed && dailyChallenge.type === "completeProjects") {
          newChallenge = { ...dailyChallenge, current: Math.min(dailyChallenge.current + 1, dailyChallenge.required) };
        }

        set({
          resources: { ...resources, experience: resources.experience + earnedXP },
          completedProjects: get().completedProjects + 1,
          projectPool: isRepeat
            ? projectPool
            : projectPool.map((p) => p.id === activeProject.id ? { ...p, completed: true } : p),
          currentStreak: newStreak,
          bestStreak: Math.max(bestStreak, newStreak),
          dailyChallenge: newChallenge,
        });
        generateRandomProject();
      },

      completeGraduation: () => {
        const { activeProject, resources, projectPool } = get();
        if (!activeProject?.isGraduation) return;
        set({
          resources: { ...resources, experience: resources.experience + activeProject.rewards.experience },
          completedProjects: get().completedProjects + 1,
          projectPool: projectPool.map((p) => p.id === activeProject.id ? { ...p, completed: true } : p),
          activeProject: null,
          epochTransition: true,
        });
      },

      dismissTransition: () => set({ epochTransition: false, currentEpoch: "azubi" }),

      declineProject: () => {
        set({ declinedProjects: get().declinedProjects + 1, currentStreak: 0 });
        get().generateRandomProject();
      },

      // ── Upgrades ─────────────────────────────────────────────────────────

      buyUpgrade: (upgradeId) => {
        const { resources, roomUpgrades } = get();
        const upgrade = roomUpgrades.find((u) => u.id === upgradeId);
        if (!upgrade || upgrade.owned || resources.experience < upgrade.cost) return;

        const newUpgrades = roomUpgrades.map((u) => u.id === upgradeId ? { ...u, owned: true } : u);

        // Recalculate maxFocus from all owned focusMax upgrades
        const baseMax = 100;
        const focusBonus = newUpgrades
          .filter((u) => u.owned && u.effect.type === "focusMax")
          .reduce((sum, u) => sum + u.effect.value, 0);
        const newMaxFocus = baseMax + focusBonus;

        set({
          resources: {
            ...resources,
            experience: resources.experience - upgrade.cost,
            maxFocus: newMaxFocus,
            focus: Math.min(resources.focus, newMaxFocus),
          },
          roomUpgrades: newUpgrades,
        });
      },

      // ── Daily Challenge ───────────────────────────────────────────────────

      checkAndRefreshChallenge: () => {
        const { dailyChallenge } = get();
        const today = todayISO();
        if (!dailyChallenge || dailyChallenge.date !== today) {
          set({ dailyChallenge: generateChallenge() });
        }
      },

      claimDailyReward: () => {
        const { dailyChallenge, resources } = get();
        if (!dailyChallenge || dailyChallenge.claimed) return;
        if (dailyChallenge.current < dailyChallenge.required) return;
        set({
          dailyChallenge: { ...dailyChallenge, claimed: true },
          resources: { ...resources, experience: resources.experience + dailyChallenge.rewardXP },
        });
      },

      // ── Active Goal ───────────────────────────────────────────────────────

      getActiveGoal: () => {
        const { skills, projectPool, allSkillsMaxed } = get();
        if (allSkillsMaxed()) {
          const grad = projectPool.find((p) => p.isGraduation && !p.completed);
          if (grad) return { label: "Abschlussprojekt!", current: 0, required: 0 };
          return { label: "Epoche abgeschlossen!", current: 0, required: 0 };
        }
        const fresh = projectPool.filter((p) => !p.completed && !p.isGraduation);
        const available = fresh.length > 0 ? fresh : projectPool.filter((p) => !p.isGraduation);
        if (available.length === 0) return { label: "Weiter lernen", current: 0, required: 0 };

        const sorted = [...available].sort(
          (a, b) =>
            a.requirements.reduce((s, r) => s + r.requiredLevel, 0) -
            b.requirements.reduce((s, r) => s + r.requiredLevel, 0)
        );

        for (const project of sorted) {
          let biggestGap = 0;
          let blockingSkill: { name: string; current: number; required: number } | null = null;
          for (const req of project.requirements) {
            const skill = skills.find((s) => s.id === req.skillId);
            const current = skill?.level ?? 0;
            const gap = req.requiredLevel - current;
            if (gap > biggestGap) {
              biggestGap = gap;
              blockingSkill = { name: skill?.name ?? req.skillId, current, required: req.requiredLevel };
            }
          }
          if (blockingSkill) {
            return { label: blockingSkill.name, current: blockingSkill.current, required: blockingSkill.required };
          }
          return { label: project.name, current: 0, required: 0 };
        }
        return { label: "Weiter lernen", current: 0, required: 0 };
      },

      // ── Reset ─────────────────────────────────────────────────────────────

      resetGame: () => {
        set({
          ...initialState,
          skills: initialSkills.map((s) => ({ ...s })),
          projectPool: initialProjects.map((p) => ({ ...p })),
          roomUpgrades: initialUpgrades.map((u) => ({ ...u })),
          dailyChallenge: generateChallenge(),
        });
      },
    }),
    {
      name: "nuvio-tycoon-save",
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const s = persisted as GameState;
        if (version < 2) {
          // Schema changed: replace old upgrades with new tiered ones
          return { ...s, roomUpgrades: initialUpgrades.map((u) => ({ ...u })) };
        }
        return s;
      },
    }
  )
);
