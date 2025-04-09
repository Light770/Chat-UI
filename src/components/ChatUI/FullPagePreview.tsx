// src/components/ChatUI/FullPagePreview.tsx
import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

interface FullPagePreviewProps {
  htmlContent: string;
  onClose: () => void;
  className?: string;
}

const FullPagePreview: React.FC<FullPagePreviewProps> = ({
  htmlContent,
  onClose,
  className = '',
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Handle fullscreen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (iframeRef.current?.parentElement?.requestFullscreen) {
        iframeRef.current.parentElement.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Load HTML content into iframe
  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  }, [htmlContent]);

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Full Page Preview
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCode(!showCode)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title={showCode ? "Hide code" : "Show code"}
            >
              <CodeBracketIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={toggleFullScreen}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullScreen ? (
                <ArrowsPointingInIcon className="h-5 w-5" />
              ) : (
                <ArrowsPointingOutIcon className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Close preview"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code panel (conditional) */}
          {showCode && (
            <div className="w-2/5 border-r border-gray-200 dark:border-gray-700 overflow-auto bg-gray-50 dark:bg-gray-800">
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {htmlContent}
              </pre>
            </div>
          )}
          
          {/* Preview iframe */}
          <div className={`${showCode ? 'w-3/5' : 'w-full'} h-full bg-white`}>
            <iframe
              ref={iframeRef}
              title="HTML Preview"
              className="w-full h-full border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
          <p>Preview mode: Changes to the code will not affect this preview. Close and reopen to see updated content.</p>
        </div>
      </div>
    </div>
  );
};

export default FullPagePreview;