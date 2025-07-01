
import { formatDistanceToNow } from 'date-fns';

interface ConversationItemProps {
  conversation: {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    avatar: string;
    online: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        p-3 rounded-lg cursor-pointer transition-all duration-200 mx-2 mb-1
        ${isSelected 
          ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/30 shadow-lg' 
          : 'hover:bg-slate-700/30'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg font-medium">
            {conversation.avatar}
          </div>
          {conversation.online && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white truncate">
              {conversation.name}
            </h3>
            <span className="text-xs text-gray-400">
              {conversation.timestamp}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-400 truncate">
              {conversation.lastMessage}
            </p>
            {conversation.unread > 0 && (
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1.5 font-medium">
                {conversation.unread > 99 ? '99+' : conversation.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
