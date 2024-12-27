import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';
import { useEventManagement } from '../../hooks/useEventManagement';
import { useEventInvitations } from '../../hooks/useEventInvitations';
import { useEvents } from '../../hooks/useEvents';
import toast from 'react-hot-toast';

interface EventModalProps {
  eventId: string | null;
  initialDate?: Date;
  onClose: () => void;
  onEventChange?: () => void;
}

export default function EventModal({ eventId, initialDate, onClose, onEventChange }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const { events } = useEvents(new Date(), new Date());
  const { createEvent, updateEvent, deleteEvent, loading } = useEventManagement();
  const { inviteUser } = useEventInvitations();

  // Carregar dados do evento quando for edição
  useEffect(() => {
    if (eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
        setStartTime(format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm"));
        setEndTime(format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm"));
      }
    } else if (initialDate) {
      const defaultStartTime = format(initialDate, "yyyy-MM-dd'T'HH:mm");
      const defaultEndTime = format(
        new Date(initialDate.getTime() + 60 * 60 * 1000),
        "yyyy-MM-dd'T'HH:mm"
      );
      setStartTime(defaultStartTime);
      setEndTime(defaultEndTime);
    }
  }, [eventId, events, initialDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      title,
      description,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
    };

    try {
      if (eventId) {
        await updateEvent(eventId, eventData);
        toast.success('Evento atualizado com sucesso');
      } else {
        await createEvent(eventData);
        toast.success('Evento criado com sucesso');
      }
      onEventChange?.();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar evento';
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (eventId && confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await deleteEvent(eventId);
        toast.success('Evento excluído com sucesso');
        onEventChange?.();
        onClose();
      } catch (error) {
        toast.error('Erro ao excluir evento');
      }
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (eventId && inviteEmail) {
      try {
        await inviteUser(eventId, inviteEmail);
        setInviteEmail('');
        toast.success('Convite enviado com sucesso');
      } catch (error) {
        toast.error('Erro ao enviar convite');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {eventId ? 'Editar Evento' : 'Novo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Início
              </label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Término
              </label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {eventId && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 rounded-md"
                disabled={loading}
              >
                Excluir
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
              disabled={loading}
            >
              {eventId ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>

        {eventId && (
          <div className="border-t p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Convidar Usuários
            </h3>
            <form onSubmit={handleInvite} className="flex space-x-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Digite o e-mail"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
                disabled={loading}
              >
                Convidar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}