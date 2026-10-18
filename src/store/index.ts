import { configureStore } from "@reduxjs/toolkit";
import { configureApi } from "../api/client";
import authReducer, { logout } from "../features/auth/authSlice";
import pedidosReducer from "../features/pedidos/pedidosSlice";
import { saveSession } from "../utils/session";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pedidos: pedidosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// O cliente HTTP lê o token da store e faz logout automático quando a API responde 401.
configureApi({
  getToken: () => store.getState().auth.token,
  onUnauthorized: () => store.dispatch(logout()),
});

// Persiste a sessão sempre que o token mudar (login / logout / expiração).
let lastToken = store.getState().auth.token;
store.subscribe(() => {
  const { token, expiresAt } = store.getState().auth;
  if (token !== lastToken) {
    lastToken = token;
    saveSession(token && expiresAt ? { token, expiresAt } : null);
  }
});
