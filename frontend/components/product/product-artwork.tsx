import { cn } from "@/lib/utils";
import { type ProductArtworkVariant } from "@/lib/product-visuals";

type ProductArtworkProps = {
  variant: ProductArtworkVariant;
  label: string;
  className?: string;
};

const ARTWORK_PALETTES: Record<
  ProductArtworkVariant,
  {
    surfaceClassName: string;
    inkClassName: string;
  }
> = {
  bag: {
    surfaceClassName: "border-amber-500/25 bg-gradient-to-br from-amber-500/20 via-amber-300/10 to-transparent",
    inkClassName: "text-amber-700 dark:text-amber-300",
  },
  lamp: {
    surfaceClassName: "border-yellow-500/25 bg-gradient-to-br from-yellow-500/20 via-yellow-300/10 to-transparent",
    inkClassName: "text-yellow-700 dark:text-yellow-300",
  },
  headphones: {
    surfaceClassName: "border-indigo-500/25 bg-gradient-to-br from-indigo-500/20 via-indigo-300/10 to-transparent",
    inkClassName: "text-indigo-700 dark:text-indigo-300",
  },
  mouse: {
    surfaceClassName: "border-cyan-500/25 bg-gradient-to-br from-cyan-500/20 via-cyan-300/10 to-transparent",
    inkClassName: "text-cyan-700 dark:text-cyan-300",
  },
  keyboard: {
    surfaceClassName: "border-violet-500/25 bg-gradient-to-br from-violet-500/20 via-violet-300/10 to-transparent",
    inkClassName: "text-violet-700 dark:text-violet-300",
  },
  bottle: {
    surfaceClassName: "border-sky-500/25 bg-gradient-to-br from-sky-500/20 via-sky-300/10 to-transparent",
    inkClassName: "text-sky-700 dark:text-sky-300",
  },
  backpack: {
    surfaceClassName: "border-emerald-500/25 bg-gradient-to-br from-emerald-500/20 via-emerald-300/10 to-transparent",
    inkClassName: "text-emerald-700 dark:text-emerald-300",
  },
  speaker: {
    surfaceClassName: "border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-500/20 via-fuchsia-300/10 to-transparent",
    inkClassName: "text-fuchsia-700 dark:text-fuchsia-300",
  },
  watch: {
    surfaceClassName: "border-zinc-500/25 bg-gradient-to-br from-zinc-500/20 via-zinc-300/10 to-transparent",
    inkClassName: "text-zinc-700 dark:text-zinc-200",
  },
  coffee: {
    surfaceClassName: "border-orange-500/25 bg-gradient-to-br from-orange-500/20 via-orange-300/10 to-transparent",
    inkClassName: "text-orange-700 dark:text-orange-300",
  },
  dumbbell: {
    surfaceClassName: "border-rose-500/25 bg-gradient-to-br from-rose-500/20 via-rose-300/10 to-transparent",
    inkClassName: "text-rose-700 dark:text-rose-300",
  },
  drive: {
    surfaceClassName: "border-slate-500/25 bg-gradient-to-br from-slate-500/20 via-slate-300/10 to-transparent",
    inkClassName: "text-slate-700 dark:text-slate-200",
  },
  phone: {
    surfaceClassName: "border-blue-500/25 bg-gradient-to-br from-blue-500/20 via-blue-300/10 to-transparent",
    inkClassName: "text-blue-700 dark:text-blue-300",
  },
  package: {
    surfaceClassName: "border-primary/25 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent",
    inkClassName: "text-primary",
  },
};

