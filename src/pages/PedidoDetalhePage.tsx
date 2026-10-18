import { motion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router";
import { ArrowLeftIcon, RefreshIcon } from "../components/icons";
import OrderTimeline from "../components/OrderTimeline";
import PageTransition from "../components/PageTransition";
import StatusBadge from "../components/StatusBadge";
import Button, { buttonStyles } from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import { fetchPedidoById, selectPedidoById } from "../features/pedidos/pedidosSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { formatBRL, formatCep, formatDateLong } from "../utils/format";
import { STATUS_FINAIS } from "../utils/status";

const POLLING_MS = 15_000;

function Card({ title, children, delay = 0 }: { title: string; children: ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">{title}</h2>
      {children}
    </motion.section>
  );
}

export default function PedidoDetalhePage() {
  const { id } = useParams();
  const pedidoId = Number(id);
  const location = useLocation();
  const dispatch = useAppDispatch();

  const pedido = useAppSelector((s) => selectPedidoById(s, pedidoId));
  const status = useAppSelector((s) => s.pedidos.detailStatus);
  const error = useAppSelector((s) => s.pedidos.detailError);

  const recemCriado = (location.state as { novo?: boolean } | null)?.novo === true;
  const idValido = Number.isInteger(pedidoId);
  const existe = pedido !== undefined;
  const finalizado = pedido ? STATUS_FINAIS.includes(pedido.status) : false;

  // Sempre busca a versão mais recente (o status pode ter mudado desde a listagem)
  useEffect(() => {
    if (idValido) dispatch(fetchPedidoById(pedidoId));
  }, [pedidoId, idValido]);

  // Acompanhamento: atualiza sozinho enquanto o pedido não estiver entregue/cancelado
  useEffect(() => {
    if (!idValido || !existe || finalizado) return;
    const timer = setInterval(() => dispatch(fetchPedidoById(pedidoId)), POLLING_MS);
    return () => clearInterval(timer);
  }, [pedidoId, idValido, existe, finalizado]);

  const voltar = (
    <Link
      to="/pedidos"
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-brand-600"
    >
      <ArrowLeftIcon width={16} height={16} /> Voltar para meus pedidos
    </Link>
  );

  // Carregando pela primeira vez
  if (!pedido && idValido && status !== "failed") {
    return (
      <PageTransition>
        {voltar}
        <Skeleton className="mb-4 h-32" />
        <Skeleton className="h-64" />
      </PageTransition>
    );
  }

  // Não encontrado / erro
  if (!pedido) {
    return (
      <PageTransition>
        {voltar}
        <div className="rounded-3xl border border-white/70 bg-white/80 p-12 text-center backdrop-blur">
          <div className="text-5xl">🔍</div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Pedido não encontrado</h2>
          <p className="mt-1 text-slate-500">{idValido ? error : "O identificador do pedido é inválido."}</p>
          <Link to="/pedidos" className={`${buttonStyles("primary")} mt-6`}>
            Ver meus pedidos
          </Link>
        </div>
      </PageTransition>
    );
  }

  const { enderecoEntrega: end } = pedido;

  return (
    <PageTransition>
      {voltar}

      {recemCriado && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-800 ring-1 ring-emerald-200"
        >
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold">Pedido realizado com sucesso!</p>
            <p className="text-sm text-emerald-700">Acompanhe o andamento por aqui — a página atualiza sozinha.</p>
          </div>
        </motion.div>
      )}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Pedido #{pedido.id}</h1>
            <StatusBadge status={pedido.status} />
          </div>
          <p className="mt-1 text-slate-500">Feito em {formatDateLong(pedido.dataPedido)}</p>
        </div>
        <Button
          variant="secondary"
          loading={status === "loading"}
          onClick={() => dispatch(fetchPedidoById(pedidoId))}
        >
          {status !== "loading" && <RefreshIcon width={16} height={16} />} Atualizar
        </Button>
      </div>

      <div className="space-y-6">
        <Card title="Andamento">
          <OrderTimeline status={pedido.status} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card title="Itens do pedido" delay={0.1}>
            <ul className="divide-y divide-slate-100">
              {pedido.itens.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{item.produtoNome}</p>
                    <p className="text-sm text-slate-500">
                      {item.quantidade} × {formatBRL(item.valorUnitario)}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-slate-900">{formatBRL(item.subtotal)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="font-medium text-slate-500">Total</span>
              <span className="text-2xl font-extrabold text-slate-900">{formatBRL(pedido.valorTotal)}</span>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Entrega" delay={0.15}>
              <address className="space-y-0.5 not-italic text-slate-700">
                <p className="font-medium text-slate-900">
                  {end.logradouro}, {end.numero}
                </p>
                {end.complemento && <p>{end.complemento}</p>}
                <p>{end.bairro}</p>
                <p>
                  {end.cidade} - {end.estado}
                </p>
                <p className="text-slate-500">CEP {formatCep(end.cep)}</p>
              </address>
            </Card>

            <Card title="Informações" delay={0.2}>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Cliente</dt>
                  <dd className="font-medium text-slate-900">{pedido.clienteNome}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Última atualização</dt>
                  <dd className="text-right font-medium text-slate-900">{formatDateLong(pedido.updatedAt)}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
