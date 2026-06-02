import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";
import BottomTabBar, { TabKey } from "./BottomTabBar";

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
  green: { text: "text-[#0E6E63]", bg: "bg-[#D6EDE9]", border: "border-[#0E6E63]/[0.22]", barFrom: "from-[#0E6E63]", barTo: "to-[#3FAE9F]" },
  gold:  { text: "text-[#C68A2E]", bg: "bg-[#FBF1E0]", border: "border-[#C68A2E]/[0.22]", barFrom: "from-[#C68A2E]", barTo: "to-[#C68A2E]" },
  blue:  { text: "text-[#2C6FB5]", bg: "bg-[#FFFFFF]", border: "border-[#2C6FB5]/[0.22]", barFrom: "from-[#2C6FB5]", barTo: "to-[#2C6FB5]" },
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

type Props = { onNavigate?: (tab: TabKey) => void };

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
    <div className="relative size-full bg-[#F5F8FA] overflow-hidden">
      {/* Status bar spacer */}
      <div className="h-[44px]" />

      <div className="px-6 pt-2">
        <p className="text-[#0B1F33] text-[24px]" style={{ fontFamily: "var(--font-sans)", fontWeight: 700, letterSpacing: "-0.01em" }}>
          Your Goals
        </p>
        <p className="text-[#65717E] text-[13px] mt-1">
          {goals.length} active · {onTrack ? "on track overall" : "needs attention"}
        </p>
      </div>

      <div className="px-5 pt-4 pb-[100px] space-y-4 overflow-y-auto h-[calc(100%-90px-80px)]">
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
                    <p className="text-[#0B1F33] text-[13px]">{g.name}</p>
                    <p className="text-[#65717E] text-[9px] mt-1">By {g.byDate}</p>
                  </div>
                  <p className={`${a.text} text-[22px]`} style={{ fontFamily: "var(--font-sans)", fontWeight: 700, letterSpacing: "-0.01em" }}>{pct}%</p>
                </div>

                <p className={`${a.text} text-[18px] mt-3`} style={{ fontFamily: "var(--font-sans)", fontWeight: 700, letterSpacing: "-0.01em" }}>{fmt(g.saved)}</p>
                <p className="text-[#65717E] text-[9px]">of {fmt(g.target)}</p>

                <div className="mt-3 h-[5px] rounded-full bg-[#F5F8FA] overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${a.barFrom} ${a.barTo} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between mt-2">
                  <p className="text-[#65717E] text-[9px]">Saving {fmt(g.monthly)}/mo</p>
                  <p className="text-[#65717E] text-[9px]">{monthsLeft(g)}</p>
                </div>
              </button>

              {open && (
                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => contribute(g.id, 500)}
                    className={`text-[13px] py-2 rounded-full border ${a.border} ${a.text}`}
                  >
                    + ₹500
                  </button>
                  <button
                    onClick={() => contribute(g.id, g.monthly)}
                    className={`text-[13px] py-2 rounded-full border ${a.border} ${a.text}`}
                  >
                    + {fmt(g.monthly)}
                  </button>
                  <button
                    onClick={() => rename(g.id)}
                    className="text-[13px] py-2 rounded-full border border-[#E5EAEE] text-[#65717E]"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => remove(g.id)}
                    className="text-[13px] py-2 rounded-full border border-[#C24A3C]/30 text-[#C24A3C]"
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
            className="w-full rounded-[14px] border border-dashed border-[#0E6E63]/[0.22] py-4 text-[#65717E] text-[13px]"
          >
            + Add a new goal
          </button>
        ) : (
          <div className="rounded-[14px] border border-[#0E6E63]/[0.22] bg-[#FFFFFF] p-4 space-y-2">
            <div className="flex gap-2 flex-wrap">
              {GOAL_ICONS.map((k) => {
                const sel = draft.icon === k;
                return (
                  <button
                    key={k}
                    onClick={() => setDraft({ ...draft, icon: k })}
                    className={`size-9 rounded-full flex items-center justify-center border ${
                      sel ? "border-[#0E6E63] text-[#0E6E63] bg-[#D6EDE9]" : "border-[#E5EAEE] text-[#65717E]"
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
              className="w-full bg-[#F5F8FA] rounded px-3 py-2 text-[13px] text-[#0B1F33] border border-[#E5EAEE] placeholder:text-[#65717E]"
            />
            <input
              value={draft.target}
              onChange={(e) => setDraft({ ...draft, target: e.target.value })}
              placeholder="Target (₹)"
              inputMode="numeric"
              className="w-full bg-[#F5F8FA] rounded px-3 py-2 text-[13px] text-[#0B1F33] border border-[#E5EAEE] placeholder:text-[#65717E]"
            />
            <input
              value={draft.monthly}
              onChange={(e) => setDraft({ ...draft, monthly: e.target.value })}
              placeholder="Monthly saving (₹)"
              inputMode="numeric"
              className="w-full bg-[#F5F8FA] rounded px-3 py-2 text-[13px] text-[#0B1F33] border border-[#E5EAEE] placeholder:text-[#65717E]"
            />
            <input
              value={draft.byDate}
              onChange={(e) => setDraft({ ...draft, byDate: e.target.value })}
              placeholder="By when (e.g. Dec 2026)"
              className="w-full bg-[#F5F8FA] rounded px-3 py-2 text-[13px] text-[#0B1F33] border border-[#E5EAEE] placeholder:text-[#65717E]"
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setAdding(false)}
                className="flex-1 py-2 rounded-full border border-[#E5EAEE] text-[13px] text-[#65717E]"
              >
                Cancel
              </button>
              <button
                onClick={addGoal}
                className="flex-1 py-2 rounded-full bg-[#0E6E63] text-[13px] text-white"
              >
                Add goal
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomTabBar onNavigate={(k) => onNavigate?.(k)} />
    </div>
  );
}
