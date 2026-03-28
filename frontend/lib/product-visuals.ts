import {
  Backpack,
  Coffee,
  Dumbbell,
  GlassWater,
  HardDrive,
  Headphones,
  Keyboard,
  LampDesk,
  Mouse,
  Package,
  ShoppingBag,
  Smartphone,
  Speaker,
  type LucideIcon,
  Watch,
} from "lucide-react";

type ProductVisual = {
  icon: LucideIcon;
  iconClassName: string;
  surfaceClassName: string;
  artworkVariant: ProductArtworkVariant;
};

export type ProductArtworkVariant =
  | "bag"
  | "lamp"
  | "headphones"
  | "mouse"
  | "keyboard"
  | "bottle"
  | "backpack"
  | "speaker"
  | "watch"
  | "coffee"
  | "dumbbell"
  | "drive"
  | "phone"
  | "package";

type ProductVisualRule = {
  keywords: string[];
  visual: ProductVisual;
};

const PRODUCT_VISUAL_RULES: ProductVisualRule[] = [
  {
    keywords: ["tote", "bag"],
    visual: {
      icon: ShoppingBag,
      iconClassName: "text-amber-700 dark:text-amber-300",
      surfaceClassName: "bg-amber-500/15 border-amber-500/25",
      artworkVariant: "bag",
    },
  },
  {
    keywords: ["lamp", "light"],
    visual: {
      icon: LampDesk,
      iconClassName: "text-yellow-700 dark:text-yellow-300",
      surfaceClassName: "bg-yellow-500/15 border-yellow-500/25",
      artworkVariant: "lamp",
    },
  },
  {
    keywords: ["headphone", "audio", "earbud"],
    visual: {
      icon: Headphones,
      iconClassName: "text-indigo-700 dark:text-indigo-300",
      surfaceClassName: "bg-indigo-500/15 border-indigo-500/25",
      artworkVariant: "headphones",
    },
  },
  {
    keywords: ["mouse", "pad"],
    visual: {
      icon: Mouse,
      iconClassName: "text-cyan-700 dark:text-cyan-300",
      surfaceClassName: "bg-cyan-500/15 border-cyan-500/25",
      artworkVariant: "mouse",
    },
  },
  {
    keywords: ["keyboard", "key", "cover"],
    visual: {
      icon: Keyboard,
      iconClassName: "text-violet-700 dark:text-violet-300",
      surfaceClassName: "bg-violet-500/15 border-violet-500/25",
      artworkVariant: "keyboard",
    },
  },
  {
    keywords: ["water", "bottle", "flask"],
    visual: {
      icon: GlassWater,
      iconClassName: "text-sky-700 dark:text-sky-300",
      surfaceClassName: "bg-sky-500/15 border-sky-500/25",
      artworkVariant: "bottle",
    },
  },
  {
    keywords: ["backpack", "travel"],
    visual: {
      icon: Backpack,
      iconClassName: "text-emerald-700 dark:text-emerald-300",
      surfaceClassName: "bg-emerald-500/15 border-emerald-500/25",
      artworkVariant: "backpack",
    },
  },
  {
    keywords: ["speaker"],
    visual: {
      icon: Speaker,
      iconClassName: "text-fuchsia-700 dark:text-fuchsia-300",
      surfaceClassName: "bg-fuchsia-500/15 border-fuchsia-500/25",
      artworkVariant: "speaker",
    },
  },
  {
    keywords: ["watch", "clock"],
    visual: {
      icon: Watch,
      iconClassName: "text-zinc-700 dark:text-zinc-200",
      surfaceClassName: "bg-zinc-500/15 border-zinc-500/25",
      artworkVariant: "watch",
    },
  },
  {
    keywords: ["coffee", "mug"],
    visual: {
      icon: Coffee,
      iconClassName: "text-orange-700 dark:text-orange-300",
      surfaceClassName: "bg-orange-500/15 border-orange-500/25",
      artworkVariant: "coffee",
    },
  },
  {
    keywords: ["dumbbell", "fitness", "workout"],
    visual: {
      icon: Dumbbell,
      iconClassName: "text-rose-700 dark:text-rose-300",
      surfaceClassName: "bg-rose-500/15 border-rose-500/25",
      artworkVariant: "dumbbell",
    },
  },
  {
    keywords: ["ssd", "drive", "storage"],
    visual: {
      icon: HardDrive,
      iconClassName: "text-slate-700 dark:text-slate-200",
      surfaceClassName: "bg-slate-500/15 border-slate-500/25",
      artworkVariant: "drive",
    },
  },
  {
    keywords: ["phone", "smartphone", "mobile"],
    visual: {
      icon: Smartphone,
      iconClassName: "text-blue-700 dark:text-blue-300",
      surfaceClassName: "bg-blue-500/15 border-blue-500/25",
      artworkVariant: "phone",
    },
  },
];

const DEFAULT_PRODUCT_VISUAL: ProductVisual = {
  icon: Package,
  iconClassName: "text-primary",
  surfaceClassName: "bg-primary/10 border-primary/20",
  artworkVariant: "package",
};

export function getProductVisual(productName: string): ProductVisual {
  const normalizedName = productName.toLowerCase();
  const matchingRule = PRODUCT_VISUAL_RULES.find((rule) =>
    rule.keywords.some((keyword) => normalizedName.includes(keyword)),
  );

  return matchingRule?.visual || DEFAULT_PRODUCT_VISUAL;
}
