// components/ChatUI/TypingIndicator.tsx
import React from 'react';
import UserAvatar from './UserAvatar';

interface TypingIndicatorProps {
  user?: {
    name: string;
    avatarUrl?: string;
  };
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  user = { name: 'AI' },
  className = '',
}) => {
  return (
    <div className={`flex items-start space-x-2 animate-fade-in ${className}`}>
      <UserAvatar user={user} size="sm" />
      <div className="glass-effect-strong backdrop-blur-md p-3 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm inline-flex space-x-1 items-center shadow-sm">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">thinking...</span>
      </div>
      
      {/* CSS for the typing animation */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        
        .typing-indicator span {
          background-color: #606060;
          border-radius: 50%;
          height: 5px;
          width: 5px;
          display: inline-block;
          margin: 0 1px;
          opacity: 0.4;
        }
        
        .typing-indicator span:nth-child(1) {
          animation: pulse 1s infinite 0.1s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation: pulse 1s infinite 0.3s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation: pulse 1s infinite 0.5s;
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
        }
        
        .dark .typing-indicator span {
          background-color: #aaa;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;