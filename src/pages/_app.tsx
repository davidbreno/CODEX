import type { AppProps } from 'next/app';
import { FinanceProvider } from '../store/FinanceContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FinanceProvider>
      <Component {...pageProps} />
    </FinanceProvider>
  );
}
