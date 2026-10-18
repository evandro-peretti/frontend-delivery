import { AnimatePresence } from "motion/react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Backdrop from "./components/Backdrop";
import Layout from "./components/Layout";
import PedidosPage from "./pages/PedidosPage";
import { useAppSelector } from "./store/hooks";
import { selectIsAuthenticated } from "./features/auth/authSlice";

function PublicRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function PrivateRoutes() {
  const location = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="*" element={<Navigate to="/pedidos" replace />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  const autenticado = useAppSelector(selectIsAuthenticated);

  return (
    <>
      <Backdrop />
      {autenticado ? <PrivateRoutes /> : <PublicRoutes />}
    </>
  );
}

export default App;
