import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './router';
import { ThemeProvider } from './theme';
import { FinanceProvider } from './store/FinanceContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <FinanceProvider>
        <RouterProvider router={router} />
      </FinanceProvider>
    </ThemeProvider>
  </React.StrictMode>
);
