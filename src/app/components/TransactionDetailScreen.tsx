import { toast } from "sonner";
import { Icon, IconKey } from "./icons";

export type TxStatus = "completed" | "pending" | "declined";

export type TransactionDetail = {
  id: string;
  merchant: string;
  icon: IconKey;
  amount: number;
  type: "debit" | "credit";
  status: TxStatus;
  category: string;
  sourceAccount: string;
  sourceMask: string;
  dateTime: string;
  reference: string;
  method: string;
};

const fmtINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STATUS_META: Record<TxStatus, { label: string; bg: string; fg: string; icon: "shield" | "alert" }> = {
  completed: { label: "Completed", bg: "rgba(27,158,99,0.12)",  fg: "var(--gain)", icon: "shield" },
  pending:   { label: "Pending",   bg: "rgba(198,138,46,0.14)", fg: "var(--warn)", icon: "alert"  },
  declined:  { label: "Declined",  bg: "rgba(194,74,60,0.12)",  fg: "var(--loss)", icon: "alert"  },
};

export default function TransactionDetailScreen({
  tx,
  onBack,
}: {
  tx: TransactionDetail;
  onBack: () => void;
}) {
  const status = STATUS_META[tx.status];
  const sign = tx.type === "credit" ? "+" : "−";
  const amountColor = tx.type === "credit" ? "var(--gain)" : "#ffffff";

  const copyRef = () => {
    navigator.clipboard?.writeText(tx.reference).catch(() => {});
    toast.success("Reference ID copied");
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
        <h2 className="truncate flex-1">{tx.merchant}</h2>
      </div>

      <div className="px-5 pt-4 pb-[40px] overflow-y-auto h-[calc(100%-80px)]">
        <div
          className="w-full p-4 relative overflow-hidden bg-trust-navy shadow-[0_2px_8px_rgba(11,31,51,0.12)]"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 flex items-center justify-center bg-white/10 text-white shrink-0"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <Icon name={tx.icon} size={20} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <label className="text-on-navy">AMOUNT</label>
              <p
                className="money"
                style={{
                  color: amountColor,
                  fontSize: 'var(--text-money)',
                  lineHeight: 'var(--leading-money)',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                }}
              >
                {sign}{fmtINR(tx.amount)}
              </p>
            </div>
          </div>
          <p
            className="text-on-navy"
            style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)' }}
          >
            {tx.category}
          </p>

          <div style={{ marginTop: 'var(--space-3)' }}>
            <span
              className="inline-flex items-center gap-1.5"
              style={{
                background: status.bg,
                color: status.fg,
                borderRadius: 'var(--radius-pill)',
                padding: '6px 12px',
                fontSize: 'var(--text-label)',
                lineHeight: 'var(--leading-label)',
                fontWeight: 400,
              }}
            >
              <Icon name={status.icon} size={14} strokeWidth={2.25} />
              {status.label}
            </span>
          </div>
        </div>

        <div
          className="bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)]"
          style={{ borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginTop: 'var(--space-4)' }}
        >
          <Row label="PAID FROM" value={`${tx.sourceAccount} •••• ${tx.sourceMask}`} mono />
          <Row label="DATE & TIME" value={tx.dateTime} />
          <Row label="CATEGORY" value={tx.category} />
          <Row
            label="REFERENCE ID"
            value={tx.reference}
            mono
            trailing={
              <button
                onClick={copyRef}
                className="w-9 h-9 rounded-full flex items-center justify-center text-vault-teal bg-teal-100 active:scale-95 transition-transform"
                aria-label="Copy reference ID"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            }
          />
          <Row label="TYPE" value={tx.method} last />
        </div>

        <div
          className="flex items-center gap-2 justify-center"
          style={{ marginTop: 'var(--space-4)' }}
        >
          <Icon name="shield" size={14} className="text-vault-teal" strokeWidth={2} />
          <p className="text-ink-500" style={{ fontSize: 'var(--text-label)', lineHeight: 'var(--leading-label)' }}>
            Secured by Sage · 256-bit encryption
          </p>
        </div>

        <button
          onClick={() => toast("Report submitted")}
          className="w-full border border-border text-ink-500 bg-card active:scale-[0.99] transition-transform"
          style={{
            marginTop: 'var(--space-4)',
            borderRadius: 'var(--radius-pill)',
            minHeight: '48px',
            fontSize: 'var(--text-button)',
            lineHeight: 'var(--leading-button)',
            fontWeight: 400,
          }}
        >
          Report a problem
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  trailing,
  last,
}: {
  label: string;
  value: string;
  mono?: boolean;
  trailing?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 ${last ? "" : "border-b border-border"}`}
      style={{ paddingTop: 'var(--space-3)', paddingBottom: 'var(--space-3)' }}
    >
      <label className="text-ink-500 shrink-0">{label}</label>
      <div className="flex items-center gap-2 min-w-0">
        <p
          className={`text-trust-navy truncate text-right ${mono ? "money" : ""}`}
          style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', fontWeight: 400 }}
        >
          {value}
        </p>
        {trailing}
      </div>
    </div>
  );
}
