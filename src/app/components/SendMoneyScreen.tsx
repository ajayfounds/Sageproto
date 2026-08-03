import { useState } from "react";
import { Icon } from "./icons";
import { toast } from "sonner";
import SuccessScreen from "./SuccessScreen";
import type { TransactionDetail } from "./TransactionDetailScreen";

type Payee = {
  id: string;
  name: string;
  initials: string;
  handle: string;
  type: "upi" | "account";
};

const SAVED_PAYEES: Payee[] = [
  { id: "p1", name: "Priya Sharma", initials: "PS", handle: "•••• 4921", type: "account" },
  { id: "p2", name: "Rajesh Kumar", initials: "RK", handle: "rajesh@okaxis", type: "upi" },
  { id: "p3", name: "Anita Verma", initials: "AV", handle: "•••• 7834", type: "account" },
];

type Props = {
  onBack: () => void;
  onViewReceipt?: (tx: TransactionDetail) => void;
};

export default function SendMoneyScreen({ onBack, onViewReceipt }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | "success">(1);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [authMethod, setAuthMethod] = useState<"biometric" | "pin">("biometric");
  const [pin, setPin] = useState("");

  const sourceAccount = "HDFC Savings •••• 4921";
  const sourceBalance = 241860;
  const fee = 0;

  const handleReview = () => {
    if (!selectedPayee) {
      toast.error("Please select a recipient");
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amt > sourceBalance) {
      toast.error("Insufficient balance");
      return;
    }
    setStep(2);
  };

  const handleConfirm = () => {
    setStep(3);
  };

  const handleAuthorize = () => {
    if (authMethod === "pin" && pin.length !== 6) {
      toast.error("Please enter 6-digit PIN");
      return;
    }
    setTimeout(() => {
      setStep("success");
    }, 800);
  };

  const handleDone = () => {
    onBack();
  };

  const handleViewReceipt = () => {
    const tx: TransactionDetail = {
      id: `TX${Date.now()}`,
      merchant: selectedPayee?.name || "Unknown",
      icon: "send",
      amount: parseFloat(amount),
      type: "debit",
      status: "completed",
      category: "Transfer",
      sourceAccount: "HDFC Savings",
      sourceMask: "4921",
      dateTime: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      reference: `TXN${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      method: "UPI / Bank transfer",
    };
    onViewReceipt?.(tx);
  };

  if (step === "success") {
    return (
      <SuccessScreen
        title="Transfer complete"
        subtitle={`Sent to ${selectedPayee?.name} ${selectedPayee?.handle}`}
        amount={parseFloat(amount)}
        referenceId={`TXN${Math.random().toString(36).substring(2, 11).toUpperCase()}`}
        onDone={handleDone}
        onSecondary={handleViewReceipt}
        secondaryLabel="View receipt"
      />
    );
  }

  if (step === 3) {
    return (
      <div className="relative size-full bg-surface-2 flex flex-col">
        <div className="h-[44px]" />

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div
            className="w-20 h-20 rounded-full bg-vault-teal/10 flex items-center justify-center mb-6"
          >
            <Icon name="lock" size={36} className="text-vault-teal" strokeWidth={1.8} />
          </div>

          <h2 className="text-center mb-2">Confirm it's you</h2>
          <p
            className="text-ink-500 text-center mb-8"
            style={{ fontSize: "var(--text-body)", lineHeight: "var(--leading-body)" }}
          >
            Authenticate to authorize this ₹{parseFloat(amount).toLocaleString("en-IN")} transfer
          </p>

          {authMethod === "biometric" ? (
            <>
              <button
                onClick={handleAuthorize}
                className="w-full bg-vault-teal text-white flex items-center justify-center gap-3 mb-4 active:scale-[0.98] transition-transform"
                style={{
                  borderRadius: "var(--radius-lg)",
                  fontSize: "var(--text-button)",
                  lineHeight: "var(--leading-button)",
                  fontWeight: 400,
                  minHeight: "64px",
                }}
              >
                <Icon name="fingerprint" size={28} className="text-white" strokeWidth={1.8} />
                Use Face ID / Fingerprint
              </button>

              <button
                onClick={() => setAuthMethod("pin")}
                className="text-vault-teal"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                  fontWeight: 400,
                }}
              >
                Use PIN instead
              </button>
            </>
          ) : (
            <>
              <div className="w-full space-y-4 mb-6">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit PIN"
                  className="w-full bg-input-background border border-border text-trust-navy placeholder:text-ink-500 text-center money"
                  style={{
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-4)",
                    fontSize: "var(--text-h3)",
                    lineHeight: "var(--leading-h3)",
                    minHeight: "64px",
                    letterSpacing: "0.25em",
                  }}
                />
              </div>

              <button
                onClick={handleAuthorize}
                className="w-full bg-vault-teal text-white active:scale-[0.98] transition-transform mb-4"
                style={{
                  borderRadius: "var(--radius-pill)",
                  fontSize: "var(--text-button)",
                  lineHeight: "var(--leading-button)",
                  fontWeight: 400,
                  minHeight: "52px",
                }}
              >
                Confirm
              </button>

              <button
                onClick={() => {
                  setAuthMethod("biometric");
                  setPin("");
                }}
                className="text-vault-teal"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                  fontWeight: 400,
                }}
              >
                Use biometric instead
              </button>
            </>
          )}

          <div className="flex items-center gap-2 mt-8">
            <Icon name="shield" size={16} className="text-ink-500" />
            <p
              className="text-ink-500"
              style={{ fontSize: "var(--text-label)", lineHeight: "var(--leading-label)" }}
            >
              Secured by SAGE · 256-bit encryption
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="relative size-full bg-surface-2 flex flex-col">
        <div className="h-[44px]" />

        <div className="px-6 pt-2">
          <h2>Review transfer</h2>
        </div>

        <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
          <div
            className="p-6 bg-trust-navy shadow-[0_2px_12px_rgba(11,31,51,0.16)] mb-6"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <p
              className="money text-white text-center mb-6"
              style={{
                fontSize: "var(--text-money)",
                lineHeight: "var(--leading-money)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              ₹{parseFloat(amount).toLocaleString("en-IN")}
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b border-white/10">
                <label className="text-on-navy">TO</label>
                <div className="text-right">
                  <p
                    className="text-white"
                    style={{
                      fontSize: "var(--text-body)",
                      lineHeight: "var(--leading-body)",
                      fontWeight: 400,
                    }}
                  >
                    {selectedPayee?.name}
                  </p>
                  <p
                    className="text-on-navy"
                    style={{ fontSize: "var(--text-label)", lineHeight: "var(--leading-label)" }}
                  >
                    {selectedPayee?.handle}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-start pb-4 border-b border-white/10">
                <label className="text-on-navy">FROM</label>
                <p
                  className="text-white"
                  style={{
                    fontSize: "var(--text-body)",
                    lineHeight: "var(--leading-body)",
                    fontWeight: 400,
                  }}
                >
                  {sourceAccount}
                </p>
              </div>

              <div className="flex justify-between items-start pb-4 border-b border-white/10">
                <label className="text-on-navy">FEE</label>
                <p
                  className="text-white"
                  style={{
                    fontSize: "var(--text-body)",
                    lineHeight: "var(--leading-body)",
                    fontWeight: 400,
                  }}
                >
                  ₹{fee} · Free
                </p>
              </div>

              <div className="flex justify-between items-start pb-4 border-b border-white/10">
                <label className="text-on-navy">ARRIVES</label>
                <p
                  className="text-white"
                  style={{
                    fontSize: "var(--text-body)",
                    lineHeight: "var(--leading-body)",
                    fontWeight: 400,
                  }}
                >
                  Instantly
                </p>
              </div>

              {note && (
                <div className="flex justify-between items-start">
                  <label className="text-on-navy">NOTE</label>
                  <p
                    className="text-white text-right max-w-[60%]"
                    style={{
                      fontSize: "var(--text-body)",
                      lineHeight: "var(--leading-body)",
                      fontWeight: 300,
                    }}
                  >
                    {note}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div
            className="flex items-start gap-3 p-4 border border-border bg-surface-1 mb-6"
            style={{ borderRadius: "var(--radius-md)" }}
          >
            <Icon name="shield" size={18} className="text-vault-teal mt-[2px]" />
            <p
              className="text-trust-navy"
              style={{ fontSize: "var(--text-body)", lineHeight: "var(--leading-body)" }}
            >
              Double-check details — transfers can't be reversed
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full bg-vault-teal text-white active:scale-[0.98] transition-transform"
            style={{
              borderRadius: "var(--radius-pill)",
              fontSize: "var(--text-button)",
              lineHeight: "var(--leading-button)",
              fontWeight: 400,
              minHeight: "52px",
            }}
          >
            Confirm & send
          </button>

          <button
            onClick={() => setStep(1)}
            className="w-full border border-border text-trust-navy active:scale-[0.98] transition-transform"
            style={{
              borderRadius: "var(--radius-pill)",
              fontSize: "var(--text-button)",
              lineHeight: "var(--leading-button)",
              fontWeight: 400,
              minHeight: "52px",
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative size-full bg-surface-2 flex flex-col">
      <div className="h-[44px]" />

      <div className="px-6 pt-2 flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-surface-1 border border-border flex items-center justify-center text-trust-navy active:scale-95 transition-transform"
          aria-label="Back"
        >
          <Icon name="arrow-left" size={20} strokeWidth={2} />
        </button>
        <h2>Send money</h2>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <label className="text-ink-500 mb-3 block">TO</label>

        <div className="space-y-2 mb-6">
          {SAVED_PAYEES.map((payee) => (
            <button
              key={payee.id}
              onClick={() => setSelectedPayee(payee)}
              className={`w-full text-left flex items-center gap-3 p-3 border ${
                selectedPayee?.id === payee.id
                  ? "border-vault-teal bg-teal-100/30"
                  : "border-border bg-card"
              } active:scale-[0.99] transition-transform`}
              style={{ borderRadius: "var(--radius-md)", minHeight: "64px" }}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  selectedPayee?.id === payee.id
                    ? "bg-vault-teal text-white"
                    : "bg-surface-2 text-trust-navy"
                }`}
                style={{ fontSize: "var(--text-body)", fontWeight: 400 }}
              >
                {payee.initials}
              </div>
              <div className="flex-1">
                <p
                  className="text-trust-navy"
                  style={{
                    fontSize: "var(--text-body)",
                    lineHeight: "var(--leading-body)",
                    fontWeight: 400,
                  }}
                >
                  {payee.name}
                </p>
                <p
                  className="text-ink-500 money"
                  style={{ fontSize: "var(--text-label)", lineHeight: "var(--leading-label)" }}
                >
                  {payee.handle}
                </p>
              </div>
            </button>
          ))}

          <button
            onClick={() => toast("Add new payee feature coming soon")}
            className="w-full text-left flex items-center gap-3 p-3 border border-dashed border-vault-teal/30 bg-teal-100/20 active:scale-[0.99] transition-transform"
            style={{ borderRadius: "var(--radius-md)", minHeight: "64px" }}
          >
            <div className="w-11 h-11 rounded-full bg-vault-teal/10 flex items-center justify-center text-vault-teal">
              <Icon name="plus" size={20} strokeWidth={2} />
            </div>
            <p
              className="text-vault-teal"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
                fontWeight: 400,
              }}
            >
              Add new payee
            </p>
          </button>
        </div>

        <label className="text-ink-500 mb-3 block">AMOUNT</label>

        <div className="text-center mb-4">
          <div className="inline-flex items-baseline gap-1">
            <span
              className="money text-ink-500"
              style={{
                fontSize: "var(--text-h2)",
                lineHeight: "var(--leading-h2)",
                fontWeight: 300,
              }}
            >
              ₹
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => {
                const val = e.target.value.replace(/[^\d.]/g, "");
                if (val.split(".").length <= 2) {
                  setAmount(val);
                }
              }}
              placeholder="0"
              className="money text-trust-navy bg-transparent border-none outline-none text-center"
              style={{
                fontSize: "var(--text-money)",
                lineHeight: "var(--leading-money)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                width: `${Math.max(2, amount.length || 1)}ch`,
              }}
            />
          </div>
        </div>

        <p
          className="text-ink-500 text-center mb-6"
          style={{ fontSize: "var(--text-label)", lineHeight: "var(--leading-label)" }}
        >
          From {sourceAccount} · ₹{sourceBalance.toLocaleString("en-IN")}
        </p>

        <label className="text-ink-500 mb-3 block">NOTE (OPTIONAL)</label>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note for this transfer"
          className="w-full bg-input-background border border-border text-trust-navy placeholder:text-ink-500 resize-none"
          style={{
            borderRadius: "var(--radius-md)",
            padding: "var(--space-3)",
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            minHeight: "88px",
          }}
        />
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={handleReview}
          className="w-full bg-vault-teal text-white active:scale-[0.98] transition-transform"
          style={{
            borderRadius: "var(--radius-pill)",
            fontSize: "var(--text-button)",
            lineHeight: "var(--leading-button)",
            fontWeight: 400,
            minHeight: "52px",
          }}
        >
          Review transfer
        </button>
      </div>
    </div>
  );
}
