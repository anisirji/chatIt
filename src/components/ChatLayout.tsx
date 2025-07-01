
import { useState } from 'react';
import { User, LogOut, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import { ConversationList } from '@/components/ConversationList';
import { ChatWindow } from '@/components/ChatWindow';
import { NewConversationModal } from '@/components/NewConversationModal';

export function ChatLayout() {
  const { user, signOut } = useAuth();
  const { conversations, loading, refetch } = useConversations();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    conv.other_participant?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_participant?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNewConversationModal(true);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative z-50 md:z-0 transition-transform duration-300 ease-in-out
        w-80 h-full bg-slate-800/40 backdrop-blur-sm border-r border-slate-700/50
        md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-700/50 bg-slate-800/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-white text-sm">
                    {user?.user_metadata?.username || user?.email?.split('@')[0]}
                  </h2>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-purple-500 h-10"
              />
            </div>

            {/* New Conversation Button - moved outside of map */}
            <Button
              onClick={handleNewChatClick}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-hidden">
            <ConversationList
              conversations={filteredConversations}
              selectedChatId={selectedChatId}
              onSelectChat={(chatId) => {
                setSelectedChatId(chatId);
                setIsSidebarOpen(false); // Close sidebar on mobile when chat is selected
              }}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedChatId ? (
          <ChatWindow 
            conversationId={selectedChatId} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="text-center text-gray-400 max-w-md mx-auto p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 opacity-50" />
              </div>
              <h2 className="text-2xl font-medium mb-3 text-white">Welcome to ChatApp</h2>
              <p className="text-gray-400 mb-6">Select a conversation to start messaging or create a new chat</p>
              <Button
                onClick={handleNewChatClick}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={showNewConversationModal}
        onClose={() => setShowNewConversationModal(false)}
        onConversationCreated={(conversationId) => {
          setSelectedChatId(conversationId);
          setShowNewConversationModal(false);
          refetch();
        }}
      />
    </div>
  );
}
