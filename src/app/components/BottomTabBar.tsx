import { Icon, IconKey } from "./icons";

export type TabKey = "home" | "accounts" | "cards" | "insights" | "profile";

const TABS: { key: TabKey; icon: IconKey; label: string }[] = [
  { key: "home",     icon: "home",     label: "Home" },
  { key: "accounts", icon: "accounts", label: "Accounts" },
  { key: "cards",    icon: "card",     label: "Cards" },
  { key: "insights", icon: "insights", label: "Insights" },
  { key: "profile",  icon: "profile",  label: "Profile" },
];

export default function BottomTabBar({
  active,
  onNavigate,
}: {
  active?: TabKey;
  onNavigate: (key: TabKey) => void;
}) {
  return (
    <div className="absolute left-0 right-0 bottom-0 h-[80px] bg-surface-1/[0.97]">
      <div className="absolute inset-x-0 top-0 h-px bg-vault-teal/[0.15]" />
      <div className="flex h-full">
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => onNavigate(t.key)}
              className="flex-1 flex flex-col items-center justify-center gap-1 relative"
              style={{ minHeight: '44px' }}
              aria-label={t.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                name={t.icon}
                size={22}
                strokeWidth={1.5}
                className={isActive ? "text-vault-teal" : "text-ink-500"}
              />
              <p
                className={isActive ? "text-vault-teal" : "text-ink-500"}
                style={{
                  fontSize: 'var(--text-label)',
                  lineHeight: 'var(--leading-label)',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {t.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
