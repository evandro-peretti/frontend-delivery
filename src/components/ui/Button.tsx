import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import Spinner from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-linear-to-r from-brand-500 to-rose-500 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40",
  secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
};


export const buttonStyles = (variant: ButtonVariant = "primary") =>
  `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${VARIANTS[variant]}`;

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <motion.button
      whileHover={inactive ? undefined : { scale: 1.02 }}
      whileTap={inactive ? undefined : { scale: 0.97 }}
      disabled={inactive}
      className={`${buttonStyles(variant)} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </motion.button>
  );
}
