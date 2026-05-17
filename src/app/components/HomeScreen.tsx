import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";

type Tx = { id: string; merchant: string; icon: IconKey; amount: number; date: string; type: "debit" | "credit" };

const INITIAL: Tx[] = [
  { id: "h1", merchant: "Swiggy",        icon: "coffee", amount: 340,   date: "Today · 1:30 PM", type: "debit"  },
  { id: "h2", merchant: "Metro Recharge",icon: "train",  amount: 200,   date: "Yesterday",       type: "debit"  },
  { id: "h3", merchant: "Salary Credit", icon: "wallet", amount: 58000, date: "Apr 1",           type: "credit" },
];

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

type Tab = "home" | "activity" | "goals" | "pulse" | "profile" | "notifications";
type Props = { onNavigate?: (tab: Tab) => void };

export default function HomeScreen({ onNavigate }: Props = {}) {
  const [income] = useState(58000);
  const [budget, setBudget] = useState(58000);
  const [txs, setTxs] = useState<Tx[]>(INITIAL);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ merchant: "", amount: "", type: "debit" as Tx["type"] });

  const spent = useMemo(() => txs.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0), [txs]);
  const credited = useMemo(() => txs.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0), [txs]);
  const available = income - spent;
  const saved = Math.max(0, available);
  const pct = Math.min(100, Math.round((spent / Math.max(budget, 1)) * 100));

  const addTx = () => {
    const amount = Number(draft.amount);
    if (!draft.merchant.trim() || !amount) {
      toast.error("Merchant and amount required");
      return;
    }
    setTxs((xs) => [
      { id: `h${Date.now()}`, merchant: draft.merchant.trim(), icon: draft.type === "credit" ? "wallet" : "card", amount, date: "Today", type: draft.type },
      ...xs,
    ]);
    setDraft({ merchant: "", amount: "", type: "debit" });
    setAdding(false);
    toast.success(`Added ${draft.merchant}`);
  };

  const editBudget = () => {
    const v = window.prompt("Monthly budget (₹)", String(budget));
    const n = Number(v);
    if (!n) return;
    setBudget(n);
    toast.success(`Budget set to ${fmt(n)}`);
  };

  return (
    <div className="relative size-full bg-[#090E0B] overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-6 pt-2 flex items-start justify-between">
        <div>
          <p className="text-[#5A7060] text-[10px]">Good morning,</p>
          <p className="text-[#EEF2ED] text-[24px] flex items-center gap-2" style={{ fontFamily: "Fraunces, serif", fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
            Priya <Icon name="wave" size={20} className="text-[#E8C87A]" />
          </p>
        </div>
        <button
          onClick={() => onNavigate?.("notifications")}
          className="relative size-9 rounded-full bg-[#7EC8A4]/10 border border-[#7EC8A4]/30 flex items-center justify-center text-[#7EC8A4] active:scale-95 transition-transform"
          aria-label="Notifications"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-[6px] right-[6px] size-[6px] rounded-full bg-[#F07B6A] border border-[#0E1A10]" />
        </button>
      </div>

      <div className="px-5 pt-3 pb-[100px] overflow-y-auto h-[calc(100%-90px-80px)]">
        <button onClick={editBudget} className="w-full text-left rounded-[14px] border border-[#7EC8A4]/[0.18] bg-[#0E1A10] p-4">
          <p className="text-[#5A7060] text-[9px] tracking-wider">AVAILABLE THIS MONTH</p>
          <p className="text-[#EEF2ED] text-[34px] mt-1" style={{ fontFamily: "Fraunces, serif" }}>{fmt(available)}</p>
          <div className="h-[3px] bg-white/5 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7EC8A4] to-[#A8E4C4]" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-[#5A7060] text-[9px]">{pct}% of budget used</p>
            <p className="text-[#5A7060] text-[9px]">18 days left</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div>
              <p className="text-[#5A7060] text-[9px]">Income</p>
              <p className="text-[#EEF2ED] text-[12px] mt-1">{fmt(income + credited - 58000 + 58000)}</p>
            </div>
            <div>
              <p className="text-[#5A7060] text-[9px]">Spent</p>
              <p className="text-[#F07B6A] text-[12px] mt-1">{fmt(spent)}</p>
            </div>
            <div>
              <p className="text-[#5A7060] text-[9px]">Saved</p>
              <p className="text-[#7EC8A4] text-[12px] mt-1">{fmt(saved)}</p>
            </div>
          </div>
        </button>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {([
            { key: "add",       label: "Add",       icon: "plus"  as IconKey, onClick: () => setAdding(true) },
            { key: "activity",  label: "Analytics", icon: "chart" as IconKey, onClick: () => onNavigate?.("activity") },
            { key: "goals",     label: "Goals",     icon: "target" as IconKey, onClick: () => onNavigate?.("goals") },
            { key: "pulse",     label: "Pulse",     icon: "pulse" as IconKey, onClick: () => onNavigate?.("pulse") },
          ]).map((q) => (
            <button
              key={q.key}
              onClick={q.onClick}
              className="rounded-[12px] border border-white/5 bg-[#0E1A10] p-3 flex flex-col items-center gap-2"
            >
              <div className="size-8 rounded-full bg-black/40 flex items-center justify-center text-[#7EC8A4]">
                <Icon name={q.icon} size={16} />
              </div>
              <p className="text-[#9BB09F] text-[10px]">{q.label}</p>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-[14px] border border-[#E8C87A]/[0.22] bg-[#1A1408] p-3 flex gap-3 items-start">
          <div className="text-[#E8C87A] mt-[1px]"><Icon name="bulb" size={16} /></div>
          <p className="text-[#EEF2ED] text-[10px] leading-[16px]">
            You're 12% under budget on food this week. At this rate you'll save an extra ₹1,200 this month.
          </p>
        </div>

        <div className="flex justify-between items-center mt-5 mb-2">
          <p className="text-[#EEF2ED] text-[16px]" style={{ fontFamily: "Fraunces, serif" }}>Recent</p>
          <button onClick={() => onNavigate?.("activity")} className="text-[#7EC8A4] text-[10px]">See all →</button>
        </div>

        <div className="space-y-2">
          {txs.slice(0, 5).map((t) => (
            <div key={t.id} className="rounded-[12px] border border-white/5 bg-[#0E1A10] p-3 flex items-center gap-3">
              <div className={`size-8 rounded-full bg-black/40 flex items-center justify-center ${t.type === "credit" ? "text-[#7EC8A4]" : "text-[#9BB09F]"}`}><Icon name={t.icon} size={14} /></div>
              <div className="flex-1">
                <p className="text-[#EEF2ED] text-[12px]">{t.merchant}</p>
                <p className="text-[#5A7060] text-[9px]">{t.date}</p>
              </div>
              <p className={`text-[12px] ${t.type === "credit" ? "text-[#7EC8A4]" : "text-[#F07B6A]"}`}>
                {t.type === "credit" ? "+" : "−"}{fmt(t.amount)}
              </p>
            </div>
          ))}
          {txs.length === 0 && <p className="text-center text-[#5A7060] text-[11px] py-6">No transactions yet</p>}
        </div>

        {adding && (
          <div className="mt-4 rounded-[14px] border border-[#7EC8A4]/[0.22] bg-[#0E1A10] p-4 space-y-2">
            <input
              value={draft.merchant}
              onChange={(e) => setDraft({ ...draft, merchant: e.target.value })}
              placeholder="Merchant"
              className="w-full bg-black/30 rounded px-3 py-2 text-[12px] text-white placeholder:text-[#5A7060]"
            />
            <input
              value={draft.amount}
              onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
              placeholder="Amount (₹)"
              inputMode="numeric"
              className="w-full bg-black/30 rounded px-3 py-2 text-[12px] text-white placeholder:text-[#5A7060]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setDraft({ ...draft, type: "debit" })}
                className={`flex-1 py-2 rounded-full border text-[11px] ${
                  draft.type === "debit" ? "border-[#F07B6A] text-[#F07B6A]" : "border-white/10 text-white/60"
                }`}
              >
                Spent
              </button>
              <button
                onClick={() => setDraft({ ...draft, type: "credit" })}
                className={`flex-1 py-2 rounded-full border text-[11px] ${
                  draft.type === "credit" ? "border-[#7EC8A4] text-[#7EC8A4]" : "border-white/10 text-white/60"
                }`}
              >
                Earned
              </button>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setAdding(false)} className="flex-1 py-2 rounded-full border border-white/10 text-[11px] text-white/60">Cancel</button>
              <button onClick={addTx} className="flex-1 py-2 rounded-full bg-[#7EC8A4] text-[11px] text-[#0A1A0E]">Add</button>
            </div>
          </div>
        )}
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
            const active = t.key === "home";
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
