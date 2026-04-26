import { useState } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";

type Mood = "Stressed" | "Calm" | "Great" | "Guilty";
const MOODS: { key: Mood; icon: IconKey; color: string }[] = [
  { key: "Stressed", icon: "frown",   color: "#7AB8D4" },
  { key: "Calm",     icon: "meh",     color: "#E8C87A" },
  { key: "Great",    icon: "smile",   color: "#7EC8A4" },
  { key: "Guilty",   icon: "annoyed", color: "#F07B6A" },
];

type Tab = "home" | "activity" | "goals" | "pulse" | "profile";
type Props = { onNavigate?: (tab: Tab) => void };

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function PulseScreen({ onNavigate }: Props = {}) {
  const [week, setWeek] = useState(14);
  const [mood, setMood] = useState<Mood | null>("Calm");
  const [reflection, setReflection] = useState(
    "I ordered Swiggy 4 times this week instead of cooking. Felt lazy but also tired after long work days...",
  );
  const [editingReflection, setEditingReflection] = useState(false);
  const [spend, setSpend] = useState(4820);
  const [lastWeek, setLastWeek] = useState(4200);
  const [impulse, setImpulse] = useState(3);
  const [lastImpulse, setLastImpulse] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const delta = spend - lastWeek;
  const impulseDelta = impulse - lastImpulse;

  const completeCheckIn = () => {
    if (!mood) {
      toast.error("Pick a mood first");
      return;
    }
    setSubmitted(true);
    toast.success(`Week ${week} check-in saved`);
  };

  const startNextWeek = () => {
    setLastWeek(spend);
    setLastImpulse(impulse);
    setSpend(0);
    setImpulse(0);
    setMood(null);
    setReflection("");
    setWeek((w) => w + 1);
    setSubmitted(false);
    toast(`Started week ${week + 1}`);
  };

  return (
    <div className="relative size-full bg-[#090E0B] overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-5 pt-2 pb-[80px] overflow-y-auto h-[calc(100%-44px-62px)] space-y-4">
        <div className="rounded-[16px] border border-[#F07B6A]/[0.18] bg-[#1A0E0C] p-5 text-center">
          <p className="text-[#F07B6A] text-[10px] tracking-wider">WEEK {week} CHECK-IN</p>
          <p className="text-[#EEF2ED] text-[22px] mt-2" style={{ fontFamily: "Fraunces, serif" }}>How did money feel</p>
          <p className="text-[#F07B6A] text-[22px] italic" style={{ fontFamily: "Fraunces, serif" }}>this week?</p>
          <p className="text-[#5A7060] text-[10px] mt-2">Takes 2 minutes. Completely private.</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {MOODS.map((m) => {
            const active = mood === m.key;
            return (
              <button
                key={m.key}
                onClick={() => {
                  setMood(m.key);
                  toast(`Mood: ${m.key}`);
                }}
                className={`rounded-[12px] border p-3 flex flex-col items-center gap-1 transition-colors ${
                  active ? "bg-[#1E1A0A]" : "bg-[#0E1A10] border-white/5"
                }`}
                style={active ? { borderColor: m.color } : undefined}
              >
                <span style={{ color: active ? m.color : "#9BB09F" }}><Icon name={m.icon} size={20} strokeWidth={1.75} /></span>
                <p className="text-[10px]" style={{ color: active ? m.color : "#9BB09F" }}>{m.key}</p>
              </button>
            );
          })}
        </div>

        <div className="rounded-[14px] border border-white/5 bg-[#0E1A10] p-4">
          <p className="text-[#5A7060] text-[9px] tracking-wider">THIS WEEK'S REFLECTION</p>
          <p className="text-[#EEF2ED] text-[12px] mt-2">Was there a purchase you second-guessed?</p>
          {editingReflection ? (
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              onBlur={() => setEditingReflection(false)}
              autoFocus
              rows={4}
              className="w-full mt-3 bg-black/30 rounded p-3 text-[11px] text-[#9BB09F] resize-none outline-none border border-[#7EC8A4]/30"
            />
          ) : (
            <button
              onClick={() => setEditingReflection(true)}
              className="w-full text-left mt-3 bg-black/20 rounded p-3 text-[11px] text-[#9BB09F] leading-[16px]"
            >
              {reflection || <span className="text-[#5A7060]">Tap to write...</span>}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              const v = window.prompt("This week's spend (₹)", String(spend));
              const n = Number(v);
              if (n >= 0) setSpend(n);
            }}
            className="rounded-[14px] border border-white/5 bg-[#0E1A10] p-3 text-left"
          >
            <p className="text-[#5A7060] text-[9px] tracking-wider">THIS WEEK</p>
            <p className="text-[#EEF2ED] text-[20px] mt-1" style={{ fontFamily: "Fraunces, serif" }}>{fmt(spend)}</p>
            <p className={`text-[9px] mt-1 ${delta >= 0 ? "text-[#F07B6A]" : "text-[#7EC8A4]"}`}>
              {delta >= 0 ? "↑" : "↓"} {fmt(Math.abs(delta))} vs last week
            </p>
          </button>
          <button
            onClick={() => {
              const v = window.prompt("Impulse buys this week", String(impulse));
              const n = Number(v);
              if (n >= 0) setImpulse(n);
            }}
            className="rounded-[14px] border border-white/5 bg-[#0E1A10] p-3 text-left"
          >
            <p className="text-[#5A7060] text-[9px] tracking-wider">IMPULSE BUYS</p>
            <p className="text-[#EEF2ED] text-[20px] mt-1" style={{ fontFamily: "Fraunces, serif" }}>{impulse}</p>
            <p className={`text-[9px] mt-1 ${impulseDelta >= 0 ? "text-[#F07B6A]" : "text-[#7EC8A4]"}`}>
              {impulseDelta >= 0 ? "↑" : "↓"} {Math.abs(impulseDelta)} from last week
            </p>
          </button>
        </div>

        <div className="rounded-[14px] border border-[#7EC8A4]/[0.22] bg-[#0E1A10] p-4 flex gap-3">
          <div className="size-9 rounded-full bg-[#7EC8A4]/10 border border-[#7EC8A4]/30 flex items-center justify-center text-[#7EC8A4] shrink-0">
            <Icon name="leaf" size={16} />
          </div>
          <div>
            <p className="text-[#EEF2ED] text-[12px]">Sage's nudge for you</p>
            <p className="text-[#9BB09F] text-[10px] mt-1 leading-[15px]">
              Your food spend goes up on weeks you log 'tired.' Meal prepping Sunday could save ₹1,200/mo —
              no pressure, just a pattern we noticed.
            </p>
          </div>
        </div>

        {!submitted ? (
          <button
            onClick={completeCheckIn}
            className="w-full py-4 rounded-full bg-[#7EC8A4] text-[#0A1A0E] text-[13px]"
          >
            Complete check-in
          </button>
        ) : (
          <div className="space-y-2">
            <div className="rounded-full bg-[#1A2E1F] border border-[#7EC8A4]/30 py-3 text-center text-[#7EC8A4] text-[12px]">
              ✓ Week {week} check-in complete
            </div>
            <button
              onClick={startNextWeek}
              className="w-full py-3 rounded-full border border-white/10 text-[11px] text-white/70"
            >
              Start week {week + 1}
            </button>
          </div>
        )}
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-[62px] bg-[#0A0F0C]/[0.97]">
        <div className="absolute inset-x-0 top-0 h-px bg-[#7EC8A4]/[0.15]" />
        <div className="flex h-full">
          {([
            { key: "home",     icon: "⌂", label: "Home" },
            { key: "activity", icon: "≡", label: "Activity" },
            { key: "goals",    icon: "◎", label: "Goals" },
            { key: "pulse",    icon: "♡", label: "Pulse" },
            { key: "profile",  icon: "⊙", label: "Profile" },
          ] as const).map((t) => {
            const active = t.key === "pulse";
            return (
              <button
                key={t.key}
                onClick={() => onNavigate?.(t.key)}
                className="flex-1 flex flex-col items-center justify-center gap-[2px] relative"
              >
                <p className={`leading-none text-[20px] ${active ? "text-[#7EC8A4]" : "text-[#5A7060]"}`}>{t.icon}</p>
                <p className={`leading-none text-[9px] ${active ? "text-[#7EC8A4]" : "text-[#5A7060]"}`}>{t.label}</p>
                {active && <div className="absolute bottom-[6px] size-[5px] rounded-full bg-[#7EC8A4]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
