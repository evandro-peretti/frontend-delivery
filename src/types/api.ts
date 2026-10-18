export type StatusPedido =
  | "RECEBIDO"
  | "EM_PREPARO"
  | "SAIU_PARA_ENTREGA"
  | "ENTREGUE"
  | "CANCELADO";

export interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  valor: number;
}

export interface ItemPedido {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
}

export interface EnderecoEntrega {
  logradouro: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Pedido {
  id: number;
  clienteId: number;
  clienteNome: string;
  itens: ItemPedido[];
  valorTotal: number;
  dataPedido: string; // ISO UTC
  status: StatusPedido;
  enderecoEntrega: EnderecoEntrega;
  createdAt: string;
  updatedAt: string;
}

export interface NovoPedidoRequest {
  itens: { produtoId: number; quantidade: number }[];
  enderecoEntrega: EnderecoEntrega;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest extends LoginRequest {
  nome: string;
}

export interface ClienteResponse {
  id: number;
  nome: string;
  email: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
}

/** Formato de erro da API (RFC 9457). */
export interface ProblemDetail {
  title?: string;
  status?: number;
  detail?: string;
  errors?: { campo: string; mensagem: string }[];
}
