import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Sage01Onboarding from "../imports/Sage01Onboarding1/Sage01Onboarding1";
import HomeScreen from "./components/HomeScreen";
import ActivityScreen from "./components/ActivityScreen";
import GoalsScreen from "./components/GoalsScreen";
import InsightsScreen from "./components/InsightsScreen";
import ProfileScreen from "./components/ProfileScreen";
import NotificationsScreen from "./components/NotificationsScreen";
import AccountsListScreen from "./components/AccountsListScreen";
import AccountDetailScreen from "./components/AccountDetailScreen";
import CardsScreen from "./components/CardsScreen";
import TransactionDetailScreen, { TransactionDetail } from "./components/TransactionDetailScreen";
import SendMoneyScreen from "./components/SendMoneyScreen";
import BudgetsScreen from "./components/BudgetsScreen";
import SecurityScreen from "./components/SecurityScreen";
import type { TabKey } from "./components/BottomTabBar";

type Screen =
  | "onboarding"
  | "home"
  | "activity"
  | "goals"
  | "insights"
  | "profile"
  | "notifications"
  | "accounts"
  | "accountDetail"
  | "cards"
  | "transactionDetail"
  | "sendMoney"
  | "budgets"
  | "security";

const FRAME_HEIGHT = 852;
const FRAME_WIDTH = 393;

export default function App() {
  const [screen, setScreen] = useState<Screen>("notifications");
  const [onboardingStep, setOnboardingStep] = useState(2);
  const [scale, setScale] = useState(1);
  const [activeAccountId, setActiveAccountId] = useState<string>("a1");
  const [activeTx, setActiveTx] = useState<TransactionDetail | null>(null);
  const [txReturnTo, setTxReturnTo] = useState<Screen>("home");

  const TAB_TO_SCREEN: Record<TabKey, Screen> = {
    home: "home",
    accounts: "accounts",
    cards: "cards",
    insights: "insights",
    profile: "profile",
  };

  const tabNavigate = (k: TabKey) => setScreen(TAB_TO_SCREEN[k]);
  const navigate = (s: Screen | TabKey) => {
    if ((s as TabKey) in TAB_TO_SCREEN) {
      setScreen(TAB_TO_SCREEN[s as TabKey]);
    } else {
      setScreen(s as Screen);
    }
  };
  const openAccount = (id: string) => {
    setActiveAccountId(id);
    setScreen("accountDetail");
  };
  const openTransaction = (tx: TransactionDetail, from: Screen) => {
    setActiveTx(tx);
    setTxReturnTo(from);
    setScreen("transactionDetail");
  };

  useEffect(() => {
    const compute = () => {
      const s = Math.min(
        window.innerWidth / FRAME_WIDTH,
        window.innerHeight / FRAME_HEIGHT,
        1,
      );
      setScale(s);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

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
      case "home": return <HomeScreen onNavigate={navigate} onOpenTransaction={(tx) => openTransaction(tx, "home")} />;
      case "activity": return <ActivityScreen onNavigate={navigate} onOpenTransaction={(tx) => openTransaction(tx, "activity")} />;
      case "goals": return <GoalsScreen onNavigate={navigate} />;
      case "insights": return <InsightsScreen onNavigate={tabNavigate} />;
      case "profile": return <ProfileScreen onNavigate={navigate} onSignOut={handleSignOut} />;
      case "notifications": return <NotificationsScreen onBack={() => setScreen("home")} />;
      case "accounts": return <AccountsListScreen onNavigate={tabNavigate} onOpenAccount={openAccount} />;
      case "accountDetail": return <AccountDetailScreen accountId={activeAccountId} onBack={() => setScreen("accounts")} onNavigate={tabNavigate} onOpenTransaction={(tx) => openTransaction(tx, "accountDetail")} />;
      case "cards": return <CardsScreen onNavigate={tabNavigate} />;
      case "transactionDetail":
        return activeTx ? <TransactionDetailScreen tx={activeTx} onBack={() => setScreen(txReturnTo)} /> : null;
      case "sendMoney":
        return <SendMoneyScreen onBack={() => setScreen("home")} onViewReceipt={(tx) => openTransaction(tx, "home")} />;
      case "budgets":
        return <BudgetsScreen onNavigate={tabNavigate} />;
      case "security":
        return <SecurityScreen onBack={() => setScreen("profile")} />;
    }
  };

  return (
    <>
      <Toaster theme="light" position="top-center" />
      <div className="fixed inset-0 flex items-center justify-center bg-[#EAF0F4] overflow-hidden">
        <div
          className="relative shrink-0"
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
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
              <div className="absolute top-2 right-2 text-[13px] text-[#0E6E63] bg-[#FFFFFF] px-2 py-1 rounded">
                {onboardingStep}/3 done
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </>
  );
}
