import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "./icons";
import BottomTabBar, { TabKey } from "./BottomTabBar";

type Card = {
  id: string;
  type: "VIRTUAL" | "PHYSICAL";
  last4: string;
  network: "Visa" | "Mastercard";
  holder: string;
  expiry: string;
};

const CARDS: Card[] = [
  { id: "c1", type: "VIRTUAL", last4: "4921", network: "Visa", holder: "PRIYA SHARMA", expiry: "••/••" },
  { id: "c2", type: "PHYSICAL", last4: "7834", network: "Mastercard", holder: "PRIYA SHARMA", expiry: "••/••" },
];

export default function CardsScreen({ onNavigate }: { onNavigate: (k: TabKey) => void }) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [onlinePayments, setOnlinePayments] = useState(true);
  const [contactless, setContactless] = useState(true);

  const activeCard = CARDS[activeCardIndex];

  const handleFreeze = () => {
    setFrozen(!frozen);
    toast.success(frozen ? "Card unfrozen" : "Card frozen");
  };

  return (
    <div className="relative size-full bg-surface-2 overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-6 pt-2">
        <h1>Cards</h1>
      </div>

      <div className="px-5 pt-6 pb-[100px] overflow-y-auto h-[calc(100%-70px-80px)]">
        {/* Card carousel */}
        <div className="relative mb-6">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
            {CARDS.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => setActiveCardIndex(idx)}
                className={`shrink-0 w-[320px] snap-center cursor-pointer transition-all ${
                  activeCardIndex === idx ? "scale-100 opacity-100" : "scale-95 opacity-60"
                }`}
              >
                <div
                  className="relative w-full p-6 bg-trust-navy shadow-[0_4px_16px_rgba(11,31,51,0.18)] overflow-hidden"
                  style={{ borderRadius: "var(--radius-lg)", minHeight: "200px" }}
                >
                  {/* Frozen overlay */}
                  {frozen && activeCardIndex === idx && (
                    <div
                      className="absolute inset-0 bg-trust-navy/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-10"
                      style={{ borderRadius: "var(--radius-lg)" }}
                    >
                      <Icon name="lock" size={32} className="text-white/90 mb-2" strokeWidth={1.5} />
                      <p
                        className="text-white"
                        style={{
                          fontSize: "var(--text-body-lg)",
                          lineHeight: "var(--leading-body-lg)",
                          fontWeight: 600,
                        }}
                      >
                        Card frozen
                      </p>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <p
                        className="text-white"
                        style={{
                          fontSize: "var(--text-h3)",
                          lineHeight: "var(--leading-h3)",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                        }}
                      >
                        SAGE
                      </p>
                    </div>
                    <div
                      className="px-3 py-1 bg-white/10 border border-white/20"
                      style={{ borderRadius: "var(--radius-sm)" }}
                    >
                      <p
                        className="text-on-navy"
                        style={{
                          fontSize: "var(--text-label)",
                          lineHeight: "var(--leading-label)",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {card.type}
                      </p>
                    </div>
                  </div>

                  <p
                    className="text-white money mb-6"
                    style={{
                      fontSize: "var(--text-body-lg)",
                      lineHeight: "var(--leading-body-lg)",
                      letterSpacing: "0.18em",
                      fontWeight: 500,
                    }}
                  >
                    •••• •••• •••• {card.last4}
                  </p>

                  <div className="flex justify-between items-end">
                    <div>
                      <label className="text-on-navy">CARDHOLDER</label>
                      <p
                        className="text-white"
                        style={{
                          fontSize: "var(--text-body)",
                          lineHeight: "var(--leading-body)",
                          fontWeight: 600,
                          letterSpacing: "0.02em",
                          marginTop: "2px",
                        }}
                      >
                        {card.holder}
                      </p>
                    </div>
                    <div className="text-right">
                      <label className="text-on-navy">EXPIRES</label>
                      <p
                        className="text-white money"
                        style={{
                          fontSize: "var(--text-body)",
                          lineHeight: "var(--leading-body)",
                          fontWeight: 600,
                          marginTop: "2px",
                        }}
                      >
                        {card.expiry}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-5 right-6">
                    <p
                      className="text-white"
                      style={{
                        fontSize: "var(--text-label)",
                        lineHeight: "var(--leading-label)",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {card.network}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {CARDS.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {CARDS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeCardIndex ? "w-6 bg-vault-teal" : "w-1.5 bg-ink-500/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Freeze toggle */}
        <div
          className="p-4 bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-4"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <button
            onClick={handleFreeze}
            className="w-full flex items-center justify-between active:scale-[0.99] transition-transform"
            style={{ minHeight: "44px" }}
          >
            <div className="flex items-center gap-3">
              <Icon name="snowflake" size={20} className="text-vault-teal" strokeWidth={1.8} />
              <div className="text-left">
                <p
                  className="text-trust-navy"
                  style={{
                    fontSize: "var(--text-body)",
                    lineHeight: "var(--leading-body)",
                    fontWeight: 600,
                  }}
                >
                  Freeze card
                </p>
                {frozen && (
                  <p
                    className="text-ink-500"
                    style={{
                      fontSize: "var(--text-label)",
                      lineHeight: "var(--leading-label)",
                    }}
                  >
                    You can unfreeze anytime
                  </p>
                )}
              </div>
            </div>
            <div
              className={`relative w-12 h-7 rounded-full transition-colors ${
                frozen ? "bg-vault-teal" : "bg-switch-background"
              }`}
            >
              <div
                className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  frozen ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Card controls */}
        <label className="text-ink-500 mb-3 block">CARD CONTROLS</label>

        <div className="space-y-2 mb-6">
          <button
            onClick={() => toast("Card details feature coming soon")}
            className="w-full p-4 bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] flex items-center justify-between active:scale-[0.99] transition-transform"
            style={{ borderRadius: "var(--radius-md)", minHeight: "56px" }}
          >
            <div className="flex items-center gap-3">
              <Icon name="eye" size={20} className="text-ink-500" strokeWidth={1.8} />
              <p
                className="text-trust-navy"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                  fontWeight: 600,
                }}
              >
                Card details
              </p>
            </div>
            <Icon name="chevron-right" size={18} className="text-ink-500" strokeWidth={2} />
          </button>

          <button
            onClick={() => toast("Spending limits feature coming soon")}
            className="w-full p-4 bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] flex items-center justify-between active:scale-[0.99] transition-transform"
            style={{ borderRadius: "var(--radius-md)", minHeight: "56px" }}
          >
            <div className="flex items-center gap-3">
              <Icon name="shield" size={20} className="text-ink-500" strokeWidth={1.8} />
              <p
                className="text-trust-navy"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                  fontWeight: 600,
                }}
              >
                Spending limits
              </p>
            </div>
            <Icon name="chevron-right" size={18} className="text-ink-500" strokeWidth={2} />
          </button>

          <div
            className="p-4 bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] flex items-center justify-between"
            style={{ borderRadius: "var(--radius-md)", minHeight: "56px" }}
          >
            <div className="flex items-center gap-3">
              <Icon name="wallet" size={20} className="text-ink-500" strokeWidth={1.8} />
              <p
                className="text-trust-navy"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                  fontWeight: 600,
                }}
              >
                Online payments
              </p>
            </div>
            <button
              onClick={() => {
                setOnlinePayments(!onlinePayments);
                toast.success(onlinePayments ? "Online payments disabled" : "Online payments enabled");
              }}
              className="relative w-12 h-7 rounded-full transition-colors"
              style={{ backgroundColor: onlinePayments ? "var(--vault-teal)" : "var(--switch-background)" }}
            >
              <div
                className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  onlinePayments ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div
            className="p-4 bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] flex items-center justify-between"
            style={{ borderRadius: "var(--radius-md)", minHeight: "56px" }}
          >
            <div className="flex items-center gap-3">
              <Icon name="zap" size={20} className="text-ink-500" strokeWidth={1.8} />
              <p
                className="text-trust-navy"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                  fontWeight: 600,
                }}
              >
                Contactless
              </p>
            </div>
            <button
              onClick={() => {
                setContactless(!contactless);
                toast.success(contactless ? "Contactless disabled" : "Contactless enabled");
              }}
              className="relative w-12 h-7 rounded-full transition-colors"
              style={{ backgroundColor: contactless ? "var(--vault-teal)" : "var(--switch-background)" }}
            >
              <div
                className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  contactless ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => toast("Replace card feature coming soon")}
            className="w-full p-4 bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] flex items-center justify-between active:scale-[0.99] transition-transform"
            style={{ borderRadius: "var(--radius-md)", minHeight: "56px" }}
          >
            <div className="flex items-center gap-3">
              <Icon name="card" size={20} className="text-ink-500" strokeWidth={1.8} />
              <p
                className="text-trust-navy"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                  fontWeight: 600,
                }}
              >
                Replace card
              </p>
            </div>
            <Icon name="chevron-right" size={18} className="text-ink-500" strokeWidth={2} />
          </button>

          <button
            onClick={() => toast("Report lost or stolen feature coming soon")}
            className="w-full p-4 bg-card border shadow-[0_1px_2px_rgba(11,31,51,0.04)] flex items-center justify-between active:scale-[0.99] transition-transform"
            style={{
              borderRadius: "var(--radius-md)",
              minHeight: "56px",
              borderColor: "var(--loss)",
              borderWidth: "1px",
            }}
          >
            <div className="flex items-center gap-3">
              <Icon name="alert" size={20} className="text-loss" strokeWidth={1.8} />
              <p
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                  fontWeight: 600,
                  color: "var(--loss)",
                }}
              >
                Report lost or stolen
              </p>
            </div>
            <Icon name="chevron-right" size={18} className="text-loss" strokeWidth={2} />
          </button>
        </div>

        {/* Security reassurance */}
        <div className="flex items-start gap-2 mb-6">
          <Icon name="shield" size={16} className="text-ink-500 mt-[2px]" strokeWidth={1.8} />
          <p
            className="text-ink-500"
            style={{
              fontSize: "var(--text-label)",
              lineHeight: "var(--leading-label)",
            }}
          >
            Your card details are encrypted and never shared
          </p>
        </div>

        {/* Primary action */}
        <button
          onClick={() => toast("Add to Apple/Google Pay feature coming soon")}
          className="w-full bg-vault-teal text-white active:scale-[0.98] transition-transform"
          style={{
            borderRadius: "var(--radius-pill)",
            fontSize: "var(--text-button)",
            lineHeight: "var(--leading-button)",
            fontWeight: 600,
            minHeight: "52px",
          }}
        >
          Add to Apple/Google Pay
        </button>
      </div>

      <BottomTabBar active="cards" onNavigate={onNavigate} />
    </div>
  );
}
