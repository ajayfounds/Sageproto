import { useState } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";
import BottomTabBar, { TabKey } from "./BottomTabBar";

type Props = { onNavigate?: (tab: TabKey | "security") => void; onSignOut?: () => void };

type SettingRow = {
  icon: IconKey;
  label: string;
  value?: string;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
  onClick?: () => void;
};

export default function ProfileScreen({ onNavigate, onSignOut }: Props = {}) {
  const [appLock, setAppLock] = useState(false);

  const accountSettings: SettingRow[] = [
    { icon: "profile", label: "Personal details", onClick: () => toast("Personal details") },
    { icon: "accounts", label: "Linked accounts & cards", onClick: () => toast("Linked accounts") },
    { icon: "card", label: "Payment methods", onClick: () => toast("Payment methods") },
  ];

  const securitySettings: SettingRow[] = [
    { icon: "shield", label: "Security & privacy", onClick: () => onNavigate?.("security") },
    {
      icon: "lock",
      label: "App lock",
      isToggle: true,
      toggleValue: appLock,
      onToggle: (val) => {
        setAppLock(val);
        toast.success(val ? "App lock enabled" : "App lock disabled");
      },
    },
    { icon: "eye", label: "Login activity", onClick: () => toast("Login activity") },
  ];

  const preferenceSettings: SettingRow[] = [
    { icon: "bell", label: "Notifications", onClick: () => toast("Notifications") },
    { icon: "globe", label: "Language", value: "English", onClick: () => toast("Language") },
    { icon: "palette", label: "Appearance", onClick: () => toast("Appearance") },
  ];

  const supportSettings: SettingRow[] = [
    { icon: "help", label: "Help centre", onClick: () => toast("Help centre") },
    { icon: "mail", label: "Contact us", onClick: () => toast("Contact us") },
    { icon: "file", label: "Terms & privacy", onClick: () => toast("Terms & privacy") },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      onSignOut?.();
    }
  };

  return (
    <div className="relative size-full bg-surface-2 overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-6 pt-2 mb-4">
        <h1>Profile</h1>
      </div>

      <div className="px-5 pb-[100px] overflow-y-auto h-[calc(100%-90px-80px)]">
        {/* Profile header card */}
        <div
          className="p-5 bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-6"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full bg-vault-teal/10 border-2 border-vault-teal/30 flex items-center justify-center text-vault-teal shrink-0"
              style={{
                fontSize: "var(--text-h2)",
                lineHeight: "var(--leading-h2)",
                fontWeight: 500,
              }}
            >
              PS
            </div>
            <div className="flex-1">
              <h2 className="mb-1">Priya Sharma</h2>
              <p
                className="text-ink-500 money mb-1"
                style={{
                  fontSize: "var(--text-label)",
                  lineHeight: "var(--leading-label)",
                }}
              >
                p••••@gmail.com
              </p>
              <p
                className="text-ink-500 money"
                style={{
                  fontSize: "var(--text-label)",
                  lineHeight: "var(--leading-label)",
                }}
              >
                +91 ••••• 4821
              </p>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gain/10 border border-gain/30"
            style={{ borderRadius: "var(--radius-pill)" }}
          >
            <Icon name="check" size={14} className="text-gain" strokeWidth={2} />
            <p
              className="text-gain"
              style={{
                fontSize: "var(--text-label)",
                lineHeight: "var(--leading-label)",
                fontWeight: 400,
              }}
            >
              Verified
            </p>
          </div>
        </div>

        {/* Account settings */}
        <label className="text-ink-500 mb-3 block">ACCOUNT</label>
        <div
          className="bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-6 overflow-hidden"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          {accountSettings.map((setting, idx) => (
            <SettingRowComponent
              key={setting.label}
              {...setting}
              isLast={idx === accountSettings.length - 1}
            />
          ))}
        </div>

        {/* Security settings */}
        <label className="text-ink-500 mb-3 block">SECURITY</label>
        <div
          className="bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-6 overflow-hidden"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          {securitySettings.map((setting, idx) => (
            <SettingRowComponent
              key={setting.label}
              {...setting}
              isLast={idx === securitySettings.length - 1}
            />
          ))}
        </div>

        {/* Preferences */}
        <label className="text-ink-500 mb-3 block">PREFERENCES</label>
        <div
          className="bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-6 overflow-hidden"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          {preferenceSettings.map((setting, idx) => (
            <SettingRowComponent
              key={setting.label}
              {...setting}
              isLast={idx === preferenceSettings.length - 1}
            />
          ))}
        </div>

        {/* Support */}
        <label className="text-ink-500 mb-3 block">SUPPORT</label>
        <div
          className="bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-6 overflow-hidden"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          {supportSettings.map((setting, idx) => (
            <SettingRowComponent
              key={setting.label}
              {...setting}
              isLast={idx === supportSettings.length - 1}
            />
          ))}
        </div>

        {/* Log out */}
        <button
          onClick={handleLogout}
          className="w-full border border-border text-loss flex items-center justify-center gap-2 active:scale-[0.98] transition-transform mb-4"
          style={{
            borderRadius: "var(--radius-pill)",
            fontSize: "var(--text-button)",
            lineHeight: "var(--leading-button)",
            fontWeight: 400,
            minHeight: "52px",
          }}
        >
          <Icon name="logout" size={18} strokeWidth={2} />
          Log out
        </button>

        {/* Version */}
        <p
          className="text-ink-500 text-center"
          style={{
            fontSize: "var(--text-caption)",
            lineHeight: "var(--leading-caption)",
          }}
        >
          SAGE v1.0.0
        </p>
      </div>

      <BottomTabBar active="profile" onNavigate={(k) => onNavigate?.(k)} />
    </div>
  );
}

function SettingRowComponent({
  icon,
  label,
  value,
  isToggle,
  toggleValue,
  onToggle,
  onClick,
  isLast,
}: SettingRow & { isLast?: boolean }) {
  const handleClick = () => {
    if (isToggle && onToggle) {
      onToggle(!toggleValue);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 p-4 active:scale-[0.99] transition-transform ${
        isLast ? "" : "border-b border-border"
      }`}
      style={{ minHeight: "64px" }}
    >
      <div
        className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-ink-500 shrink-0"
        style={{ borderRadius: "var(--radius-sm)" }}
      >
        <Icon name={icon} size={18} strokeWidth={1.8} />
      </div>

      <p
        className="text-trust-navy flex-1 text-left"
        style={{
          fontSize: "var(--text-body)",
          lineHeight: "var(--leading-body)",
          fontWeight: 400,
        }}
      >
        {label}
      </p>

      {value && !isToggle && (
        <p
          className="text-ink-500"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            fontWeight: 300,
          }}
        >
          {value}
        </p>
      )}

      {isToggle ? (
        <div
          className={`relative w-12 h-7 rounded-full transition-colors ${
            toggleValue ? "bg-vault-teal" : "bg-switch-background"
          }`}
        >
          <div
            className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
              toggleValue ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      ) : (
        <Icon name="chevron-right" size={18} className="text-ink-500 shrink-0" strokeWidth={2} />
      )}
    </button>
  );
}
