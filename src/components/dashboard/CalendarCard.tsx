import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { dashboardSelectors } from '../../store/dashboardStore';
import type { CalendarEvent } from '../../store/dashboardStore';

const CalendarCard = () => {
  const events: CalendarEvent[] = dashboardSelectors.getCalendarEvents();

  return (
    <article className="gradient-border rounded-2xl bg-slate-900/60 p-[1px]">
      <div className="glass-card h-full rounded-[1.05rem] p-6">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Eventos financeiros</p>
            <h3 className="text-lg font-semibold text-white">Calendário consolidado</h3>
            <p className="mt-1 text-xs text-slate-400">
              Eventos gerados automaticamente a partir das transações e contas vinculadas.
            </p>
          </div>
        </header>
        <div className="calendar-wrapper [&_.fc]:font-display [&_.fc]:text-xs [&_.fc-button]:rounded-lg [&_.fc-button]:border-none [&_.fc-button]:bg-slate-800/80 [&_.fc-button]:text-slate-200 [&_.fc-button]:transition [&_.fc-button:hover]:bg-slate-700/90 [&_.fc-button:focus]:shadow-none">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            headerToolbar={{ left: 'title', right: 'prev,next today dayGridMonth,timeGridWeek' }}
            events={events}
            eventDisplay="block"
            dayMaxEventRows={2}
            eventClassNames={() => ['rounded-xl', 'font-semibold', '!border-none', '!text-slate-900', 'shadow-lg', 'shadow-slate-900/40']}
            eventContent={(info) => {
              const [rawTitle, rawAmount] = info.event.title.split('(');
              const title = rawTitle.trim();
              const amount = rawAmount ? `(${rawAmount.replace(')', '').trim()})` : '';
              return (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.7rem]">{title}</span>
                  {amount && <span className="text-[0.65rem] text-slate-900/80">{amount}</span>}
                </div>
              );
            }}
          />
        </div>
      </div>
    </article>
  );
};

export default CalendarCard;
