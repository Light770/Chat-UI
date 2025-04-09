// components/ChatUI/CommandPalette.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  ChartBarIcon,
  TableCellsIcon,
  PhotoIcon,
  WrenchIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface Command {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  example?: string;
}

interface CommandPaletteProps {
  onSelect: (commandId: string) => void;
  onClose: () => void;
  className?: string;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  onSelect,
  onClose,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const commands: Command[] = [
    {
      id: 'generate_code',
      name: 'Generate Code',
      description: 'Create a code snippet or full program',
      icon: <CodeBracketIcon className="h-5 w-5" />,
      category: 'Development',
      example: 'generate_code react component for a login form'
    },
    {
      id: 'explain_code',
      name: 'Explain Code',
      description: 'Get an explanation of provided code',
      icon: <CodeBracketIcon className="h-5 w-5" />,
      category: 'Development',
      example: 'explain_code <paste your code here>'
    },
    {
      id: 'summarize',
      name: 'Summarize Text',
      description: 'Create a summary of the provided text',
      icon: <DocumentTextIcon className="h-5 w-5" />,
      category: 'Content',
      example: 'summarize <paste your text here>'
    },
    {
      id: 'data_visualization',
      name: 'Data Visualization',
      description: 'Create a visualization from data',
      icon: <ChartBarIcon className="h-5 w-5" />,
      category: 'Data',
      example: 'data_visualization <describe what you want>'
    },
    {
      id: 'analyze_data',
      name: 'Analyze Data',
      description: 'Perform analysis on your data',
      icon: <TableCellsIcon className="h-5 w-5" />,
      category: 'Data',
      example: 'analyze_data <describe what to analyze>'
    },
    {
      id: 'generate_image_description',
      name: 'Generate Image Description',
      description: 'Create a detailed description for an image',
      icon: <PhotoIcon className="h-5 w-5" />,
      category: 'Content',
      example: 'generate_image_description <describe the image>'
    },
    {
      id: 'format_content',
      name: 'Format Content',
      description: 'Reformat text with proper structure',
      icon: <DocumentTextIcon className="h-5 w-5" />,
      category: 'Content',
      example: 'format_content <paste your text here>'
    },
    {
      id: 'system_settings',
      name: 'System Settings',
      description: 'Configure AI settings and behavior',
      icon: <WrenchIcon className="h-5 w-5" />,
      category: 'System',
      example: 'system_settings'
    },
    {
      id: 'regenerate',
      name: 'Regenerate Response',
      description: 'Ask the AI to try again with a new response',
      icon: <ArrowPathIcon className="h-5 w-5" />,
      category: 'System',
      example: 'regenerate'
    },
    {
      id: 'help',
      name: 'Help',
      description: 'Get assistance with using the system',
      icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
      category: 'System',
      example: 'help'
    }
  ];

  const filteredCommands = commands.filter(command => {
    const searchLower = searchTerm.toLowerCase();
    return (
      command.name.toLowerCase().includes(searchLower) ||
      command.description.toLowerCase().includes(searchLower) ||
      command.category.toLowerCase().includes(searchLower)
    );
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce<Record<string, Command[]>>((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {});

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Reset selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prevIndex => 
          prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onSelect(filteredCommands[selectedIndex].id);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  return (
    <div 
      className={`glass-effect backdrop-blur-xl rounded-xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden ${className}`}
      onKeyDown={handleKeyDown}
    >
      <div className="p-4 border-b border-white/20 dark:border-gray-700/30 flex items-center">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search commands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button 
          onClick={onClose}
          className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 glass-effect"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {Object.entries(groupedCommands).length > 0 ? (
          Object.entries(groupedCommands).map(([category, categoryCommands]) => (
            <div key={category} className="py-2">
              <div className="px-4 py-1 text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                {category}
              </div>
              <div className="mt-1">
                {categoryCommands.map((command, index) => {
                  const commandIndex = filteredCommands.findIndex(c => c.id === command.id);
                  const isSelected = commandIndex === selectedIndex;
                  
                  return (
                    <button
                      key={command.id}
                      className={`
                        w-full text-left px-4 py-2 flex items-start space-x-3 transition-all duration-200
                        ${isSelected ? 'bg-blue-50/30 dark:bg-blue-900/30' : 'hover:bg-white/20 dark:hover:bg-gray-700/20'}
                      `}
                      onClick={() => onSelect(command.id)}
                      onMouseEnter={() => setSelectedIndex(commandIndex)}
                    >
                      <div className={`p-1 rounded-lg ${isSelected ? 'text-blue-600 dark:text-blue-400 glass-effect' : 'text-gray-500 dark:text-gray-400'}`}>
                        {command.icon}
                      </div>
                      <div>
                        <div className={`font-medium ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                          {command.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {command.description}
                        </div>
                        {command.example && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
                            Example: /{command.example}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No commands found matching "{searchTerm}"
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 border-t border-white/20 dark:border-gray-700/30 glass-effect text-xs text-gray-500 dark:text-gray-400">
        Press <kbd className="px-2 py-1 glass-effect rounded text-gray-800 dark:text-gray-300 font-mono">↑</kbd> <kbd className="px-2 py-1 glass-effect rounded text-gray-800 dark:text-gray-300 font-mono">↓</kbd> to navigate, <kbd className="px-2 py-1 glass-effect rounded text-gray-800 dark:text-gray-300 font-mono">Enter</kbd> to select, <kbd className="px-2 py-1 glass-effect rounded text-gray-800 dark:text-gray-300 font-mono">Esc</kbd> to dismiss
      </div>
    </div>
  );
};

export default CommandPalette;