/*
  # Fix Events Table Policies

  1. Changes
    - Simplify RLS policies to prevent recursion
    - Separate policies for owners and invitees
    - Remove complex subqueries that could cause recursion
    
  2. Security
    - Maintain data access control
    - Ensure users can only access their own events or events they're invited to
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own events" ON events;

-- Create separate policies for owners and invitees
CREATE POLICY "Users can view events they own"
  ON events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view events they are invited to"
  ON events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM event_invitations 
      WHERE event_invitations.event_id = events.id 
      AND event_invitations.invitee_id = auth.uid()
      AND event_invitations.status != 'declined'
    )
  );