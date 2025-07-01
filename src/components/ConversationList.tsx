
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
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
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  loading: boolean;
}

export function ConversationList({ conversations, selectedChatId, onSelectChat, loading }: ConversationListProps) {
  if (loading) {
    return (
      <div className="flex-1 p-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-700/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-gray-400">
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs mt-1">Start a new chat to begin messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2">
      <div className="space-y-1">
        {conversations.map((conversation) => {
          const isSelected = selectedChatId === conversation.id;
          const participant = conversation.other_participant;
          const lastMessage = conversation.last_message;
          
          return (
            <div
              key={conversation.id}
              onClick={() => onSelectChat(conversation.id)}
              className={`
                p-3 rounded-lg cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'bg-purple-600/30 border border-purple-500/30' 
                  : 'hover:bg-slate-700/30'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg">
                    {participant.username?.[0]?.toUpperCase() || participant.email[0]?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white truncate">
                      {participant.username || participant.email.split('@')[0]}
                    </h3>
                    {lastMessage && (
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-400 truncate">
                      {lastMessage?.content || 'No messages yet'}
                    </p>
                    {conversation.unread_count > 0 && (
                      <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
