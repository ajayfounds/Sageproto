import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";
import BottomTabBar, { TabKey } from "./BottomTabBar";
import type { TransactionDetail } from "./TransactionDetailScreen";

type Tx = { id: string; merchant: string; icon: IconKey; amount: number; date: string; type: "debit" | "credit" };

const INITIAL: Tx[] = [
  { id: "h1", merchant: "Swiggy",        icon: "coffee", amount: 340,   date: "Today · 1:30 PM", type: "debit"  },
  { id: "h2", merchant: "Metro Recharge",icon: "train",  amount: 200,   date: "Yesterday",       type: "debit"  },
  { id: "h3", merchant: "Salary Credit", icon: "wallet", amount: 58000, date: "Apr 1",           type: "credit" },
];

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

type NavTarget = TabKey | "notifications" | "activity";
type Props = {
  onNavigate?: (tab: NavTarget) => void;
  onOpenTransaction?: (tx: TransactionDetail) => void;
};

export default function HomeScreen({ onNavigate, onOpenTransaction }: Props = {}) {
  const handleOpenTx = (t: Tx) => {
    onOpenTransaction?.({
      id: t.id,
      merchant: t.merchant,
      icon: t.icon,
      amount: t.amount,
      type: t.type,
      status: "completed",
      category: t.type === "credit" ? "Income" : "Food & Dining",
      sourceAccount: "HDFC Savings",
      sourceMask: "4921",
      dateTime: "1 Apr 2025, 1:30 PM",
      reference: "TXN8F2K9D4Q" + t.id.toUpperCase(),
      method: t.type === "credit" ? "Bank transfer" : "UPI / Card",
    });
  };
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
    <div className="relative size-full bg-surface-2 overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-6 pt-2 flex items-start justify-between">
        <div>
          <p className="text-ink-500" style={{ fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)' }}>Good morning,</p>
          <h1 className="flex items-center gap-2">Priya</h1>
        </div>
        <button
          onClick={() => onNavigate?.("notifications")}
          className="relative w-11 h-11 rounded-full bg-vault-teal/10 border border-vault-teal/30 flex items-center justify-center text-vault-teal active:scale-95 transition-transform"
          aria-label="Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-[6px] right-[6px] size-[6px] rounded-full bg-loss border border-surface-1" />
        </button>
      </div>

      <div className="px-5 pt-3 pb-[100px] overflow-y-auto h-[calc(100%-90px-80px)]">
        <button onClick={editBudget} className="w-full text-left p-4 relative overflow-hidden bg-trust-navy shadow-[0_2px_8px_rgba(11,31,51,0.12)]" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div className="absolute top-3 right-4">
            <Icon name="shield" size={18} className="text-white/60" strokeWidth={1.5} />
          </div>
          <label className="text-on-navy">AVAILABLE THIS MONTH</label>
          <p className="text-white mt-1 money" style={{ fontSize: 'var(--text-money)', lineHeight: 'var(--leading-money)', fontWeight: 600, letterSpacing: "-0.01em" }}>{fmt(available)}</p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="trending-up" size={16} className="text-gain" strokeWidth={2} />
            <span style={{ color: '#5BD49C', fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)', fontWeight: 600 }}>+2.4% this month</span>
          </div>
          <div className="h-[4px] bg-white/20 rounded-full overflow-hidden" style={{ marginTop: 'var(--space-3)' }}>
            <div className="h-full bg-white" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between" style={{ marginTop: 'var(--space-2)' }}>
            <span className="text-on-navy" style={{ fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)', fontWeight: 500 }}>{pct}% of budget used</span>
            <span className="text-on-navy" style={{ fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)', fontWeight: 500 }}>18 days left</span>
          </div>
          <div className="grid grid-cols-3 gap-2" style={{ marginTop: 'var(--space-4)' }}>
            <div>
              <label className="text-on-navy">INCOME</label>
              <p className="text-white mt-1 money" style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 600 }}>{fmt(income + credited - 58000 + 58000)}</p>
            </div>
            <div>
              <label className="text-on-navy">SPENT</label>
              <p className="text-white mt-1 money" style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 600 }}>{fmt(spent)}</p>
            </div>
            <div>
              <label className="text-on-navy">SAVED</label>
              <p className="text-white mt-1 money" style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 600 }}>{fmt(saved)}</p>
            </div>
          </div>
        </button>

        <div className="grid grid-cols-4 gap-3 mt-4">
          {([
            { key: "send",    label: "Send",    icon: "send"    as IconKey, onClick: () => onNavigate?.("sendMoney" as any) },
            { key: "request", label: "Request", icon: "request" as IconKey, onClick: () => toast("Request money") },
            { key: "pay",     label: "Pay",     icon: "pay"     as IconKey, onClick: () => toast("Pay bill") },
            { key: "topup",   label: "Top up",  icon: "topup"   as IconKey, onClick: () => setAdding(true) },
          ]).map((q) => (
            <button
              key={q.key}
              onClick={q.onClick}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-vault-teal">
                <Icon name={q.icon} size={22} strokeWidth={1.8} />
              </div>
              <p className="text-ink-900" style={{ fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)', fontWeight: 500 }}>{q.label}</p>
            </button>
          ))}
        </div>

        <div className="mt-4 border border-warn/[0.22] bg-[#FBF1E0] flex gap-3 items-start" style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
          <div className="text-warn mt-[2px]"><Icon name="bulb" size={18} /></div>
          <p className="text-trust-navy" style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)' }}>
            You're 12% under budget on food this week. At this rate you'll save an extra ₹1,200 this month.
          </p>
        </div>

        <div className="flex justify-between items-center mt-5 mb-2">
          <label className="text-ink-500">RECENT ACTIVITY</label>
          <button onClick={() => onNavigate?.("activity")} className="text-vault-teal" style={{ fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)', fontWeight: 600 }}>See all →</button>
        </div>

        <div className="space-y-2">
          {txs.slice(0, 5).map((t) => (
            <button key={t.id} onClick={() => handleOpenTx(t)} className="w-full text-left border border-border bg-card shadow-[0_1px_2px_rgba(11,31,51,0.04)] flex items-center gap-3 active:scale-[0.99] transition-transform" style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', minHeight: '56px' }}>
              <div className={`w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center ${t.type === "credit" ? "text-vault-teal" : "text-ink-500"}`}><Icon name={t.icon} size={18} /></div>
              <div className="flex-1">
                <p className="text-trust-navy" style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 500 }}>{t.merchant}</p>
                <p className="text-ink-500" style={{ fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)' }}>{t.date}</p>
              </div>
              <p className={`money ${t.type === "credit" ? "text-gain" : "text-trust-navy"}`} style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 600 }}>
                {t.type === "credit" ? "+" : "−"}{fmt(t.amount)}
              </p>
            </button>
          ))}
          {txs.length === 0 && <p className="text-center text-ink-500 py-6" style={{ fontSize: 'var(--text-body)' }}>No transactions yet</p>}
        </div>

        {adding && (
          <div className="mt-4 border border-vault-teal/[0.22] bg-card space-y-2" style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
            <input
              value={draft.merchant}
              onChange={(e) => setDraft({ ...draft, merchant: e.target.value })}
              placeholder="Merchant"
              className="w-full bg-input-background border border-border text-trust-navy placeholder:text-ink-500"
              style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', minHeight: '44px' }}
            />
            <input
              value={draft.amount}
              onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
              placeholder="Amount (₹)"
              inputMode="numeric"
              className="w-full bg-input-background border border-border text-trust-navy placeholder:text-ink-500"
              style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', minHeight: '44px' }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setDraft({ ...draft, type: "debit" })}
                className={`flex-1 py-2 border ${
                  draft.type === "debit" ? "border-loss text-loss" : "border-border text-ink-500"
                }`}
                style={{ borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', minHeight: '44px' }}
              >
                Spent
              </button>
              <button
                onClick={() => setDraft({ ...draft, type: "credit" })}
                className={`flex-1 py-2 border ${
                  draft.type === "credit" ? "border-vault-teal text-vault-teal" : "border-border text-ink-500"
                }`}
                style={{ borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', minHeight: '44px' }}
              >
                Earned
              </button>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setAdding(false)} className="flex-1 border border-border text-ink-500" style={{ borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-body)', minHeight: '44px' }}>Cancel</button>
              <button onClick={addTx} className="flex-1 bg-vault-teal text-white" style={{ borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-body)', fontWeight: 600, minHeight: '44px' }}>Add</button>
            </div>
          </div>
        )}
      </div>

      <BottomTabBar active="home" onNavigate={(k) => onNavigate?.(k)} />
    </div>
  );
}
