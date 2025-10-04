import React from 'react';
import ReactDOM from 'react-dom/client';
 codex/create-kpi-cards-with-recharts

 codex/create-dashboardlayout-components-and-routing
 dev
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
 codex/create-kpi-cards-with-recharts


import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
 dev
 dev
  </React.StrictMode>
);
