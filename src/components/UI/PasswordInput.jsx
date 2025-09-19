import React, { useState, memo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getInputBackground, getInputBorderColor, getInputTextColor } from '../../utils/theme.js';

const PasswordInput = memo(({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  label,
  className = '',
  error = null,
  ...props
}) => {
  const { theme, isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block font-poppins text-sm mb-2"
          style={{ color: theme.colors.text, opacity: 0.8 }}
        >
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 pr-10 rounded-lg focus:outline-none font-poppins ${error ? 'border-red-500' : ''}`}
          style={{
            backgroundColor: getInputBackground(isDarkMode),
            borderColor: error ? '#ef4444' : getInputBorderColor(isDarkMode),
            borderWidth: '1px',
            color: getInputTextColor(isDarkMode),
          }}
          {...props}
        />
        
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
          style={{ color: theme.colors.text, opacity: 0.6 }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.757 6.757M9.878 9.878a3 3 0 000 4.243m4.242-4.243L17.121 17.121m-4.243-4.243a3 3 0 000-4.243m0 4.243l4.243 4.243M17.121 17.121L21 21m-3.879-3.879l-2.122-2.122m0 0L12 12m0 0L9.879 9.879" />
            </svg>
          ) : (
            
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      
      {error && (
        <div className="mt-1 flex items-center">
          <svg 
            className="h-4 w-4 mr-1" 
            fill="currentColor" 
            style={{ color: '#ef4444' }}
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <p className="font-poppins text-sm" style={{ color: '#ef4444' }}>
            {error}
          </p>
        </div>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;