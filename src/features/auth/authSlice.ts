import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { authApi } from "../../api/endpoints";
import { toErrorPayload, type ErrorPayload } from "../../api/errors";
import type { LoginRequest, RegisterRequest, TokenResponse } from "../../types/api";
import { emailFromToken, loadSession } from "../../utils/session";

export interface AuthState {
  token: string | null;
  expiresAt: string | null;
  email: string | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
  fieldErrors: Record<string, string> | null;
}

const session = loadSession();

const initialState: AuthState = {
  token: session?.token ?? null,
  expiresAt: session?.expiresAt ?? null,
  email: session ? emailFromToken(session.token) : null,
  status: "idle",
  error: null,
  fieldErrors: null,
};

const loggedOutState: AuthState = {
  token: null,
  expiresAt: null,
  email: null,
  status: "idle",
  error: null,
  fieldErrors: null,
};

type ThunkConfig = { rejectValue: ErrorPayload };

export const login = createAsyncThunk<TokenResponse, LoginRequest, ThunkConfig>(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.login(data);
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

/** Cadastra o cliente e já faz o login em seguida, para o usuário entrar direto. */
export const register = createAsyncThunk<TokenResponse, RegisterRequest, ThunkConfig>(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      await authApi.register(data);
      return await authApi.login({ email: data.email, senha: data.senha });
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => loggedOutState,
    clearAuthError(state) {
      state.status = "idle";
      state.error = null;
      state.fieldErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(login.pending, register.pending), (state) => {
        state.status = "loading";
        state.error = null;
        state.fieldErrors = null;
      })
      .addMatcher(isAnyOf(login.fulfilled, register.fulfilled), (state, action) => {
        state.status = "idle";
        state.token = action.payload.accessToken;
        state.expiresAt = action.payload.expiresAt;
        state.email = emailFromToken(action.payload.accessToken);
      })
      .addMatcher(isAnyOf(login.rejected, register.rejected), (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Não foi possível concluir a operação.";
        state.fieldErrors = action.payload?.fieldErrors ?? null;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.token !== null;
export default authSlice.reducer;
