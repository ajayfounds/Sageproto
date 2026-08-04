import { Icon, IconKey } from "./icons";

type Props = {
  icon: IconKey;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ icon, title, subtitle, actionLabel, onAction }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12">
      <div
        className="w-20 h-20 rounded-full bg-vault-teal/10 border border-vault-teal/30 flex items-center justify-center text-vault-teal mb-6"
      >
        <Icon name={icon} size={32} strokeWidth={1.8} />
      </div>

      <h3 className="mb-2">{title}</h3>

      <p
        className="text-ink-500 max-w-[280px] mb-6"
        style={{
          fontSize: "var(--text-body)",
          lineHeight: "var(--leading-body)",
        }}
      >
        {subtitle}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-vault-teal text-white active:scale-[0.98] transition-transform"
          style={{
            borderRadius: "var(--radius-pill)",
            fontSize: "var(--text-button)",
            lineHeight: "var(--leading-button)",
            fontWeight: 600,
            minHeight: "52px",
            paddingLeft: "var(--space-8)",
            paddingRight: "var(--space-8)",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
