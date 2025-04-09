// components/ChatUI/ChatInput.tsx
import React, { useState, useRef } from 'react';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  MicrophoneIcon, 
  FaceSmileIcon,
  CodeBracketIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Popover } from '@headlessui/react';
import FileUploadZone from './FileUploadZone';
import CommandPalette from './CommandPalette';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload?: (files: File[]) => void;
  placeholderText?: string;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onFileUpload,
  placeholderText = "Type a message...",
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUploadComplete = (files: File[]) => {
    if (onFileUpload) {
      onFileUpload(files);
      setShowFileUpload(false);
    }
  };
  
  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="relative">
      {showFileUpload && (
        <div className="absolute bottom-full left-0 right-0 mb-2 p-4 glass-effect-strong backdrop-blur-lg rounded-lg shadow-lg border border-white/30 dark:border-gray-700/30">
          <FileUploadZone
            onFileUpload={handleFileUploadComplete}
            onCancel={() => setShowFileUpload(false)}
          />
        </div>
      )}
      
      {showCommands && (
        <div className="absolute bottom-full left-0 right-0 mb-2">
          <CommandPalette
            onSelect={(command) => {
              setShowCommands(false);
              setMessage(prev => `${prev} /${command} `);
              textareaRef.current?.focus();
            }}
            onClose={() => setShowCommands(false)}
          />
        </div>
      )}

      <div className="glass-effect rounded-xl p-1 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleResize();
              }}
              onKeyDown={handleKeyPress}
              placeholder={placeholderText}
              disabled={disabled}
              className="w-full resize-none px-4 py-3 rounded-xl glass-effect-light backdrop-blur-sm border-0 focus:ring-2 focus:ring-blue-500/50 dark:text-white min-h-[44px] max-h-[150px] bg-white/10 dark:bg-gray-800/10"
              rows={1}
              onInput={handleResize}
            />
            
            <div className="absolute top-0 right-0 flex space-x-1 p-2">
              <div className="text-gray-400 text-xs">
                {message.length > 0 ? `${message.length}/4000` : ''}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1 ml-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 glass-effect rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30"
              onClick={() => setShowFileUpload(true)}
              disabled={disabled}
            >
              <PaperClipIcon className="h-5 w-5" />
            </button>
            
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 glass-effect rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30"
              disabled={disabled}
            >
              <MicrophoneIcon className="h-5 w-5" />
            </button>
            
            <Popover className="relative">
              <Popover.Button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 glass-effect rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30">
                <CodeBracketIcon className="h-5 w-5" />
              </Popover.Button>
              <Popover.Panel className="absolute bottom-full right-0 mb-2 glass-effect-strong shadow-lg rounded-lg p-2 w-48 border border-white/30 dark:border-gray-700/30">
                <div className="space-y-1">
                  <button 
                    className="w-full text-left p-2 hover:bg-white/30 dark:hover:bg-gray-700/50 rounded flex items-center"
                    onClick={() => setMessage(prev => prev + "\n```javascript\n\n```")}
                  >
                    <span>JavaScript</span>
                  </button>
                  <button 
                    className="w-full text-left p-2 hover:bg-white/30 dark:hover:bg-gray-700/50 rounded flex items-center"
                    onClick={() => setMessage(prev => prev + "\n```python\n\n```")}
                  >
                    <span>Python</span>
                  </button>
                  <button 
                    className="w-full text-left p-2 hover:bg-white/30 dark:hover:bg-gray-700/50 rounded flex items-center"
                    onClick={() => setMessage(prev => prev + "\n```html\n\n```")}
                  >
                    <span>HTML</span>
                  </button>
                </div>
              </Popover.Panel>
            </Popover>
            
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 glass-effect rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30"
              onClick={() => setShowCommands(true)}
              disabled={disabled}
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
            
            <button
              type="submit"
              className={`p-2 rounded-full ${
                message.trim() && !disabled
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg'
                  : 'glass-effect text-gray-500 dark:text-gray-400'
              } transition-all duration-200`}
              disabled={!message.trim() || disabled}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;