
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ConversationWithParticipant {
  id: string;
  created_at: string;
  updated_at: string;
  other_participant: {
    id: string;
    username: string;
    email: string;
    avatar_url?: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
  is_ai_conversation?: boolean;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Get conversations where the user is a participant
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select(`
          id,
          created_at,
          updated_at
        `);

      if (conversationError) throw conversationError;

      if (!conversationData || conversationData.length === 0) {
        setConversations([]);
        return;
      }

      // Get details for each conversation
      const conversationsWithDetails = await Promise.all(
        conversationData.map(async (conversation) => {
          // Get other participant
          const { data: otherParticipantData } = await supabase
            .from('conversation_participants')
            .select(`
              users!inner (
                id,
                username,
                email,
                avatar_url
              )
            `)
            .eq('conversation_id', conversation.id)
            .neq('user_id', user.id)
            .single();

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .neq('sender_id', user.id)
            .eq('is_read', false);

          // Check if this is an AI conversation
          const isAIConversation = otherParticipantData?.users?.id === '00000000-0000-0000-0000-000000000001';

          // If it's an AI conversation, set the display name
          let displayParticipant = otherParticipantData?.users;
          if (isAIConversation && displayParticipant) {
            displayParticipant = {
              ...displayParticipant,
              username: 'AI Assistant'
            };
          }

          return {
            id: conversation.id,
            created_at: conversation.created_at,
            updated_at: conversation.updated_at,
            other_participant: displayParticipant,
            last_message: lastMessage,
            unread_count: unreadCount || 0,
            is_ai_conversation: isAIConversation
          };
        })
      );

      setConversations(conversationsWithDetails.filter(conv => conv.other_participant));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    
    // Listen for conversation updates
    const handleConversationUpdate = () => {
      fetchConversations();
    };
    
    window.addEventListener('conversationsUpdate', handleConversationUpdate);
    
    return () => {
      window.removeEventListener('conversationsUpdate', handleConversationUpdate);
    };
  }, [user]);

  return {
    conversations,
    loading,
    refetch: fetchConversations
  };
}
