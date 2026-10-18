import { request } from "./client";
import type {
  ClienteResponse,
  LoginRequest,
  NovoPedidoRequest,
  Pedido,
  RegisterRequest,
  TokenResponse,
} from "../types/api";

export const authApi = {
  login: (data: LoginRequest) => request<TokenResponse>("/auth/login", { method: "POST", body: data, auth: false }),
  register: (data: RegisterRequest) =>
    request<ClienteResponse>("/auth/register", { method: "POST", body: data, auth: false }),
};

export const pedidosApi = {
  listar: () => request<Pedido[]>("/pedidos"),
  buscar: (id: number) => request<Pedido>(`/pedidos/${id}`),
  criar: (data: NovoPedidoRequest) => request<Pedido>("/pedidos", { method: "POST", body: data }),
};
