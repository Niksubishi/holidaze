import React, { memo, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

const FormInput = memo(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  min,
  max,
  step,
  rows,
  ...props
}) => {
  const { theme, isDarkMode } = useTheme();

  // Memoize styles to prevent recalculation
  const inputStyles = useMemo(() => ({
    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
    borderColor: error ? '#ef4444' : (isDarkMode ? '#6b7280' : '#d1d5db'),
    color: isDarkMode ? '#ffffff' : '#132F3D',
    borderWidth: '1px'
  }), [isDarkMode, error]);

  const labelStyles = useMemo(() => ({
    color: theme.colors.text,
    opacity: 0.8
  }), [theme.colors.text]);

  const errorStyles = useMemo(() => ({
    color: '#ef4444'
  }), []);

  const baseClasses = "w-full px-3 py-2 rounded-lg focus:outline-none font-poppins transition-colors focus:ring-2 focus:ring-primary focus:ring-opacity-20";
  const textareaClasses = "w-full px-3 py-2 rounded-lg focus:outline-none font-poppins transition-colors focus:ring-2 focus:ring-primary focus:ring-opacity-20 resize-vertical";
  
  const inputElement = useMemo(() => {
    const commonProps = {
      value: value || '',
      onChange,
      onBlur,
      disabled,
      style: inputStyles,
      placeholder,
      required,
      ...props
    };

    if (type === 'textarea') {
      return (
        <textarea
          {...commonProps}
          rows={rows || 3}
          className={`${textareaClasses} ${className}`}
        />
      );
    }

    return (
      <input
        type={type}
        min={min}
        max={max}
        step={step}
        {...commonProps}
        className={`${baseClasses} ${className}`}
      />
    );
  }, [type, rows, baseClasses, textareaClasses, className, value, onChange, onBlur, disabled, inputStyles, placeholder, required, min, max, step, props]);

  return (
    <div className="mb-4">
      {label && (
        <label className="block font-poppins text-sm mb-2" style={labelStyles}>
          {label}
          {required && <span style={errorStyles}> *</span>}
        </label>
      )}
      
      {inputElement}
      
      {error && (
        <div className="mt-1 flex items-center">
          <svg 
            className="h-4 w-4 mr-1" 
            fill="currentColor" 
            style={errorStyles}
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <p className="font-poppins text-sm" style={errorStyles}>
            {error}
          </p>
        </div>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;