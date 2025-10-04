import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from './theme';
import { router } from './router';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
import './index.css';
import { ThemeProvider } from './theme';
import { router } from './router';
import App from './App';
import './index.css';
import { ThemeProvider } from './theme';
import { FinanceProvider } from './store/FinanceContext';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element with id "root" was not found.');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
      <FinanceProvider>
        <App />
      </FinanceProvider>
    </ThemeProvider>

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
