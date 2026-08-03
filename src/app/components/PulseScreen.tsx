import { useState } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";
import BottomTabBar, { TabKey } from "./BottomTabBar";

type Mood = "Stressed" | "Calm" | "Great" | "Guilty";
const MOODS: { key: Mood; icon: IconKey; color: string }[] = [
  { key: "Stressed", icon: "frown",   color: "#665efd" },
  { key: "Calm",     icon: "meh",     color: "#9b6829" },
  { key: "Great",    icon: "smile",   color: "#533afd" },
  { key: "Guilty",   icon: "annoyed", color: "#ea2261" },
];

type Props = { onNavigate?: (tab: TabKey) => void };

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
    <div className="relative size-full bg-[#f6f9fc] overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-5 pt-2 pb-[100px] overflow-y-auto h-[calc(100%-44px-80px)] space-y-4">
        <div className="rounded-[16px] border border-[#ea2261]/[0.18] bg-[#FBE7E3] p-5 text-center">
          <p className="text-[#ea2261] text-[13px] tracking-wider">WEEK {week} CHECK-IN</p>
          <p className="text-[#0d253d] text-[22px] mt-2" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, letterSpacing: "-0.01em" }}>How did money feel</p>
          <p className="text-[#ea2261] text-[22px] italic" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, letterSpacing: "-0.01em" }}>this week?</p>
          <p className="text-[#64748d] text-[13px] mt-2">Takes 2 minutes. Completely private.</p>
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
                  active ? "bg-[#f5e9d4]" : "bg-[#FFFFFF] border-white/5"
                }`}
                style={active ? { borderColor: m.color } : undefined}
              >
                <span style={{ color: active ? m.color : "#64748d" }}><Icon name={m.icon} size={20} strokeWidth={1.75} /></span>
                <p className="text-[13px]" style={{ color: active ? m.color : "#64748d" }}>{m.key}</p>
              </button>
            );
          })}
        </div>

        <div className="rounded-[12px] border border-[#e3e8ee] bg-[#FFFFFF] shadow-[0_1px_2px_rgba(11,31,51,0.04)] p-4">
          <p className="text-[#64748d] text-[11px] tracking-wider">THIS WEEK'S REFLECTION</p>
          <p className="text-[#0d253d] text-[13px] mt-2">Was there a purchase you second-guessed?</p>
          {editingReflection ? (
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              onBlur={() => setEditingReflection(false)}
              autoFocus
              rows={4}
              className="w-full mt-3 bg-black/30 rounded p-3 text-[13px] text-[#64748d] resize-none outline-none border border-[#533afd]/30"
            />
          ) : (
            <button
              onClick={() => setEditingReflection(true)}
              className="w-full text-left mt-3 bg-[#f6f9fc] rounded p-3 text-[13px] text-[#64748d] leading-[16px]"
            >
              {reflection || <span className="text-[#64748d]">Tap to write...</span>}
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
            className="rounded-[12px] border border-[#e3e8ee] bg-[#FFFFFF] shadow-[0_1px_2px_rgba(11,31,51,0.04)] p-3 text-left"
          >
            <p className="text-[#64748d] text-[11px] tracking-wider">THIS WEEK</p>
            <p className="text-[#0d253d] text-[20px] mt-1" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, letterSpacing: "-0.01em" }}>{fmt(spend)}</p>
            <p className={`text-[11px] mt-1 ${delta >= 0 ? "text-[#ea2261]" : "text-[#533afd]"}`}>
              {delta >= 0 ? "↑" : "↓"} {fmt(Math.abs(delta))} vs last week
            </p>
          </button>
          <button
            onClick={() => {
              const v = window.prompt("Impulse buys this week", String(impulse));
              const n = Number(v);
              if (n >= 0) setImpulse(n);
            }}
            className="rounded-[12px] border border-[#e3e8ee] bg-[#FFFFFF] shadow-[0_1px_2px_rgba(11,31,51,0.04)] p-3 text-left"
          >
            <p className="text-[#64748d] text-[11px] tracking-wider">IMPULSE BUYS</p>
            <p className="text-[#0d253d] text-[20px] mt-1" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, letterSpacing: "-0.01em" }}>{impulse}</p>
            <p className={`text-[11px] mt-1 ${impulseDelta >= 0 ? "text-[#ea2261]" : "text-[#533afd]"}`}>
              {impulseDelta >= 0 ? "↑" : "↓"} {Math.abs(impulseDelta)} from last week
            </p>
          </button>
        </div>

        <div className="rounded-[12px] border border-[#533afd]/[0.22] bg-[#FFFFFF] p-4 flex gap-3">
          <div className="size-9 rounded-full bg-[#533afd]/10 border border-[#533afd]/30 flex items-center justify-center text-[#533afd] shrink-0">
            <Icon name="leaf" size={16} />
          </div>
          <div>
            <p className="text-[#0d253d] text-[13px]">Sage's nudge for you</p>
            <p className="text-[#64748d] text-[13px] mt-1 leading-[15px]">
              Your food spend goes up on weeks you log 'tired.' Meal prepping Sunday could save ₹1,200/mo —
              no pressure, just a pattern we noticed.
            </p>
          </div>
        </div>

        {!submitted ? (
          <button
            onClick={completeCheckIn}
            className="w-full py-4 rounded-full bg-[#533afd] text-[#FFFFFF] text-[13px]"
          >
            Complete check-in
          </button>
        ) : (
          <div className="space-y-2">
            <div className="rounded-full bg-[#eeecfe] border border-[#533afd]/30 py-3 text-center text-[#533afd] text-[13px]">
              ✓ Week {week} check-in complete
            </div>
            <button
              onClick={startNextWeek}
              className="w-full py-3 rounded-full border border-[#e3e8ee] text-[13px] text-[#64748d]"
            >
              Start week {week + 1}
            </button>
          </div>
        )}
      </div>

      <BottomTabBar active="insights" onNavigate={(k) => onNavigate?.(k)} />
    </div>
  );
}
