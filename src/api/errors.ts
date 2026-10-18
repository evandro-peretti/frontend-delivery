import { ApiError } from "./client";

export interface ErrorPayload {
  message: string;
  /** campo -> mensagem, vindo da validação do backend (ex.: "enderecoEntrega.cidade"). */
  fieldErrors?: Record<string, string>;
}

export function toErrorPayload(error: unknown): ErrorPayload {
  if (error instanceof ApiError) {
    const fieldErrors: Record<string, string> = {};
    for (const e of error.problem?.errors ?? []) {
      fieldErrors[e.campo] ??= e.mensagem;
    }
    return {
      message: error.message,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    };
  }
  return { message: "Ocorreu um erro inesperado. Tente novamente." };
}
