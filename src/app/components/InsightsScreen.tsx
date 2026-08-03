import { useState } from "react";
import { Icon, IconKey } from "./icons";
import BottomTabBar, { TabKey } from "./BottomTabBar";
import { toast } from "sonner";

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

type MonthData = { month: string; income: number; spending: number };
type CategorySpend = { name: string; icon: IconKey; amount: number; color: string };
type Trend = { icon: IconKey; iconColor: string; text: string; change: "up" | "down" | "neutral"; changeColor: string };

const CASH_FLOW: MonthData[] = [
  { month: "Nov", income: 58000, spending: 42300 },
  { month: "Dec", income: 58000, spending: 51200 },
  { month: "Jan", income: 58000, spending: 48900 },
  { month: "Feb", income: 62000, spending: 52100 },
  { month: "Mar", income: 58000, spending: 49600 },
  { month: "Apr", income: 58000, spending: 40540 },
];

const CATEGORIES: CategorySpend[] = [
  { name: "Food & Dining", icon: "coffee", amount: 8200, color: "var(--vault-teal)" },
  { name: "Bills & Utilities", icon: "wallet", amount: 9800, color: "var(--navy-700)" },
  { name: "Shopping", icon: "cart", amount: 12400, color: "var(--teal-400)" },
  { name: "Transport", icon: "car", amount: 3100, color: "var(--info)" },
  { name: "Entertainment", icon: "smile", amount: 2300, color: "var(--warn)" },
  { name: "Health", icon: "pulse", amount: 2740, color: "var(--teal-200)" },
];

const TRENDS: Trend[] = [
  {
    icon: "trending-up",
    iconColor: "var(--gain)",
    text: "You spent 12% less on dining than last month",
    change: "down",
    changeColor: "var(--gain)",
  },
  {
    icon: "alert",
    iconColor: "var(--warn)",
    text: "Subscriptions up ₹400 from last month",
    change: "up",
    changeColor: "var(--warn)",
  },
  {
    icon: "shield",
    iconColor: "var(--vault-teal)",
    text: "You're on track to save ₹21,000 this month",
    change: "neutral",
    changeColor: "var(--vault-teal)",
  },
];

type Props = {
  onNavigate?: (tab: TabKey) => void;
};

export default function InsightsScreen({ onNavigate }: Props = {}) {
  const [period] = useState("This month");

  const income = 116000;
  const spent = 98540;
  const net = income - spent;

  const totalCategorySpend = CATEGORIES.reduce((sum, cat) => sum + cat.amount, 0);
  const maxCashFlow = Math.max(...CASH_FLOW.map((m) => Math.max(m.income, m.spending)));

  return (
    <div className="relative size-full bg-surface-2 overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-6 pt-2 flex items-center justify-between mb-4">
        <h1>Insights</h1>
        <button
          onClick={() => toast("Period selector")}
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
            {period}
          </p>
        </button>
      </div>

      <div className="px-5 pt-3 pb-[100px] overflow-y-auto h-[calc(100%-90px-80px)]">
        {/* Net summary card */}
        <div
          className="bg-brand-dark-900 shadow-level-2 mb-6"
          style={{ borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}
        >
          <label className="text-on-navy">NET THIS MONTH</label>
          <p
            className="money"
            style={{
              fontSize: "var(--text-money)",
              lineHeight: "var(--leading-money)",
              fontWeight: 300,
              letterSpacing: "var(--tracking-money)",
              marginTop: "var(--space-2)",
              color: net >= 0 ? "var(--gain-on-dark)" : "var(--loss)",
            }}
          >
            {net >= 0 ? "+" : "−"}
            {fmt(Math.abs(net))}
          </p>
          <p
            className="text-on-navy money"
            style={{
              fontSize: "var(--text-tabular)",
              lineHeight: "var(--leading-tabular)",
              fontWeight: 300,
              marginTop: "var(--space-3)",
            }}
          >
            Income {fmt(income)} · Spent {fmt(spent)}
          </p>
        </div>

        {/* Cash Flow */}
        <div
          className="p-5 bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-4"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <h3 className="mb-4">Cash Flow</h3>

          <div className="flex items-end justify-between gap-2 h-[160px] mb-4">
            {CASH_FLOW.map((month, idx) => {
              const incomeHeight = (month.income / maxCashFlow) * 100;
              const spendingHeight = (month.spending / maxCashFlow) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <div className="flex-1 w-full flex items-end justify-center gap-1">
                    <div
                      className="w-[40%] bg-teal-400"
                      style={{
                        height: `${incomeHeight}%`,
                        borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                      }}
                      title={`Income: ${fmt(month.income)}`}
                    />
                    <div
                      className="w-[40%] bg-navy-700"
                      style={{
                        height: `${spendingHeight}%`,
                        borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                      }}
                      title={`Spending: ${fmt(month.spending)}`}
                    />
                  </div>
                  <p
                    className="text-ink-500"
                    style={{
                      fontSize: "var(--text-label)",
                      lineHeight: "var(--leading-label)",
                      fontWeight: 300,
                    }}
                  >
                    {month.month}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-400" style={{ borderRadius: "var(--radius-sm)" }} />
              <p
                className="text-ink-500"
                style={{
                  fontSize: "var(--text-label)",
                  lineHeight: "var(--leading-label)",
                }}
              >
                Income
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-navy-700" style={{ borderRadius: "var(--radius-sm)" }} />
              <p
                className="text-ink-500"
                style={{
                  fontSize: "var(--text-label)",
                  lineHeight: "var(--leading-label)",
                }}
              >
              Spending
              </p>
            </div>
          </div>
        </div>

        {/* Spending by Category */}
        <div
          className="p-5 bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-4"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <h3 className="mb-4">Spending by Category</h3>

          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const percentage = Math.round((cat.amount / totalCategorySpend) * 100);

              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{
                          backgroundColor: `${cat.color}1A`,
                          color: cat.color,
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        <Icon name={cat.icon} size={14} strokeWidth={1.8} />
                      </div>
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
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p
                        className="money text-trust-navy"
                        style={{
                          fontSize: "var(--text-body)",
                          lineHeight: "var(--leading-body)",
                          fontWeight: 400,
                        }}
                      >
                        {fmt(cat.amount)}
                      </p>
                      <p
                        className="text-ink-500"
                        style={{
                          fontSize: "var(--text-label)",
                          lineHeight: "var(--leading-label)",
                        }}
                      >
                        {percentage}%
                      </p>
                    </div>
                  </div>

                  <div
                    className="h-2 bg-surface-2 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trends */}
        <div
          className="p-5 bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-4"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <h3 className="mb-4">Trends</h3>

          <div className="space-y-3">
            {TRENDS.map((trend, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-surface-2"
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${trend.iconColor}1A`,
                    color: trend.iconColor,
                  }}
                >
                  <Icon name={trend.icon} size={16} strokeWidth={1.8} />
                </div>
                <p
                  className="text-trust-navy flex-1 money"
                  style={{
                    fontSize: "var(--text-body)",
                    lineHeight: "var(--leading-body)",
                    fontWeight: 300,
                  }}
                >
                  {trend.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onNavigate?.("insights")}
          className="w-full bg-vault-teal text-white active:scale-[0.98] transition-transform"
          style={{
            borderRadius: "var(--radius-pill)",
            fontSize: "var(--text-button)",
            lineHeight: "var(--leading-button)",
            fontWeight: 400,
            minHeight: "52px",
          }}
        >
          View detailed reports
        </button>
      </div>

      <BottomTabBar active="insights" onNavigate={(k) => onNavigate?.(k)} />
    </div>
  );
}
