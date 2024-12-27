import { useState } from 'react';
import { Event } from '../types/calendar';
import { useAuth } from '../contexts/AuthContext';
import * as eventService from '../services/eventService';
import toast from 'react-hot-toast';

export function useEventManagement() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'user_id'>) => {
    if (!user) {
      toast.error('Você precisa estar logado para criar eventos');
      return;
    }

    setLoading(true);
    try {
      const newEvent = await eventService.createEvent(user.id, eventData);
      toast.success('Evento criado com sucesso');
      return newEvent;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar evento';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (
    eventId: string,
    eventData: Partial<Omit<Event, 'id' | 'user_id'>>
  ) => {
    if (!user) {
      toast.error('Você precisa estar logado para editar eventos');
      return;
    }

    setLoading(true);
    try {
      const updatedEvent = await eventService.updateEvent(eventId, user.id, eventData);
      toast.success('Evento atualizado com sucesso');
      return updatedEvent;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar evento';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para excluir eventos');
      return;
    }

    setLoading(true);
    try {
      await eventService.deleteEvent(eventId);
      toast.success('Evento excluído com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir evento');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createEvent: handleCreateEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
  };
}