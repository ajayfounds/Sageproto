import { useState } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";

type Kind = "nudge" | "alert" | "goal" | "insight" | "reminder";

type Notif = {
  id: string;
  kind: Kind;
  icon: IconKey;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const KIND_STYLE: Record<Kind, { color: string; bg: string; border: string; label: string }> = {
  nudge:    { color: "#7EC8A4", bg: "#0E1A10", border: "#7EC8A4", label: "Sage's nudge" },
  alert:    { color: "#F07B6A", bg: "#1A0E0C", border: "#F07B6A", label: "Alert" },
  goal:     { color: "#E8C87A", bg: "#1A140A", border: "#E8C87A", label: "Goal" },
  insight:  { color: "#7AB8D4", bg: "#0A141A", border: "#7AB8D4", label: "Insight" },
  reminder: { color: "#9BB09F", bg: "#0E1A10", border: "#9BB09F", label: "Reminder" },
};

const INITIAL: Notif[] = [
  { id: "n1", kind: "nudge",    icon: "leaf",   title: "Food spend is up this week",         body: "₹620 more than last week. Try cooking Sunday — pattern from past 4 weeks.", time: "Just now",   read: false },
  { id: "n2", kind: "alert",    icon: "alert",  title: "Big spend detected",                  body: "Amazon ₹1,499 — tap to categorize as Shopping or Essentials.",              time: "2h ago",     read: false },
  { id: "n3", kind: "goal",     icon: "target", title: "Goa trip is 65% funded",              body: "₹500 more this week keeps you on track for July.",                          time: "Today",      read: false },
  { id: "n4", kind: "insight",  icon: "chart",  title: "You spend more when tired",           body: "3 of last 4 'tired' check-ins had Swiggy orders. No pressure.",             time: "Yesterday",  read: true  },
  { id: "n5", kind: "reminder", icon: "pulse",  title: "Sunday check-in",                     body: "Your weekly Pulse opens tomorrow — takes 2 minutes.",                      time: "Yesterday",  read: true  },
  { id: "n6", kind: "goal",     icon: "wallet", title: "Salary credited",                     body: "₹58,000 added. ₹15,000 auto-allocated to goals.",                          time: "Apr 1",      read: true  },
];

type Props = { onBack?: () => void };

export default function NotificationsScreen({ onBack }: Props = {}) {
  const [items, setItems] = useState<Notif[]>(INITIAL);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unread = items.filter((n) => !n.read).length;
  const list = filter === "unread" ? items.filter((n) => !n.read) : items;

  const open = (id: string) => {
    setItems((xs) => xs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const dismiss = (id: string) => {
    const n = items.find((x) => x.id === id);
    setItems((xs) => xs.filter((x) => x.id !== id));
    if (n) toast(`Dismissed: ${n.title}`);
  };

  const markAll = () => {
    setItems((xs) => xs.map((n) => ({ ...n, read: true })));
    toast.success("All caught up");
  };

  const clearAll = () => {
    if (window.confirm("Clear all notifications?")) {
      setItems([]);
      toast("Inbox cleared");
    }
  };

  return (
    <div className="relative size-full bg-[#090E0B] overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-5 pt-2 flex items-center justify-between">
        <button
          onClick={onBack}
          className="size-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#9BB09F] active:scale-95 transition-transform"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <p className="text-[#EEF2ED] text-[20px]" style={{ fontFamily: "Fraunces, serif", fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
          Notifications
        </p>
        <button
          onClick={markAll}
          disabled={unread === 0}
          className="text-[10px] text-[#7EC8A4] disabled:text-[#5A7060] disabled:opacity-50"
        >
          Mark all read
        </button>
      </div>

      <div className="px-5 pt-3 flex items-center justify-between">
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full border text-[10px] ${
                  active ? "border-[#7EC8A4] text-[#7EC8A4] bg-[#1A2E1F]" : "border-white/10 text-white/60"
                }`}
              >
                {f === "all" ? `All · ${items.length}` : `Unread · ${unread}`}
              </button>
            );
          })}
        </div>
        {items.length > 0 && (
          <button onClick={clearAll} className="text-[10px] text-[#5A7060] active:text-[#F07B6A]">
            Clear all
          </button>
        )}
      </div>

      <div className="px-5 pt-3 pb-[40px] overflow-y-auto h-[calc(100%-44px-90px)] space-y-2">
        {list.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <div className="size-12 rounded-full bg-[#7EC8A4]/10 border border-[#7EC8A4]/25 flex items-center justify-center text-[#7EC8A4]">
              <Icon name="leaf" size={20} />
            </div>
            <p className="text-[#EEF2ED] text-[14px]" style={{ fontFamily: "Fraunces, serif" }}>
              All caught up
            </p>
            <p className="text-[#5A7060] text-[10px] max-w-[220px]">
              Sage will nudge you when there's something worth your attention.
            </p>
          </div>
        ) : (
          list.map((n) => {
            const s = KIND_STYLE[n.kind];
            return (
              <button
                key={n.id}
                onClick={() => open(n.id)}
                className={`w-full text-left rounded-[14px] border p-3 flex gap-3 active:scale-[0.99] transition-transform`}
                style={{
                  background: n.read ? "rgba(255,255,255,0.02)" : s.bg,
                  borderColor: n.read ? "rgba(255,255,255,0.06)" : `${s.border}33`,
                }}
              >
                <div
                  className="size-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: `${s.color}1A`,
                    border: `1px solid ${s.color}4D`,
                    color: s.color,
                  }}
                >
                  <Icon name={n.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] tracking-wider uppercase" style={{ color: s.color }}>
                      {s.label}
                    </p>
                    <p className="text-[#5A7060] text-[9px]">· {n.time}</p>
                    {!n.read && <span className="ml-auto size-[6px] rounded-full bg-[#F07B6A]" />}
                  </div>
                  <p className={`text-[12px] mt-1 ${n.read ? "text-white/70" : "text-[#EEF2ED]"}`}>
                    {n.title}
                  </p>
                  <p className="text-[#9BB09F] text-[10px] mt-1 leading-[15px]">{n.body}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        open(n.id);
                        toast.success("Opened");
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-full border cursor-pointer"
                      style={{ borderColor: `${s.color}4D`, color: s.color }}
                    >
                      View
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        dismiss(n.id);
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 text-white/50 cursor-pointer"
                    >
                      Dismiss
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
