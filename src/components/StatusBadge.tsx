import type { StatusPedido } from "../types/api";
import { STATUS_LABEL, STATUS_STYLE } from "../utils/status";

export default function StatusBadge({ status }: { status: StatusPedido }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
