import React, { forwardRef } from 'react';
import { useThemeStyles, useButtonStyles, useInputStyles, useCardStyles } from '../../hooks/useThemeStyles';

// Styled Button Component
export const Button = forwardRef(({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const buttonStyles = useButtonStyles(variant, size);
  
  const finalStyles = {
    ...buttonStyles,
    opacity: disabled || loading ? 0.6 : 1,
    cursor: disabled || loading ? 'not-allowed' : 'pointer'
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${className} transition-all duration-200 hover:opacity-90 focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
      style={finalStyles}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

// Styled Input Component
export const Input = forwardRef(({ 
  error = false, 
  className = '', 
  type = 'text',
  ...props 
}, ref) => {
  const [focused, setFocused] = React.useState(false);
  const inputStyles = useInputStyles(error, focused);

  return (
    <input
      ref={ref}
      type={type}
      className={`${className} w-full`}
      style={inputStyles}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
});

Input.displayName = 'Input';

// Styled Textarea Component
export const Textarea = forwardRef(({ 
  error = false, 
  className = '', 
  rows = 3,
  ...props 
}, ref) => {
  const [focused, setFocused] = React.useState(false);
  const inputStyles = useInputStyles(error, focused);

  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`${className} w-full resize-vertical`}
      style={inputStyles}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

// Styled Card Component
export const Card = forwardRef(({ 
  children, 
  className = '', 
  interactive = false,
  hover = false,
  ...props 
}, ref) => {
  const cardStyles = useCardStyles(interactive);
  const styles = useThemeStyles();

  const hoverClass = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';
  const interactiveClass = interactive ? 'cursor-pointer' : '';

  return (
    <div
      ref={ref}
      className={`${className} ${hoverClass} ${interactiveClass} transition-all duration-200`}
      style={cardStyles}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Styled Text Components
export const Text = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  as: Component = 'p',
  ...props 
}) => {
  const styles = useThemeStyles();
  const textStyle = styles.text[variant] || styles.text.primary;

  return (
    <Component 
      className={`font-poppins ${className}`} 
      style={textStyle}
      {...props}
    >
      {children}
    </Component>
  );
};

export const Heading = ({ 
  level = 1, 
  children, 
  className = '', 
  ...props 
}) => {
  const styles = useThemeStyles();
  const Component = `h${level}`;
  
  const sizeClasses = {
    1: 'text-3xl md:text-4xl font-bold',
    2: 'text-2xl md:text-3xl font-semibold', 
    3: 'text-xl md:text-2xl font-semibold',
    4: 'text-lg md:text-xl font-medium',
    5: 'text-base md:text-lg font-medium',
    6: 'text-sm md:text-base font-medium'
  };

  return (
    <Component 
      className={`font-poppins ${sizeClasses[level]} ${className}`}
      style={styles.text.primary}
      {...props}
    >
      {children}
    </Component>
  );
};

// Styled Container Component
export const Container = ({ 
  children, 
  className = '', 
  maxWidth = '7xl',
  padding = true,
  ...props 
}) => {
  const maxWidthClass = `max-w-${maxWidth}`;
  const paddingClass = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <div 
      className={`mx-auto ${maxWidthClass} ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Styled Modal Components
export const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  closeOnBackdropClick = true 
}) => {
  const styles = useThemeStyles();

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={styles.modals.overlay}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-md ${className}`}
        style={styles.modals.content}
      >
        {children}
      </div>
    </div>
  );
};

export const ModalHeader = ({ children, className = '', onClose }) => {
  const styles = useThemeStyles();
  
  return (
    <div className={`flex items-center justify-between p-6 border-b ${className}`} style={{ borderColor: styles.text.muted.color }}>
      <div style={styles.text.primary}>
        {children}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="p-1 hover:opacity-75 transition-opacity"
          style={styles.text.muted}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export const ModalBody = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export const ModalFooter = ({ children, className = '' }) => {
  const styles = useThemeStyles();
  
  return (
    <div 
      className={`flex items-center justify-end space-x-3 p-6 border-t ${className}`}
      style={{ borderColor: styles.text.muted.color }}
    >
      {children}
    </div>
  );
};