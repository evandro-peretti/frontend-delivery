import { SubmitEvent, useEffect, useState } from "react";
import { Link } from "react-router";
import AuthShell from "../components/AuthShell";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { clearAuthError, login } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    // Ao logar, o App troca automaticamente para a área autenticada.
    void dispatch(login({ email: email.trim(), senha }));
  }

  return (
    <AuthShell
      title="Bem-vindo de volta 👋"
      subtitle="Entre para acompanhar e fazer seus pedidos."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
            Cadastre-se
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert message={error} />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <Button type="submit" loading={status === "loading"} className="w-full py-3">
          Entrar
        </Button>
      </form>
      <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
        Conta de demonstração: <span className="font-semibold">maria@exemplo.com</span> / <span className="font-semibold">maria123</span>
      </p>
    </AuthShell>
  );
}
