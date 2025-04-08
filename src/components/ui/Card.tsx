import React from 'react';

// Card container component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional padding size
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Add a hover effect to the card
   */
  hoverable?: boolean;
  /**
   * Add a shadow to the card
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Add a border to the card
   */
  bordered?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', padding = 'md', hoverable = false, shadow = 'sm', bordered = true, children, ...props }, ref) => {
    // Base styles
    const baseStyles = 'bg-white dark:bg-gray-800 rounded-lg overflow-hidden';
    
    // Padding styles
    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    };
    
    // Shadow styles
    const shadowStyles = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    };
    
    const classes = [
      baseStyles,
      paddingStyles[padding],
      shadowStyles[shadow],
      bordered ? 'border border-gray-200 dark:border-gray-700' : '',
      hoverable ? 'transition-all duration-200 hover:shadow-md' : '',
      className
    ].join(' ');
    
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card header component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to add a bottom border to the header
   */
  bordered?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', bordered = true, children, ...props }, ref) => {
    const classes = [
      'px-5 py-4',
      bordered ? 'border-b border-gray-200 dark:border-gray-700' : '',
      className
    ].join(' ');
    
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card title component
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', children, ...props }, ref) => {
    const classes = [
      'text-lg font-medium text-gray-900 dark:text-white',
      className
    ].join(' ');
    
    return (
      <h3 ref={ref} className={classes} {...props}>
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

// Card description component
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = '', children, ...props }, ref) => {
    const classes = [
      'text-sm text-gray-500 dark:text-gray-400',
      className
    ].join(' ');
    
    return (
      <p ref={ref} className={classes} {...props}>
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

// Card content component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => {
    const classes = [
      'p-5',
      className
    ].join(' ');
    
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// Card footer component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to add a top border to the footer
   */
  bordered?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', bordered = true, children, ...props }, ref) => {
    const classes = [
      'px-5 py-4',
      bordered ? 'border-t border-gray-200 dark:border-gray-700' : '',
      className
    ].join(' ');
    
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };