
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

const AI_ASSISTANT_ID = '00000000-0000-0000-0000-000000000001';

export function useAIAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const isAIConversation = (conversationId: string, messages: any[]) => {
    return messages.some(msg => msg.sender_id === AI_ASSISTANT_ID);
  };

  const sendToAI = async (message: string, conversationId: string) => {
    if (!user || isProcessing) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message,
          conversationId
        }
      });

      if (error) {
        console.error('AI Assistant error:', error);
        toast({
          title: "AI Assistant Error",
          description: "Failed to get AI response. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      toast({
        title: "Error",
        description: "Failed to communicate with AI Assistant.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isAIConversation,
    sendToAI,
    isProcessing,
    AI_ASSISTANT_ID
  };
}
