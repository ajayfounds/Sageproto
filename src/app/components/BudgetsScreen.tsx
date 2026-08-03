import { useState } from "react";
import { Icon, IconKey } from "./icons";
import BottomTabBar, { TabKey } from "./BottomTabBar";
import { toast } from "sonner";

type CategoryBudget = {
  id: string;
  name: string;
  icon: IconKey;
  spent: number;
  limit: number;
};

const CATEGORIES: CategoryBudget[] = [
  { id: "food", name: "Food & Dining", icon: "coffee", spent: 8200, limit: 10000 },
  { id: "transport", name: "Transport", icon: "car", spent: 3100, limit: 6000 },
  { id: "shopping", name: "Shopping", icon: "cart", spent: 12400, limit: 10000 },
  { id: "bills", name: "Bills & Utilities", icon: "wallet", spent: 9800, limit: 12000 },
  { id: "entertainment", name: "Entertainment", icon: "smile", spent: 2300, limit: 5000 },
  { id: "health", name: "Health & Wellness", icon: "pulse", spent: 2740, limit: 8000 },
];

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

type Props = {
  onNavigate?: (tab: TabKey) => void;
};

export default function BudgetsScreen({ onNavigate }: Props = {}) {
  const [month] = useState("April 2025");
  const [daysLeft] = useState(18);

  const monthlyBudget = 60000;
  const totalSpent = CATEGORIES.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = monthlyBudget - totalSpent;

  const getStatus = (spent: number, limit: number) => {
    const pct = (spent / limit) * 100;
    if (pct > 100) return { status: "over", color: "var(--loss)", label: "Over budget", icon: "alert" as IconKey };
    if (pct >= 80) return { status: "near", color: "var(--warn)", label: "Near limit", icon: "alert" as IconKey };
    return { status: "ok", color: "var(--vault-teal)", label: "On track", icon: "check" as IconKey };
  };

  return (
    <div className="relative size-full bg-surface-2 overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-6 pt-2 flex items-center justify-between mb-4">
        <h1>Budgets</h1>
        <button
          onClick={() => toast("Month selector")}
          className="px-4 py-2 bg-surface-1 border border-border active:scale-95 transition-transform"
          style={{ borderRadius: "var(--radius-pill)", minHeight: "36px" }}
        >
          <p
            className="text-trust-navy"
            style={{
              fontSize: "var(--text-label)",
              lineHeight: "var(--leading-label)",
              fontWeight: 400,
            }}
          >
            {month}
          </p>
        </button>
      </div>

      <div className="px-5 pt-3 pb-[100px] overflow-y-auto h-[calc(100%-90px-80px)]">
        <div
          className="p-6 bg-trust-navy shadow-[0_2px_8px_rgba(11,31,51,0.12)] mb-6"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <label className="text-on-navy">TOTAL SPENT THIS MONTH</label>
          <p
            className="text-white mt-1 money"
            style={{
              fontSize: "var(--text-money)",
              lineHeight: "var(--leading-money)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            {fmt(totalSpent)}
          </p>
          <p
            className="text-on-navy mt-1"
            style={{
              fontSize: "var(--text-label)",
              lineHeight: "var(--leading-label)",
              fontWeight: 300,
            }}
          >
            of {fmt(monthlyBudget)} budget
          </p>

          <div
            className="h-[6px] bg-white/20 rounded-full overflow-hidden"
            style={{ marginTop: "var(--space-4)" }}
          >
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${Math.min(100, (totalSpent / monthlyBudget) * 100)}%` }}
            />
          </div>

          <p
            className="text-on-navy"
            style={{
              fontSize: "var(--text-label)",
              lineHeight: "var(--leading-label)",
              fontWeight: 300,
              marginTop: "var(--space-2)",
            }}
          >
            {fmt(remaining)} left · {daysLeft} days to go
          </p>
        </div>

        <label className="text-ink-500 mb-3 block">CATEGORIES</label>

        <div className="space-y-3 mb-6">
          {CATEGORIES.map((cat) => {
            const pct = Math.round((cat.spent / cat.limit) * 100);
            const { status, color, label, icon } = getStatus(cat.spent, cat.limit);

            return (
              <div
                key={cat.id}
                className="p-4 bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)]"
                style={{ borderRadius: "var(--radius-md)" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-lg bg-teal-100 flex items-center justify-center text-vault-teal shrink-0"
                    style={{ borderRadius: "var(--radius-sm)" }}
                  >
                    <Icon name={cat.icon} size={20} strokeWidth={1.8} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p
                        className="text-trust-navy"
                        style={{
                          fontSize: "var(--text-body)",
                          lineHeight: "var(--leading-body)",
                          fontWeight: 400,
                        }}
                      >
                        {cat.name}
                      </p>
                      <p
                        className="money text-trust-navy shrink-0"
                        style={{
                          fontSize: "var(--text-body)",
                          lineHeight: "var(--leading-body)",
                          fontWeight: 400,
                        }}
                      >
                        {pct}%
                      </p>
                    </div>

                    <p
                      className="money text-ink-500 mb-2"
                      style={{
                        fontSize: "var(--text-label)",
                        lineHeight: "var(--leading-label)",
                      }}
                    >
                      {fmt(cat.spent)} of {fmt(cat.limit)}
                    </p>

                    <div
                      className="h-[4px] bg-surface-2 rounded-full overflow-hidden mb-2"
                    >
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${Math.min(100, pct)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>

                    {status !== "ok" && (
                      <div className="flex items-center gap-1">
                        <Icon
                          name={icon}
                          size={14}
                          strokeWidth={2}
                          className={status === "over" ? "text-loss" : "text-warn"}
                        />
                        <p
                          className={status === "over" ? "text-loss" : "text-warn"}
                          style={{
                            fontSize: "var(--text-label)",
                            lineHeight: "var(--leading-label)",
                            fontWeight: 400,
                          }}
                        >
                          {label}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => toast("Adjust budgets feature coming soon")}
          className="w-full bg-vault-teal text-white active:scale-[0.98] transition-transform"
          style={{
            borderRadius: "var(--radius-pill)",
            fontSize: "var(--text-button)",
            lineHeight: "var(--leading-button)",
            fontWeight: 400,
            minHeight: "52px",
          }}
        >
          Adjust budgets
        </button>
      </div>

      <BottomTabBar active="insights" onNavigate={(k) => onNavigate?.(k)} />
    </div>
  );
}
