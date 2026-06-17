export type IconVariantId =
  | "classic"
  | "circuit"
  | "inverse"
  | "low-poly"
  | "mono"
  | "glass"
  | "violet";

export interface IconVariant {
  id: IconVariantId;
  label: string;
  svg: string;
  png256: string;
  png512: string;
  png1024: string;
}

export const ICON_VARIANTS: IconVariant[] = [
  {
    id: "classic",
    label: "Classic",
    svg: "/icons/variants/classic/icon.svg",
    png256: "/icons/variants/classic/icon-256.png",
    png512: "/icons/variants/classic/icon-512.png",
    png1024: "/icons/variants/classic/icon-1024.png",
  },
  {
    id: "circuit",
    label: "Circuit",
    svg: "/icons/variants/circuit/icon.svg",
    png256: "/icons/variants/circuit/icon-256.png",
    png512: "/icons/variants/circuit/icon-512.png",
    png1024: "/icons/variants/circuit/icon-1024.png",
  },
  {
    id: "inverse",
    label: "Inverse",
    svg: "/icons/variants/inverse/icon.svg",
    png256: "/icons/variants/inverse/icon-256.png",
    png512: "/icons/variants/inverse/icon-512.png",
    png1024: "/icons/variants/inverse/icon-1024.png",
  },
  {
    id: "low-poly",
    label: "Low-Poly",
    svg: "/icons/variants/low-poly/icon.svg",
    png256: "/icons/variants/low-poly/icon-256.png",
    png512: "/icons/variants/low-poly/icon-512.png",
    png1024: "/icons/variants/low-poly/icon-1024.png",
  },
  {
    id: "mono",
    label: "Mono",
    svg: "/icons/variants/mono/icon.svg",
    png256: "/icons/variants/mono/icon-256.png",
    png512: "/icons/variants/mono/icon-512.png",
    png1024: "/icons/variants/mono/icon-1024.png",
  },
  {
    id: "glass",
    label: "Glass",
    svg: "/icons/variants/glass/icon.svg",
    png256: "/icons/variants/glass/icon-256.png",
    png512: "/icons/variants/glass/icon-512.png",
    png1024: "/icons/variants/glass/icon-1024.png",
  },
  {
    id: "violet",
    label: "Violet",
    svg: "/icons/variants/violet/icon.svg",
    png256: "/icons/variants/violet/icon-256.png",
    png512: "/icons/variants/violet/icon-512.png",
    png1024: "/icons/variants/violet/icon-1024.png",
  },
];

export const DEFAULT_ICON_VARIANT: IconVariantId = "classic";

export function getIconVariant(id: IconVariantId): IconVariant {
  return ICON_VARIANTS.find((v) => v.id === id) ?? ICON_VARIANTS[0];
}
