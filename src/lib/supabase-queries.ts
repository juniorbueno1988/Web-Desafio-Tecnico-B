import { supabase } from './supabase';
import { Event } from '../types/calendar';

async function fetchOwnedEvents(userId: string, startDate: Date, endDate: Date): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', startDate.toISOString())
    .lte('end_time', endDate.toISOString());

  if (error) {
    console.error('Error fetching owned events:', error);
    throw error;
  }

  return data || [];
}

async function fetchInvitedEvents(userId: string, startDate: Date, endDate: Date): Promise<Event[]> {
  const { data: invitations, error: invitationsError } = await supabase
    .from('event_invitations')
    .select('event_id')
    .eq('invitee_id', userId)
    .neq('status', 'declined');

  if (invitationsError) {
    console.error('Error fetching invitations:', invitationsError);
    throw invitationsError;
  }

  if (!invitations?.length) {
    return [];
  }

  const eventIds = invitations.map(inv => inv.event_id);
  
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .in('id', eventIds)
    .gte('start_time', startDate.toISOString())
    .lte('end_time', endDate.toISOString());

  if (eventsError) {
    console.error('Error fetching invited events:', eventsError);
    throw eventsError;
  }

  return events || [];
}

export async function fetchUserEvents(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Event[]> {
  try {
    const [ownedEvents, invitedEvents] = await Promise.all([
      fetchOwnedEvents(userId, startDate, endDate),
      fetchInvitedEvents(userId, startDate, endDate)
    ]);

    // Combine and deduplicate events
    const eventMap = new Map<string, Event>();
    [...ownedEvents, ...invitedEvents].forEach(event => {
      eventMap.set(event.id, event);
    });

    return Array.from(eventMap.values());
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}