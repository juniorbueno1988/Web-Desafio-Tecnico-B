import { isWithinInterval } from 'date-fns';
import { Event } from '../types/calendar';

export function checkEventOverlap(
  startTime: Date,
  endTime: Date,
  existingEvents: Event[],
  excludeEventId?: string
): boolean {
  return existingEvents.some(event => {
    if (event.id === excludeEventId) return false;
    
    const eventStart = new Date(event.start_time);
    const eventEnd = new Date(event.end_time);
    
    return (
      isWithinInterval(startTime, { start: eventStart, end: eventEnd }) ||
      isWithinInterval(endTime, { start: eventStart, end: eventEnd }) ||
      isWithinInterval(eventStart, { start: startTime, end: endTime })
    );
  });
}

export function validateEventTimes(startTime: Date, endTime: Date): string | null {
  if (startTime >= endTime) {
    return 'O horário de início deve ser anterior ao horário de término';
  }
  return null;
}