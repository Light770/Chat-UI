import React, { ReactNode } from 'react';
import { Popover } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface ToolbarButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
  className
}) => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            as="button"
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "p-2 rounded-full glass-effect transition-all duration-200 ease-in-out",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              active 
                ? "bg-blue-100/30 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shadow-md" 
                : "hover:bg-white/20 dark:hover:bg-gray-800/30",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            {icon}
          </Popover.Button>
          
          <Popover.Panel 
            className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 
                       mb-2 glass-effect text-gray-800 dark:text-white text-xs 
                       px-3 py-1 rounded-full shadow-lg backdrop-blur-md
                       opacity-0 group-hover:opacity-100 
                       transition-opacity duration-300"
          >
            {label}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default ToolbarButton;