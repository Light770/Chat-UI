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
    <div className={`flex flex-col h-full glass-effect-colored backdrop-blur-lg ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center glass-effect p-8 rounded-2xl max-w-md">
              <h3 className="text-lg font-medium mb-2 gradient-text">Welcome to AI Assistant</h3>
              <p className="text-gray-500 dark:text-gray-300">
                Start a conversation by typing a message below. I'm here to help with your questions, tasks, and creative needs.
              </p>
            </div>
          </div>
        )}
        
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
      <div className="p-4 glass-effect backdrop-blur-md border-t border-white/20 dark:border-gray-700/30">
        <ChatInput 
          onSendMessage={onSendMessage} 
          onFileUpload={onFileUpload}
        />
      </div>
    </div>
  );
};

export default ChatContainer;