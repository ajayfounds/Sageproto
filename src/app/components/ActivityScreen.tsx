import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";

type Category = "Food & Dining" | "Transport" | "Shopping" | "Other";

type Tx = {
  id: string;
  merchant: string;
  icon: IconKey;
  amount: number;
  category: Category;
  time: string;
  day: "Today" | "Yesterday" | "Earlier";
  month: "Feb" | "Mar" | "Apr";
};

const CATEGORY_ICON: Record<Category, IconKey> = {
  "Food & Dining": "coffee",
  "Transport": "train",
  "Shopping": "cart",
  "Other": "card",
};

const CATEGORY_COLOR: Record<Category, string> = {
  "Food & Dining": "#F07B6A",
  "Transport": "#7EC8A4",
  "Shopping": "#E8C87A",
  "Other": "#7AB8D4",
};

const INITIAL: Tx[] = [
  { id: "t1", merchant: "Swiggy",            icon: "coffee", amount: 340,  category: "Food & Dining", time: "1:30 PM",  day: "Today",     month: "Apr" },
  { id: "t2", merchant: "Third Wave Coffee", icon: "tea",    amount: 180,  category: "Food & Dining", time: "9:10 AM",  day: "Today",     month: "Apr" },
  { id: "t3", merchant: "Metro Recharge",    icon: "train",  amount: 200,  category: "Transport",     time: "7:50 PM",  day: "Yesterday", month: "Apr" },
  { id: "t4", merchant: "Zepto",             icon: "cart",   amount: 640,  category: "Shopping",      time: "6:22 PM",  day: "Yesterday", month: "Apr" },
  { id: "t5", merchant: "Uber",              icon: "car",    amount: 320,  category: "Transport",     time: "11:00 AM", day: "Earlier",   month: "Mar" },
  { id: "t6", merchant: "Amazon",            icon: "package",amount: 1499, category: "Shopping",      time: "3:00 PM",  day: "Earlier",   month: "Feb" },
];

const MONTHS: Tx["month"][] = ["Feb", "Mar", "Apr"];
const CATEGORIES: Category[] = ["Food & Dining", "Transport", "Shopping", "Other"];

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

type Props = { onNavigate?: (tab: "home" | "activity" | "goals" | "pulse" | "profile") => void };

