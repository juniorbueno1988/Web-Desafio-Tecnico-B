import { supabase } from '../supabase';
import { Event } from '../../types/calendar';

export async function getEventsByInviteeId(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Event[]> {
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      event_invitations!inner (
        invitee_id,
        status
      )
    `)
    .eq('event_invitations.invitee_id', userId)
    .neq('event_invitations.status', 'declined')
    .gte('start_time', startDate.toISOString())
    .lte('end_time', endDate.toISOString());

  if (error) throw error;
  return events || [];
}