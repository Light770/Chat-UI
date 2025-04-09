// components/ChatUI/MessageOptions.tsx
import React, { useState } from 'react';
import { 
  PencilIcon, 
  ClipboardIcon, 
  ClipboardDocumentCheckIcon,
  HandThumbUpIcon, 
  HandThumbDownIcon, 
  ArrowPathIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface MessageOptionsProps {
  message: ChatMessage;
  onModify?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onThumbsUp?: (messageId: string) => void;
  onThumbsDown?: (messageId: string) => void;
  onRetry?: (messageId: string) => void;
  className?: string;
}

const MessageOptions: React.FC<MessageOptionsProps> = ({
  message,
  onModify,
  onCopy,
  onThumbsUp,
  onThumbsDown,
  onRetry,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const isUserMessage = message.sender === 'user';
  
  // Estimate token count (rough estimation for demo purposes)
  const estimateTokenCount = (text: string) => {
    // Simple estimation: ~4 chars per token on average
    return Math.ceil(text.length / 4);
  };
  
  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
    } else {
      navigator.clipboard.writeText(message.content);
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={cn(
      "flex items-center mt-1 text-xs",
      isUserMessage ? "justify-end" : "justify-start",
      className
    )}>
      <div className={cn(
        "flex items-center space-x-2 glass-effect-light py-1 px-2 rounded-full",
        isUserMessage ? "bg-blue-50/30 dark:bg-blue-900/20" : "bg-gray-50/30 dark:bg-gray-800/20"
      )}>
        {isUserMessage ? (
          // User message options
          <button
            onClick={() => onModify && onModify(message.id)}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            title="Modify message"
          >
            <PencilIcon className="h-3.5 w-3.5" />
          </button>
        ) : (
          // AI message options
          <>
            <span 
              className="text-gray-500 dark:text-gray-400 flex items-center" 
              title="Estimated token count"
            >
              <DocumentTextIcon className="h-3.5 w-3.5 mr-1" />
              <span>{estimateTokenCount(message.content)}</span>
            </span>
            
            <span 
              className="text-gray-500 dark:text-gray-400"
              title="AI Model"
            >
              GPT-4
            </span>
            
            <button
              onClick={handleCopy}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              title="Copy message"
            >
              {copied ? (
                <ClipboardDocumentCheckIcon className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <ClipboardIcon className="h-3.5 w-3.5" />
              )}
            </button>
            
            <button
              onClick={() => onThumbsUp && onThumbsUp(message.id)}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              title="Thumbs up"
            >
              <HandThumbUpIcon className="h-3.5 w-3.5" />
            </button>
            
            <button
              onClick={() => onThumbsDown && onThumbsDown(message.id)}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              title="Thumbs down"
            >
              <HandThumbDownIcon className="h-3.5 w-3.5" />
            </button>
            
            <button
              onClick={() => onRetry && onRetry(message.id)}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              title="Retry"
            >
              <ArrowPathIcon className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageOptions;