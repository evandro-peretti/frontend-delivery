import { motion } from "motion/react";
import type { ReactNode } from "react";
import PageTransition from "./PageTransition";

const FLOATERS = [
  { emoji: "🍕", style: { left: "8%", top: "14%" }, delay: 0 },
  { emoji: "🍔", style: { right: "12%", top: "22%" }, delay: 0.6 },
  { emoji: "🥗", style: { left: "18%", bottom: "20%" }, delay: 1.2 },
  { emoji: "🍣", style: { right: "20%", bottom: "14%" }, delay: 1.8 },
  { emoji: "🍰", style: { left: "46%", top: "8%" }, delay: 2.4 },
];

const FEATURES = ["Peça em poucos cliques", "Acompanhe o status em tempo real", "Histórico de todos os seus pedidos"];

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/** Layout das telas de login e cadastro: painel de apresentação + cartão do formulário. */
export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <PageTransition className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-linear-to-br from-brand-500 via-brand-600 to-rose-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {FLOATERS.map((f) => (
          <motion.span
            key={f.emoji}
            aria-hidden="true"
            className="absolute text-5xl opacity-90 drop-shadow-lg"
            style={f.style}
            animate={{ y: [0, -16, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: f.delay }}
          >
            {f.emoji}
          </motion.span>
        ))}

        <div className="relative flex items-center gap-2 text-xl font-extrabold">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">🍔</span>
          Delivery
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Do pedido à sua porta, sem complicação.
          </h2>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((text, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-3 text-white/90"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-white/25 text-xs">✓</span>
                {text}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-2xl shadow-brand-500/10 backdrop-blur-xl">
          <div className="mb-8">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-rose-500 text-2xl shadow-lg shadow-brand-500/30 lg:hidden">
              🍔
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-slate-500">{subtitle}</p>
          </div>
          {children}
          <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
        </div>
      </section>
    </PageTransition>
  );
}
