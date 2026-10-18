import { AnimatePresence, motion } from "motion/react";

/** Banner de erro que entra e sai com animação. */
export default function Alert({ message }: { message: string | null | undefined }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          key="alerta"
          role="alert"
          initial={{ opacity: 0, height: 0, y: -6 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
