import { create } from 'zustand';

type FinanceEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
};

type FinanceState = {
  events: FinanceEvent[];
  addEvent: (event: FinanceEvent) => void;
};

export const useFinanceStore = create<FinanceState>((set) => ({
  events: [
    {
      id: '1',
      title: 'Revisão do orçamento trimestral',
      start: '2024-07-09T12:00:00Z',
      end: '2024-07-09T13:00:00Z'
    },
    {
      id: '2',
      title: 'Reunião com investidores',
      start: '2024-07-17T15:00:00Z',
      end: '2024-07-17T16:30:00Z'
    }
  ],
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event]
    }))
}));
