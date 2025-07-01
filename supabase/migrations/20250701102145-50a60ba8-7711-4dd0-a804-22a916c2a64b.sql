
-- Fix the conversations policy to allow creation
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON public.conversations;

-- Allow authenticated users to create conversations (they'll add themselves as participant right after)
CREATE POLICY "Users can create conversations" 
ON public.conversations
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can view conversations they participate in
CREATE POLICY "Users can view conversations they participate in" 
ON public.conversations
FOR SELECT 
USING (public.user_is_conversation_participant(conversations.id, auth.uid()));
