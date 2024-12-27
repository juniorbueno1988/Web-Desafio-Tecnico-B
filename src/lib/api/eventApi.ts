import { supabase } from '../supabase';
import { Event } from '../../types/calendar';
import { retry } from '../utils/retry';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function fetchEvents(userId: string, startDate: Date, endDate: Date): Promise<Event[]> {
  return retry(async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate.toISOString())
      .lte('end_time', endDate.toISOString());

    if (error) throw error;
    return data || [];
  }, MAX_RETRIES, RETRY_DELAY);
}

export async function createEvent(userId: string, eventData: Omit<Event, 'id' | 'user_id'>): Promise<Event> {
  return retry(async () => {
    const { data, error } = await supabase
      .from('events')
      .insert([{ ...eventData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }, MAX_RETRIES, RETRY_DELAY);
}

export async function updateEvent(eventId: string, eventData: Partial<Omit<Event, 'id' | 'user_id'>>): Promise<Event> {
  return retry(async () => {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }, MAX_RETRIES, RETRY_DELAY);
}

export async function deleteEvent(eventId: string): Promise<void> {
  return retry(async () => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
  }, MAX_RETRIES, RETRY_DELAY);
}