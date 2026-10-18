import type { SVGProps } from "react";

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type IconProps = SVGProps<SVGSVGElement>;

export const PlusIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 12h14" /></svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="m5 13 4 4L19 7" /></svg>
);
export const TrashIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" /></svg>
);
export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M19 12H5m6-6-6 6 6 6" /></svg>
);
export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="m9 6 6 6-6 6" /></svg>
);
export const LogoutIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9" /></svg>
);
export const RefreshIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 8m0-5v5h-5" /></svg>
);
