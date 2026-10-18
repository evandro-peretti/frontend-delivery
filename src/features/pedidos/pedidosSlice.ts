import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { pedidosApi } from "../../api/endpoints";
import { toErrorPayload, type ErrorPayload } from "../../api/errors";
import type { NovoPedidoRequest, Pedido } from "../../types/api";
import { logout } from "../auth/authSlice";

type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

// Pedidos normalizados por id, do mais recente para o mais antigo.
const adapter = createEntityAdapter<Pedido>({
  sortComparer: (a, b) => Date.parse(b.dataPedido) - Date.parse(a.dataPedido),
});

const initialState = adapter.getInitialState({
  listStatus: "idle" as LoadStatus,
  listError: null as string | null,
  detailStatus: "idle" as LoadStatus,
  detailError: null as string | null,
  createStatus: "idle" as LoadStatus,
  createError: null as string | null,
  createFieldErrors: null as Record<string, string> | null,
});

type PedidosState = typeof initialState;
type ThunkConfig = { rejectValue: ErrorPayload };

export const fetchPedidos = createAsyncThunk<Pedido[], void, ThunkConfig>(
  "pedidos/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await pedidosApi.listar();
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

export const fetchPedidoById = createAsyncThunk<Pedido, number, ThunkConfig>(
  "pedidos/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await pedidosApi.buscar(id);
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

export const createPedido = createAsyncThunk<Pedido, NovoPedidoRequest, ThunkConfig>(
  "pedidos/create",
  async (data, { rejectWithValue }) => {
    try {
      return await pedidosApi.criar(data);
    } catch (e) {
      return rejectWithValue(toErrorPayload(e));
    }
  },
);

const pedidosSlice = createSlice({
  name: "pedidos",
  initialState,
  reducers: {
    resetCreate(state) {
      state.createStatus = "idle";
      state.createError = null;
      state.createFieldErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // lista
      .addCase(fetchPedidos.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchPedidos.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        adapter.setAll(state, action.payload);
      })
      .addCase(fetchPedidos.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload?.message ?? "Não foi possível carregar os pedidos.";
      })
      // detalhe
      .addCase(fetchPedidoById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchPedidoById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        adapter.upsertOne(state, action.payload);
      })
      .addCase(fetchPedidoById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload?.message ?? "Não foi possível carregar o pedido.";
      })
      // criação
      .addCase(createPedido.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
        state.createFieldErrors = null;
      })
      .addCase(createPedido.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        adapter.addOne(state, action.payload);
      })
      .addCase(createPedido.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload?.message ?? "Não foi possível criar o pedido.";
        state.createFieldErrors = action.payload?.fieldErrors ?? null;
      })
      .addCase(logout, () => initialState);
  },
});

export const { resetCreate } = pedidosSlice.actions;

export const { selectAll: selectAllPedidos, selectById: selectPedidoById } = adapter.getSelectors(
  (state: { pedidos: PedidosState }) => state.pedidos,
);

export default pedidosSlice.reducer;
