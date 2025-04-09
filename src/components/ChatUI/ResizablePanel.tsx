// src/components/ChatUI/ResizablePanel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
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
  const panelRef = useRef<HTMLDivElement>(null);
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
        
        // Add a class to the body during resize
        document.body.classList.add('resizing');
        
        // Prevent text selection during resize
        e.preventDefault();
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
      if (onResize) {
        onResize(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        document.body.style.removeProperty('cursor');
        document.body.style.removeProperty('user-select');
        document.body.classList.remove('resizing');
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('resizing');
    };
  }, [currentWidth, minWidth, maxWidth, onResize, position]);

  if (!isVisible) return null;

  return (
    <div className="flex h-full" ref={panelRef}>
      {/* Handle for left panels */}
      {position === 'left' && (
        <div 
          ref={resizeRef}
          className="relative w-2 h-full cursor-col-resize group"
          title="Drag to resize"
        >
          {/* Visual indicator for resize handle */}
          <div className="absolute inset-0 w-full h-full hover:bg-blue-500/10 active:bg-blue-500/20 transition-colors"></div>
          <div className="absolute inset-y-0 right-0 w-[3px] bg-gray-200 dark:bg-gray-700"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowsUpDownIcon className="h-5 w-5 rotate-90" />
          </div>
        </div>
      )}

      {/* Panel content */}
      <div 
        className={cn(
          "h-full overflow-auto transition-all duration-300 glass-effect-strong backdrop-blur-xl",
          position === 'left' ? 'border-r' : 'border-l',
          "border-white/20 dark:border-gray-700/30 shadow-lg",
          className
        )}
        style={{ width: `${currentWidth}px` }}
      >
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 dark:border-gray-700/30 backdrop-blur-md">
            <h2 className="text-lg font-semibold gradient-text">{title}</h2>
            
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentWidth}px
              </div>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 glass-effect rounded-full hover:bg-white/20 dark:hover:bg-gray-700/30"
                  aria-label="Close panel"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
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
          className="relative w-3 h-full cursor-col-resize group"
          title="Drag to resize"
        >
          {/* Visual indicator for resize handle */}
          <div className="absolute inset-0 w-full h-full hover:bg-blue-500/10 active:bg-blue-500/20 transition-colors"></div>
          <div className="absolute inset-y-0 left-0 w-[3px] bg-gray-200 dark:bg-gray-700"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowsUpDownIcon className="h-5 w-5 rotate-90" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResizablePanel;