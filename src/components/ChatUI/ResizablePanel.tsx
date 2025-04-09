// src/components/ChatUI/ResizablePanel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface ResizablePanelProps {
  children: React.ReactNode;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  position?: 'left' | 'right';
  onClose?: () => void;
  onResize?: (newWidth: number) => void;
  title?: string;
  className?: string;
  isVisible?: boolean;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  width = 350,
  minWidth = 250,
  maxWidth = 800,
  position = 'right',
  onClose,
  onResize,
  title,
  className = '',
  isVisible = true,
}) => {
  const [currentWidth, setCurrentWidth] = useState(width);
  const resizeRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  useEffect(() => {
    if (width !== currentWidth) {
      setCurrentWidth(width);
    }
  }, [width]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (resizeRef.current && resizeRef.current.contains(e.target as Node)) {
        isResizingRef.current = true;
        startXRef.current = e.clientX;
        startWidthRef.current = currentWidth;
        document.body.style.cursor = position === 'right' ? 'col-resize' : 'col-resize';
        document.body.style.userSelect = 'none';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      
      const delta = position === 'right' 
        ? startXRef.current - e.clientX 
        : e.clientX - startXRef.current;
      
      let newWidth = startWidthRef.current + delta;
      
      // Set min and max width limits
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      
      setCurrentWidth(newWidth);
      onResize?.(newWidth);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.removeProperty('cursor');
      document.body.style.removeProperty('user-select');
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [currentWidth, minWidth, maxWidth, onResize, position]);

  if (!isVisible) return null;

  return (
    <div className="flex h-full">
      {/* Handle for left panels */}
      {position === 'left' && (
        <div 
          ref={resizeRef}
          className="w-1 h-full bg-gray-300/50 dark:bg-gray-700/50 cursor-col-resize hover:bg-blue-500/50 transition-colors"
        />
      )}

      {/* Panel content */}
      <div 
        className={cn(
          "h-full overflow-auto transition-width duration-300 glass-effect-strong backdrop-blur-xl border-l border-white/20 dark:border-gray-700/30",
          position === 'left' ? 'border-r' : 'border-l',
          className
        )}
        style={{ width: `${currentWidth}px` }}
      >
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 dark:border-gray-700/30">
            <h2 className="text-lg font-semibold gradient-text">{title}</h2>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 glass-effect rounded-full"
                aria-label="Close panel"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>

      {/* Handle for right panels */}
      {position === 'right' && (
        <div 
          ref={resizeRef}
          className="w-1 h-full bg-gray-300/50 dark:bg-gray-700/50 cursor-col-resize hover:bg-blue-500/50 transition-colors"
        />
      )}
    </div>
  );
};

export default ResizablePanel;