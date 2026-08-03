import { useState } from "react";
import { toast } from "sonner";
import { Icon, IconKey } from "./icons";
import EmptyState from "./EmptyState";

type NotifType = "security" | "security-warning" | "money-received" | "money-sent" | "budget-alert" | "info";

type Notif = {
  id: string;
  type: NotifType;
  icon: IconKey;
  iconColor: string;
  title: string;
  subtitle: string;
  time: string;
  section: "TODAY" | "YESTERDAY" | "EARLIER";
  read: boolean;
};

const NOTIFICATIONS: Notif[] = [
  // Temporarily empty to show empty state - restore data as needed
  // {
  //   id: "n1",
  //   type: "security",
  //   icon: "shield",
  //   iconColor: "var(--info)",
  //   title: "New login detected",
  //   subtitle: "New sign-in from Chrome on Windows · Mumbai",
  //   time: "9:24 AM",
  //   section: "TODAY",
  //   read: false,
  // },
  // {
  //   id: "n2",
  //   type: "money-received",
  //   icon: "request",
  //   iconColor: "var(--gain)",
  //   title: "Money received",
  //   subtitle: "₹58,000 from Acme Payroll",
  //   time: "8:00 AM",
  //   section: "TODAY",
  //   read: false,
  // },
  // {
  //   id: "n3",
  //   type: "budget-alert",
  //   icon: "alert",
  //   iconColor: "var(--warn)",
  //   title: "Nearing your Food budget",
  //   subtitle: "82% of ₹10,000 used",
  //   time: "7:10 AM",
  //   section: "TODAY",
  //   read: false,
  // },
  // {
  //   id: "n4",
  //   type: "money-sent",
  //   icon: "send",
  //   iconColor: "var(--trust-navy)",
  //   title: "Payment sent",
  //   subtitle: "₹340 to Swiggy",
  //   time: "1:30 PM",
  //   section: "YESTERDAY",
  //   read: true,
  // },
  // {
  //   id: "n5",
  //   type: "info",
  //   icon: "card",
  //   iconColor: "var(--vault-teal)",
  //   title: "Card used online",
  //   subtitle: "₹1,849 at Amazon",
  //   time: "11:45 AM",
  //   section: "YESTERDAY",
  //   read: true,
  // },
  // {
  //   id: "n6",
  //   type: "info",
  //   icon: "shield",
  //   iconColor: "var(--info)",
  //   title: "Statement ready",
  //   subtitle: "March statement available",
  //   time: "Mar 31",
  //   section: "EARLIER",
  //   read: true,
  // },
];

type Props = { onBack?: () => void };

export default function NotificationsScreen({ onBack }: Props = {}) {
  const [items, setItems] = useState<Notif[]>(NOTIFICATIONS);

  const markAllRead = () => {
    setItems((xs) => xs.map((n) => ({ ...n, read: true })));
    toast.success("All marked as read");
  };

  const handleNotificationTap = (id: string) => {
    setItems((xs) => xs.map((n) => (n.id === id ? { ...n, read: true } : n)));
    toast("Notification opened");
  };

  const sections = ["TODAY", "YESTERDAY", "EARLIER"] as const;
  const groupedNotifications = sections.map((section) => ({
    section,
    items: items.filter((n) => n.section === section),
  })).filter((group) => group.items.length > 0);

  const hasUnread = items.some((n) => !n.read);

  return (
    <div className="relative size-full bg-surface-2 overflow-hidden">
      <div className="h-[44px]" />

      <div className="px-6 pt-2 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-surface-1 border border-border flex items-center justify-center text-trust-navy active:scale-95 transition-transform"
            aria-label="Back"
          >
            <Icon name="arrow-left" size={20} strokeWidth={2} />
          </button>
          <h1>Notifications</h1>
        </div>
        <button
          onClick={markAllRead}
          disabled={!hasUnread}
          className="text-vault-teal disabled:text-ink-500 disabled:opacity-50 active:scale-95 transition-transform"
          style={{
            fontSize: "var(--text-label)",
            lineHeight: "var(--leading-label)",
            fontWeight: 400,
          }}
        >
          Mark all read
        </button>
      </div>

      <div className="px-5 pb-[40px] overflow-y-auto h-[calc(100%-90px)]">
        {items.length === 0 ? (
          <div className="mt-20">
            <EmptyState
              icon="bell"
              title="You're all caught up"
              subtitle="New alerts about your money and security will show up here."
            />
          </div>
        ) : (
          <div className="space-y-6">
            {groupedNotifications.map((group) => (
              <div key={group.section}>
                <label className="text-ink-500 mb-3 block">{group.section}</label>
                <div className="space-y-2">
                  {group.items.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationTap(notif.id)}
                      className={`w-full text-left p-4 border shadow-[0_1px_2px_rgba(11,31,51,0.04)] flex items-start gap-3 active:scale-[0.99] transition-transform ${
                        notif.read ? "bg-card border-border" : "bg-surface-2 border-vault-teal/20"
                      }`}
                      style={{
                        borderRadius: "var(--radius-md)",
                        minHeight: "72px",
                      }}
                    >
                      {!notif.read && (
                        <div
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-vault-teal"
                          aria-label="Unread"
                        />
                      )}

                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: notif.read
                            ? "var(--surface-2)"
                            : `${notif.iconColor}1A`,
                          borderRadius: "var(--radius-sm)",
                          color: notif.iconColor,
                        }}
                      >
                        <Icon
                          name={notif.icon}
                          size={20}
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-trust-navy"
                          style={{
                            fontSize: "var(--text-body)",
                            lineHeight: "var(--leading-body)",
                            fontWeight: 400,
                          }}
                        >
                          {notif.title}
                        </p>
                        <p
                          className="text-ink-500 mt-1 money"
                          style={{
                            fontSize: "var(--text-label)",
                            lineHeight: "var(--leading-label)",
                          }}
                        >
                          {notif.subtitle}
                        </p>
                        <p
                          className="text-ink-500 mt-1"
                          style={{
                            fontSize: "var(--text-label)",
                            lineHeight: "var(--leading-label)",
                          }}
                        >
                          {notif.time}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
