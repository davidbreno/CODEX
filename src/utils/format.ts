import dayjs from 'dayjs';

export const formatCurrency = (amountInCents: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amountInCents / 100);
};

export const formatDate = (isoDate: string): string => {
  if (!isoDate) {
    return '';
  }

  return dayjs(isoDate).format('DD/MM/YYYY');
};

export const createId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `id-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
};
