// components/ChatUI/Sidebar.tsx
import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  FolderIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  TrashIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Disclosure, Transition } from '@headlessui/react';
import UserAvatar from './UserAvatar';
import ThemeToggle from './ThemeToggle';

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  unread?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  conversations: Conversation[];
}

interface SidebarProps {
  user?: {
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  conversations: Conversation[];
  folders?: Folder[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation?: (id: string) => void;
  onSignOut?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  conversations,
  folders = [],
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onSignOut,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(
    conv => conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className={`
        flex flex-col h-full overflow-hidden
        ${className}
      `}
    >
      <div className="flex items-center justify-between p-3 border-b border-white/20 dark:border-gray-700/30 glass-effect-strong">
        <h2 className="text-base font-semibold gradient-text">Conversations</h2>
        
        <button
          onClick={onNewConversation}
          className="p-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-md transition-all duration-300 flex items-center"
          aria-label="New conversation"
        >
          <PlusCircleIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 py-2 border-b border-white/20 dark:border-gray-700/30">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 pl-8 text-sm rounded-lg glass-effect-light backdrop-blur-sm border-0 focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {folders.length > 0 ? (
          <div className="space-y-0.5 p-2">
            {folders.map((folder) => (
              <Disclosure key={folder.id} defaultOpen={true}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-medium text-left text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/30 rounded-lg">
                      <div className="flex items-center">
                        <FolderIcon className="h-3.5 w-3.5 mr-2 text-gray-500 dark:text-gray-400" />
                        <span>{folder.name}</span>
                      </div>
                      <svg
                        className={`${open ? 'transform rotate-90' : ''} w-3.5 h-3.5 text-gray-500 dark:text-gray-400`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Disclosure.Button>
                    
                    <Transition
                      show={open}
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel static className="pl-4 pr-2 space-y-0.5">
                        {folder.conversations.map((conversation) => (
                          <button
                            key={conversation.id}
                            onClick={() => onSelectConversation(conversation.id)}
                            className={`
                              w-full flex items-center px-2 py-1.5 text-xs rounded-lg
                              ${selectedConversationId === conversation.id 
                                ? 'sidebar-item-active glass-effect-light text-blue-700 dark:text-blue-300' 
                                : 'sidebar-item text-gray-700 dark:text-gray-300'}
                            `}
                          >
                            <ChatBubbleLeftRightIcon className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                            <div className="flex-1 truncate text-left">{conversation.title}</div>
                          </button>
                        ))}
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        ) : (
          <div className="space-y-0.5 p-2">
            {filteredConversations.map((conversation) => (
              <div key={conversation.id} className="relative group">
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`
                    w-full flex items-center px-2 py-2 text-xs rounded-lg transition-all duration-200
                    ${selectedConversationId === conversation.id 
                      ? 'sidebar-item-active glass-effect-strong backdrop-blur-md text-blue-700 dark:text-blue-300' 
                      : 'sidebar-item text-gray-700 dark:text-gray-300'}
                  `}
                >
                  <ChatBubbleLeftRightIcon className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                  
                  <div className="flex flex-col items-start overflow-hidden">
                    <div className="font-medium truncate w-full mb-0.5">
                      {conversation.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">
                      {conversation.preview}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {conversation.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                  
                  {conversation.unread && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                  )}
                </button>
                
                {onDeleteConversation && (
                  <button
                    onClick={() => onDeleteConversation(conversation.id)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-white/30 dark:hover:bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity glass-effect"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-white/20 dark:border-gray-700/30 glass-effect-strong backdrop-blur-md">
        <ThemeToggle />
        
        {user && (
          <div className="mt-3 flex items-center space-x-2">
            <UserAvatar user={user} size="xs" />
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
              {user.email && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              )}
            </div>
            
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-white/30 dark:hover:bg-gray-800/50 glass-effect"
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;