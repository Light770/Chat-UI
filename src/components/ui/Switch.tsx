import React from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /**
   * Is the switch checked/active?
   */
  checked: boolean;
  /**
   * Function called when the switch state changes
   */
  onChange: (checked: boolean) => void;
  /**
   * Optional label for the switch
   */
  label?: string;
  /**
   * Position of the label
   */
  labelPosition?: 'left' | 'right';
  /**
   * Size of the switch
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color of the switch when active
   */
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gray';
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({
    checked,
    onChange,
    label,
    labelPosition = 'right',
    size = 'md',
    color = 'blue',
    disabled = false,
    className = '',
    id,
    ...props
  }, ref) => {
    // Generate a unique ID if not provided
    const switchId = id || `switch-${Math.random().toString(36).substring(2, 11)}`;
    
    // Size styles
    const sizeStyles = {
      sm: {
        switch: 'h-4 w-7',
        thumb: 'h-3 w-3',
        translateX: 'translate-x-3',
      },
      md: {
        switch: 'h-6 w-11',
        thumb: 'h-4 w-4',
        translateX: 'translate-x-5',
      },
      lg: {
        switch: 'h-7 w-14',
        thumb: 'h-5 w-5',
        translateX: 'translate-x-7',
      },
    };
    
    // Color styles
    const colorStyles = {
      blue: 'bg-blue-600 dark:bg-blue-500',
      green: 'bg-green-600 dark:bg-green-500',
      red: 'bg-red-600 dark:bg-red-500',
      purple: 'bg-purple-600 dark:bg-purple-500',
      gray: 'bg-gray-600 dark:bg-gray-500',
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        onChange(e.target.checked);
      }
    };
    
    const switchClasses = [
      'relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      checked ? colorStyles[color] : 'bg-gray-200 dark:bg-gray-700',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
      sizeStyles[size].switch,
      className
    ].join(' ');
    
    const thumbClasses = [
      'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
      sizeStyles[size].thumb,
      checked ? sizeStyles[size].translateX : 'translate-x-1'
    ].join(' ');
    
    const labelClasses = [
      'select-none text-sm font-medium',
      disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300',
      labelPosition === 'left' ? 'mr-3' : 'ml-3'
    ].join(' ');
    
    const switchWithLabel = (
      <div className="flex items-center">
        {label && labelPosition === 'left' && (
          <label htmlFor={switchId} className={labelClasses}>
            {label}
          </label>
        )}
        
        <span className={switchClasses}>
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />
          <span
            className={thumbClasses}
            aria-hidden="true"
          />
        </span>
        
        {label && labelPosition === 'right' && (
          <label htmlFor={switchId} className={labelClasses}>
            {label}
          </label>
        )}
      </div>
    );
    
    return switchWithLabel;
  }
);

Switch.displayName = 'Switch';

export default Switch;