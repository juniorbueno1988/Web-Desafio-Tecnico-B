import { supabase } from '../supabase';
import { Event } from '../../types/calendar';

export async function getEventsByUserId(
  userId: string, 
  startDate: Date, 
  endDate: Date
): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', startDate.toISOString())
    .lte('end_time', endDate.toISOString());

  if (error) throw error;
  return data || [];
}

export async function createEvent(userId: string, eventData: Omit<Event, 'id' | 'user_id'>): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        ...eventData,
        user_id: userId
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(eventId: string, eventData: Partial<Omit<Event, 'id' | 'user_id'>>): Promise<Event> {
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