import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState, SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { MinusIcon, PlusIcon, TrashIcon } from "../components/icons";
import PageTransition from "../components/PageTransition";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { adicionar, MAX_QUANTIDADE, remover, removerItem } from "../features/cart/cartSlice";
import { createPedido, resetCreate } from "../features/pedidos/pedidosSlice";
import { selectProdutos } from "../features/produtos/produtosSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { NovoPedidoRequest, Produto } from "../types/api";
import { emojiDoProduto, formatBRL, formatCep, onlyDigits } from "../utils/format";

// ---------- formulário de endereço ----------
const ENDERECO_VAZIO = { cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "" };
type EnderecoForm = typeof ENDERECO_VAZIO;
type Erros = Partial<Record<keyof EnderecoForm, string>>;

function validar(f: EnderecoForm): Erros {
  const erros: Erros = {};
  if (onlyDigits(f.cep).length !== 8) erros.cep = "Informe um CEP válido";
  if (!f.logradouro.trim()) erros.logradouro = "Informe a rua";
  if (!f.numero.trim()) erros.numero = "Informe o número";
  if (!f.bairro.trim()) erros.bairro = "Informe o bairro";
  if (!f.cidade.trim()) erros.cidade = "Informe a cidade";
  if (!/^[A-Za-z]{2}$/.test(f.estado)) erros.estado = "Use a sigla com 2 letras";
  return erros;
}