function renderSketch(variant: ProductArtworkVariant) {
  switch (variant) {
    case "bag":
      return (
        <>
          <rect x="98" y="54" width="124" height="86" rx="16" />
          <path d="M122 54c0-18 12-28 38-28s38 10 38 28" />
        </>
      );
    case "lamp":
      return (
        <>
          <rect x="100" y="132" width="120" height="10" rx="5" />
          <path d="M160 132V92l34-20" />
          <path d="M194 72h38l-14 26h-38z" />
        </>
      );
    case "headphones":
      return (
        <>
          <path d="M110 100c0-30 22-50 50-50s50 20 50 50" />
          <rect x="96" y="96" width="20" height="40" rx="10" />
          <rect x="204" y="96" width="20" height="40" rx="10" />
        </>
      );
    case "mouse":
      return (
        <>
          <rect x="122" y="54" width="76" height="92" rx="36" />
          <path d="M160 54v40" />
          <circle cx="160" cy="104" r="4" />
        </>
      );
    case "keyboard":
      return (
        <>
          <rect x="70" y="68" width="180" height="72" rx="12" />
          <path d="M92 90h136M92 106h136M92 122h92" />
        </>
      );
    case "bottle":
      return (
        <>
          <rect x="134" y="36" width="52" height="108" rx="20" />
          <rect x="146" y="28" width="28" height="12" rx="4" />
          <path d="M146 84h28" />
        </>
      );
    case "backpack":
      return (
        <>
          <rect x="108" y="42" width="104" height="102" rx="20" />
          <rect x="128" y="86" width="64" height="42" rx="12" />
          <path d="M130 42c0-12 10-20 30-20s30 8 30 20" />
        </>
      );
    case "speaker":
      return (
        <>
          <rect x="108" y="42" width="104" height="102" rx="18" />
          <circle cx="160" cy="76" r="14" />
          <circle cx="160" cy="114" r="20" />
        </>
      );
    case "watch":
      return (
        <>
          <rect x="144" y="24" width="32" height="132" rx="10" />
          <circle cx="160" cy="90" r="32" />
          <path d="M160 90V74M160 90l12 8" />
        </>
      );
    case "coffee":
      return (
        <>
          <path d="M110 80h92v52a18 18 0 0 1-18 18h-56a18 18 0 0 1-18-18z" />
          <path d="M202 96h18a14 14 0 0 1 0 28h-18" />
          <path d="M132 52c0 10-8 10-8 20M156 52c0 10-8 10-8 20M180 52c0 10-8 10-8 20" />
        </>
      );
    case "dumbbell":
      return (
        <>
          <rect x="124" y="86" width="72" height="8" rx="4" />
          <rect x="102" y="72" width="16" height="36" rx="4" />
          <rect x="86" y="76" width="12" height="28" rx="3" />
          <rect x="202" y="72" width="16" height="36" rx="4" />
          <rect x="222" y="76" width="12" height="28" rx="3" />
        </>
      );
    case "drive":
      return (
        <>
          <rect x="92" y="64" width="136" height="64" rx="12" />
          <circle cx="120" cy="96" r="4" />
          <path d="M140 96h64" />
        </>
      );
    case "phone":
      return (
        <>
          <rect x="126" y="32" width="68" height="116" rx="14" />
          <rect x="136" y="48" width="48" height="82" rx="8" />
          <circle cx="160" cy="138" r="3" />
        </>
      );
    default:
      return (
        <>
          <path d="M96 66 160 38l64 28-64 30z" />
          <path d="M96 66v56l64 34 64-34V66" />
          <path d="M160 96v60" />
        </>
      );
  }
}

export function ProductArtwork({ variant, label, className }: ProductArtworkProps) {
  const palette = ARTWORK_PALETTES[variant];

  return (
    <div
      className={cn(
        "relative mb-4 h-40 overflow-hidden rounded-2xl border",
        palette.surfaceClassName,
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.55),transparent_45%)]" />
      <svg
        viewBox="0 0 320 180"
        className={cn("absolute inset-0 h-full w-full", palette.inkClassName)}
      >
        <g fill="currentColor" opacity="0.14">
          <circle cx="56" cy="36" r="20" />
          <circle cx="276" cy="146" r="26" />
        </g>
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
        >
          {renderSketch(variant)}
        </g>
      </svg>
      <p className="absolute bottom-2 left-3 rounded-full border border-white/40 bg-white/45 px-2 py-0.5 text-[10px] font-medium text-foreground/80 backdrop-blur dark:border-white/15 dark:bg-black/30">
        {label}
      </p>
    </div>
  );
}
