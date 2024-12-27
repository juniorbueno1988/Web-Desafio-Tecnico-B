/*
  # Calendar Event System Schema

  1. New Tables
    - events
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - title (text)
      - description (text)
      - start_time (timestamptz)
      - end_time (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - event_invitations
      - id (uuid, primary key)
      - event_id (uuid, references events)
      - invitee_id (uuid, references auth.users)
      - status (text): 'pending', 'accepted', 'declined'
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
*/

-- Events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_duration CHECK (end_time > start_time)
);

-- Event invitations table
CREATE TABLE event_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events ON DELETE CASCADE,
  invitee_id uuid REFERENCES auth.users,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_invitations ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Users can create their own events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own events"
  ON events FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM event_invitations
      WHERE event_invitations.event_id = events.id
      AND event_invitations.invitee_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for event invitations
CREATE POLICY "Event owners can create invitations"
  ON event_invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their invitations"
  ON event_invitations FOR SELECT
  TO authenticated
  USING (
    invitee_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Invitees can update their RSVP status"
  ON event_invitations FOR UPDATE
  TO authenticated
  USING (invitee_id = auth.uid())
  WITH CHECK (invitee_id = auth.uid());

-- Function to check event conflicts
CREATE OR REPLACE FUNCTION check_event_conflicts()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM events
    WHERE user_id = NEW.user_id
    AND id != NEW.id
    AND (
      (NEW.start_time, NEW.end_time) OVERLAPS (start_time, end_time)
    )
  ) THEN
    RAISE EXCEPTION 'Event time conflicts with an existing event';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for event conflicts
CREATE TRIGGER prevent_event_conflicts
  BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION check_event_conflicts();