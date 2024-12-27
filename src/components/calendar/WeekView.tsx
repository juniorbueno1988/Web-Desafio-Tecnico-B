import React from 'react';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachHourOfInterval,
  format,
  isToday,
  isSameHour,
  addDays,
} from 'date-fns';
import { useEvents } from '../../hooks/useEvents';
import EventItem from '../events/EventItem';

interface WeekViewProps {
  selectedDate: Date;
  onEventClick: (eventId: string) => void;
  onTimeSlotClick: (date: Date) => void;
}

export default function WeekView({
  selectedDate,
  onEventClick,
  onTimeSlotClick,
}: WeekViewProps) {
  const start = startOfWeek(selectedDate);
  const end = endOfWeek(selectedDate);
  const days = eachDayOfInterval({ start, end });
  const hours = eachHourOfInterval({ start, end });
  
  const { events, loading } = useEvents(start, end);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-8 gap-px border-b">
        <div className="h-12 bg-gray-50" />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`h-12 ${
              isToday(day) ? 'bg-indigo-50' : 'bg-gray-50'
            } text-center py-3`}
          >
            <div className="text-sm font-medium text-gray-500">
              {format(day, 'EEE')}
            </div>
            <div
              className={`text-sm font-semibold ${
                isToday(day) ? 'text-indigo-600' : 'text-gray-900'
              }`}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-px bg-gray-200">
        {hours.map((hour) => (
          <React.Fragment key={hour.toISOString()}>
            <div className="bg-gray-50 p-2 text-right">
              <span className="text-sm text-gray-500">
                {format(hour, 'ha')}
              </span>
            </div>
            {days.map((day) => {
              const currentHour = addDays(hour, day.getDay());
              const hourEvents = events.filter((event) =>
                isSameHour(new Date(event.start_time), currentHour)
              );

              return (
                <div
                  key={currentHour.toISOString()}
                  onClick={() => onTimeSlotClick(currentHour)}
                  className="bg-white p-1 h-20"
                >
                  {hourEvents.map((event) => (
                    <EventItem
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event.id)}
                      variant="detailed"
                    />
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}