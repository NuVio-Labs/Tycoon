import { create } from "zustand";
import { persist } from "zustand/middleware";
import { skills as initialSkills } from "../data/skills";
import { projects as initialProjects } from "../data/projects";
import { roomUpgrades as initialUpgrades } from "../data/roomUpgrades";
import { skins as skinData } from "../data/skins";
import { achievements as achievementData } from "../data/achievements";
import { kernelUpgrades as kernelData } from "../data/kernelUpgrades";
import { playSound, type SoundName } from "../utils/sound";
import type { GameState } from "../types/game";
import type { Project } from "../types/project";
import type { RoomUpgrade } from "../types/upgrade";
import type { SkillId } from "../types/skill";
import type { DailyChallenge, ChallengeType } from "../types/challenge";

// ── Helpers ────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Fehlendes epoch-Feld bedeutet Epoche 1 (ältere Daten/Spielstände)
const epochOf = (x: { epoch?: number }) => x.epoch ?? 1;
const epochNrOf = (e: GameState["currentEpoch"]) => (e === "kinderzimmer" ? 1 : 2);

// KP-Belohnung pro Epochen-Abschluss
const GRADUATION_KP: Record<number, number> = { 1: 3, 2: 5 };
// Alle N Erfolge gibt es 1 Kernel-Punkt
const KP_ACHIEVEMENT_STEP = 3;
// Offline-Fortschritt wird auf 12 Stunden gedeckelt
const OFFLINE_CAP_SECONDS = 12 * 3600;

function recalcMaxFocus(roomUpgrades: RoomUpgrade[], ownedKernel: string[]): number {
  const roomBonus = roomUpgrades
    .filter((u) => u.owned && u.effect.type === "focusMax")
    .reduce((sum, u) => sum + u.effect.value, 0);
  const kernelBonus = kernelData
    .filter((k) => ownedKernel.includes(k.id) && k.effect.type === "focusMax")
    .reduce((sum, k) => sum + k.effect.value, 0);
  return 100 + roomBonus + kernelBonus;
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
  tick: () => void; // 1×/Sekunde: Fokus-Regen, passives Wissen, Spielzeit, lastActiveAt
  buySkillLevel: (skillId: SkillId) => void;
  getSkillCost: (skillId: SkillId) => number;
  getProjectSuccessChance: (project: Project) => number;
  generateRandomProject: () => void;
  acceptProject: () => void;
  completeGraduation: () => void;
  declineProject: () => void;
  getActiveGoal: () => { label: string; current: number; required: number };
  allSkillsMaxed: (epochNr?: number) => boolean;
  dismissTransition: () => void;
  setEpoch: (epoch: GameState["currentEpoch"]) => void;
  buyUpgrade: (upgradeId: string) => void;
  claimDailyReward: () => void;
  checkAndRefreshChallenge: () => void;
  // Skins
  buySkin: (skinId: string) => void;
  setSkin: (skinId: string) => void;
  // Kernel
  buyKernelUpgrade: (upgradeId: string) => void;
  // Achievements
  checkAchievements: () => void;
  shiftAchievement: () => void;
  // Sound
  toggleSound: () => void;
  // Offline-Fortschritt
  applyOfflineProgress: () => void;
  dismissWelcomeBack: () => void;
  // Derived values
  getKnowledgePerClick: () => number;
  getFocusRegenRate: () => number;
  getPassiveKnowledge: () => number;
  getXPMultiplier: () => number;
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
  ownedSkins: ["standard"],
  activeSkin: "standard",
  unlockedAchievements: [],
  achievementQueue: [],
  stats: { totalClicks: 0, totalKnowledge: 0, totalXP: 0, playSeconds: 0, dailiesClaimed: 0 },
  kernelPoints: 0,
  kpMilestonesCredited: 0,
  ownedKernelUpgrades: [],
  soundEnabled: true,
  lastActiveAt: Date.now(),
  welcomeBack: null,
};

