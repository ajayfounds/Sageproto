import { useState } from "react";
import { Icon, IconKey } from "./icons";
import { toast } from "sonner";

type Device = {
  id: string;
  name: string;
  location: string;
  lastActive: string;
  icon: IconKey;
  isCurrent: boolean;
};

const DEVICES: Device[] = [
  { id: "d1", name: "iPhone 15", location: "Mumbai", lastActive: "Just now", icon: "smartphone", isCurrent: true },
  { id: "d2", name: "Chrome on Windows", location: "Mumbai", lastActive: "2 hours ago", icon: "monitor", isCurrent: false },
  { id: "d3", name: "Safari on MacBook Pro", location: "Mumbai", lastActive: "Yesterday", icon: "laptop", isCurrent: false },
];

type Props = {
  onBack?: () => void;
};

export default function SecurityScreen({ onBack }: Props = {}) {
  const [biometric, setBiometric] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [appLock, setAppLock] = useState(false);

  const handleSignOutAll = () => {
    if (window.confirm("Sign out of all other devices?")) {
      toast.success("Signed out of all other devices");
    }
  };

  return (
    <div className="relative size-full bg-surface-2 overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-6 pt-2 flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-surface-1 border border-border flex items-center justify-center text-trust-navy active:scale-95 transition-transform"
          aria-label="Back"
        >
          <Icon name="arrow-left" size={20} strokeWidth={2} />
        </button>
        <h1>Security</h1>
      </div>

      <div className="px-5 pb-[40px] overflow-y-auto h-[calc(100%-90px)]">
        {/* Reassurance banner */}
        <div
          className="p-4 bg-trust-navy shadow-[0_2px_8px_rgba(11,31,51,0.12)] mb-6 flex items-start gap-3"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <Icon name="shield-check" size={20} className="text-white mt-[2px]" strokeWidth={1.8} />
          <div>
            <p
              className="text-white"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
                fontWeight: 600,
              }}
            >
              Your account is protected
            </p>
            <p
              className="text-on-navy mt-1"
              style={{
                fontSize: "var(--text-label)",
                lineHeight: "var(--leading-label)",
              }}
            >
              Last reviewed today
            </p>
          </div>
        </div>

        {/* Sign-in */}
        <label className="text-ink-500 mb-3 block">SIGN-IN</label>
        <div
          className="bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-6 overflow-hidden"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <div className="p-4 flex items-center gap-3 border-b border-border" style={{ minHeight: "64px" }}>
            <div
              className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-ink-500 shrink-0"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <Icon name="fingerprint" size={18} strokeWidth={1.8} />
            </div>
            <p
              className="text-trust-navy flex-1"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
                fontWeight: 600,
              }}
            >
              Biometric login
            </p>
            <button
              onClick={() => {
                setBiometric(!biometric);
                toast.success(biometric ? "Biometric disabled" : "Biometric enabled");
              }}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                biometric ? "bg-vault-teal" : "bg-switch-background"
              }`}
            >
              <div
                className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  biometric ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="p-4 flex items-start gap-3 border-b border-border" style={{ minHeight: "64px" }}>
            <div
              className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-ink-500 shrink-0"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <Icon name="shield" size={18} strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <p
                className="text-trust-navy"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                  fontWeight: 600,
                }}
              >
                Two-factor authentication
              </p>
              <p
                className="text-ink-500 mt-1"
                style={{
                  fontSize: "var(--text-label)",
                  lineHeight: "var(--leading-label)",
                }}
              >
                Via authenticator app
              </p>
            </div>
            <button
              onClick={() => {
                setTwoFactor(!twoFactor);
                toast.success(twoFactor ? "2FA disabled" : "2FA enabled");
              }}
              className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                twoFactor ? "bg-vault-teal" : "bg-switch-background"
              }`}
            >
              <div
                className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  twoFactor ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => toast("Change PIN feature coming soon")}
            className="w-full p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
            style={{ minHeight: "64px" }}
          >
            <div
              className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-ink-500 shrink-0"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <Icon name="lock" size={18} strokeWidth={1.8} />
            </div>
            <p
              className="text-trust-navy flex-1 text-left"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
                fontWeight: 600,
              }}
            >
              Change PIN / password
            </p>
            <Icon name="chevron-right" size={18} className="text-ink-500 shrink-0" strokeWidth={2} />
          </button>
        </div>

        {/* Trusted devices */}
        <label className="text-ink-500 mb-3 block">TRUSTED DEVICES</label>
        <div
          className="bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-6 overflow-hidden"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          {DEVICES.map((device, idx) => (
            <div
              key={device.id}
              className={`p-4 flex items-start gap-3 ${
                idx !== DEVICES.length - 1 ? "border-b border-border" : ""
              }`}
              style={{ minHeight: "72px" }}
            >
              <div
                className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-ink-500 shrink-0"
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                <Icon name={device.icon} size={18} strokeWidth={1.8} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p
                    className="text-trust-navy"
                    style={{
                      fontSize: "var(--text-body)",
                      lineHeight: "var(--leading-body)",
                      fontWeight: 600,
                    }}
                  >
                    {device.name} · {device.location}
                  </p>
                  {device.isCurrent && (
                    <div
                      className="px-2 py-0.5 bg-vault-teal/10 border border-vault-teal/30"
                      style={{ borderRadius: "var(--radius-sm)" }}
                    >
                      <p
                        className="text-vault-teal"
                        style={{
                          fontSize: "var(--text-label)",
                          lineHeight: "var(--leading-label)",
                          fontWeight: 600,
                        }}
                      >
                        This device
                      </p>
                    </div>
                  )}
                </div>
                <p
                  className="text-ink-500 money"
                  style={{
                    fontSize: "var(--text-label)",
                    lineHeight: "var(--leading-label)",
                  }}
                >
                  Last active {device.lastActive}
                </p>
              </div>

              {!device.isCurrent && (
                <button
                  onClick={() => toast(`Remove ${device.name}`)}
                  className="text-ink-500"
                  style={{
                    fontSize: "var(--text-label)",
                    lineHeight: "var(--leading-label)",
                    fontWeight: 600,
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Alerts & Privacy */}
        <label className="text-ink-500 mb-3 block">ALERTS & PRIVACY</label>
        <div
          className="bg-card border border-border shadow-[0_1px_2px_rgba(11,31,51,0.04)] mb-6 overflow-hidden"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <div className="p-4 flex items-center gap-3 border-b border-border" style={{ minHeight: "64px" }}>
            <div
              className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-ink-500 shrink-0"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <Icon name="bell" size={18} strokeWidth={1.8} />
            </div>
            <p
              className="text-trust-navy flex-1"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
                fontWeight: 600,
              }}
            >
              Login alerts
            </p>
            <button
              onClick={() => {
                setLoginAlerts(!loginAlerts);
                toast.success(loginAlerts ? "Login alerts disabled" : "Login alerts enabled");
              }}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                loginAlerts ? "bg-vault-teal" : "bg-switch-background"
              }`}
            >
              <div
                className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  loginAlerts ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="p-4 flex items-center gap-3 border-b border-border" style={{ minHeight: "64px" }}>
            <div
              className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-ink-500 shrink-0"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <Icon name="lock" size={18} strokeWidth={1.8} />
            </div>
            <p
              className="text-trust-navy flex-1"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
                fontWeight: 600,
              }}
            >
              App lock
            </p>
            <button
              onClick={() => {
                setAppLock(!appLock);
                toast.success(appLock ? "App lock disabled" : "App lock enabled");
              }}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                appLock ? "bg-vault-teal" : "bg-switch-background"
              }`}
            >
              <div
                className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  appLock ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => toast("Data & privacy feature coming soon")}
            className="w-full p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
            style={{ minHeight: "64px" }}
          >
            <div
              className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-ink-500 shrink-0"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <Icon name="shield" size={18} strokeWidth={1.8} />
            </div>
            <p
              className="text-trust-navy flex-1 text-left"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
                fontWeight: 600,
              }}
            >
              Data & privacy controls
            </p>
            <Icon name="chevron-right" size={18} className="text-ink-500 shrink-0" strokeWidth={2} />
          </button>
        </div>

        {/* Sign out all */}
        <button
          onClick={handleSignOutAll}
          className="w-full border border-border text-loss flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{
            borderRadius: "var(--radius-pill)",
            fontSize: "var(--text-button)",
            lineHeight: "var(--leading-button)",
            fontWeight: 600,
            minHeight: "52px",
          }}
        >
          <Icon name="logout" size={18} strokeWidth={2} />
          Sign out of all other devices
        </button>
      </div>
    </div>
  );
}
