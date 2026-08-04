import { useMemo } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";
import { ACCOUNTS, Account } from "./AccountsListScreen";
import BottomTabBar, { TabKey } from "./BottomTabBar";
import type { TransactionDetail } from "./TransactionDetailScreen";

type TxStatus = "posted" | "declined";
type Tx = {
  id: string;
  merchant: string;
  icon: IconKey;
  category: string;
  date: string;
  amount: number;
  type: "debit" | "credit";
  status?: TxStatus;
};

const SAMPLE_TX: Tx[] = [
  { id: "d1", merchant: "Salary Credit", icon: "wallet", category: "Income",      date: "Apr 1",            amount: 58000, type: "credit" },
  { id: "d2", merchant: "Swiggy",        icon: "coffee", category: "Food",        date: "Today · 1:30 PM",  amount: 340,   type: "debit"  },
  { id: "d3", merchant: "Metro Recharge",icon: "train",  category: "Transport",   date: "Yesterday",        amount: 200,   type: "debit"  },
  { id: "d4", merchant: "Amazon",        icon: "cart",   category: "Shopping",    date: "Mar 30",           amount: 1849,  type: "debit"  },
  { id: "d5", merchant: "Netflix",       icon: "laptop", category: "Subscription",date: "Mar 29 · Declined",amount: 649,   type: "debit", status: "declined" },
];

const fmtINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const maskIFSC = (ifsc: string) => (ifsc === "—" ? "—" : "•••• " + ifsc.slice(-4));

type Props = {
  accountId: string;
  onBack?: () => void;
  onNavigate?: (tab: TabKey) => void;
  onOpenTransaction?: (tx: TransactionDetail) => void;
};

export default function AccountDetailScreen({ accountId, onBack, onNavigate, onOpenTransaction }: Props) {
  const account = useMemo<Account | undefined>(
    () => ACCOUNTS.find((a) => a.id === accountId),
    [accountId],
  );

  if (!account) {
    return (
      <div className="relative size-full bg-surface-2 flex items-center justify-center px-6">
        <div className="text-center">
          <h2>Account not found</h2>
          <button
            onClick={onBack}
            className="mt-4 bg-vault-teal text-white px-6"
            style={{ borderRadius: 'var(--radius-pill)', minHeight: '44px', fontSize: 'var(--text-button)', fontWeight: 600 }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const copyNumber = () => {
    const full = `XXXXXXXX${account.mask}`;
    navigator.clipboard?.writeText(full).catch(() => {});
    toast.success("Account number copied");
  };

  return (
    <div className="relative size-full bg-surface-2 overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-4 pt-2 flex items-center gap-2">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full flex items-center justify-center text-trust-navy active:scale-95 transition-transform"
          aria-label="Back"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h2 className="truncate">{account.name}</h2>
          <span
            className="inline-flex items-center gap-1 bg-teal-100 text-vault-teal shrink-0"
            style={{
              borderRadius: 'var(--radius-pill)',
              padding: '4px 10px',
              fontSize: 'var(--text-label)',
              lineHeight: 'var(--leading-label)',
              fontWeight: 600,
            }}
          >
            <Icon name="shield" size={12} strokeWidth={2.25} />
            Verified
          </span>
        </div>
      </div>

      <div className="px-5 pt-4 pb-[100px] overflow-y-auto h-[calc(100%-80px-80px)]">
        <div
          className="w-full p-4 relative overflow-hidden bg-trust-navy shadow-[0_2px_8px_rgba(11,31,51,0.12)]"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <div className="absolute top-3 right-4">
            <Icon name="shield" size={18} className="text-white/60" strokeWidth={1.5} />
          </div>
          <label className="text-on-navy">AVAILABLE BALANCE</label>
          <p
            className="text-white mt-1 money"
            style={{ fontSize: 'var(--text-money)', lineHeight: 'var(--leading-money)', fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            {fmtINR(account.balance)}
          </p>

          <div className="flex items-center gap-2" style={{ marginTop: 'var(--space-3)' }}>
            <p
              className="text-white money"
              style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 500, letterSpacing: '0.04em' }}
            >
              •••• {account.mask}
            </p>
            <button
              onClick={copyNumber}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 bg-white/10 active:scale-95 transition-transform"
              aria-label="Copy account number"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>

          <p
            className="text-on-navy"
            style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)' }}
          >
            {account.type} · {account.institution}
          </p>
        </div>

        <div
          className="bg-card border border-border flex"
          style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', marginTop: 'var(--space-3)' }}
        >
          <div className="flex-1">
            <label className="text-ink-500">IFSC</label>
            <p className="text-trust-navy money" style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 500 }}>
              {maskIFSC(account.ifsc)}
            </p>
          </div>
          <div className="w-px bg-border mx-3" />
          <div className="flex-1">
            <label className="text-ink-500">ACCOUNT HOLDER</label>
            <p className="text-trust-navy" style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 500 }}>
              {account.holder}
            </p>
          </div>
        </div>

        <button
          onClick={() => toast(`Sending from ${account.name}`)}
          className="w-full bg-vault-teal text-white active:scale-[0.99] transition-transform flex items-center justify-center gap-2"
          style={{
            marginTop: 'var(--space-4)',
            borderRadius: 'var(--radius-pill)',
            minHeight: '48px',
            fontSize: 'var(--text-button)',
            lineHeight: 'var(--leading-button)',
            fontWeight: 600,
          }}
        >
          <Icon name="send" size={18} strokeWidth={2} />
          Send from this account
        </button>

        <label className="text-ink-500" style={{ marginTop: 'var(--space-6)', display: 'block', marginBottom: 'var(--space-3)' }}>
          RECENT TRANSACTIONS
        </label>

        <div className="space-y-2">
          {SAMPLE_TX.map((t) => {
            const declined = t.status === "declined";
            const color = declined ? "text-loss" : t.type === "credit" ? "text-gain" : "text-trust-navy";
            const sign = t.type === "credit" ? "+" : "−";
            return (
              <button
                key={t.id}
                onClick={() => onOpenTransaction?.({
                  id: t.id,
                  merchant: t.merchant,
                  icon: t.icon,
                  amount: t.amount,
                  type: t.type,
                  status: t.status === "declined" ? "declined" : "completed",
                  category: t.category === "Income" ? "Salary" : t.category === "Food" ? "Food & Dining" : t.category,
                  sourceAccount: account.name,
                  sourceMask: account.mask,
                  dateTime: t.date.includes("·") ? "1 Apr 2025, 1:30 PM" : `${t.date}, 11:24 AM`,
                  reference: "TXN8F2K9D4Q" + t.id.toUpperCase(),
                  method: t.type === "credit" ? "Bank transfer" : "UPI / Card",
                })}
                className="w-full text-left border border-border bg-card shadow-[0_1px_2px_rgba(11,31,51,0.04)] flex items-center gap-3 active:scale-[0.99] transition-transform"
                style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', minHeight: '56px' }}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center bg-teal-100 text-vault-teal shrink-0 ${declined ? "opacity-60" : ""}`}
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <Icon name={t.icon} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-trust-navy truncate" style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 600 }}>
                    {t.merchant}
                  </p>
                  <p className="text-ink-500" style={{ fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)' }}>
                    {t.category} · {t.date}
                  </p>
                </div>
                <p className={`money ${color}`} style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 600 }}>
                  {sign}{fmtINR(t.amount)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <BottomTabBar active="accounts" onNavigate={(k) => onNavigate?.(k)} />
    </div>
  );
}
