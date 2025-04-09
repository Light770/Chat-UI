// components/ChatUI/MessageBubble.tsx
import React, { useState } from 'react';
import UserAvatar from './UserAvatar';
import CodeBlock from './CodeBlock';
import MessageOptions from './MessageOptions';
import MessageEdit from './MessageEdit';
import { ChatMessage, MessageType } from '../../types';
import { LightBulbIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface MessageBubbleProps {
  message: ChatMessage;
  showAvatar?: boolean;
  onMessageUpdate?: (id: string, content: string) => void;
  onRetry?: (id: string) => void;
  onThumbsUp?: (id: string) => void;
  onThumbsDown?: (id: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  showAvatar = true,
  onMessageUpdate,
  onRetry,
  onThumbsUp,
  onThumbsDown
}) => {
  const isUser = message.sender === 'user';
  const [isEditing, setIsEditing] = useState(false);
  
  const renderContent = () => {
    switch (message.type) {
      case MessageType.TEXT:
        return <p className="whitespace-pre-wrap">{message.content}</p>;
      
      case MessageType.CODE:
        return <CodeBlock code={message.content} language={message.language || 'javascript'} />;
      
      case MessageType.FILE:
        return (
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5 text-blue-500" />
            <span>{message.content}</span>
          </div>
        );
      
      case MessageType.VISUALIZATION:
        return (
          <div className="flex flex-col space-y-2">
            <ChartBarIcon className="h-5 w-5 text-purple-500" />
            <div className="glass-effect-strong backdrop-blur-md bg-white/70 dark:bg-gray-800/70 rounded-lg p-2 border border-white/30 dark:border-gray-700/30">
              {message.content}
            </div>
          </div>
        );
      
      case MessageType.AI_SUGGESTION:
        return (
          <div className="flex items-start space-x-2">
            <LightBulbIcon className="h-5 w-5 flex-shrink-0 text-yellow-500 mt-1" />
            <div>{message.content}</div>
          </div>
        );
      
      default:
        return <p>{message.content}</p>;
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };
  
  const handleModify = () => {
    setIsEditing(true);
  };
  
  const handleSaveEdit = (newContent: string) => {
    if (onMessageUpdate) {
      onMessageUpdate(message.id, newContent);
    }
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      {!isUser && showAvatar && (
        <div className="mr-2 flex-shrink-0">
          <UserAvatar user={{ name: 'AI', avatarUrl: '/ai-avatar.png' }} />
        </div>
      )}
      
      <div className="max-w-[80%] flex flex-col">
        {isEditing ? (
          <MessageEdit 
            initialContent={message.content} 
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            className={isUser ? 'bg-blue-100/30 dark:bg-blue-900/20' : ''}
          />
        ) : (
          <div className={`${
            isUser 
              ? 'message-bubble-user' 
              : 'message-bubble-ai backdrop-blur-md'
          }`}>
            {renderContent()}
            {message.timestamp && (
              <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        )}
        
        {!isEditing && (
          <MessageOptions 
            message={message}
            onModify={handleModify}
            onCopy={handleCopy}
            onThumbsUp={onThumbsUp}
            onThumbsDown={onThumbsDown}
            onRetry={onRetry}
          />
        )}
      </div>
      
      {isUser && showAvatar && (
        <div className="ml-2 flex-shrink-0">
          <UserAvatar user={{ name: 'User', avatarUrl: '/user-avatar.png' }} />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;