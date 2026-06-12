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
import KernelTab from "../components/KernelTab";
import DailyChallengeCard from "../components/DailyChallengeCard";

// Fehlendes epoch-Feld bedeutet Epoche 1 (ältere Daten)
const epochOf = (x: { epoch?: number }) => x.epoch ?? 1;

type RoomPageProps = {
  epochNr: 1 | 2;
};

function RoomPage({ epochNr }: RoomPageProps) {
  const {
    resources,
    skills,
    activeProject,
    projectPool,
    completedProjects,
    failedProjects,
    declinedProjects,
    epochTransition,
    currentStreak,
    bestStreak,
    dailyChallenge,
    roomUpgrades,
    ownedSkins,
    activeSkin,
    stats,
    soundEnabled,
    unlockedAchievements,
    kernelPoints,
    ownedKernelUpgrades,
    resetGame,
    learnCode,
    tick,
    buySkillLevel,
    getSkillCost,
    getProjectSuccessChance,
    generateRandomProject,
    acceptProject,
    completeGraduation,
    declineProject,
    getActiveGoal,
    dismissTransition,
    setEpoch,
    buyUpgrade,
    buySkin,
    setSkin,
    buyKernelUpgrade,
    toggleSound,
    claimDailyReward,
    checkAndRefreshChallenge,
    getKnowledgePerClick,
    getPassiveKnowledge,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabId>("uebersicht");

  // Game tick: Fokus-Regen, passives Wissen, Spielzeit, lastActiveAt
  useEffect(() => {
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [tick]);

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
  const passiveKnowledge = getPassiveKnowledge();

  // Skills der aktuellen Epoche (+ gemeisterte aus Epoche 1 im Azubi-Zimmer)
  const epochSkills = skills.filter((s) => epochOf(s) === epochNr);
  const masteredSkills = epochNr === 2 ? skills.filter((s) => epochOf(s) === 1) : undefined;

  const totalLevels = epochSkills.reduce((s, sk) => s + sk.maxLevel, 0);
  const currentLevels = epochSkills.reduce((s, sk) => s + sk.level, 0);
  const goalProgress = totalLevels > 0 ? Math.round((currentLevels / totalLevels) * 100) : 0;

  // Epochen-Fortschritt & Freischaltung
  const normalProjectsOf = (nr: number) =>
    projectPool.filter((p) => !p.isGraduation && epochOf(p) === nr);
  const graduatedOf = (nr: number) =>
    projectPool.some((p) => p.isGraduation && epochOf(p) === nr && p.completed);

  const graduated1 = graduatedOf(1);
  const graduated2 = graduatedOf(2);
  const maxUnlockedEpoch = graduated2 ? 3 : graduated1 ? 2 : 1;

  const e1Projects = normalProjectsOf(1);
  const e2Projects = normalProjectsOf(2);
  const epochProgress = [
    { label: "Epoche 1 — Kinderzimmer", done: e1Projects.filter((p) => p.completed).length, total: e1Projects.length },
    ...(graduated1
      ? [{ label: "Epoche 2 — Azubi-Zimmer", done: e2Projects.filter((p) => p.completed).length, total: e2Projects.length }]
      : []),
  ];

  const handleEnterEpoch = (nr: number) => {
    if (nr === epochNr) {
      setActiveTab("uebersicht");
    } else if (nr === 1) {
      setEpoch("kinderzimmer");
    } else if (nr === 2) {
      setEpoch("azubi");
    } else if (nr === 3) {
      setEpoch("freelancer");
    }
  };

  const tabContent: Record<TabId, React.ReactNode> = {
    uebersicht: (
      <div className="space-y-3">
        <ClickArea
          scene={epochNr === 2 ? "azubi" : "kinderzimmer"}
          focus={resources.focus}
          knowledgePerClick={getKnowledgePerClick()}
          onLearnCode={learnCode}
        />

        {/* Passives Wissen (Kernel) */}
        {passiveKnowledge > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-overlay/8 bg-card px-4 py-3">
            <span className="text-xl">🤖</span>
            <div>
              <p className="text-xs font-black text-accent">+{passiveKnowledge} Wissen/Sek</p>
              <p className="text-[10px] text-muted">Auto-Compiler läuft — auch offline</p>
            </div>
          </div>
        )}

        {/* Streak badge */}
        {currentStreak >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/8 px-4 py-3"
          >
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-xs font-black text-accent">
                {currentStreak}er Streak!
                {currentStreak >= 10 ? " ×2.0 XP" : currentStreak >= 5 ? " ×1.5 XP" : " ×1.25 XP"}
              </p>
              <p className="text-[10px] text-muted">Bisher bestes: {bestStreak}</p>
            </div>
          </motion.div>
        )}

        <DailyChallengeCard challenge={dailyChallenge} onClaim={claimDailyReward} />
      </div>
    ),

    epochen: (
      <div className="space-y-3">
        <div>
          <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">Epochen</h2>
          <p className="mt-0.5 text-[11px] text-muted/60">Dein Weg vom Kinderzimmer zum Tech-Konzern</p>
        </div>
        <EpochenGrid currentEpoch={epochNr} maxUnlocked={maxUnlockedEpoch} onEnter={handleEnterEpoch} />
      </div>
    ),

    skills: (
      <SkillPanel
        skills={epochSkills}
        masteredSkills={masteredSkills}
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
      <KernelTab
        kernelPoints={kernelPoints}
        ownedKernelUpgrades={ownedKernelUpgrades}
        onBuy={buyKernelUpgrade}
      />
    ),

    unternehmen: (
      <div className="space-y-3">
        <h2 className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">Unternehmen</h2>
        <div className="relative overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-br from-card-2 to-card p-8 text-center">
          <p className="text-3xl">🏢</p>
          <p className="mt-3 text-base font-black text-accent">Dein Unternehmen</p>
          <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted">
            Mitarbeiter, Kunden, Umsatz — vom Freelancer zum Tech-Konzern.
          </p>
          <span className="mt-4 inline-block rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-[10px] font-bold text-accent">
            🔒 Wird mit Epoche 3 freigeschaltet
          </span>
        </div>
      </div>
    ),

    shop: (
      <ShopTab
        upgrades={roomUpgrades}
        epoch={epochNr}
        experience={resources.experience}
        ownedSkins={ownedSkins}
        activeSkin={activeSkin}
        onBuy={buyUpgrade}
        onBuySkin={buySkin}
        onSetSkin={setSkin}
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
        epochProgress={epochProgress}
        stats={stats}
        soundEnabled={soundEnabled}
        unlockedAchievements={unlockedAchievements}
        onToggleSound={toggleSound}
        onReset={resetGame}
      />
    ),
  };

  // Epoch transition overlay
  if (epochTransition) {
    const isFirst = epochNr === 1;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-dvh flex-col items-center justify-center gap-8 bg-background px-8 text-center text-foreground"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent bg-card text-5xl shadow-2xl shadow-accent/20">
            🎓
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-accent">
              {isFirst ? "EPOCHE 1 ABGESCHLOSSEN" : "EPOCHE 2 ABGESCHLOSSEN"}
            </p>
            <h1 className="mt-2 text-3xl font-black">{isFirst ? "Kinderzimmer ✓" : "Azubi-Zimmer ✓"}</h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              {isFirst
                ? "NuVion hat die Grundlagen gemeistert. HTML, CSS und JavaScript — alles sitzt. Es ist Zeit, das Kinderzimmer hinter sich zu lassen und ins Azubi-Zimmer aufzusteigen."
                : "Abschlussprüfung bestanden! Git, React, TypeScript — NuVion ist jetzt ausgelernter Entwickler. Zeit für den großen Sprung: die eigene Selbstständigkeit."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            <div className="rounded-2xl border border-accent/20 bg-card p-4 text-center">
              <p className="text-[10px] text-muted">ERFAHRUNG</p>
              <p className="text-xl font-black text-accent">{resources.experience.toLocaleString("de-DE")}</p>
            </div>
            <div className="rounded-2xl border border-accent/20 bg-card p-4 text-center">
              <p className="text-[10px] text-muted">AUFTRÄGE</p>
              <p className="text-xl font-black">{completedProjects}</p>
            </div>
            <div className="rounded-2xl border border-accent/20 bg-card p-4 text-center">
              <p className="text-[10px] text-muted">{isFirst ? "BEST STREAK" : "KERNEL-PUNKTE"}</p>
              <p className="text-xl font-black text-accent">{isFirst ? `${bestStreak}🔥` : `${kernelPoints} KP`}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={dismissTransition}
            className="rounded-2xl bg-accent px-10 py-4 text-base font-black text-accent-foreground shadow-lg shadow-accent/20"
          >
            {isFirst ? "Ins Azubi-Zimmer →" : "In die Selbstständigkeit →"}
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <main className="flex h-dvh flex-col bg-background text-foreground">
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

export default RoomPage;
