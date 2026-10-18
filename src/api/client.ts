import type { ProblemDetail } from "../types/api";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

interface ApiConfig {
  getToken: () => string | null;
  onUnauthorized: () => void;
}

let config: ApiConfig = { getToken: () => null, onUnauthorized: () => {} };

/** Chamado pela store para o cliente HTTP ler o token e reagir a 401 sem depender do Redux. */
export function configureApi(next: ApiConfig) {
  config = next;
}

export class ApiError extends Error {
  status: number;
  problem?: ProblemDetail;

  constructor(status: number, message: string, problem?: ProblemDetail) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Envia o token JWT (padrão). Use false em login/cadastro. */
  auth?: boolean;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const token = auth ? config.getToken() : null;

  const headers: Record<string, string> = { Accept: "application/json, application/problem+json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor. Verifique se a API está em execução.");
  }

  if (!response.ok) {
    let problem: ProblemDetail | undefined;
    try {
      problem = (await response.json()) as ProblemDetail;
    } catch {
      /* corpo vazio ou não-JSON (ex.: proxy sem backend) */
    }
    if (response.status === 401 && token) config.onUnauthorized(); // sessão expirada
    const fallback = response.status >= 500 ? "Servidor indisponível no momento." : `Erro ${response.status}`;
    throw new ApiError(response.status, problem?.detail ?? problem?.title ?? fallback, problem);
  }

  return (response.status === 204 ? undefined : await response.json()) as T;
}
