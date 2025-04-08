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
  Bars3Icon
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
  collapsible?: boolean;
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
  collapsible = true,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(
    conv => conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSidebar = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div 
      className={`
        relative flex flex-col h-full transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64 sm:w-72'}
        bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        ${className}
      `}
    >
      {collapsible && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md z-10"
        >
          {isCollapsed ? (
            <Bars3Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <XMarkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      )}

      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Conversations</h2>
        )}
        
        <button
          onClick={onNewConversation}
          className={`
            p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center
            ${isCollapsed ? 'w-10 h-10' : 'w-auto space-x-1'}
          `}
        >
          <PlusCircleIcon className="h-5 w-5" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {folders.length > 0 ? (
          <div className="space-y-1 p-2">
            {folders.map((folder) => (
              <Disclosure key={folder.id} defaultOpen={true}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      <div className="flex items-center">
                        <FolderIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                        {!isCollapsed && <span>{folder.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <svg
                          className={`${open ? 'transform rotate-90' : ''} w-4 h-4 text-gray-500 dark:text-gray-400`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </Disclosure.Button>
                    
                    <Transition
                      show={open && !isCollapsed}
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel static className="pl-4 pr-2 space-y-1">
                        {folder.conversations.map((conversation) => (
                          <button
                            key={conversation.id}
                            onClick={() => onSelectConversation(conversation.id)}
                            className={`
                              w-full flex items-center px-2 py-2 text-sm rounded-md
                              ${selectedConversationId === conversation.id 
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }
                            `}
                          >
                            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 flex-shrink-0" />
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
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div key={conversation.id} className="relative group">
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm rounded-md
                    ${selectedConversationId === conversation.id 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                >
                  <ChatBubbleLeftRightIcon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3 flex-shrink-0'}`} />
                  
                  {!isCollapsed && (
                    <div className="flex flex-col items-start">
                      <div className="font-medium truncate w-full">
                        {conversation.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">
                        {conversation.preview}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {conversation.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  
                  {conversation.unread && !isCollapsed && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                  )}
                </button>
                
                {onDeleteConversation && !isCollapsed && (
                  <button
                    onClick={() => onDeleteConversation(conversation.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!isCollapsed && <ThemeToggle />}
        
        {user && (
          <div className="mt-4 flex items-center space-x-3">
            <UserAvatar user={user} />
            
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                {user.email && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                )}
              </div>
            )}
            
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;