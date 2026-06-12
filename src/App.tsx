import { useEffect } from "react";
import { useGameStore } from "./store/gameStore";
import RoomPage from "./pages/RoomPage";
import FreelancerTeaser from "./pages/FreelancerTeaser";
import AchievementToast from "./components/AchievementToast";
import WelcomeBackModal from "./components/WelcomeBackModal";

function App() {
  const activeSkin = useGameStore((s) => s.activeSkin);
  const currentEpoch = useGameStore((s) => s.currentEpoch);
  const applyOfflineProgress = useGameStore((s) => s.applyOfflineProgress);

  // Aktiven Skin als Theme auf <html> setzen
  useEffect(() => {
    document.documentElement.dataset.theme = activeSkin;
  }, [activeSkin]);

  // Offline-Fortschritt einmalig beim Start anwenden
  useEffect(() => {
    applyOfflineProgress();
  }, [applyOfflineProgress]);

  return (
    <>
      {currentEpoch === "freelancer" ? (
        <FreelancerTeaser />
      ) : (
        // key erzwingt Remount beim Raumwechsel (frischer Tab- und Szenen-State)
        <RoomPage key={currentEpoch} epochNr={currentEpoch === "azubi" ? 2 : 1} />
      )}
      <AchievementToast />
      <WelcomeBackModal />
    </>
  );
}

export default App;
