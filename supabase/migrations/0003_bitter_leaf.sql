/*
  # Simplified Event Access Policies
  
  1. Changes
    - Remove complex policies that caused recursion
    - Implement simple, direct access controls
    - Separate policies for different operations
    
  2. Security
    - Maintain strict access control
    - Prevent unauthorized access
    - Keep policies simple and efficient
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view events they own" ON events;
DROP POLICY IF EXISTS "Users can view events they are invited to" ON events;
DROP POLICY IF EXISTS "Users can create their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Create simplified policies
CREATE POLICY "events_select_policy" ON events FOR SELECT TO authenticated
USING (
  user_id = auth.uid() OR
  id IN (
    SELECT event_id 
    FROM event_invitations 
    WHERE invitee_id = auth.uid() 
    AND status != 'declined'
  )
);

CREATE POLICY "events_insert_policy" ON events FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "events_update_policy" ON events FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "events_delete_policy" ON events FOR DELETE TO authenticated
USING (user_id = auth.uid());