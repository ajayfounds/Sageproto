import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "./icons";

type Tab = "home" | "activity" | "goals" | "pulse" | "profile";
type Props = { onNavigate?: (tab: Tab) => void; onSignOut?: () => void };

const CURRENCIES = ["INR (₹)", "USD ($)", "EUR (€)", "GBP (£)"];
const DAYS = ["Sundays", "Mondays", "Fridays", "Saturdays"];
const PRIVACY = ["Only you", "Friends", "Public"];

export default function ProfileScreen({ onNavigate, onSignOut }: Props = {}) {
  const [name, setName] = useState("Priya");
  const [email, setEmail] = useState("priya@sage.app");
  const [salary, setSalary] = useState(58000);
  const [currency, setCurrency] = useState(0);
  const [checkInDay, setCheckInDay] = useState(0);
  const [notifs, setNotifs] = useState(true);
  const [privacy, setPrivacy] = useState(0);

  const editName = () => {
    const v = window.prompt("Display name", name);
    if (v && v.trim()) {
      setName(v.trim());
      toast.success("Name updated");
    }
  };
  const editEmail = () => {
    const v = window.prompt("Email", email);
    if (v && v.trim()) {
      setEmail(v.trim());
      toast.success("Email updated");
    }
  };
  const editSalary = () => {
    const v = window.prompt("Monthly salary (₹)", String(salary));
    const n = Number(v);
    if (n > 0) {
      setSalary(n);
      toast.success("Salary updated");
    }
  };

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <div className="relative size-full bg-[#050E0B] overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-6 pt-2">
        <p className="text-[#EEF2ED] text-[28px]" style={{ fontFamily: "Fraunces, serif", fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
          Profile
        </p>
      </div>

      <div className="px-5 pt-4 pb-[100px] overflow-y-auto h-[calc(100%-100px-80px)] space-y-4">
        <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-4 flex items-center gap-4">
          <button
            onClick={() => toast("Sage")}
            className="size-14 rounded-full bg-[#00BC7D]/15 border border-[#00BC7D]/30 flex items-center justify-center text-[#7EC8A4]"
          >
            <Icon name="leaf" size={24} />
          </button>
          <div className="flex-1">
            <button onClick={editName} className="block text-left text-white text-[18px]">{name}</button>
            <button onClick={editEmail} className="block text-left text-white/50 text-[12px] mt-0.5">{email}</button>
          </div>
        </div>

        <div className="rounded-[16px] border border-white/10 bg-white/[0.03] overflow-hidden">
          <Row
            label="Monthly salary"
            value={fmt(salary)}
            onClick={editSalary}
          />
          <Row
            label="Currency"
            value={CURRENCIES[currency]}
            onClick={() => {
              setCurrency((c) => (c + 1) % CURRENCIES.length);
              toast(`Currency: ${CURRENCIES[(currency + 1) % CURRENCIES.length]}`);
            }}
          />
          <Row
            label="Weekly check-in"
            value={DAYS[checkInDay]}
            onClick={() => {
              setCheckInDay((d) => (d + 1) % DAYS.length);
              toast(`Check-in: ${DAYS[(checkInDay + 1) % DAYS.length]}`);
            }}
          />
          <Row
            label="Notifications"
            value={notifs ? "On" : "Off"}
            onClick={() => {
              setNotifs((v) => !v);
              toast(`Notifications ${!notifs ? "on" : "off"}`);
            }}
            valueClass={notifs ? "text-[#7EC8A4]" : "text-[#F07B6A]"}
          />
          <Row
            label="Privacy"
            value={PRIVACY[privacy]}
            onClick={() => {
              setPrivacy((p) => (p + 1) % PRIVACY.length);
              toast(`Privacy: ${PRIVACY[(privacy + 1) % PRIVACY.length]}`);
            }}
            last
          />
        </div>

        <button
          onClick={() => {
            if (window.confirm("Sign out?")) {
              onSignOut?.();
            }
          }}
          className="w-full py-3 rounded-full border border-white/15 text-white/70 text-[12px]"
        >
          Sign out
        </button>
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-[80px] bg-[#0A0F0C]/[0.97]">
        <div className="absolute inset-x-0 top-0 h-px bg-[#7EC8A4]/[0.15]" />
        <div className="flex h-full">
          {([
            { key: "home",     icon: "⌂", label: "Home" },
            { key: "activity", icon: "≡", label: "Activity" },
            { key: "goals",    icon: "◎", label: "Goals" },
            { key: "pulse",    icon: "♡", label: "Pulse" },
            { key: "profile",  icon: "⊙", label: "Profile" },
          ] as const).map((t) => {
            const active = t.key === "profile";
            return (
              <button
                key={t.key}
                onClick={() => onNavigate?.(t.key)}
                className="flex-1 flex flex-col items-center justify-center gap-[3px] relative"
              >
                <p className={`leading-none text-[26px] ${active ? "text-[#7EC8A4]" : "text-[#5A7060]"}`}>{t.icon}</p>
                <p className={`leading-none text-[12px] ${active ? "text-[#7EC8A4]" : "text-[#5A7060]"}`}>{t.label}</p>
                {active && <div className="absolute bottom-[8px] size-[6px] rounded-full bg-[#7EC8A4]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  onClick,
  last,
  valueClass,
}: {
  label: string;
  value: string;
  onClick: () => void;
  last?: boolean;
  valueClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 ${last ? "" : "border-b border-white/[0.05]"}`}
    >
      <p className="text-white/70 text-[12px]">{label}</p>
      <p className={valueClass ?? "text-white/90 text-[11px] text-[12px]"}>{value}</p>
    </button>
  );
}
