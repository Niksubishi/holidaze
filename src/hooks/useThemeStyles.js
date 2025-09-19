import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';


export const useThemeStyles = () => {
  const { theme, isDarkMode } = useTheme();

  const styles = useMemo(() => ({
    
    backgrounds: {
      primary: theme.colors.background,
      card: isDarkMode ? '#3a3a3a' : '#ffffff',
      secondary: isDarkMode ? '#4b5563' : '#f9fafb',
      input: isDarkMode ? '#374151' : '#ffffff',
      hover: isDarkMode ? '#4b5563' : '#f3f4f6'
    },

    
    text: {
      primary: theme.colors.text,
      secondary: { color: theme.colors.text, opacity: 0.8 },
      muted: { color: theme.colors.text, opacity: 0.6 },
      disabled: { color: theme.colors.text, opacity: 0.4 }
    },

    
    buttons: {
      primary: {
        backgroundColor: theme.colors.primary,
        color: 'white',
        border: 'none',
        transition: 'all 0.2s ease-in-out'
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `1px solid ${theme.colors.primary}`,
        transition: 'all 0.2s ease-in-out'
      },
      ghost: {
        backgroundColor: 'transparent',
        color: theme.colors.text,
        border: `1px solid ${isDarkMode ? '#6b7280' : '#d1d5db'}`,
        transition: 'all 0.2s ease-in-out'
      },
      danger: {
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        transition: 'all 0.2s ease-in-out'
      }
    },

    
    inputs: {
      base: {
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
        color: isDarkMode ? '#ffffff' : '#132F3D',
        borderWidth: '1px',
        transition: 'all 0.2s ease-in-out'
      },
      error: {
        borderColor: '#ef4444',
        backgroundColor: isDarkMode ? '#374151' : '#fef2f2'
      },
      focus: {
        borderColor: theme.colors.primary,
        boxShadow: `0 0 0 3px ${theme.colors.primary}20`
      }
    },

    
    cards: {
      base: {
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        borderRadius: '0.5rem',
        boxShadow: isDarkMode 
          ? '0 1px 3px rgba(0, 0, 0, 0.3)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb'
      },
      hover: {
        transform: 'translateY(-2px)',
        boxShadow: isDarkMode 
          ? '0 4px 12px rgba(0, 0, 0, 0.4)' 
          : '0 4px 12px rgba(0, 0, 0, 0.15)'
      }
    },

    
    modals: {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      },
      content: {
        backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
        borderRadius: '0.75rem',
        boxShadow: isDarkMode 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.6)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    },

    
    navigation: {
      background: theme.colors.headerBg,
      link: {
        color: theme.colors.navLinks,
        transition: 'opacity 0.2s ease-in-out'
      },
      activeLink: {
        color: theme.colors.navLinks,
        borderBottom: `2px solid ${theme.colors.navLinks}`
      }
    },

    
    status: {
      success: {
        backgroundColor: '#10b981',
        color: 'white'
      },
      warning: {
        backgroundColor: '#f59e0b',
        color: 'white'
      },
      error: {
        backgroundColor: '#ef4444',
        color: 'white'
      },
      info: {
        backgroundColor: '#3b82f6',
        color: 'white'
      }
    },

    
    animations: {
      fadeIn: {
        animation: 'fadeIn 0.3s ease-in-out'
      },
      slideInUp: {
        animation: 'slideInUp 0.3s ease-out'
      },
      pulse: {
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      spin: {
        animation: 'spin 1s linear infinite'
      }
    }
  }), [theme, isDarkMode]);

  return styles;
};


export const useButtonStyles = (variant = 'primary', size = 'md') => {
  const styles = useThemeStyles();
  
  return useMemo(() => {
    const baseStyle = styles.buttons[variant] || styles.buttons.primary;
    
    const sizeStyles = {
      sm: {
        padding: '0.375rem 0.75rem',
        fontSize: '0.875rem',
        borderRadius: '0.375rem'
      },
      md: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        borderRadius: '0.5rem'
      },
      lg: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        borderRadius: '0.5rem'
      }
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: baseStyle.border || 'none',
      outline: 'none'
    };
  }, [styles.buttons, variant, size]);
};


export const useInputStyles = (hasError = false, isFocused = false) => {
  const styles = useThemeStyles();
  
  return useMemo(() => {
    let inputStyle = { ...styles.inputs.base };
    
    if (hasError) {
      inputStyle = { ...inputStyle, ...styles.inputs.error };
    }
    
    if (isFocused) {
      inputStyle = { ...inputStyle, ...styles.inputs.focus };
    }

    return {
      ...inputStyle,
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontFamily: 'Poppins, sans-serif',
      outline: 'none'
    };
  }, [styles.inputs, hasError, isFocused]);
};


export const useCardStyles = (interactive = false) => {
  const styles = useThemeStyles();
  
  return useMemo(() => {
    let cardStyle = { ...styles.cards.base };
    
    if (interactive) {
      cardStyle.transition = 'all 0.2s ease-in-out';
      cardStyle.cursor = 'pointer';
    }

    return cardStyle;
  }, [styles.cards, interactive]);
};