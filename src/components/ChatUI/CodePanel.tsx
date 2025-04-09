// components/ChatUI/CodePanel.tsx
import React, { useState } from 'react';
import { 
  XMarkIcon, 
  ClipboardDocumentIcon, 
  ClipboardDocumentCheckIcon,
  PlayIcon,
  CodeBracketIcon,
  ArrowPathIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface CodePanelProps {
  code: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  onClose?: () => void;
  isMobile?: boolean;
  className?: string;
  readOnly?: boolean;
}

const CodePanel: React.FC<CodePanelProps> = ({
  code,
  language = 'javascript',
  onCodeChange,
  onClose,
  isMobile = false,
  className = '',
  readOnly = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format language display
  const formatLanguage = (lang: string) => {
    const langMap: Record<string, string> = {
      'js': 'JavaScript',
      'javascript': 'JavaScript',
      'ts': 'TypeScript',
      'typescript': 'TypeScript',
      'py': 'Python',
      'python': 'Python',
      'jsx': 'React JSX',
      'tsx': 'React TSX',
      'html': 'HTML',
      'css': 'CSS',
      'json': 'JSON',
      'md': 'Markdown',
      'bash': 'Shell',
      'sh': 'Shell',
    };

    return langMap[lang.toLowerCase()] || lang;
  };

  // Tabs for code panel
  const tabs = [
    { id: 'code', label: 'Code', icon: <CodeBracketIcon className="h-4 w-4" /> },
    { id: 'preview', label: 'Preview', icon: <PlayIcon className="h-4 w-4" /> },
  ];

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 dark:border-gray-700/30">
        <div className="flex items-center space-x-4">
          <div className="gradient-text font-medium">{formatLanguage(language)}</div>
          
          {/* Tabs */}
          <div className="hidden md:flex border rounded-lg glass-effect-light overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-3 py-1 text-sm flex items-center space-x-1 transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white/30 dark:bg-gray-800/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-white/10 dark:hover:bg-gray-800/10'
                }`}
                onClick={() => setActiveTab(tab.id as 'code' | 'preview')}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 glass-effect rounded-full"
            title="Copy code"
          >
            {copied ? (
              <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ClipboardDocumentIcon className="h-4 w-4" />
            )}
          </button>
          
          <button
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 glass-effect rounded-full"
            title="Run code"
          >
            <PlayIcon className="h-4 w-4" />
          </button>
          
          <button
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 glass-effect rounded-full"
            title="Format code"
          >
            <CogIcon className="h-4 w-4" />
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 glass-effect rounded-full"
              title="Close panel"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'code' ? (
          <div className="h-full overflow-auto bg-gray-900/95 backdrop-blur-md text-gray-200">
            <div className="p-4 font-mono text-sm whitespace-pre overflow-x-auto">
              {readOnly ? (
                <pre>{code}</pre>
              ) : (
                <textarea
                  value={code}
                  onChange={(e) => onCodeChange?.(e.target.value)}
                  className="w-full h-full bg-transparent border-0 focus:ring-0 resize-none font-mono p-0 text-sm"
                  style={{ minHeight: '300px' }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm">
            <div className="p-8 glass-effect rounded-lg text-center">
              <PlayIcon className="h-10 w-10 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Preview not available</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Code execution is not supported in this demo version.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/20 dark:border-gray-700/30 bg-gray-800/20 backdrop-blur-sm">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {code.split('\n').length} lines
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isMobile ? 'Tap' : 'Drag'} {isMobile ? 'header' : 'divider'} to resize
          </span>
          
          <div className="glass-effect px-2 py-1 rounded-full flex items-center space-x-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Auto Save</span>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePanel;