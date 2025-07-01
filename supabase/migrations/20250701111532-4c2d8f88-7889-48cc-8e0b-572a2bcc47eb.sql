
-- Create a special AI Assistant user
INSERT INTO public.users (id, email, username, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'ai-assistant@chatapp.com',
  'AI Assistant',
  null
)
ON CONFLICT (id) DO NOTHING;

-- Create a function to automatically create AI Assistant conversation for new users
CREATE OR REPLACE FUNCTION public.create_ai_assistant_conversation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conversation_id uuid;
BEGIN
  -- Create a new conversation
  INSERT INTO public.conversations DEFAULT VALUES
  RETURNING id INTO conversation_id;
  
  -- Add the new user as a participant
  INSERT INTO public.conversation_participants (conversation_id, user_id)
  VALUES (conversation_id, NEW.id);
  
  -- Add the AI Assistant as a participant
  INSERT INTO public.conversation_participants (conversation_id, user_id)
  VALUES (conversation_id, '00000000-0000-0000-0000-000000000001');
  
  -- Send welcome message from AI Assistant
  INSERT INTO public.messages (conversation_id, sender_id, content)
  VALUES (
    conversation_id,
    '00000000-0000-0000-0000-000000000001',
    'Hello! I''m your AI Assistant. I''m here to help you with any questions or just have a friendly chat. How can I assist you today?'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to run the function when a new user is created
DROP TRIGGER IF EXISTS on_user_created_ai_conversation ON public.users;
CREATE TRIGGER on_user_created_ai_conversation
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_ai_assistant_conversation();
