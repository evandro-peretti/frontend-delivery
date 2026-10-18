import type { StatusPedido } from "../types/api";

export const STATUS_LABEL: Record<StatusPedido, string> = {
  RECEBIDO: "Recebido",
  EM_PREPARO: "Em preparo",
  SAIU_PARA_ENTREGA: "Saiu para entrega",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export const STATUS_STYLE: Record<StatusPedido, string> = {
  RECEBIDO: "bg-sky-50 text-sky-700 ring-sky-600/20",
  EM_PREPARO: "bg-amber-50 text-amber-700 ring-amber-600/20",
  SAIU_PARA_ENTREGA: "bg-violet-50 text-violet-700 ring-violet-600/20",
  ENTREGUE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  CANCELADO: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export const STATUS_FINAIS: StatusPedido[] = ["ENTREGUE", "CANCELADO"];