export default function ActivityScreen({ onNavigate }: Props = {}) {
  const [txs, setTxs] = useState<Tx[]>(INITIAL);
  const [month, setMonth] = useState<Tx["month"]>("Apr");
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ merchant: "", amount: "", category: "Food & Dining" as Category, time: "Now", day: "Today" as Tx["day"] });

  const filtered = useMemo(() => txs.filter((t) => t.month === month), [txs, month]);

  const totals = useMemo(() => {
    const map: Record<Category, number> = { "Food & Dining": 0, "Transport": 0, "Shopping": 0, "Other": 0 };
    filtered.forEach((t) => (map[t.category] += t.amount));
    return map;
  }, [filtered]);

  const total = useMemo(() => filtered.reduce((s, t) => s + t.amount, 0), [filtered]);

  const grouped = useMemo(() => {
    const g: Record<string, Tx[]> = { Today: [], Yesterday: [], Earlier: [] };
    filtered.forEach((t) => g[t.day].push(t));
    return g;
  }, [filtered]);

  const remove = (id: string) => {
    const t = txs.find((x) => x.id === id);
    setTxs((xs) => xs.filter((x) => x.id !== id));
    setOpenId(null);
    if (t) toast(`Deleted ${t.merchant}`);
  };

  const addTx = () => {
    const amount = Number(draft.amount);
    if (!draft.merchant.trim() || !amount) {
      toast.error("Merchant and amount required");
      return;
    }
    setTxs((xs) => [
      {
        id: `t${Date.now()}`,
        merchant: draft.merchant.trim(),
        icon: CATEGORY_ICON[draft.category],
        amount,
        category: draft.category,
        time: draft.time || "Now",
        day: draft.day,
        month,
      },
      ...xs,
    ]);
    setDraft({ merchant: "", amount: "", category: "Food & Dining", time: "Now", day: "Today" });
    setAdding(false);
    toast.success(`Added ${draft.merchant}`);
  };

  // donut: cumulative arc segments
  const C = 2 * Math.PI * 36;
  let offset = 0;
  const segments = CATEGORIES.map((cat) => {
    const v = totals[cat];
    const len = total > 0 ? (v / total) * C : 0;
    const seg = { cat, len, offset };
    offset += len;
    return seg;
  });

  const maxCat = Math.max(...Object.values(totals), 1);

  return (
    <div className="relative size-full bg-[#090E0B] overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-6 pt-2">
        <p className="text-[#EEF2ED] text-[26px]" style={{ fontFamily: "Fraunces, serif", fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
          Activity
        </p>
        <div className="flex gap-2 mt-3">
          {MONTHS.map((m) => {
            const active = m === month;
            return (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={`px-3 py-1 rounded-full border text-[10px] ${
                  active ? "border-[#7EC8A4] text-[#7EC8A4] bg-[#1A2E1F]" : "border-white/10 text-white/60"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pt-3 pb-[100px] overflow-y-auto h-[calc(100%-100px-80px)]">
        <div className="rounded-[14px] border border-[#7EC8A4]/[0.15] bg-[#0E1A10] p-4 flex gap-4 items-center">
          <div className="relative size-[88px] shrink-0">
            <svg viewBox="0 0 88 88" className="size-full -rotate-90">
              <circle cx="44" cy="44" r="36" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
              {segments.map((s) => (
                <circle
                  key={s.cat}
                  cx="44"
                  cy="44"
                  r="36"
                  stroke={CATEGORY_COLOR[s.cat]}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${s.len} ${C}`}
                  strokeDashoffset={-s.offset}
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[#EEF2ED] text-[18px]" style={{ fontFamily: "Fraunces, serif" }}>
                ₹{total >= 1000 ? (total / 1000).toFixed(total % 1000 === 0 ? 0 : 1) + "k" : total.toLocaleString("en-IN")}
              </p>
              <p className="text-[#5A7060] text-[8px]">spent</p>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {CATEGORIES.slice(0, 3).map((cat) => {
              const v = totals[cat];
              const pct = Math.round((v / maxCat) * 100);
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2">
                    <div className="size-[6px] rounded-full" style={{ background: CATEGORY_COLOR[cat] }} />
                    <p className="text-[#EEF2ED] text-[10px] flex-1">{cat === "Food & Dining" ? "Food & Dining" : cat}</p>
                    <p className="text-[#EEF2ED] text-[10px]">{fmt(v)}</p>
                  </div>
                  <div className="h-[2px] bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: CATEGORY_COLOR[cat] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {(["Today", "Yesterday", "Earlier"] as const).map((day) => {
          const list = grouped[day];
          if (list.length === 0) return null;
          return (
            <div key={day} className="mt-5">
              <p className="text-[#5A7060] text-[9px] tracking-wider px-1 mb-2">{day.toUpperCase()}</p>
              <div className="space-y-2">
                {list.map((t) => {
                  const open = openId === t.id;
                  return (
                    <div key={t.id} className="rounded-[12px] border border-white/5 bg-[#0E1A10]">
                      <button onClick={() => setOpenId(open ? null : t.id)} className="w-full p-3 flex items-center gap-3">
                        <div className="size-8 rounded-full bg-black/40 flex items-center justify-center" style={{ color: CATEGORY_COLOR[t.category] }}><Icon name={t.icon} size={14} /></div>
                        <div className="flex-1 text-left">
                          <p className="text-[#EEF2ED] text-[12px]">{t.merchant}</p>
                          <p className="text-[#5A7060] text-[9px]">{t.time} · {t.category.replace(" & Dining", "")}</p>
                        </div>
                        <p className="text-[12px]" style={{ color: CATEGORY_COLOR[t.category] }}>−{fmt(t.amount)}</p>
                      </button>
                      {open && (
                        <div className="px-3 pb-3 pt-1 flex gap-2">
                          <button
                            onClick={() => toast(`${t.merchant} · ${t.category} · ${fmt(t.amount)}`)}
                            className="flex-1 py-2 rounded-full border border-white/10 text-[10px] text-white/60"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => {
                              const idx = CATEGORIES.indexOf(t.category);
                              const next = CATEGORIES[(idx + 1) % CATEGORIES.length];
                              setTxs((xs) => xs.map((x) => (x.id === t.id ? { ...x, category: next } : x)));
                              toast(`Recategorized to ${next}`);
                            }}
                            className="flex-1 py-2 rounded-full border border-[#7EC8A4]/30 text-[10px] text-[#7EC8A4]"
                          >
                            Recategorize
                          </button>
                          <button
                            onClick={() => remove(t.id)}
                            className="flex-1 py-2 rounded-full border border-[#F07B6A]/30 text-[10px] text-[#F07B6A]"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-[#5A7060] text-[11px] mt-10">No transactions in {month}</p>
        )}

        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            className="w-full mt-5 rounded-full border border-dashed border-[#7EC8A4]/30 py-3 text-[11px] text-[#7EC8A4]"
          >
            + Add transaction
          </button>
        ) : (
          <div className="mt-5 rounded-[14px] border border-[#7EC8A4]/[0.22] bg-[#0E1A10] p-4 space-y-2">
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
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })}
              className="w-full bg-black/30 rounded px-3 py-2 text-[12px] text-white"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={draft.day}
              onChange={(e) => setDraft({ ...draft, day: e.target.value as Tx["day"] })}
              className="w-full bg-black/30 rounded px-3 py-2 text-[12px] text-white"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Earlier">Earlier</option>
            </select>
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
            const active = t.key === "activity";
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
