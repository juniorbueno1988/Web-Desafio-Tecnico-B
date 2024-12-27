import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CalendarGrid from '../components/calendar/CalendarGrid';
import CalendarHeader from '../components/calendar/CalendarHeader';
import EventModal from '../components/events/EventModal';
import { ViewType } from '../types/calendar';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { refresh } = useEvents(new Date(), new Date());

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleEventChange = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleTimeSlotClick = (date: Date) => {
    setModalInitialDate(date);
    setSelectedEventId(null);
    setShowEventModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
          </h1>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalendarHeader
          viewType={viewType}
          onViewChange={setViewType}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onCreateEvent={() => {
            setModalInitialDate(undefined);
            setSelectedEventId(null);
            setShowEventModal(true);
          }}
        />
        
        <CalendarGrid
          viewType={viewType}
          selectedDate={selectedDate}
          onEventClick={setSelectedEventId}
          onTimeSlotClick={handleTimeSlotClick}
        />

        {showEventModal && (
          <EventModal
            eventId={selectedEventId}
            initialDate={modalInitialDate}
            onClose={() => {
              setShowEventModal(false);
              setSelectedEventId(null);
              setModalInitialDate(undefined);
            }}
            onEventChange={handleEventChange}
          />
        )}
      </main>
    </div>
  );
}