// ---------- card de produto ----------
function ProdutoCard({ produto }: { produto: Produto }) {
  const dispatch = useAppDispatch();
  const quantidade = useAppSelector((s) => s.cart.quantidades[produto.id] ?? 0);

  return (
    <motion.li
      layout
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      className={`flex flex-col rounded-3xl border p-5 backdrop-blur transition-colors duration-300 ${
        quantidade > 0
          ? "border-brand-300 bg-brand-50/70 shadow-lg shadow-brand-500/10"
          : "border-white/70 bg-white/80 shadow-sm"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-100 to-amber-100 text-3xl">
          {emojiDoProduto(produto.nome)}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900">{produto.nome}</h3>
          {produto.descricao && <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">{produto.descricao}</p>}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-lg font-extrabold text-slate-900">{formatBRL(produto.valor)}</span>

        <AnimatePresence mode="wait" initial={false}>
          {quantidade === 0 ? (
            <motion.button
              key="adicionar"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => dispatch(adicionar(produto.id))}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <PlusIcon width={16} height={16} /> Adicionar
            </motion.button>
          ) : (
            <motion.div
              key="stepper"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-brand-200"
            >
              <motion.button
                whileTap={{ scale: 0.85 }}
                aria-label={`Remover um ${produto.nome}`}
                onClick={() => dispatch(remover(produto.id))}
                className="flex size-8 items-center justify-center rounded-lg text-brand-700 transition hover:bg-brand-50"
              >
                <MinusIcon width={16} height={16} />
              </motion.button>
              <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden text-center font-bold tabular-nums text-slate-900">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={quantidade}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute"
                  >
                    {quantidade}
                  </motion.span>
                </AnimatePresence>
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                aria-label={`Adicionar mais um ${produto.nome}`}
                disabled={quantidade >= MAX_QUANTIDADE}
                onClick={() => dispatch(adicionar(produto.id))}
                className="flex size-8 items-center justify-center rounded-lg bg-brand-500 text-white transition hover:bg-brand-600 disabled:opacity-40"
              >
                <PlusIcon width={16} height={16} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}

// ---------- página ----------
export default function NovoPedidoPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const produtos = useAppSelector(selectProdutos);
  const quantidades = useAppSelector((s) => s.cart.quantidades);
  const { createStatus, createError, createFieldErrors } = useAppSelector((s) => s.pedidos);

  const [endereco, setEndereco] = useState<EnderecoForm>(ENDERECO_VAZIO);
  const [erros, setErros] = useState<Erros>({});

  useEffect(() => {
    dispatch(resetCreate());
  }, [dispatch]);

  const linhas = useMemo(
    () =>
      produtos
        .filter((p) => (quantidades[p.id] ?? 0) > 0)
        .map((produto) => {
          const quantidade = quantidades[produto.id];
          return { produto, quantidade, subtotal: produto.valor * quantidade };
        }),
    [produtos, quantidades],
  );
  const total = linhas.reduce((soma, l) => soma + l.subtotal, 0);
  const unidades = linhas.reduce((soma, l) => soma + l.quantidade, 0);

  const setCampo = (campo: keyof EnderecoForm, valor: string) => {
    setEndereco((e) => ({ ...e, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  };

  // erro do cliente (validação local) ou do servidor (campo "enderecoEntrega.xxx")
  const erro = (campo: keyof EnderecoForm) => erros[campo] ?? createFieldErrors?.[`enderecoEntrega.${campo}`];

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (linhas.length === 0) return;

    const encontrados = validar(endereco);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    const payload: NovoPedidoRequest = {
      itens: linhas.map((l) => ({ produtoId: l.produto.id, quantidade: l.quantidade })),
      enderecoEntrega: {
        logradouro: endereco.logradouro.trim(),
        numero: endereco.numero.trim(),
        complemento: endereco.complemento.trim() || null,
        bairro: endereco.bairro.trim(),
        cidade: endereco.cidade.trim(),
        estado: endereco.estado.toUpperCase(),
        cep: endereco.cep,
      },
    };

    try {
      const pedido = await dispatch(createPedido(payload)).unwrap();
      navigate(`/pedidos/${pedido.id}`, { state: { novo: true } });
    } catch {
      /* a mensagem de erro já está no estado (createError) */
    }
  }

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Novo pedido</h1>
        <p className="mt-1 text-slate-500">Escolha os produtos, ajuste as quantidades e informe o endereço de entrega.</p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">
        {/* ---------- cardápio ---------- */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Cardápio</h2>

          {produtos.length > 0 && (
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {produtos.map((produto) => (
                <ProdutoCard key={produto.id} produto={produto} />
              ))}
            </motion.ul>
          )}
        </section>

        {/* ---------- resumo + endereço ---------- */}
        <form
          id="resumo"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-brand-500/5 backdrop-blur-xl lg:sticky lg:top-24"
        >
          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Seu pedido</h2>

            <AnimatePresence initial={false} mode="popLayout">
              {linhas.length === 0 ? (
                <motion.p
                  key="vazio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400"
                >
                  🛒 Adicione produtos do cardápio para começar.
                </motion.p>
              ) : (
                <motion.ul key="itens" layout className="divide-y divide-slate-100">
                  <AnimatePresence initial={false}>
                    {linhas.map(({ produto, quantidade, subtotal }) => (
                      <motion.li
                        key={produto.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-3 py-3">
                          <span className="text-2xl">{emojiDoProduto(produto.nome)}</span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">{produto.nome}</p>
                            <p className="text-xs text-slate-500">
                              {quantidade} × {formatBRL(produto.valor)}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-slate-900">{formatBRL(subtotal)}</span>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.85 }}
                            aria-label={`Remover ${produto.nome}`}
                            onClick={() => dispatch(removerItem(produto.id))}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          >
                            <TrashIcon width={16} height={16} />
                          </motion.button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-sm font-medium text-slate-500">
                Total · {unidades} {unidades === 1 ? "item" : "itens"}
              </span>
              <motion.span
                key={total}
                initial={{ scale: 1.15, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-extrabold text-slate-900"
              >
                {formatBRL(total)}
              </motion.span>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Endereço de entrega</h2>
            <div className="grid grid-cols-6 gap-3">
              <Input
                className="col-span-6 sm:col-span-2"
                label="CEP"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                value={endereco.cep}
                onChange={(e) => setCampo("cep", formatCep(e.target.value))}
                error={erro("cep")}
              />
              <Input
                className="col-span-6 sm:col-span-4"
                label="Rua"
                autoComplete="address-line1"
                value={endereco.logradouro}
                onChange={(e) => setCampo("logradouro", e.target.value)}
                error={erro("logradouro")}
              />
              <Input
                className="col-span-3 sm:col-span-2"
                label="Número"
                value={endereco.numero}
                onChange={(e) => setCampo("numero", e.target.value)}
                error={erro("numero")}
              />
              <Input
                className="col-span-3 sm:col-span-4"
                label="Complemento"
                placeholder="Opcional"
                value={endereco.complemento}
                onChange={(e) => setCampo("complemento", e.target.value)}
                error={erro("complemento")}
              />
              <Input
                className="col-span-6"
                label="Bairro"
                value={endereco.bairro}
                onChange={(e) => setCampo("bairro", e.target.value)}
                error={erro("bairro")}
              />
              <Input
                className="col-span-4"
                label="Cidade"
                autoComplete="address-level2"
                value={endereco.cidade}
                onChange={(e) => setCampo("cidade", e.target.value)}
                error={erro("cidade")}
              />
              <Input
                className="col-span-2"
                label="UF"
                maxLength={2}
                placeholder="SP"
                autoComplete="address-level1"
                value={endereco.estado}
                onChange={(e) => setCampo("estado", e.target.value.toUpperCase())}
                error={erro("estado")}
              />
            </div>
          </div>

          <div>
            <Alert message={createError && !createFieldErrors ? createError : null} />
            <Button
              type="submit"
              loading={createStatus === "loading"}
              disabled={linhas.length === 0}
              className="w-full py-3.5 text-base"
            >
              Finalizar pedido · {formatBRL(total)}
            </Button>
          </div>
        </form>
      </div>

      {/* barra fixa no mobile para ir ao resumo */}
      <AnimatePresence>
        {linhas.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-x-4 bottom-4 z-20 lg:hidden"
          >
            <button
              type="button"
              onClick={() => document.getElementById("resumo")?.scrollIntoView({ behavior: "smooth" })}
              className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-2xl"
            >
              <span className="text-sm font-medium">
                {unidades} {unidades === 1 ? "item" : "itens"} · Revisar pedido
              </span>
              <span className="font-extrabold">{formatBRL(total)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
