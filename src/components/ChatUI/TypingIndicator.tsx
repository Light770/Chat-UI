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
    <div className={`flex items-start space-x-2 ${className}`}>
      <UserAvatar user={user} size="sm" />
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg inline-flex space-x-1 items-center">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">typing...</span>
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
      `}</style>
    </div>
  );
};

export default TypingIndicator;