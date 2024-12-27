export type ViewType = 'week' | 'month';

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  user_id: string;
}

export interface EventInvitation {
  id: string;
  event_id: string;
  invitee_id: string;
  status: 'pending' | 'accepted' | 'declined';
}