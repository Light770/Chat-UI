// components/ChatUI/FileViewer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  DocumentIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  DocumentChartBarIcon,
  ArchiveIcon,
  CodeBracketIcon,
  TableCellsIcon,
  MusicalNoteIcon,
  FilmIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';
import CodeBlock from './CodeBlock';

export type FileType = 'pdf' | 'image' | 'spreadsheet' | 'document' | 'code' | 'audio' | 'video' | 'archive' | 'other';

export interface FileData {
  id: string;
  name: string;
  type: FileType;
  size: number;
  url?: string;
  content?: string;
  preview?: string;
  lastModified?: Date;
}

interface FileViewerProps {
  file: FileData;
  onClose?: () => void;
  className?: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ file, onClose, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [previewHeight, setPreviewHeight] = useState(400);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Adjust preview height based on container
  useEffect(() => {
    if (containerRef.current) {
      const updateHeight = () => {
        if (!containerRef.current) return;
        
        // Get container height and subtract header height
        const containerHeight = containerRef.current.clientHeight;
        const headerHeight = 80; // Approx. header height
        const tabsHeight = 40; // Approx. tabs height
        const padding = 40; // Some padding
        
        const availableHeight = containerHeight - headerHeight - tabsHeight - padding;
        setPreviewHeight(Math.max(300, availableHeight));
      };
      
      updateHeight();
      
      // Setup resize observer to update height when container resizes
      const resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });
      
      resizeObserver.observe(containerRef.current);
      
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }
  }, []);
  
  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'pdf':
        return <DocumentTextIcon className="h-8 w-8 text-red-500" />;
      case 'image':
        return <PhotoIcon className="h-8 w-8 text-blue-500" />;
      case 'spreadsheet':
        return <TableCellsIcon className="h-8 w-8 text-green-500" />;
      case 'document':
        return <DocumentIcon className="h-8 w-8 text-blue-700" />;
      case 'code':
        return <CodeBracketIcon className="h-8 w-8 text-purple-500" />;
      case 'audio':
        return <MusicalNoteIcon className="h-8 w-8 text-yellow-500" />;
      case 'video':
        return <FilmIcon className="h-8 w-8 text-pink-500" />;
      case 'archive':
        return <ArchiveIcon className="h-8 w-8 text-gray-500" />;
      default:
        return <DocumentChartBarIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreview = () => {
    if (!isExpanded) return null;
    
    switch (file.type) {
      case 'image':
        return (
          <div className="mt-4 flex justify-center">
            {file.url && (
              <img 
                src={file.url} 
                alt={file.name} 
                className="max-w-full object-contain rounded-lg" 
                style={{ maxHeight: `${previewHeight}px` }}
              />
            )}
          </div>
        );
        
      case 'pdf':
        return (
          <div className="mt-4 glass-effect rounded-xl p-4 flex flex-col items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">PDF Preview</p>
            {file.url ? (
              <iframe 
                src={`${file.url}#toolbar=0`} 
                className="w-full border-0 rounded-lg"
                title={file.name}
                style={{ height: `${previewHeight}px` }}
              />
            ) : (
              <div className="flex items-center justify-center h-40 w-full border-2 border-dashed border-white/30 dark:border-gray-600/50 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">Preview not available</p>
              </div>
            )}
          </div>
        );
        
      case 'code':
        return (
          <div className="mt-4">
            <CodeBlock 
              code={file.content || '// No code content available'} 
              language={file.name.split('.').pop() || 'javascript'} 
            />
          </div>
        );
        
      case 'spreadsheet':
        return (
          <div className="mt-4 overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="glass-effect border border-white/30 dark:border-gray-700/30 rounded-xl">
                <table className="min-w-full divide-y divide-white/20 dark:divide-gray-700/30">
                  <thead className="bg-white/10 dark:bg-gray-800/30">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preview Only</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Column A</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Column B</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20 dark:divide-gray-700/30">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Row 1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Data 1-A</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Data 1-B</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Row 2</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Data 2-A</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Data 2-B</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">This is a simplified preview. Use the analysis tools for full data exploration.</p>
            </div>
          </div>
        );
        
      case 'audio':
        return (
          <div className="mt-4">
            {file.url ? (
              <audio controls className="w-full rounded-lg glass-effect p-2">
                <source src={file.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <div className="flex items-center justify-center h-16 w-full border-2 border-dashed border-white/30 dark:border-gray-600/50 rounded-lg glass-effect">
                <p className="text-gray-500 dark:text-gray-400">Audio preview not available</p>
              </div>
            )}
          </div>
        );
        
      case 'video':
        return (
          <div className="mt-4">
            {file.url ? (
              <video 
                controls 
                className="w-full rounded-lg glass-effect"
                style={{ maxHeight: `${previewHeight}px` }}
              >
                <source src={file.url} type="video/mp4" />
                Your browser does not support the video element.
              </video>
            ) : (
              <div className="flex items-center justify-center h-40 w-full border-2 border-dashed border-white/30 dark:border-gray-600/50 rounded-lg glass-effect">
                <p className="text-gray-500 dark:text-gray-400">Video preview not available</p>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="mt-4 p-4 glass-effect rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Preview not available for this file type</p>
          </div>
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`glass-effect rounded-2xl backdrop-blur-md overflow-hidden h-full ${className}`}
    >
      <div className="p-4 border-b border-white/20 dark:border-gray-700/30 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {getFileIcon(file.type)}
          <div>
            <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate max-w-xs">{file.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/30 glass-effect"
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          
          {file.url && (
            <a 
              href={file.url}
              download={file.name}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/30 glass-effect"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 overflow-auto" style={{ maxHeight: `calc(100% - 80px)` }}>
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl glass-effect p-1">
              <Tab
                className={({ selected }) =>
                  `w-full py-2 text-sm font-medium leading-5 rounded-lg transition-all duration-200
                  ${selected 
                    ? 'bg-white/70 dark:bg-gray-800/70 shadow-md text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
                  }`
                }
              >
                Preview
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full py-2 text-sm font-medium leading-5 rounded-lg transition-all duration-200
                  ${selected 
                    ? 'bg-white/70 dark:bg-gray-800/70 shadow-md text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
                  }`
                }
              >
                Details
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="focus:outline-none">
                {renderPreview()}
              </Tab.Panel>
              <Tab.Panel className="p-3 glass-effect rounded-xl focus:outline-none">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">File Name</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{file.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 capitalize">{file.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Size</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatFileSize(file.size)}</p>
                  </div>
                  {file.lastModified && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Modified</p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {file.lastModified.toLocaleDateString()} {file.lastModified.toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </div>
  );
};

export default FileViewer;