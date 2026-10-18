const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dataCurta = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });
const dataLonga = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" });

export const formatBRL = (valor: number) => brl.format(valor);

export const formatDate = (iso: string) => dataCurta.format(new Date(iso));
export const formatDateLong = (iso: string) => dataLonga.format(new Date(iso));

export const onlyDigits = (valor: string) => valor.replace(/\D/g, "");

export function formatCep(valor: string) {
  const d = onlyDigits(valor).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export const pluralize = (n: number, singular: string, plural: string) => (n === 1 ? singular : plural);

export function emojiDoProduto(nome: string): string {
  const n = nome.toLowerCase();
  if (/pizza/.test(n)) return "🍕";
  if (/hamb|burger|lanche|x-/.test(n)) return "🍔";
  if (/refri|suco|bebida|água|agua|cerveja|chá|cha |café|cafe/.test(n)) return "🥤";
  if (/sushi|japon|temaki/.test(n)) return "🍣";
  if (/salada/.test(n)) return "🥗";
  if (/batata|frita/.test(n)) return "🍟";
  if (/lasanha|massa|macarr|espaguete/.test(n)) return "🍝";
  if (/sobremesa|bolo|sorvete|doce|brownie|pudim/.test(n)) return "🍰";
  return "🍽️";
}
