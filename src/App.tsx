import type { JSX } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import {
  ConfiguracoesPage,
  ContasAPagarPage,
  DashboardPage,
  EntradaPage,
  GraficoPizzaPage,
  LoginPage,
  SaidaPage,
  TemasPage
} from './pages';

export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="entrada" element={<EntradaPage />} />
          <Route path="saida" element={<SaidaPage />} />
          <Route path="contas-a-pagar" element={<ContasAPagarPage />} />
          <Route path="grafico-pizza" element={<GraficoPizzaPage />} />
          <Route path="temas" element={<TemasPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
