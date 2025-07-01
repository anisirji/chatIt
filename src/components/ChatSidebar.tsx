
import { useState } from 'react';
import { Search, Plus, Settings, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConversationItem } from '@/components/ConversationItem';

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedChat: string;
  onSelectChat: (chatId: string) => void;
}

const mockConversations = [
  {
    id: 'john-doe',
    name: 'John Doe',
    lastMessage: 'Hey! How are you doing?',
    timestamp: '2 min ago',
    unread: 2,
    avatar: '👤',
    online: true
  },
  {
    id: 'jane-smith',
    name: 'Jane Smith',
    lastMessage: 'The project looks great!',
    timestamp: '1 hour ago',
    unread: 0,
    avatar: '👩',
    online: true
  },
  {
    id: 'mike-wilson',
    name: 'Mike Wilson',
    lastMessage: 'Thanks for the help yesterday',
    timestamp: '3 hours ago',
    unread: 1,
    avatar: '👨',
    online: false
  },
  {
    id: 'sarah-johnson',
    name: 'Sarah Johnson',
    lastMessage: 'Let\'s schedule a meeting',
    timestamp: '1 day ago',
    unread: 0,
    avatar: '👩‍💼',
    online: false
  }
];

export function ChatSidebar({ isOpen, onToggle, selectedChat, onSelectChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative z-50 h-full w-80 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${!isOpen ? 'md:w-0 md:overflow-hidden' : ''}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-white">Messages</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-white md:hidden"
                  onClick={onToggle}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-purple-500"
              />
            </div>
          </div>
          
          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedChat === conversation.id}
                  onClick={() => onSelectChat(conversation.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Button */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-30 md:hidden text-white"
          onClick={onToggle}
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
    </>
  );
}
