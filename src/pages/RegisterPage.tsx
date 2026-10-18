import { useEffect, useState, SubmitEvent, type ChangeEvent } from "react";
import { Link } from "react-router";
import AuthShell from "../components/AuthShell";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { clearAuthError, register } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const { status, error, fieldErrors } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmar: "" });
  const [confirmarErro, setConfirmarErro] = useState<string>();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const set = (campo: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.senha !== form.confirmar) {
      setConfirmarErro("As senhas não conferem");
      return;
    }
    setConfirmarErro(undefined);
    // Cadastra e já autentica; o App leva o usuário para a área logada.
    void dispatch(register({ nome: form.nome.trim(), email: form.email.trim(), senha: form.senha }));
  }

  return (
    <AuthShell
      title="Crie sua conta 🚀"
      subtitle="Leva menos de um minuto."
      footer={
        <>
          Já tem uma conta?{" "}
          <Link to="/" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert message={error && !fieldErrors ? error : null} />
        <Input
          label="Nome"
          autoComplete="name"
          placeholder="Seu nome completo"
          value={form.nome}
          onChange={set("nome")}
          error={fieldErrors?.nome}
          required
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          value={form.email}
          onChange={set("email")}
          error={fieldErrors?.email}
          required
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo de 6 caracteres"
          minLength={6}
          value={form.senha}
          onChange={set("senha")}
          error={fieldErrors?.senha}
          required
        />
        <Input
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          value={form.confirmar}
          onChange={set("confirmar")}
          error={confirmarErro}
          required
        />
        <Button type="submit" loading={status === "loading"} className="w-full py-3">
          Criar conta
        </Button>
      </form>
    </AuthShell>
  );
}
