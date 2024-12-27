import React from 'react';
import { format } from 'date-fns';
import { Event } from '../../types/calendar';

interface EventItemProps {
  event: Event;
  onClick: () => void;
  variant: 'compact' | 'detailed';
}

export default function EventItem({ event, onClick, variant }: EventItemProps) {
  if (variant === 'compact') {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="w-full text-left px-2 py-1 rounded text-sm bg-indigo-100 text-indigo-700 truncate hover:bg-indigo-200"
      >
        {event.title}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="w-full text-left p-2 rounded text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="text-xs text-indigo-500">
        {format(new Date(event.start_time), 'h:mm a')}
      </div>
    </button>
  );
}