import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import TopBar from "../components/TopBar";
import ClickArea from "../components/ClickArea";
import SkillPanel from "../components/SkillPanel";
import ProjectPanel from "../components/ProjectPanel";
import BottomNav, { type TabId } from "../components/BottomNav";
import EpochenGrid from "../components/EpochenGrid";
import EinstellungenTab from "../components/EinstellungenTab";
import ShopTab from "../components/ShopTab";
import DailyChallengeCard from "../components/DailyChallengeCard";

function Kinderzimmer() {
  const {
    resources,
    skills,
    activeProject,
    completedProjects,
    failedProjects,
    declinedProjects,
    epochTransition,
    currentStreak,
    bestStreak,
    dailyChallenge,
    roomUpgrades,
    resetGame,
    learnCode,
    regenFocus,
    buySkillLevel,
    getSkillCost,
    getProjectSuccessChance,
    generateRandomProject,
    acceptProject,
    completeGraduation,
    declineProject,
    getActiveGoal,
    dismissTransition,
    buyUpgrade,
    claimDailyReward,
    checkAndRefreshChallenge,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabId>("uebersicht");

  // Focus regen
  useEffect(() => {
    const id = window.setInterval(regenFocus, 1000);
    return () => window.clearInterval(id);
  }, [regenFocus]);

  // Generate project if none active
  useEffect(() => {
    if (!activeProject) generateRandomProject();
  }, [activeProject, generateRandomProject]);

  // Check daily challenge on mount
  useEffect(() => {
    checkAndRefreshChallenge();
  }, [checkAndRefreshChallenge]);

  const successChance = activeProject ? getProjectSuccessChance(activeProject) : 0;
  const activeGoal = getActiveGoal();

  const totalLevels = skills.reduce((s, sk) => s + sk.maxLevel, 0);
  const currentLevels = skills.reduce((s, sk) => s + sk.level, 0);
  const goalProgress = Math.round((currentLevels / totalLevels) * 100);

  const tabContent: Record<TabId, React.ReactNode> = {
    uebersicht: (
      <div className="space-y-3">
        <ClickArea focus={resources.focus} knowledgePerClick={getKnowledgePerClick()} onLearnCode={learnCode} />

        {/* Streak badge */}
        {currentStreak >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-2xl border border-[#E0B84A]/30 bg-[#E0B84A]/8 px-4 py-3"
          >
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-xs font-black text-[#E0B84A]">
                {currentStreak}er Streak!
                {currentStreak >= 10 ? " ×2.0 XP" : currentStreak >= 5 ? " ×1.5 XP" : " ×1.25 XP"}
              </p>
              <p className="text-[10px] text-[#B9B2A3]">Bisher bestes: {bestStreak}</p>
            </div>
          </motion.div>
        )}

        <DailyChallengeCard challenge={dailyChallenge} onClaim={claimDailyReward} />
      </div>
    ),

    epochen: (
      <div className="space-y-3">
        <div>
          <h2 className="text-xs font-semibold tracking-[0.25em] text-[#B9B2A3] uppercase">Epochen</h2>
          <p className="mt-0.5 text-[11px] text-[#B9B2A3]/60">Dein Weg vom Kinderzimmer zum Tech-Konzern</p>
        </div>
        <EpochenGrid currentEpoch={1} onEnter={() => setActiveTab("uebersicht")} />
      </div>
    ),

    skills: (
      <SkillPanel
        skills={skills}
        knowledge={resources.knowledge}
        getSkillCost={getSkillCost}
        onBuy={buySkillLevel}
      />
    ),

    projekte: (
      <ProjectPanel
        activeProject={activeProject}
        skills={skills}
        successChance={successChance}
        onGenerate={generateRandomProject}
        onAccept={acceptProject}
        onDecline={declineProject}
        onGraduationComplete={completeGraduation}
      />
    ),

    kernel: (
      <div className="space-y-3">
        <h2 className="text-xs font-semibold tracking-[0.25em] text-[#B9B2A3] uppercase">Kernel</h2>
        <div className="rounded-2xl border border-[#E0B84A]/15 bg-[#111111] p-6 text-center">
          <p className="text-2xl">⚙️</p>
          <p className="mt-2 font-bold text-[#E0B84A]">Kernel Upgrades</p>
          <p className="mt-1 text-xs text-[#B9B2A3]">Kommt in Epoche 2</p>
        </div>
      </div>
    ),

    unternehmen: (
      <div className="space-y-3">
        <h2 className="text-xs font-semibold tracking-[0.25em] text-[#B9B2A3] uppercase">Unternehmen</h2>
        <div className="rounded-2xl border border-[#E0B84A]/15 bg-[#111111] p-6 text-center">
          <p className="text-2xl">🏢</p>
          <p className="mt-2 font-bold text-[#E0B84A]">Unternehmen</p>
          <p className="mt-1 text-xs text-[#B9B2A3]">Kommt in Epoche 3</p>
        </div>
      </div>
    ),

    shop: (
      <ShopTab
        upgrades={roomUpgrades}
        experience={resources.experience}
        onBuy={buyUpgrade}
      />
    ),

    einstellungen: (
      <EinstellungenTab
        resources={resources}
        completedProjects={completedProjects}
        failedProjects={failedProjects}
        declinedProjects={declinedProjects}
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        onReset={resetGame}
      />
    ),
  };

  // Epoch transition overlay
  if (epochTransition) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-dvh flex-col items-center justify-center gap-8 bg-[#050505] px-8 text-center text-[#F5F3EE]"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#E0B84A] bg-[#111111] text-5xl shadow-2xl shadow-[#E0B84A]/20">
            🎓
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-[#E0B84A]">EPOCHE 1 ABGESCHLOSSEN</p>
            <h1 className="mt-2 text-3xl font-black">Kinderzimmer ✓</h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#B9B2A3]">
              NuVion hat die Grundlagen gemeistert. HTML, CSS und JavaScript — alles sitzt. Es ist Zeit, das Kinderzimmer hinter sich zu lassen und ins Azubi-Zimmer aufzusteigen.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            <div className="rounded-2xl border border-[#E0B84A]/20 bg-[#111111] p-4 text-center">
              <p className="text-[10px] text-[#B9B2A3]">ERFAHRUNG</p>
              <p className="text-xl font-black text-[#E0B84A]">{resources.experience.toLocaleString("de-DE")}</p>
            </div>
            <div className="rounded-2xl border border-[#E0B84A]/20 bg-[#111111] p-4 text-center">
              <p className="text-[10px] text-[#B9B2A3]">AUFTRÄGE</p>
              <p className="text-xl font-black">{completedProjects}</p>
            </div>
            <div className="rounded-2xl border border-[#E0B84A]/20 bg-[#111111] p-4 text-center">
              <p className="text-[10px] text-[#B9B2A3]">BEST STREAK</p>
              <p className="text-xl font-black text-[#E0B84A]">{bestStreak}🔥</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={dismissTransition}
            className="rounded-2xl bg-[#E0B84A] px-10 py-4 text-base font-black text-[#050505] shadow-lg shadow-[#E0B84A]/20"
          >
            Ins Azubi-Zimmer →
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <main className="flex h-dvh flex-col bg-[#050505] text-[#F5F3EE]">
      <div className="shrink-0 px-4 pt-4">
        <TopBar
          knowledge={resources.knowledge}
          experience={resources.experience}
          focus={resources.focus}
          maxFocus={resources.maxFocus}
          knowledgePerClick={getKnowledgePerClick()}
          activeGoal={activeGoal}
          goalProgress={goalProgress}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="shrink-0 px-4 pb-4 pt-2">
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    </main>
  );
}

export default Kinderzimmer;
