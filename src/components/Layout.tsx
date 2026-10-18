import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { logout } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { LogoutIcon } from "./icons";

const LINKS = [
  { to: "/pedidos", label: "Meus pedidos" },
  { to: "/pedidos/novo", label: "Novo pedido" },
];

/** Estrutura fixa da área logada: a barra de navegação não é recriada a cada troca de página. */
export default function Layout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const email = useAppSelector((s) => s.auth.email);
  const { pathname } = useLocation();

  // /pedidos e /pedidos/:id destacam "Meus pedidos"; /pedidos/novo destaca "Novo pedido"
  const activeTo = pathname.startsWith("/pedidos/novo") ? "/pedidos/novo" : "/pedidos";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/pedidos" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-rose-500 text-lg shadow-md shadow-brand-500/30">
              🍔
            </span>
            <span>
              Deli<span className="text-brand-500">very</span>
            </span>
          </Link>

          <nav className="order-3 flex w-full gap-1 sm:order-0 sm:w-auto">
            {LINKS.map((link) => {
              const active = link.to === activeTo;
              return (
                <Link key={link.to} to={link.to} className="relative rounded-full px-4 py-2 text-sm font-medium">
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-brand-500/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className={`relative transition-colors ${active ? "text-brand-700" : "text-slate-600"}`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {email && (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold uppercase text-brand-700">
                  {email[0]}
                </span>
                <span className="max-w-48 truncate text-sm text-slate-600">{email}</span>
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(logout())}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              <LogoutIcon width={16} height={16} />
              Sair
            </motion.button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
