import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";

export type Goal = {
  id: string;
  icon: IconKey;
  name: string;
  target: number;
  saved: number;
  monthly: number;
  byDate: string;
  accent: "green" | "gold" | "blue";
};

const GOAL_ICONS: IconKey[] = ["plane", "alert", "laptop", "target", "wallet", "cart"];

const ACCENT = {
  green: { text: "text-[#7EC8A4]", bg: "bg-[#1A2E1F]", border: "border-[#7EC8A4]/[0.22]", barFrom: "from-[#7EC8A4]", barTo: "to-[#A8E4C4]" },
  gold:  { text: "text-[#E8C87A]", bg: "bg-[#1E1A0A]", border: "border-[#E8C87A]/[0.22]", barFrom: "from-[#E8C87A]", barTo: "to-[#F0D89A]" },
  blue:  { text: "text-[#7AB8D4]", bg: "bg-[#0E1C24]", border: "border-[#7AB8D4]/[0.22]", barFrom: "from-[#7AB8D4]", barTo: "to-[#A8CDE4]" },
};

const ACCENT_CYCLE: Goal["accent"][] = ["green", "gold", "blue"];

const DEFAULT_GOALS: Goal[] = [
  { id: "g1", icon: "plane",  name: "Europe Trip",     target: 60000,  saved: 37200, monthly: 5000, byDate: "Dec 2025", accent: "green" },
  { id: "g2", icon: "alert",  name: "Emergency Fund",  target: 100000, saved: 35000, monthly: 3500, byDate: "Jun 2025", accent: "gold"  },
  { id: "g3", icon: "laptop", name: "MacBook Pro",     target: 125000, saved: 25000, monthly: 2000, byDate: "Sep 2025", accent: "blue"  },
];

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

const monthsLeft = (g: Goal) => {
  const remaining = Math.max(0, g.target - g.saved);
  if (g.monthly <= 0) return "—";
  const m = Math.ceil(remaining / g.monthly);
  return `${m} month${m === 1 ? "" : "s"} left`;
};

type Props = { onNavigate?: (tab: "home" | "activity" | "goals" | "pulse" | "profile") => void };

