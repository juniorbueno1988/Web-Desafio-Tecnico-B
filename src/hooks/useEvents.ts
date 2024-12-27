import { useEffect, useState, useCallback } from 'react';
import { Event } from '../types/calendar';
import { useAuth } from '../contexts/AuthContext';
import { fetchEvents, createEvent as createEventApi, updateEvent as updateEventApi, deleteEvent as deleteEventApi } from '../lib/api/eventApi';
import toast from 'react-hot-toast';
import { useEventState } from './useEventState';

export function useEvents(startDate: Date, endDate: Date) {
  const { user } = useAuth();
  const { 
    events,
    setEvents,
    addEvent,
    updateEventInState,
    removeEvent,
    loading,
    setLoading,
    error,
    setError 
  } = useEventState();

  const loadEvents = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchEvents(user.id, startDate, endDate);
      setEvents(data);
    } catch (err) {
      console.error('Error in useEvents:', err);
      setError(err instanceof Error ? err : new Error('Failed to load events'));
      toast.error('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, startDate, endDate, setEvents, setLoading, setError]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const createEvent = async (eventData: Omit<Event, 'id' | 'user_id'>) => {
    if (!user) {
      toast.error('You must be logged in to create events');
      return;
    }

    try {
      const newEvent = await createEventApi(user.id, eventData);
      addEvent(newEvent);
      toast.success('Event created successfully');
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Failed to create event');
      throw err;
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<Omit<Event, 'id' | 'user_id'>>) => {
    try {
      const updatedEvent = await updateEventApi(eventId, eventData);
      updateEventInState(updatedEvent);
      toast.success('Event updated successfully');
      return updatedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Failed to update event');
      throw err;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await deleteEventApi(eventId);
      removeEvent(eventId);
      toast.success('Event deleted successfully');
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Failed to delete event');
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    refresh: loadEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
}