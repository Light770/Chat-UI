// components/ChatUI/ChatContainer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { ChatMessage } from '../../types';

interface ChatContainerProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onFileUpload?: (files: File[]) => void;
  onRetry?: (messageId: string) => void;
  isTyping?: boolean;
  className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  onFileUpload,
  onRetry,
  isTyping = false,
  className = '',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages);

  // Update local messages when the prop changes
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, isTyping]);

  const handleMessageUpdate = (id: string, content: string) => {
    // Update the message content locally
    const updatedMessages = localMessages.map(msg => 
      msg.id === id ? { ...msg, content } : msg
    );
    setLocalMessages(updatedMessages);
    
    // In a real app, you might want to sync this with a server
    // or trigger a new AI response based on the updated message
    // For simplicity in this demo, we're just updating locally
  };
  
  const handleThumbsUp = (id: string) => {
    console.log('Thumbs up for message:', id);
    // In a real app, send feedback to the server
  };
  
  const handleThumbsDown = (id: string) => {
    console.log('Thumbs down for message:', id);
    // In a real app, send feedback to the server
  };
  
  const handleRetry = (id: string) => {
    if (onRetry) {
      onRetry(id);
    } else {
      console.log('Retry message:', id);
      // In a real app, implement retry logic
    }
  };

  return (
    <div className={`flex flex-col h-full glass-effect-colored backdrop-blur-lg ${className}`}>
      <div className="flex-1 overflow-y-auto py-6 px-4 md:px-8 space-y-6 custom-scrollbar">
        {localMessages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center glass-effect p-8 rounded-2xl max-w-md">
              <h3 className="text-lg font-medium mb-2 gradient-text">Welcome to AI Assistant</h3>
              <p className="text-gray-500 dark:text-gray-300">
                Start a conversation by typing a message below. I'm here to help with your questions, tasks, and creative needs.
              </p>
            </div>
          </div>
        )}
        
        <div className="w-full max-w-5xl mx-auto space-y-6">
          {localMessages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message}
              showAvatar={index === 0 || localMessages[index - 1].sender !== message.sender}
              onMessageUpdate={handleMessageUpdate}
              onThumbsUp={handleThumbsUp}
              onThumbsDown={handleThumbsDown}
              onRetry={handleRetry}
            />
          ))}
          {isTyping && (
            <div className="w-full max-w-5xl mx-auto">
              <TypingIndicator />
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 glass-effect backdrop-blur-md border-t border-white/20 dark:border-gray-700/30">
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            onSendMessage={onSendMessage} 
            onFileUpload={onFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;