// Generated types from Supabase
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string;
          created_at: string;
          updated_at: string;
        };
      };
      event_invitations: {
        Row: {
          id: string;
          event_id: string;
          invitee_id: string;
          status: 'pending' | 'accepted' | 'declined';
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}