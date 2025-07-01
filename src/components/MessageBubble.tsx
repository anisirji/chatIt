
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  isRead: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const timeAgo = formatDistanceToNow(message.timestamp, { addSuffix: true });

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-lg relative
            ${isOwnMessage
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md ml-8'
              : 'bg-slate-700/80 backdrop-blur-sm text-white rounded-bl-md mr-8 border border-slate-600/50'
            }
          `}
        >
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap" style={{ fontSize: '14px', lineHeight: '1.4' }}>
            {message.content}
          </p>
          
          {/* Message tail */}
          <div 
            className={`
              absolute top-3 w-3 h-3 transform rotate-45
              ${isOwnMessage 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 -right-1' 
                : 'bg-slate-700/80 -left-1 border-l border-b border-slate-600/50'
              }
            `}
          />
        </div>
        
        <div className={`mt-1 flex items-center gap-2 px-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-400">{timeAgo}</span>
          {isOwnMessage && (
            <span className={`text-xs ${message.isRead ? 'text-green-400' : 'text-gray-400'}`}>
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
