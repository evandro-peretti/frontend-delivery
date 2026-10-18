# Delivery Web

Front-end do site de delivery (consome a `delivery-api`).

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS 4 · Redux Toolkit (slices) · React Router 7 · Motion (animações)

## Como rodar

Pré-requisitos: Node.js 20.19+ (ou 22.12+) ou Bun 1.4+ e a API rodando em `http://localhost:8080`.

```bash
npm install
npm run dev        # http://localhost:5173
```

Em desenvolvimento o Vite encaminha `/api/*` para `http://localhost:8080` (veja `vite.config.ts`),
então não é preciso configurar CORS. Conta de demonstração: `maria@examplo.com` / `maria123`.

```bash
npm run build      # typecheck + build de produção em dist/
npm run preview
```

Em produção, se o front e a API ficarem em origens diferentes, defina `VITE_API_URL` com a URL da API
(veja `.env.example`) e habilite CORS no Spring Boot.

## Telas

| Rota | Tela |
|---|---|
| `/` | Login (com link para o cadastro) |
| `/cadastro` | Cadastro de cliente (já entra logado ao concluir) |
| `/pedidos` | Lista resumida dos pedidos do cliente logado |
| `/pedidos/:id` | Detalhes do pedido: andamento, itens, entrega (atualiza sozinho a cada 15 s) |
| `/pedidos/novo` | Novo pedido: escolha de produtos, quantidades e endereço |

## Estrutura

```
src/
├── data/         produtos.json (cardápio mockado)
├── api/          cliente HTTP (fetch), endpoints e tratamento de erros (RFC 9457)
├── features/     slices do Redux Toolkit
│   ├── auth/       token JWT, login e cadastro
│   ├── produtos/   cardápio (mock em src/data/produtos.json)
│   ├── pedidos/    lista, detalhe e criação (createEntityAdapter)
│   └── cart/       quantidades escolhidas no novo pedido
├── store/        configureStore + hooks tipados (useAppDispatch / useAppSelector)
├── components/   Layout, transições, timeline do pedido e componentes de UI
├── pages/        uma página por rota
└── utils/        formatação (BRL, datas), status e sessão
```

## Produtos (mock)

O cardápio vem de `src/data/produtos.json`; a API ainda não tem endpoint de produtos.
Cada produto do JSON precisa existir no banco da API **com o mesmo `id`**, porque o pedido é enviado com
`produtoId`. Se o id não existir, a API responde 400 (`Produto não encontrado`).

- A API já cria 3 produtos na primeira execução (`DataLoader`), com ids 1, 2 e 3 — são os do JSON.
- Ao adicionar produtos no JSON, cadastre-os também no banco com os mesmos ids.
- O preço usado no pedido é sempre o do **banco**; o valor do JSON serve só para exibição.
- Quando existir `GET /produtos`, basta trocar `initialState` do `produtosSlice` por um `createAsyncThunk`.

## Decisões

- **Sessão:** o token JWT fica no `localStorage` (simples para demonstração). Se a API responder 401
  (token expirado), o app faz logout automático. Em produção, prefira cookie `HttpOnly`.
- **Rotas:** o `App` alterna entre rotas públicas e privadas conforme `auth.token`, então login e logout
  navegam sozinhos, sem guards em cada rota.
- **Animações:** transição entre páginas, entrada em cascata de listas, stepper de quantidade e timeline
  do pedido usam a biblioteca Motion. O app respeita `prefers-reduced-motion`.
