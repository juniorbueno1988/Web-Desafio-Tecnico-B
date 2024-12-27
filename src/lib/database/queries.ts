import { getEventsByUserId } from './events';
import { getEventsByInviteeId } from './invitations';
import { Event } from '../../types/calendar';

export async function getAllUserEvents(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Event[]> {
  try {
    const [ownedEvents, invitedEvents] = await Promise.all([
      getEventsByUserId(userId, startDate, endDate),
      getEventsByInviteeId(userId, startDate, endDate)
    ]);

    // Deduplicate events
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