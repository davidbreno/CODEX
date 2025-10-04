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
        const color = bill.status === 'paid' ? '#34d399' : '#f97316';

        return {
          id: bill.id,
          title: `${bill.description} • ${formatCurrency(bill.amountInCents)}`,
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
    <div className="calendar-surface rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-aurora-end/20 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">Calendário de contas</h2>
      <p className="mb-4 text-sm text-white/60">
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
