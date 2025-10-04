import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { DashboardPage } from '../pages/Dashboard';
import { EntradaPage } from '../pages/Entrada';
import { SaidaPage } from '../pages/Saida';
import { LoginPage } from '../pages/Login';
import BillsPage from '../pages/Bills';
import { GraficoPizzaPage } from '../pages/GraficoPizza';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'entrada', element: <EntradaPage /> },
      { path: 'saida', element: <SaidaPage /> },
      { path: 'bills', element: <BillsPage /> },
      { path: 'pie', element: <GraficoPizzaPage /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> }
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
