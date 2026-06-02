import { useMemo } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";
import BottomTabBar, { TabKey } from "./BottomTabBar";

export type AccountKind = "savings" | "salary" | "wallet";

export type Account = {
  id: string;
  name: string;
  kind: AccountKind;
  institution: string;
  type: string;
  mask: string;
  ifsc: string;
  holder: string;
  balance: number;
};

export const ACCOUNTS: Account[] = [
  { id: "a1", name: "HDFC Savings",  kind: "savings", institution: "HDFC Bank",  type: "Savings", mask: "4921", ifsc: "HDFC0001234", holder: "Priya Sharma", balance: 241860 },
  { id: "a2", name: "ICICI Salary",  kind: "salary",  institution: "ICICI Bank", type: "Salary",  mask: "7330", ifsc: "ICIC0005678", holder: "Priya Sharma", balance: 57460  },
  { id: "a3", name: "Cash Wallet",   kind: "wallet",  institution: "Sage Wallet",type: "Wallet",  mask: "0000", ifsc: "—",           holder: "Priya Sharma", balance: 19100  },
];

const KIND_ICON: Record<AccountKind, IconKey> = {
  savings: "shield",
  salary: "wallet",
  wallet: "card",
};

const fmtINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type Props = {
  onNavigate?: (tab: TabKey) => void;
  onOpenAccount?: (id: string) => void;
};

export default function AccountsListScreen({ onNavigate, onOpenAccount }: Props = {}) {
  const total = useMemo(() => ACCOUNTS.reduce((s, a) => s + a.balance, 0), []);

  return (
    <div className="relative size-full bg-surface-2 overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-6 pt-2">
        <h1>Accounts</h1>
      </div>

      <div className="px-5 pt-3 pb-[100px] overflow-y-auto h-[calc(100%-70px-80px)]">
        <div
          className="w-full p-4 relative overflow-hidden bg-trust-navy shadow-[0_2px_8px_rgba(11,31,51,0.12)]"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <div className="absolute top-3 right-4">
            <Icon name="shield" size={18} className="text-white/60" strokeWidth={1.5} />
          </div>
          <label className="text-on-navy">TOTAL BALANCE</label>
          <p
            className="text-white mt-1 money"
            style={{ fontSize: 'var(--text-money)', lineHeight: 'var(--leading-money)', fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            {fmtINR(total)}
          </p>
          <p
            className="text-on-navy"
            style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)' }}
          >
            Across {ACCOUNTS.length} accounts
          </p>
        </div>

        <div className="flex justify-between items-center" style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>
          <label className="text-ink-500">YOUR ACCOUNTS</label>
        </div>

        <div className="space-y-2">
          {ACCOUNTS.map((a) => (
            <button
              key={a.id}
              onClick={() => onOpenAccount?.(a.id)}
              className="w-full text-left border border-border bg-card shadow-[0_1px_2px_rgba(11,31,51,0.04)] flex items-center gap-3 active:scale-[0.99] transition-transform"
              style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', minHeight: '64px' }}
            >
              <div
                className="w-11 h-11 flex items-center justify-center bg-teal-100 border border-vault-teal/20 text-vault-teal shrink-0"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <Icon name={KIND_ICON[a.kind]} size={20} strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-trust-navy truncate"
                  style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--leading-body-lg)', fontWeight: 600 }}
                >
                  {a.name}
                </p>
                <p className="text-ink-500 money" style={{ fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)' }}>
                  •••• {a.mask}
                </p>
              </div>
              <p
                className="money text-trust-navy"
                style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 600 }}
              >
                {fmtINR(a.balance)}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => toast.success("Add account")}
          className="w-full bg-vault-teal text-white active:scale-[0.99] transition-transform flex items-center justify-center gap-2"
          style={{
            marginTop: 'var(--space-6)',
            borderRadius: 'var(--radius-pill)',
            minHeight: '48px',
            fontSize: 'var(--text-button)',
            lineHeight: 'var(--leading-button)',
            fontWeight: 600,
          }}
        >
          <Icon name="plus" size={18} strokeWidth={2.25} />
          Add account
        </button>
      </div>

      <BottomTabBar active="accounts" onNavigate={(k) => onNavigate?.(k)} />
    </div>
  );
}
