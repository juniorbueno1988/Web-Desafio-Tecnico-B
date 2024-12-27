import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEvents } from '../../hooks/useEvents';
import EventItem from '../events/EventItem';

interface MonthViewProps {
  selectedDate: Date;
  onEventClick: (eventId: string) => void;
  onTimeSlotClick: (date: Date) => void;
}

export default function MonthView({
  selectedDate,
  onEventClick,
  onTimeSlotClick,
}: MonthViewProps) {
  const start = startOfWeek(startOfMonth(selectedDate));
  const end = endOfWeek(endOfMonth(selectedDate));
  const days = eachDayOfInterval({ start, end });
  
  const { events, loading } = useEvents(start, end);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 gap-px border-b">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div
            key={day}
            className="h-12 bg-gray-50 text-center py-3 text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day) => {
          const dayEvents = events.filter(
            (event) =>
              format(new Date(event.start_time), 'yyyy-MM-dd') ===
              format(day, 'yyyy-MM-dd')
          );

          return (
            <div
              key={day.toISOString()}
              onClick={() => onTimeSlotClick(day)}
              className={`min-h-[8rem] bg-white p-2 ${
                !isSameMonth(day, selectedDate) && 'bg-gray-50'
              }`}
            >
              <div
                className={`text-sm font-medium ${
                  isToday(day)
                    ? 'bg-indigo-600 text-white h-6 w-6 rounded-full flex items-center justify-center mx-auto'
                    : 'text-gray-900'
                }`}
              >
                {format(day, 'd')}
              </div>
              <div className="mt-2 space-y-1">
                {dayEvents.map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onClick={() => onEventClick(event.id)}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}