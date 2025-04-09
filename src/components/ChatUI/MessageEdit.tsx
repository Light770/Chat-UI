// components/ChatUI/MessageEdit.tsx
import React, { useState, useEffect, useRef } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface MessageEditProps {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  className?: string;
}

const MessageEdit: React.FC<MessageEditProps> = ({
  initialContent,
  onSave,
  onCancel,
  className = '',
}) => {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus the textarea and set cursor at the end
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(content.length, content.length);
      
      // Auto-resize the textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSave(content);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("glass-effect rounded-xl p-2", className)}>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          handleResize();
        }}
        className="w-full resize-none px-3 py-2 rounded-lg glass-effect-light backdrop-blur-sm border-0 focus:ring-2 focus:ring-blue-500/50 dark:text-white min-h-[60px] bg-white/10 dark:bg-gray-800/10"
        placeholder="Edit your message..."
      />
      
      <div className="flex justify-end space-x-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 glass-effect rounded-full"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
        
        <button
          type="submit"
          className="p-1.5 text-white bg-blue-500 hover:bg-blue-600 rounded-full"
        >
          <CheckIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

export default MessageEdit;