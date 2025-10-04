import { Navigate, createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import {
  ConfiguracoesPage,
  ContasAPagarPage,
  DashboardPage,
  EntradaPage,
  GraficoPizzaPage,
  LoginPage,
  SaidaPage,
  TemasPage
} from '../pages';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'entrada', element: <EntradaPage /> },
      { path: 'saida', element: <SaidaPage /> },
      { path: 'contas-a-pagar', element: <ContasAPagarPage /> },
      { path: 'grafico-pizza', element: <GraficoPizzaPage /> },
      { path: 'temas', element: <TemasPage /> },
      { path: 'configuracoes', element: <ConfiguracoesPage /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);
