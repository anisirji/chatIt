
-- Update the AI assistant conversation creation function to handle timing issues
CREATE OR REPLACE FUNCTION public.create_ai_assistant_conversation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conversation_id uuid;
BEGIN
  -- Wait a moment for the user record to be fully committed
  PERFORM pg_sleep(0.1);
  
  -- Verify the user exists before proceeding
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    RAISE LOG 'User % not found when creating AI conversation', NEW.id;
    RETURN NEW;
  END IF;
  
  -- Create a new conversation
  INSERT INTO public.conversations DEFAULT VALUES
  RETURNING id INTO conversation_id;
  
  -- Add the new user as a participant
  INSERT INTO public.conversation_participants (conversation_id, user_id)
  VALUES (conversation_id, NEW.id);
  
  -- Add the AI Assistant as a participant (ensure AI user exists)
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
EXCEPTION
  WHEN foreign_key_violation THEN
    RAISE LOG 'Foreign key violation creating AI conversation for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
  WHEN others THEN
    RAISE LOG 'Error creating AI conversation for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;
