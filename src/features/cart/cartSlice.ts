import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice";
import { createPedido } from "../pedidos/pedidosSlice";

/** Limite aceito pela API por item. */
export const MAX_QUANTIDADE = 99;

interface CartState {
  /** produtoId -> quantidade escolhida no novo pedido. */
  quantidades: Record<number, number>;
}

const initialState: CartState = { quantidades: {} };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    adicionar(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.quantidades[id] = Math.min((state.quantidades[id] ?? 0) + 1, MAX_QUANTIDADE);
    },
    remover(state, action: PayloadAction<number>) {
      const id = action.payload;
      const atual = state.quantidades[id] ?? 0;
      if (atual <= 1) delete state.quantidades[id];
      else state.quantidades[id] = atual - 1;
    },
    removerItem(state, action: PayloadAction<number>) {
      delete state.quantidades[action.payload];
    },
    limpar: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPedido.fulfilled, () => initialState) // pedido feito: carrinho vazio
      .addCase(logout, () => initialState);
  },
});

export const { adicionar, remover, removerItem, limpar } = cartSlice.actions;
export default cartSlice.reducer;
