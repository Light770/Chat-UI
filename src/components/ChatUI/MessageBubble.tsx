// src/components/ChatUI/MessageBubble.tsx
import React, { useState } from 'react';
import UserAvatar from './UserAvatar';
import CodeBlock from './CodeBlock';
import MessageOptions from './MessageOptions';
import MessageEdit from './MessageEdit';
import { ChatMessage, MessageType } from '../../types';
import { 
  LightBulbIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CodeBracketIcon,
  ArrowsPointingOutIcon 
} from '@heroicons/react/24/outline';

// Temporary placeholder for FullPagePreview until we fix it
const FullPagePreview = ({ htmlContent, onClose }: { htmlContent: string, onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium">Full Page Preview</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <iframe 
          srcDoc={htmlContent}
          title="HTML Preview"
          className="w-full h-full border-0 bg-white"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  </div>
);

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
  const [showFullPreview, setShowFullPreview] = useState(false);
  
  const renderContent = () => {
    switch (message.type) {
      case MessageType.TEXT:
        return <p className="whitespace-pre-wrap">{message.content}</p>;
      
      case MessageType.CODE:
        // Detect if the code is HTML to use the appropriate language highlighting
        const isHTML = message.language === 'html' || 
                      (message.content.trim().startsWith('<') && message.content.includes('</'));
        const isCSS = message.language === 'css';
        
        return (
          <div className="w-full">
            {(isHTML || isCSS) && (
              <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                <div className="flex items-center">
                  <CodeBracketIcon className="h-4 w-4 mr-1" />
                  <span>{isHTML ? 'HTML' : 'CSS'} Preview</span>
                </div>
                
                {isHTML && (
                  <button 
                    onClick={() => {
                      // Set the code in the code panel
                      if (window && typeof window.updateCodePanel === 'function') {
                        window.updateCodePanel(message.content, 'html');
                      }
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs flex items-center"
                  >
                    <ArrowsPointingOutIcon className="h-3.5 w-3.5 mr-1" />
                    Edit in Code Panel
                  </button>
                )}
              </div>
            )}
            
            <CodeBlock 
              code={message.content} 
              language={message.language || (isHTML ? 'html' : 'javascript')} 
              showLineNumbers={true}
            />
            
            {/* Add HTML preview if applicable but not in a dialog */}
            {isHTML && (
              <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Rendered Result:
                </div>
                <div className="glass-effect bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg overflow-hidden">
                  <div 
                    className="html-preview text-sm" 
                    dangerouslySetInnerHTML={{ __html: message.content }} 
                  />
                </div>
              </div>
            )}
            
            {/* Add CSS preview if applicable */}
            {isCSS && (
              <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Example Applied:
                </div>
                <div className="css-preview-container glass-effect bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <style dangerouslySetInnerHTML={{ __html: message.content }} />
                  <div className="css-preview flex flex-wrap gap-2">
                    <div className="preview-box w-24 h-24 bg-blue-500 rounded">Box 1</div>
                    <div className="preview-box w-24 h-24 bg-green-500 rounded">Box 2</div>
                    <div className="preview-box w-24 h-24 bg-purple-500 rounded">Box 3</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Full page preview modal */}
            {showFullPreview && isHTML && (
              <FullPagePreview 
                htmlContent={message.content}
                onClose={() => setShowFullPreview(false)}
              />
            )}
          </div>
        );
      
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
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
      {!isUser && showAvatar && (
        <div className="mr-3 flex-shrink-0">
          <UserAvatar user={{ name: 'AI', avatarUrl: '/ai-avatar.png' }} />
        </div>
      )}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] w-full`}>
        {isEditing ? (
          <MessageEdit 
            initialContent={message.content} 
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            className={isUser ? 'bg-blue-100/30 dark:bg-blue-900/20 w-full' : 'w-full'}
          />
        ) : (
          <div className={`
            w-full rounded-2xl px-4 py-3 shadow-sm
            ${isUser 
              ? 'message-bubble-user bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
              : 'message-bubble-ai glass-effect-strong text-gray-900 dark:text-white'}
          `}>
            {renderContent()}
            {message.timestamp && (
              <div className={`text-xs mt-2 ${isUser ? 'text-blue-100 text-right' : 'text-gray-500 dark:text-gray-400'}`}>
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
            className="mt-1.5"
          />
        )}
      </div>
      
      {isUser && showAvatar && (
        <div className="ml-3 flex-shrink-0">
          <UserAvatar user={{ name: 'User', avatarUrl: '/user-avatar.png' }} />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;