// ── Store ──────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => {
      // Sound nur abspielen, wenn aktiviert
      const sfx = (name: SoundName) => {
        if (get().soundEnabled) playSound(name);
      };

      return {
      ...initialState,

      // ── Derived values ───────────────────────────────────────────────────

      getKnowledgePerClick: () => {
        const bonus = get().roomUpgrades
          .filter((u) => u.owned && u.effect.type === "knowledgePerClick")
          .reduce((sum, u) => sum + u.effect.value, 0);
        return 1 + bonus;
      },

      getFocusRegenRate: () => {
        const { roomUpgrades, ownedKernelUpgrades } = get();
        const roomBonus = roomUpgrades
          .filter((u) => u.owned && u.effect.type === "focusRegen")
          .reduce((sum, u) => sum + u.effect.value, 0);
        const kernelBonus = kernelData
          .filter((k) => ownedKernelUpgrades.includes(k.id) && k.effect.type === "focusRegen")
          .reduce((sum, k) => sum + k.effect.value, 0);
        return 1 + roomBonus + kernelBonus;
      },

      getPassiveKnowledge: () => {
        const { ownedKernelUpgrades } = get();
        return kernelData
          .filter((k) => ownedKernelUpgrades.includes(k.id) && k.effect.type === "passiveKnowledge")
          .reduce((sum, k) => sum + k.effect.value, 0);
      },

      getXPMultiplier: () => {
        const { ownedKernelUpgrades } = get();
        const boost = kernelData
          .filter((k) => ownedKernelUpgrades.includes(k.id) && k.effect.type === "xpBoost")
          .reduce((sum, k) => sum + k.effect.value, 0);
        return 1 + boost;
      },

      // ── Core actions ─────────────────────────────────────────────────────

      learnCode: () => {
        const { resources, dailyChallenge, stats, getKnowledgePerClick, checkAchievements } = get();
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
        set({
          resources: newResources,
          dailyChallenge: newChallenge,
          stats: { ...stats, totalClicks: stats.totalClicks + 1, totalKnowledge: stats.totalKnowledge + gained },
        });
        sfx("click");
        checkAchievements();
      },

      tick: () => {
        const { resources, stats, dailyChallenge, getFocusRegenRate, getPassiveKnowledge } = get();
        const focus = Math.min(resources.focus + getFocusRegenRate(), resources.maxFocus);
        const passive = getPassiveKnowledge();

        // Daily: passives Wissen zählt für earnKnowledge mit
        let newChallenge = dailyChallenge;
        if (passive > 0 && dailyChallenge && !dailyChallenge.claimed && dailyChallenge.type === "earnKnowledge") {
          newChallenge = { ...dailyChallenge, current: Math.min(dailyChallenge.current + passive, dailyChallenge.required) };
        }

        set({
          resources: { ...resources, focus, knowledge: resources.knowledge + passive },
          stats: { ...stats, playSeconds: stats.playSeconds + 1, totalKnowledge: stats.totalKnowledge + passive },
          dailyChallenge: newChallenge,
          lastActiveAt: Date.now(),
        });
      },

      getSkillCost: (skillId) => {
        const skill = get().skills.find((s) => s.id === skillId);
        if (!skill) return 0;
        return skill.baseCost * (skill.level + 1);
      },

      buySkillLevel: (skillId) => {
        const { resources, skills, getSkillCost, dailyChallenge, stats, checkAchievements } = get();
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
          stats: { ...stats, totalXP: stats.totalXP + 5 },
        });
        sfx("levelup");
        checkAchievements();
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

      allSkillsMaxed: (epochNr) => {
        const nr = epochNr ?? epochNrOf(get().currentEpoch);
        return get().skills
          .filter((s) => epochOf(s) === nr)
          .every((s) => s.level >= s.maxLevel);
      },

      generateRandomProject: () => {
        const { projectPool, skills, currentEpoch, allSkillsMaxed } = get();
        const epochNr = epochNrOf(currentEpoch);
        const epochPool = projectPool.filter((p) => epochOf(p) === epochNr);
        const epochSkills = skills.filter((s) => epochOf(s) === epochNr);

        if (allSkillsMaxed(epochNr)) {
          const grad = epochPool.find((p) => p.isGraduation && !p.completed);
          if (grad) {
            set({ activeProject: grad });
            return;
          }
          // Abschluss geschafft → freies Spiel: alle normalen Aufträge wiederholbar
        }

        const fresh = epochPool.filter((p) => !p.completed && !p.isGraduation);
        const pool = fresh.length > 0
          ? fresh
          : epochPool.filter((p) => !p.isGraduation);

        // Weight each project by how close the player is to meeting requirements.
        // maxReq = highest required level across all requirements of that project.
        // Player skill average gives a "center". Projects within ±15 of that center
        // get high weight; too far above get low weight; already-meetable get medium.
        const avgSkill = epochSkills.reduce((s, sk) => s + sk.level, 0) / Math.max(epochSkills.length, 1);

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
        set({ activeProject: pool[0] ?? null });
      },

      acceptProject: () => {
        const {
          activeProject, resources, projectPool,
          getProjectSuccessChance, generateRandomProject, getXPMultiplier,
          currentStreak, bestStreak, dailyChallenge, stats, checkAchievements,
        } = get();
        if (!activeProject || activeProject.isGraduation) return;

        const chance = getProjectSuccessChance(activeProject);
        const success = Math.random() * 100 <= chance;

        if (!success) {
          set({
            resources: { ...resources, experience: resources.experience + 3 },
            failedProjects: get().failedProjects + 1,
            currentStreak: 0,
            stats: { ...stats, totalXP: stats.totalXP + 3 },
          });
          sfx("fail");
          generateRandomProject();
          return;
        }

        const newStreak = currentStreak + 1;
        const multiplier = streakMultiplier(newStreak);
        const isRepeat = activeProject.completed;
        const baseXP = isRepeat
          ? Math.max(5, Math.round(activeProject.rewards.experience * 0.25))
          : activeProject.rewards.experience;
        const earnedXP = Math.round(baseXP * multiplier * getXPMultiplier());

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
          stats: { ...stats, totalXP: stats.totalXP + earnedXP },
        });
        sfx("success");
        checkAchievements();
        generateRandomProject();
      },

      completeGraduation: () => {
        const { activeProject, resources, projectPool, stats, kernelPoints, getXPMultiplier, checkAchievements } = get();
        if (!activeProject?.isGraduation) return;
        const earnedXP = Math.round(activeProject.rewards.experience * getXPMultiplier());
        const kpReward = GRADUATION_KP[epochOf(activeProject)] ?? 3;
        set({
          resources: { ...resources, experience: resources.experience + earnedXP },
          completedProjects: get().completedProjects + 1,
          projectPool: projectPool.map((p) => p.id === activeProject.id ? { ...p, completed: true } : p),
          activeProject: null,
          epochTransition: true,
          kernelPoints: kernelPoints + kpReward,
          stats: { ...stats, totalXP: stats.totalXP + earnedXP },
        });
        sfx("achievement");
        checkAchievements();
      },

      dismissTransition: () => {
        const next = get().currentEpoch === "kinderzimmer" ? "azubi" : "freelancer";
        set({ epochTransition: false, currentEpoch: next, activeProject: null });
      },

      setEpoch: (epoch) => set({ currentEpoch: epoch, activeProject: null }),

      declineProject: () => {
        set({ declinedProjects: get().declinedProjects + 1, currentStreak: 0 });
        get().generateRandomProject();
      },

      // ── Upgrades ─────────────────────────────────────────────────────────

      buyUpgrade: (upgradeId) => {
        const { resources, roomUpgrades, ownedKernelUpgrades, checkAchievements } = get();
        const upgrade = roomUpgrades.find((u) => u.id === upgradeId);
        if (!upgrade || upgrade.owned || resources.experience < upgrade.cost) return;

        const newUpgrades = roomUpgrades.map((u) => u.id === upgradeId ? { ...u, owned: true } : u);
        const newMaxFocus = recalcMaxFocus(newUpgrades, ownedKernelUpgrades);

        set({
          resources: {
            ...resources,
            experience: resources.experience - upgrade.cost,
            maxFocus: newMaxFocus,
            focus: Math.min(resources.focus, newMaxFocus),
          },
          roomUpgrades: newUpgrades,
        });
        sfx("buy");
        checkAchievements();
      },

      // ── Skins ─────────────────────────────────────────────────────────────

      buySkin: (skinId) => {
        const { resources, ownedSkins, checkAchievements } = get();
        const skin = skinData.find((s) => s.id === skinId);
        if (!skin || ownedSkins.includes(skinId) || resources.experience < skin.price) return;
        set({
          resources: { ...resources, experience: resources.experience - skin.price },
          ownedSkins: [...ownedSkins, skinId],
          activeSkin: skinId,
        });
        sfx("buy");
        checkAchievements();
      },

      setSkin: (skinId) => {
        if (get().ownedSkins.includes(skinId)) set({ activeSkin: skinId });
      },

      // ── Kernel ────────────────────────────────────────────────────────────

      buyKernelUpgrade: (upgradeId) => {
        const { kernelPoints, ownedKernelUpgrades, roomUpgrades, resources, checkAchievements } = get();
        const upgrade = kernelData.find((k) => k.id === upgradeId);
        if (!upgrade || ownedKernelUpgrades.includes(upgradeId) || kernelPoints < upgrade.cost) return;
        if (upgrade.requires && !ownedKernelUpgrades.includes(upgrade.requires)) return;

        const newOwned = [...ownedKernelUpgrades, upgradeId];
        const newMaxFocus = recalcMaxFocus(roomUpgrades, newOwned);

        set({
          kernelPoints: kernelPoints - upgrade.cost,
          ownedKernelUpgrades: newOwned,
          resources: {
            ...resources,
            maxFocus: newMaxFocus,
            focus: Math.min(resources.focus, newMaxFocus),
          },
        });
        sfx("buy");
        checkAchievements();
      },

      // ── Achievements ──────────────────────────────────────────────────────

      checkAchievements: () => {
        const state = get();
        const newly = achievementData.filter(
          (a) => !state.unlockedAchievements.includes(a.id) && a.check(state)
        );
        if (newly.length === 0) return;
        const unlocked = [...state.unlockedAchievements, ...newly.map((a) => a.id)];
        // Kernel-Punkte für Erfolgs-Meilensteine (alle KP_ACHIEVEMENT_STEP Erfolge)
        const milestones = Math.floor(unlocked.length / KP_ACHIEVEMENT_STEP);
        const kpGain = Math.max(0, milestones - state.kpMilestonesCredited);
        set({
          unlockedAchievements: unlocked,
          achievementQueue: [...state.achievementQueue, ...newly.map((a) => a.id)],
          kernelPoints: state.kernelPoints + kpGain,
          kpMilestonesCredited: Math.max(state.kpMilestonesCredited, milestones),
        });
        sfx("achievement");
      },

      shiftAchievement: () => {
        set({ achievementQueue: get().achievementQueue.slice(1) });
      },

      // ── Sound ─────────────────────────────────────────────────────────────

      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),

      // ── Offline-Fortschritt ───────────────────────────────────────────────

      applyOfflineProgress: () => {
        const { lastActiveAt, resources, stats, getFocusRegenRate, getPassiveKnowledge } = get();
        const now = Date.now();
        const awaySeconds = Math.floor((now - lastActiveAt) / 1000);
        // Erst ab 1 Minute Abwesenheit lohnt sich eine Anzeige
        if (!lastActiveAt || awaySeconds < 60) {
          set({ lastActiveAt: now });
          return;
        }
        const counted = Math.min(awaySeconds, OFFLINE_CAP_SECONDS);
        const missing = resources.maxFocus - resources.focus;
        const focusGained = Math.min(Math.floor(counted * getFocusRegenRate()), missing);
        const knowledgeGained = counted * getPassiveKnowledge();

        if (focusGained > 0 || knowledgeGained > 0) {
          set({
            resources: {
              ...resources,
              focus: resources.focus + focusGained,
              knowledge: resources.knowledge + knowledgeGained,
            },
            stats: { ...stats, totalKnowledge: stats.totalKnowledge + knowledgeGained },
            lastActiveAt: now,
            welcomeBack: { awaySeconds, focusGained, knowledgeGained },
          });
        } else {
          set({ lastActiveAt: now });
        }
      },

      dismissWelcomeBack: () => set({ welcomeBack: null }),

      // ── Daily Challenge ───────────────────────────────────────────────────

      checkAndRefreshChallenge: () => {
        const { dailyChallenge } = get();
        const today = todayISO();
        if (!dailyChallenge || dailyChallenge.date !== today) {
          set({ dailyChallenge: generateChallenge() });
        }
      },

      claimDailyReward: () => {
        const { dailyChallenge, resources, stats, checkAchievements } = get();
        if (!dailyChallenge || dailyChallenge.claimed) return;
        if (dailyChallenge.current < dailyChallenge.required) return;
        set({
          dailyChallenge: { ...dailyChallenge, claimed: true },
          resources: { ...resources, experience: resources.experience + dailyChallenge.rewardXP },
          stats: { ...stats, totalXP: stats.totalXP + dailyChallenge.rewardXP, dailiesClaimed: stats.dailiesClaimed + 1 },
        });
        sfx("claim");
        checkAchievements();
      },

      // ── Active Goal ───────────────────────────────────────────────────────

      getActiveGoal: () => {
        const { skills, projectPool, currentEpoch, allSkillsMaxed } = get();
        const epochNr = epochNrOf(currentEpoch);
        const epochSkills = skills.filter((s) => epochOf(s) === epochNr);
        const epochProjects = projectPool.filter((p) => epochOf(p) === epochNr);

        if (allSkillsMaxed(epochNr)) {
          const grad = epochProjects.find((p) => p.isGraduation && !p.completed);
          if (grad) return { label: epochNr === 2 ? "Abschlussprüfung!" : "Abschlussprojekt!", current: 0, required: 0 };
          return { label: "Epoche abgeschlossen!", current: 0, required: 0 };
        }
        const fresh = epochProjects.filter((p) => !p.completed && !p.isGraduation);
        const available = fresh.length > 0 ? fresh : epochProjects.filter((p) => !p.isGraduation);
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
            const skill = epochSkills.find((s) => s.id === req.skillId);
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
          stats: { ...initialState.stats },
          ownedSkins: ["standard"],
          ownedKernelUpgrades: [],
          achievementQueue: [],
          unlockedAchievements: [],
          dailyChallenge: generateChallenge(),
          lastActiveAt: Date.now(),
        });
      },
      };
    },
    {
      name: "nuvio-tycoon-save",
      version: 5,
      migrate: (persisted: unknown, version: number) => {
        // Defensive: if persisted state is unusable, start fresh
        if (!persisted || typeof persisted !== "object") return { ...initialState };
        const s = persisted as Partial<GameState>;
        // Fehlende Felder kommen immer aus initialState
        const merged: GameState = { ...initialState, ...s };
        if (version < 2) {
          merged.roomUpgrades = initialUpgrades.map((u) => ({ ...u }));
        }
        if (version < 3) {
          merged.roomUpgrades =
            s.roomUpgrades && s.roomUpgrades.length === initialUpgrades.length
              ? s.roomUpgrades
              : initialUpgrades.map((u) => ({ ...u }));
        }
        if (version < 4) {
          // Skins, Stats, Achievements, Sound, Offline
          merged.ownedSkins = s.ownedSkins ?? ["standard"];
          merged.activeSkin = s.activeSkin ?? "standard";
          merged.unlockedAchievements = s.unlockedAchievements ?? [];
          merged.achievementQueue = [];
          merged.stats = { ...initialState.stats, ...(s.stats ?? {}) };
          merged.soundEnabled = s.soundEnabled ?? true;
          merged.lastActiveAt = s.lastActiveAt ?? Date.now();
          merged.welcomeBack = null;
        }
        if (version < 5) {
          // Stage 2: Daten neu aufbauen, Fortschritt per ID erhalten —
          // so erreichen neue Skills/Projekte/Upgrades auch Bestandsspieler.
          merged.skills = initialSkills.map((def) => {
            const old = s.skills?.find((x) => x.id === def.id);
            return { ...def, level: old?.level ?? 0 };
          });
          merged.projectPool = initialProjects.map((def) => {
            const old = s.projectPool?.find((x) => x.id === def.id);
            return { ...def, completed: old?.completed ?? false };
          });
          merged.roomUpgrades = initialUpgrades.map((def) => {
            const old = merged.roomUpgrades?.find((x) => x.id === def.id);
            return { ...def, owned: old?.owned ?? false };
          });
          // Kernel: rückwirkend KP für bisherigen Fortschritt gutschreiben
          merged.ownedKernelUpgrades = [];
          merged.kpMilestonesCredited = Math.floor(
            (merged.unlockedAchievements?.length ?? 0) / KP_ACHIEVEMENT_STEP
          );
          const graduated1 = merged.projectPool.some(
            (p) => p.isGraduation && epochOf(p) === 1 && p.completed
          );
          merged.kernelPoints =
            (graduated1 ? GRADUATION_KP[1] : 0) + merged.kpMilestonesCredited;
          // Aktives Projekt könnte veraltet sein → neu generieren lassen
          merged.activeProject = null;
          // maxFocus aus Upgrades neu berechnen
          const newMax = recalcMaxFocus(merged.roomUpgrades, merged.ownedKernelUpgrades);
          merged.resources = {
            ...merged.resources,
            maxFocus: newMax,
            focus: Math.min(merged.resources.focus, newMax),
          };
        }
        return merged;
      },
    }
  )
);
