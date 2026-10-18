import { motion } from "motion/react";
import type { StatusPedido } from "../types/api";
import { STATUS_LABEL } from "../utils/status";
import { CheckIcon } from "./icons";

const STEPS: StatusPedido[] = ["RECEBIDO", "EM_PREPARO", "SAIU_PARA_ENTREGA", "ENTREGUE"];

/** Linha do tempo do pedido com barra de progresso animada. */
export default function OrderTimeline({ status }: { status: StatusPedido }) {
  if (status === "CANCELADO") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-rose-50 px-5 py-4 text-rose-700 ring-1 ring-rose-200">
        <span className="text-2xl">🚫</span>
        <p className="text-sm font-medium">Este pedido foi cancelado.</p>
      </div>
    );
  }

  const current = STEPS.indexOf(status);
  const progress = (current / (STEPS.length - 1)) * 100;

  return (
    <div className="relative grid grid-cols-4">
      <div className="absolute left-[12.5%] right-[12.5%] top-4.5 h-1 rounded-full bg-slate-200">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-brand-500 to-rose-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        />
      </div>

      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step} className="relative flex flex-col items-center gap-2 text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * i, type: "spring", stiffness: 300, damping: 20 }}
              className={`relative z-10 flex size-9 items-center justify-center rounded-full text-sm font-bold ${
                done || active ? "bg-brand-500 text-white" : "bg-white text-slate-400 ring-2 ring-slate-200"
              }`}
            >
              {done ? <CheckIcon width={16} height={16} /> : i + 1}
              {active && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-brand-500/40" />}
            </motion.div>
            <span
              className={`text-xs font-medium sm:text-sm ${
                active ? "text-brand-700" : done ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {STATUS_LABEL[step]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
