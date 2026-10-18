import { createSlice } from "@reduxjs/toolkit";
import produtosMock from "../../data/produtos.json";
import type { Produto } from "../../types/api";

interface ProdutosState {
  items: Produto[];
}

/**
 * Cardápio mockado em src/data/produtos.json.
 * Atenção: o "id" de cada produto precisa existir na tabela de produtos da API,
 * senão o POST /pedidos responde 400 ("Produto não encontrado").
 */
const initialState: ProdutosState = { items: produtosMock as Produto[] };

const produtosSlice = createSlice({
  name: "produtos",
  initialState,
  reducers: {},
});

export const selectProdutos = (state: { produtos: ProdutosState }) => state.produtos.items;
export default produtosSlice.reducer;