export default function GoalsScreen({ onNavigate }: Props = {}) {
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<{ name: string; target: string; monthly: string; icon: IconKey; byDate: string }>({ name: "", target: "", monthly: "", icon: "target", byDate: "" });

  const onTrack = useMemo(
    () => goals.filter((g) => g.saved / g.target >= 0.3).length >= Math.ceil(goals.length / 2),
    [goals],
  );

  const contribute = (id: string, amount: number) => {
    setGoals((gs) =>
      gs.map((g) => {
        if (g.id !== id) return g;
        const next = Math.min(g.target, g.saved + amount);
        if (next >= g.target && g.saved < g.target) toast.success(`${g.name} complete!`);
        else toast(`${fmt(amount)} added to ${g.name}`);
        return { ...g, saved: next };
      }),
    );
  };

  const remove = (id: string) => {
    const g = goals.find((x) => x.id === id);
    setGoals((gs) => gs.filter((x) => x.id !== id));
    setOpenId(null);
    if (g) toast(`Deleted "${g.name}"`);
  };

  const rename = (id: string) => {
    const cur = goals.find((g) => g.id === id);
    if (!cur) return;
    const name = window.prompt("Rename goal", cur.name);
    if (!name) return;
    setGoals((gs) => gs.map((g) => (g.id === id ? { ...g, name } : g)));
    toast.success("Goal renamed");
  };

  const addGoal = () => {
    const target = Number(draft.target);
    const monthly = Number(draft.monthly);
    if (!draft.name.trim() || !target) {
      toast.error("Name and target required");
      return;
    }
    const accent = ACCENT_CYCLE[goals.length % ACCENT_CYCLE.length];
    setGoals((gs) => [
      ...gs,
      {
        id: `g${Date.now()}`,
        icon: draft.icon,
        name: draft.name.trim(),
        target,
        saved: 0,
        monthly: monthly || 0,
        byDate: draft.byDate || "—",
        accent,
      },
    ]);
    setDraft({ name: "", target: "", monthly: "", icon: "target", byDate: "" });
    setAdding(false);
    toast.success(`"${draft.name}" added`);
  };

  return (
    <div className="relative size-full bg-[#090E0B] overflow-hidden">
      {/* Status bar spacer */}
      <div className="h-[44px]" />

      <div className="px-6 pt-2">
        <p className="text-[#EEF2ED] text-[24px]" style={{ fontFamily: "Fraunces, serif", fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
          Your Goals
        </p>
        <p className="text-[#5A7060] text-[10px] mt-1">
          {goals.length} active · {onTrack ? "on track overall" : "needs attention"}
        </p>
      </div>

      <div className="px-5 pt-4 pb-[80px] space-y-4 overflow-y-auto h-[calc(100%-90px-62px)]">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          const a = ACCENT[g.accent];
          const open = openId === g.id;
          return (
            <div key={g.id} className={`rounded-[14px] border ${a.border} ${a.bg} p-4`}>
              <button onClick={() => setOpenId(open ? null : g.id)} className="w-full text-left">
                <div className="flex items-start gap-3">
                  <div className={`size-8 rounded-full ${a.bg} border ${a.border} flex items-center justify-center ${a.text}`}>
                    <Icon name={g.icon} size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#EEF2ED] text-[13px]">{g.name}</p>
                    <p className="text-[#5A7060] text-[9px] mt-1">By {g.byDate}</p>
                  </div>
                  <p className={`${a.text} text-[22px]`} style={{ fontFamily: "Fraunces, serif" }}>{pct}%</p>
                </div>

                <p className={`${a.text} text-[18px] mt-3`} style={{ fontFamily: "Fraunces, serif" }}>{fmt(g.saved)}</p>
                <p className="text-[#5A7060] text-[9px]">of {fmt(g.target)}</p>

                <div className="mt-3 h-[5px] rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${a.barFrom} ${a.barTo} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between mt-2">
                  <p className="text-[#5A7060] text-[9px]">Saving {fmt(g.monthly)}/mo</p>
                  <p className="text-[#5A7060] text-[9px]">{monthsLeft(g)}</p>
                </div>
              </button>

              {open && (
                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => contribute(g.id, 500)}
                    className={`text-[11px] py-2 rounded-full border ${a.border} ${a.text}`}
                  >
                    + ₹500
                  </button>
                  <button
                    onClick={() => contribute(g.id, g.monthly)}
                    className={`text-[11px] py-2 rounded-full border ${a.border} ${a.text}`}
                  >
                    + {fmt(g.monthly)}
                  </button>
                  <button
                    onClick={() => rename(g.id)}
                    className="text-[11px] py-2 rounded-full border border-white/10 text-white/60"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => remove(g.id)}
                    className="text-[11px] py-2 rounded-full border border-[#F07B6A]/30 text-[#F07B6A]"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            className="w-full rounded-[14px] border border-dashed border-[#7EC8A4]/[0.22] py-4 text-[#5A7060] text-[11px]"
          >
            + Add a new goal
          </button>
        ) : (
          <div className="rounded-[14px] border border-[#7EC8A4]/[0.22] bg-[#0E1A10] p-4 space-y-2">
            <div className="flex gap-2 flex-wrap">
              {GOAL_ICONS.map((k) => {
                const sel = draft.icon === k;
                return (
                  <button
                    key={k}
                    onClick={() => setDraft({ ...draft, icon: k })}
                    className={`size-9 rounded-full flex items-center justify-center border ${
                      sel ? "border-[#7EC8A4] text-[#7EC8A4] bg-[#1A2E1F]" : "border-white/10 text-white/50"
                    }`}
                  >
                    <Icon name={k} size={16} />
                  </button>
                );
              })}
            </div>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Goal name"
              className="w-full bg-black/30 rounded px-3 py-2 text-[12px] text-white placeholder:text-[#5A7060]"
            />
            <input
              value={draft.target}
              onChange={(e) => setDraft({ ...draft, target: e.target.value })}
              placeholder="Target (₹)"
              inputMode="numeric"
              className="w-full bg-black/30 rounded px-3 py-2 text-[12px] text-white placeholder:text-[#5A7060]"
            />
            <input
              value={draft.monthly}
              onChange={(e) => setDraft({ ...draft, monthly: e.target.value })}
              placeholder="Monthly saving (₹)"
              inputMode="numeric"
              className="w-full bg-black/30 rounded px-3 py-2 text-[12px] text-white placeholder:text-[#5A7060]"
            />
            <input
              value={draft.byDate}
              onChange={(e) => setDraft({ ...draft, byDate: e.target.value })}
              placeholder="By when (e.g. Dec 2026)"
              className="w-full bg-black/30 rounded px-3 py-2 text-[12px] text-white placeholder:text-[#5A7060]"
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setAdding(false)}
                className="flex-1 py-2 rounded-full border border-white/10 text-[11px] text-white/60"
              >
                Cancel
              </button>
              <button
                onClick={addGoal}
                className="flex-1 py-2 rounded-full bg-[#7EC8A4] text-[11px] text-[#0A1A0E]"
              >
                Add goal
              </button>
            </div>
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
            const active = t.key === "goals";
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
