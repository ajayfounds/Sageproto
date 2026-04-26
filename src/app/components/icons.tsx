import {
  Coffee,
  Train,
  ShoppingCart,
  Car,
  Package,
  CreditCard,
  Wallet,
  Plane,
  AlertTriangle,
  Laptop,
  Target,
  BarChart3,
  HeartPulse,
  Plus,
  Lightbulb,
  Hand,
  Leaf,
  Smile,
  Meh,
  Frown,
  Annoyed,
} from "lucide-react";

export type IconKey =
  | "coffee" | "tea" | "train" | "cart" | "car" | "package" | "card" | "wallet"
  | "plane" | "alert" | "laptop" | "target" | "chart" | "pulse" | "plus"
  | "bulb" | "wave" | "leaf" | "smile" | "meh" | "frown" | "annoyed";

const MAP: Record<IconKey, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  coffee: Coffee,
  tea: Coffee,
  train: Train,
  cart: ShoppingCart,
  car: Car,
  package: Package,
  card: CreditCard,
  wallet: Wallet,
  plane: Plane,
  alert: AlertTriangle,
  laptop: Laptop,
  target: Target,
  chart: BarChart3,
  pulse: HeartPulse,
  plus: Plus,
  bulb: Lightbulb,
  wave: Hand,
  leaf: Leaf,
  smile: Smile,
  meh: Meh,
  frown: Frown,
  annoyed: Annoyed,
};

export function Icon({ name, size = 16, className, strokeWidth = 1.5 }: { name: IconKey; size?: number; className?: string; strokeWidth?: number }) {
  const C = MAP[name];
  return <C size={size} className={className} strokeWidth={strokeWidth} />;
}
