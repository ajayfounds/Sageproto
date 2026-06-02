import { Icon } from "./icons";
import { toast } from "sonner";

type Props = {
  title: string;
  subtitle?: string;
  amount?: number;
  referenceId?: string;
  onDone: () => void;
  onSecondary?: () => void;
  secondaryLabel?: string;
};

export default function SuccessScreen({
  title,
  subtitle,
  amount,
  referenceId,
  onDone,
  onSecondary,
  secondaryLabel = "View receipt",
}: Props) {
  const handleCopy = () => {
    if (referenceId) {
      navigator.clipboard.writeText(referenceId);
      toast.success("Reference ID copied");
    }
  };

  return (
    <div className="relative size-full bg-surface-2 flex flex-col">
      <div className="h-[44px]" />

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div
          className="w-20 h-20 rounded-full bg-vault-teal/10 flex items-center justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-full bg-vault-teal flex items-center justify-center">
            <Icon name="check" size={32} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-center mb-2">{title}</h1>

        {amount !== undefined && (
          <p
            className="money text-trust-navy text-center mb-2"
            style={{
              fontSize: "var(--text-money)",
              lineHeight: "var(--leading-money)",
              fontWeight: 600,
            }}
          >
            ₹{amount.toLocaleString("en-IN")}
          </p>
        )}

        {subtitle && (
          <p
            className="text-ink-500 text-center mb-6"
            style={{ fontSize: "var(--text-body)", lineHeight: "var(--leading-body)" }}
          >
            {subtitle}
          </p>
        )}

        {referenceId && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-surface-1 border border-border active:scale-95 transition-transform"
            style={{ borderRadius: "var(--radius-pill)" }}
          >
            <p
              className="money text-ink-500"
              style={{ fontSize: "var(--text-label)", lineHeight: "var(--leading-label)" }}
            >
              {referenceId}
            </p>
            <Icon name="copy" size={14} className="text-ink-500" />
          </button>
        )}
      </div>

      <div className="px-6 pb-6 space-y-3">
        <button
          onClick={onDone}
          className="w-full bg-vault-teal text-white active:scale-[0.98] transition-transform"
          style={{
            borderRadius: "var(--radius-pill)",
            fontSize: "var(--text-button)",
            lineHeight: "var(--leading-button)",
            fontWeight: 600,
            minHeight: "52px",
          }}
        >
          Done
        </button>

        {onSecondary && (
          <button
            onClick={onSecondary}
            className="w-full border border-border text-trust-navy active:scale-[0.98] transition-transform"
            style={{
              borderRadius: "var(--radius-pill)",
              fontSize: "var(--text-button)",
              lineHeight: "var(--leading-button)",
              fontWeight: 600,
              minHeight: "52px",
            }}
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
