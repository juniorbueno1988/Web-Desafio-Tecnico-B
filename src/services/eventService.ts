import { supabase } from '../lib/supabase';
import { Event } from '../types/calendar';
import { validateEventTimes, checkEventOverlap } from '../utils/eventValidation';

export async function createEvent(userId: string, eventData: Omit<Event, 'id' | 'user_id'>): Promise<Event> {
  const start = new Date(eventData.start_time);
  const end = new Date(eventData.end_time);

  // Validar horários
  const timeError = validateEventTimes(start, end);
  if (timeError) throw new Error(timeError);

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId);

  // Verificar conflitos
  if (checkEventOverlap(start, end, events || [])) {
    throw new Error('Existe um conflito com outro evento neste horário');
  }

  const { data, error } = await supabase
    .from('events')
    .insert([{ ...eventData, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(
  eventId: string,
  userId: string,
  eventData: Partial<Omit<Event, 'id' | 'user_id'>>
): Promise<Event> {
  if (eventData.start_time && eventData.end_time) {
    const start = new Date(eventData.start_time);
    const end = new Date(eventData.end_time);

    const timeError = validateEventTimes(start, end);
    if (timeError) throw new Error(timeError);

    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId);

    if (checkEventOverlap(start, end, events || [], eventId)) {
      throw new Error('Existe um conflito com outro evento neste horário');
    }
  }

  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(eventId: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) throw error;
}