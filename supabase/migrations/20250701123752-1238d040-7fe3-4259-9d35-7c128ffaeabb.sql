
-- Recreate the trigger to automatically create AI conversations for new users
DROP TRIGGER IF EXISTS on_user_created_ai_conversation ON public.users;
CREATE TRIGGER on_user_created_ai_conversation
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_ai_assistant_conversation();

-- Also make sure the AI Assistant user exists
INSERT INTO public.users (id, email, username, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'ai-assistant@chatapp.com',
  'AI Assistant',
  null
)
ON CONFLICT (id) DO NOTHING;
