
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add participants to conversations they're in" ON public.conversation_participants;

-- Create a security definer function to check if user is in conversation
CREATE OR REPLACE FUNCTION public.user_is_conversation_participant(conversation_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.conversation_participants 
    WHERE conversation_participants.conversation_id = $1 
    AND conversation_participants.user_id = $2
  );
$$;

-- Create new policies using the security definer function
CREATE POLICY "Users can view participants in their conversations" 
ON public.conversation_participants
FOR SELECT 
USING (public.user_is_conversation_participant(conversation_participants.conversation_id, auth.uid()));

CREATE POLICY "Users can add participants to conversations they're in" 
ON public.conversation_participants
FOR INSERT 
WITH CHECK (
  -- Allow if user is adding themselves to a new conversation
  auth.uid() = user_id 
  OR 
  -- Allow if user is already a participant in the conversation
  public.user_is_conversation_participant(conversation_participants.conversation_id, auth.uid())
);

-- Update the conversations policy to use the same function
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON public.conversations;

CREATE POLICY "Users can view conversations they participate in" 
ON public.conversations
FOR SELECT 
USING (public.user_is_conversation_participant(conversations.id, auth.uid()));

-- Update the messages policy to use the same function
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;

CREATE POLICY "Users can view messages in their conversations" 
ON public.messages
FOR SELECT 
USING (public.user_is_conversation_participant(messages.conversation_id, auth.uid()));

CREATE POLICY "Users can send messages to their conversations" 
ON public.messages
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id 
  AND public.user_is_conversation_participant(messages.conversation_id, auth.uid())
);
