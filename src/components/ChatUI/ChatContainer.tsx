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
  isTyping?: boolean;
  className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  onFileUpload,
  isTyping = false,
  className = '',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-800 ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble 
            key={index} 
            message={message}
            showAvatar={index === 0 || messages[index - 1].sender !== message.sender}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <ChatInput 
          onSendMessage={onSendMessage} 
          onFileUpload={onFileUpload}
        />
      </div>
    </div>
  );
};

export default ChatContainer;