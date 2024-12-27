/*
  # Fix Recursive Policies
  
  1. Changes
    - Remove all existing policies
    - Create simple, non-recursive policies
    - Use direct joins instead of subqueries
    
  2. Security
    - Maintain row-level security
    - Simplify access control logic
    - Prevent policy recursion
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "events_select_policy" ON events;
DROP POLICY IF EXISTS "events_insert_policy" ON events;
DROP POLICY IF EXISTS "events_update_policy" ON events;
DROP POLICY IF EXISTS "events_delete_policy" ON events;
DROP POLICY IF EXISTS "Event owners can create invitations" ON event_invitations;
DROP POLICY IF EXISTS "Users can view their invitations" ON event_invitations;
DROP POLICY IF EXISTS "Invitees can update their RSVP status" ON event_invitations;

-- Simple events policies
CREATE POLICY "select_own_events"
  ON events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "insert_own_events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_events"
  ON events FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "delete_own_events"
  ON events FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Simple event_invitations policies
CREATE POLICY "select_invitations"
  ON event_invitations FOR SELECT
  TO authenticated
  USING (
    invitee_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_invitations.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "insert_invitations"
  ON event_invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "update_own_invitations"
  ON event_invitations FOR UPDATE
  TO authenticated
  USING (invitee_id = auth.uid())
  WITH CHECK (invitee_id = auth.uid());