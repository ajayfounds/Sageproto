import { useState } from "react";
import { Toaster, toast } from "sonner";
import Sage01Onboarding from "../imports/Sage01Onboarding1/Sage01Onboarding1";
import HomeScreen from "./components/HomeScreen";
import ActivityScreen from "./components/ActivityScreen";
import GoalsScreen from "./components/GoalsScreen";
import PulseScreen from "./components/PulseScreen";
import ProfileScreen from "./components/ProfileScreen";

type Screen = "onboarding" | "home" | "activity" | "goals" | "pulse" | "profile";

const FRAME_HEIGHT = 844;
const FRAME_WIDTH = 390;

export default function App() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [onboardingStep, setOnboardingStep] = useState(2);

  const handleSignOut = () => {
    setScreen("onboarding");
    setOnboardingStep(2);
    toast("Signed out");
  };

  const handleOnboardingCheck = (step: number) => {
    setOnboardingStep(step);
    toast.success(`Step ${step} complete`);
  };

  const renderScreen = () => {
    switch (screen) {
      case "onboarding": return <Sage01Onboarding />;
      case "home": return <HomeScreen onNavigate={setScreen} />;
      case "activity": return <ActivityScreen onNavigate={setScreen} />;
      case "goals": return <GoalsScreen onNavigate={setScreen} />;
      case "pulse": return <PulseScreen onNavigate={setScreen} />;
      case "profile": return <ProfileScreen onNavigate={setScreen} onSignOut={handleSignOut} />;
    }
  };

  return (
    <div className="size-full flex items-center justify-center bg-[#050505] p-4 overflow-auto">
      <Toaster theme="dark" position="top-center" />
      <div
        className="relative shrink-0"
        style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
      >
        {renderScreen()}

        {screen === "onboarding" && (
          <>
            <button
              onClick={() => handleOnboardingCheck(1)}
              className="absolute cursor-pointer"
              style={{ left: "6.15%", right: "48.72%", top: "44.5%", height: "4.4%" }}
              aria-label="Step 1"
            />
            <button
              onClick={() => handleOnboardingCheck(2)}
              className="absolute cursor-pointer"
              style={{ left: "6.15%", right: "48.72%", top: "48.5%", height: "4.4%" }}
              aria-label="Step 2"
            />
            <button
              onClick={() => handleOnboardingCheck(3)}
              className="absolute cursor-pointer"
              style={{ left: "6.15%", right: "48.72%", top: "52.5%", height: "4.4%" }}
              aria-label="Step 3"
            />
            <button
              onClick={() => {
                toast.success("Welcome to Sage");
                setScreen("home");
              }}
              className="absolute cursor-pointer"
              style={{ left: "6.15%", right: "6.15%", top: "59.48%", height: "5.45%" }}
              aria-label="Set my first goal"
            />
            <button
              onClick={() => setScreen("home")}
              className="absolute cursor-pointer"
              style={{ left: "6.15%", right: "6.15%", top: "65.88%", height: "5.21%" }}
              aria-label="Skip for now"
            />
            {onboardingStep > 0 && (
              <div className="absolute top-2 right-2 text-[10px] text-[#7EC8A4] bg-[#0E1A10] px-2 py-1 rounded">
                {onboardingStep}/3 done
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
