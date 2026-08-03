import { useMemo, useState } from "react";
import { toast } from "sonner";
import ArrowOutwardOutlined from "@mui/icons-material/ArrowOutwardOutlined";
import CallReceivedOutlined from "@mui/icons-material/CallReceivedOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
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
    <div className="relative size-full bg-canvas overflow-hidden">
      {/* Gradient mesh washes the upper third — the brand's depth medium. */}
      <div className="gradient-mesh absolute inset-x-0 top-0 h-[42%] pointer-events-none" />
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{ top: '32%', height: '14%', background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--canvas-soft) 100%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 bg-canvas-soft pointer-events-none" style={{ top: '46%' }} />

      <div className="relative h-[44px]" />

      <div className="relative px-6 pt-2 flex items-start justify-between">
        <div>
          <p className="text-ink-secondary" style={{ fontSize: 'var(--text-caption)', lineHeight: 'var(--leading-caption)', letterSpacing: 'var(--tracking-caption)' }}>Good morning,</p>
          <h1 className="flex items-center gap-2">Priya</h1>
        </div>
        <button
          onClick={() => onNavigate?.("notifications")}
          className="relative w-11 h-11 rounded-full bg-canvas border border-hairline shadow-level-1 flex items-center justify-center text-primary active:scale-95 transition-transform"
          aria-label="Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-[6px] right-[6px] size-[6px] rounded-full bg-loss border border-surface-1" />
        </button>
      </div>

      <div className="relative px-5 pt-3 pb-[100px] overflow-y-auto h-[calc(100%-90px-80px)]">
        <button onClick={editBudget} className="w-full text-left relative overflow-hidden bg-brand-dark-900 shadow-level-2" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
          <div className="absolute top-5 right-5">
            <Icon name="shield" size={18} className="text-white/50" strokeWidth={1.5} />
          </div>
          <label className="text-on-navy">AVAILABLE THIS MONTH</label>
          <p className="text-white mt-2 money" style={{ fontSize: 'var(--text-money)', lineHeight: 'var(--leading-money)', fontWeight: 300, letterSpacing: 'var(--tracking-money)' }}>{fmt(available)}</p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="trending-up" size={15} style={{ color: 'var(--gain-on-dark)' }} strokeWidth={1.75} />
            <span className="money" style={{ color: 'var(--gain-on-dark)', fontSize: 'var(--text-tabular)', lineHeight: 'var(--leading-tabular)', fontWeight: 300 }}>+2.4% this month</span>
          </div>
          <div className="h-[3px] bg-white/15 rounded-full overflow-hidden" style={{ marginTop: 'var(--space-4)' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--primary-soft)' }} />
          </div>
          <div className="flex justify-between" style={{ marginTop: 'var(--space-2)' }}>
            <span className="text-on-navy money" style={{ fontSize: 'var(--text-caption)', lineHeight: 'var(--leading-caption)', fontWeight: 300 }}>{pct}% of budget used</span>
            <span className="text-on-navy money" style={{ fontSize: 'var(--text-caption)', lineHeight: 'var(--leading-caption)', fontWeight: 300 }}>18 days left</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-white/10" style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)' }}>
            {[
              { label: "INCOME", value: income + credited - 58000 + 58000 },
              { label: "SPENT",  value: spent },
              { label: "SAVED",  value: saved },
            ].map((s) => (
              <div key={s.label}>
                <label className="text-on-navy">{s.label}</label>
                <p className="text-white mt-1 money" style={{ fontSize: 'var(--text-tabular)', lineHeight: 'var(--leading-tabular)', fontWeight: 300 }}>{fmt(s.value)}</p>
              </div>
            ))}
          </div>
        </button>

        <div className="grid grid-cols-4 gap-3" style={{ marginTop: 'var(--space-6)' }}>
          {([
            { key: "send",    label: "Send",    Glyph: ArrowOutwardOutlined,          onClick: () => onNavigate?.("sendMoney" as any) },
            { key: "request", label: "Request", Glyph: CallReceivedOutlined,          onClick: () => toast("Request money") },
            { key: "pay",     label: "Pay",     Glyph: ReceiptLongOutlined,           onClick: () => toast("Pay bill") },
            { key: "topup",   label: "Top up",  Glyph: AccountBalanceWalletOutlined,  onClick: () => setAdding(true) },
          ]).map((q) => (
            <button
              key={q.key}
              onClick={q.onClick}
              className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-full bg-canvas border border-hairline shadow-level-1 flex items-center justify-center text-primary">
                <q.Glyph sx={{ fontSize: 21 }} />
              </div>
              <p className="text-ink" style={{ fontSize: 'var(--text-caption)', lineHeight: 'var(--leading-caption)', letterSpacing: 'var(--tracking-caption)', fontWeight: 300 }}>{q.label}</p>
            </button>
          ))}
        </div>

        <div className="card-cream flex gap-3 items-start" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)' }}>
          <div className="text-lemon mt-[2px] shrink-0"><Icon name="bulb" size={18} strokeWidth={1.5} /></div>
          <p className="text-ink" style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)' }}>
            You're 12% under budget on food this week. At this rate you'll save an extra ₹1,200 this month.
          </p>
        </div>

        <div className="mb-3" style={{ marginTop: 'var(--space-6)' }}>
          <label>RECENT ACTIVITY</label>
        </div>

        <div className="space-y-2">
          {txs.slice(0, 5).map((t) => (
            <button key={t.id} onClick={() => handleOpenTx(t)} className="w-full text-left border border-hairline bg-canvas shadow-level-1 flex items-center gap-3 active:scale-[0.99] transition-transform" style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', minHeight: '56px' }}>
              <div className={`w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center ${t.type === "credit" ? "text-primary" : "text-ink-mute"}`}><Icon name={t.icon} size={18} strokeWidth={1.5} /></div>
              <div className="flex-1">
                <p className="text-ink" style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 300 }}>{t.merchant}</p>
                <p className="text-ink-mute" style={{ fontSize: 'var(--text-caption)', lineHeight: 'var(--leading-caption)', letterSpacing: 'var(--tracking-caption)' }}>{t.date}</p>
              </div>
              <p className={`money ${t.type === "credit" ? "text-gain" : "text-ink"}`} style={{ fontSize: 'var(--text-tabular)', lineHeight: 'var(--leading-tabular)', fontWeight: 300 }}>
                {t.type === "credit" ? "+" : "−"}{fmt(t.amount)}
              </p>
            </button>
          ))}
          {txs.length === 0 && <p className="text-center text-ink-mute py-6" style={{ fontSize: 'var(--text-body)' }}>No transactions yet</p>}
        </div>

        <button
          onClick={() => onNavigate?.("activity")}
          className="btn-pill w-full"
          style={{ marginTop: 'var(--space-6)' }}
        >
          View all activity
          <Icon name="arrow-right" size={16} strokeWidth={1.75} />
        </button>

        {adding && (
          <div className="card-feature space-y-2" style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)' }}>
            <input
              value={draft.merchant}
              onChange={(e) => setDraft({ ...draft, merchant: e.target.value })}
              placeholder="Merchant"
              className="input-field placeholder:text-ink-mute"
            />
            <input
              value={draft.amount}
              onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
              placeholder="Amount (₹)"
              inputMode="numeric"
              className="input-field money placeholder:text-ink-mute"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setDraft({ ...draft, type: "debit" })}
                className={`flex-1 border ${
                  draft.type === "debit" ? "border-ruby text-ruby" : "border-hairline text-ink-mute"
                }`}
                style={{ borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-button)', minHeight: '44px' }}
              >
                Spent
              </button>
              <button
                onClick={() => setDraft({ ...draft, type: "credit" })}
                className={`flex-1 border ${
                  draft.type === "credit" ? "border-primary text-primary" : "border-hairline text-ink-mute"
                }`}
                style={{ borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-button)', minHeight: '44px' }}
              >
                Earned
              </button>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setAdding(false)} className="flex-1 border border-hairline text-ink-mute" style={{ borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-button)', minHeight: '44px' }}>Cancel</button>
              <button onClick={addTx} className="btn-pill flex-1">Add</button>
            </div>
          </div>
        )}
      </div>

      <BottomTabBar active="home" onNavigate={(k) => onNavigate?.(k)} />
    </div>
  );
}
