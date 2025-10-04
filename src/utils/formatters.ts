import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export const formatCurrencyBRL = (value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);

export const formatDate = (
  value: string | Date,
  pattern = 'DD/MM/YYYY',
  fallback = '--',
) => {
  const date = dayjs(value);
  if (!date.isValid()) {
    return fallback;
  }
  return date.format(pattern);
};

export const formatDateTime = (
  value: string | Date,
  pattern = 'DD/MM/YYYY HH:mm',
  fallback = '--',
) => {
  const date = dayjs(value);
  if (!date.isValid()) {
    return fallback;
  }
  return date.format(pattern);
};

export const formatRelativeDate = (value: string | Date, fallback = '--') => {
  const date = dayjs(value);
  if (!date.isValid()) {
    return fallback;
  }
  return date.fromNow();
};

export const parseISODate = (value: string | Date) => {
  const date = dayjs(value);
  return date.isValid() ? date.toISOString() : undefined;
};

export const getDayjs = () => dayjs;
