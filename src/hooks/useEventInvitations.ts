import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { EventInvitation } from '../types/calendar';
import toast from 'react-hot-toast';

export function useEventInvitations() {
  const [loading, setLoading] = useState(false);

  const inviteUser = async (eventId: string, email: string) => {
    setLoading(true);
    try {
      // First, get the user ID from the email
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError) throw new Error('User not found');

      const { error } = await supabase
        .from('event_invitations')
        .insert({
          event_id: eventId,
          invitee_id: userData.id,
          status: 'pending'
        });

      if (error) throw error;
      toast.success('Invitation sent successfully');
    } catch (error) {
      toast.error('Failed to send invitation');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const respondToInvitation = async (invitationId: string, status: EventInvitation['status']) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('event_invitations')
        .update({ status })
        .eq('id', invitationId);

      if (error) throw error;
      toast.success('Response updated successfully');
    } catch (error) {
      toast.error('Failed to update response');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    inviteUser,
    respondToInvitation,
  };
}