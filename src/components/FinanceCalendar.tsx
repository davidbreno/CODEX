import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventInput } from '@fullcalendar/core';
import ptLocale from '@fullcalendar/core/locales/pt-br';
import { useFinance } from '../store/FinanceContext';
import { formatCurrency } from '../utils/format';

export const FinanceCalendar = () => {
  const { bills } = useFinance();

  const events = useMemo<EventInput[]>(
    () =>
      bills.map((bill) => {
        const color = bill.status === 'paid' ? '#16a34a' : '#f97316';

        return {
          id: bill.id,
          title: `${bill.description} • ${formatCurrency(bill.value)}`,
          start: bill.dueDate,
          allDay: true,
          backgroundColor: color,
          borderColor: color,
          classNames: [bill.status === 'paid' ? 'opacity-70' : 'font-semibold']
        } satisfies EventInput;
      }),
    [bills]
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow">
      <h2 className="text-lg font-semibold text-slate-700">Calendário de contas</h2>
      <p className="mb-4 text-sm text-slate-500">
        Eventos são atualizados automaticamente conforme contas são pagas ou permanecem pendentes.
      </p>
      <FullCalendar
        height="auto"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={ptLocale}
        events={events}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
      />
    </div>
  );
};
