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
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/entrada', element: <EntradaPage /> },
      { path: '/saida', element: <SaidaPage /> },
      { path: '/bills', element: <ContasAPagarPage /> },
      { path: '/pie', element: <GraficoPizzaPage /> },
      { path: '/temas', element: <TemasPage /> },
      { path: '/configuracoes', element: <ConfiguracoesPage /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> }
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'entrada', element: <EntradaPage /> },
      { path: 'saida', element: <SaidaPage /> },
      { path: 'bills', element: <ContasAPagarPage /> },
      { path: 'pie', element: <GraficoPizzaPage /> },
      { path: 'temas', element: <TemasPage /> },
      { path: 'configuracoes', element: <ConfiguracoesPage /> }
    ]
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
]);
