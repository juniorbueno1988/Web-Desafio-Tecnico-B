import React from 'react';
import { addMonths, addWeeks, format, subMonths, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ViewType } from '../../types/calendar';

interface CalendarHeaderProps {
  viewType: ViewType;
  selectedDate: Date;
  onViewChange: (view: ViewType) => void;
  onDateChange: (date: Date) => void;
  onCreateEvent: () => void;
}

export default function CalendarHeader({
  viewType,
  selectedDate,
  onViewChange,
  onDateChange,
  onCreateEvent,
}: CalendarHeaderProps) {
  const handlePrevious = () => {
    if (viewType === 'month') {
      onDateChange(subMonths(selectedDate, 1));
    } else {
      onDateChange(subWeeks(selectedDate, 1));
    }
  };

  const handleNext = () => {
    if (viewType === 'month') {
      onDateChange(addMonths(selectedDate, 1));
    } else {
      onDateChange(addWeeks(selectedDate, 1));
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePrevious}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDateChange(new Date())}
          className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Hoje
        </button>
        <button
          onClick={handleNext}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={() => onViewChange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              viewType === 'week'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => onViewChange('month')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              viewType === 'month'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Mês
          </button>
        </div>

        <button
          onClick={onCreateEvent}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </button>
      </div>
    </div>
  );
}