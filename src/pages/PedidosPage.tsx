import { motion, type Variants } from "motion/react";
import { useEffect } from "react";
import { Link } from "react-router";
import { ChevronRightIcon, PlusIcon } from "../components/icons";
import StatusBadge from "../components/StatusBadge";
import Button, { buttonStyles } from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import PageTransition from "../components/PageTransition";
import { fetchPedidos, selectAllPedidos } from "../features/pedidos/pedidosSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { Pedido } from "../types/api";
import { formatBRL, formatDate, pluralize } from "../utils/format";

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

function resumoItens(pedido: Pedido) {
  const unidades = pedido.itens.reduce((soma, i) => soma + i.quantidade, 0);
  const nomes = pedido.itens.slice(0, 2).map((i) => `${i.quantidade}× ${i.produtoNome}`);
  const restantes = pedido.itens.length - nomes.length;
  return {
    unidades,
    texto: nomes.join(", ") + (restantes > 0 ? ` e mais ${restantes}` : ""),
  };
}

export default function PedidosPage() {
  const dispatch = useAppDispatch();
  const pedidos = useAppSelector(selectAllPedidos);
  const status = useAppSelector((s) => s.pedidos.listStatus);
  const error = useAppSelector((s) => s.pedidos.listError);

  useEffect(() => {
    void dispatch(fetchPedidos());
  }, [dispatch]);

  const carregando = (status === "idle" || status === "loading") && pedidos.length === 0;

  return (
    <PageTransition>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Meus pedidos</h1>
          <p className="mt-1 text-slate-500">Acompanhe o andamento de cada pedido.</p>
        </div>
        <Link to="/pedidos/novo" className={buttonStyles("primary")}>
          <PlusIcon width={18} height={18} /> Novo pedido
        </Link>
      </div>

      {carregando && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      )}

      {status === "failed" && pedidos.length === 0 && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center">
          <p className="font-medium text-rose-700">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={() => void dispatch(fetchPedidos())}>
            Tentar novamente
          </Button>
        </div>
      )}

      {status === "succeeded" && pedidos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-white/70 bg-white/80 p-12 text-center shadow-sm backdrop-blur"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl"
          >
            🛵
          </motion.div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Nenhum pedido por aqui ainda</h2>
          <p className="mt-1 text-slate-500">Que tal fazer o primeiro agora mesmo?</p>
          <Link to="/pedidos/novo" className={`${buttonStyles("primary")} mt-6`}>
            Fazer um pedido
          </Link>
        </motion.div>
      )}

      {pedidos.length > 0 && (
        <motion.ul variants={listVariants} initial="hidden" animate="show" className="space-y-4">
          {pedidos.map((pedido) => {
            const { unidades, texto } = resumoItens(pedido);
            return (
              <motion.li key={pedido.id} variants={itemVariants}>
                <Link
                  to={`/pedidos/${pedido.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/10"
                >
                  <div className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl sm:flex">
                    🧾
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-bold text-slate-900">Pedido #{pedido.id}</h3>
                      <StatusBadge status={pedido.status} />
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-600">{texto}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {formatDate(pedido.dataPedido)} · {unidades} {pluralize(unidades, "item", "itens")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-slate-900">{formatBRL(pedido.valorTotal)}</p>
                  </div>
                  <ChevronRightIcon className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-500" />
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </PageTransition>
  );
}
