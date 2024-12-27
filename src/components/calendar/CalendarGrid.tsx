import React from 'react';
import { ViewType } from '../../types/calendar';
import MonthView from './MonthView';
import WeekView from './WeekView';

interface CalendarGridProps {
  viewType: ViewType;
  selectedDate: Date;
  onEventClick: (eventId: string) => void;
  onTimeSlotClick: (date: Date) => void;
}

export default function CalendarGrid({
  viewType,
  selectedDate,
  onEventClick,
  onTimeSlotClick,
}: CalendarGridProps) {
  return viewType === 'month' ? (
    <MonthView
      selectedDate={selectedDate}
      onEventClick={onEventClick}
      onTimeSlotClick={onTimeSlotClick}
    />
  ) : (
    <WeekView
      selectedDate={selectedDate}
      onEventClick={onEventClick}
      onTimeSlotClick={onTimeSlotClick}
    />
  );
}