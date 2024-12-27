import { useState } from 'react';
import { Event } from '../types/calendar';

export function useEventState() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
  };

  const updateEventInState = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const removeEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return {
    events,
    setEvents,
    addEvent,
    updateEventInState,
    removeEvent,
    loading,
    setLoading,
    error,
    setError
  };
}