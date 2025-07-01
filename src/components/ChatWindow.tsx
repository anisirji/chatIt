
import { useEffect, useRef } from 'react';
import { MessageBubble } from '@/components/MessageBubble';
import { MessageInput } from '@/components/MessageInput';
import { Button } from '@/components/ui/button';
import { MoreVertical, Menu, Bot } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';

interface ChatWindowProps {
  conversationId: string;
  onToggleSidebar: () => void;
}

export function ChatWindow({ conversationId, onToggleSidebar }: ChatWindowProps) {
  const { user } = useAuth();
  const { messages, loading, sendMessage, isAIConversation } = useMessages(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white">Loading messages...</div>
      </div>
    );
  }

  // For AI conversations, show AI Assistant name
  const getDisplayName = () => {
    if (isAIConversation) {
      return 'AI Assistant';
    }
    
    const otherParticipant = messages[0]?.sender?.id === user?.id 
      ? messages.find(m => m.sender.id !== user?.id)?.sender
      : messages[0]?.sender;
      
    return otherParticipant?.username || otherParticipant?.email?.split('@')[0] || 'Unknown User';
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white md:hidden"
              onClick={onToggleSidebar}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
              isAIConversation 
                ? 'bg-gradient-to-br from-green-500 to-blue-500' 
                : 'bg-gradient-to-br from-purple-500 to-blue-500'
            }`}>
              {isAIConversation ? (
                <Bot className="w-5 h-5" />
              ) : (
                getDisplayName()[0]?.toUpperCase() || '?'
              )}
            </div>
            <div>
              <h2 className="font-semibold text-white flex items-center gap-2">
                {getDisplayName()}
                {isAIConversation && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    AI Assistant
                  </span>
                )}
              </h2>
              <p className="text-sm text-green-400">
                {isAIConversation ? 'Always available' : 'Online'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p>No messages yet</p>
              <p className="text-sm mt-1">
                {isAIConversation 
                  ? 'Ask the AI Assistant anything!' 
                  : 'Send a message to start the conversation'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={{
                  id: message.id,
                  content: message.content,
                  senderId: message.sender_id,
                  timestamp: new Date(message.created_at),
                  isRead: message.is_read
                }}
                isOwnMessage={message.sender_id === user?.id}
              />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0">
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
}
