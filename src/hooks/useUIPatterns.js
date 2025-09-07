import { useState, useCallback, useEffect, useRef } from 'react';

// Hook for toggle functionality (modals, dropdowns, etc.)
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue
  };
};

// Hook for managing disclosure patterns (expandable content)
export const useDisclosure = (initialOpen = false) => {
  const { 
    value: isOpen, 
    setTrue: open, 
    setFalse: close, 
    toggle 
  } = useToggle(initialOpen);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

// Hook for managing hover states
export const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverProps = {
    onMouseEnter: useCallback(() => setIsHovered(true), []),
    onMouseLeave: useCallback(() => setIsHovered(false), [])
  };

  return {
    isHovered,
    hoverProps
  };
};

// Hook for managing focus states
export const useFocus = () => {
  const [isFocused, setIsFocused] = useState(false);

  const focusProps = {
    onFocus: useCallback(() => setIsFocused(true), []),
    onBlur: useCallback(() => setIsFocused(false), [])
  };

  return {
    isFocused,
    focusProps
  };
};

// Hook for click outside functionality
export const useClickOutside = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
};

// Hook for escape key functionality
export const useEscapeKey = (callback) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback]);
};

// Hook for combining click outside and escape key
export const useModalBehavior = (isOpen, onClose) => {
  const ref = useClickOutside(isOpen ? onClose : () => {});
  useEscapeKey(isOpen ? onClose : () => {});
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  return ref;
};

// Hook for debounced values
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for managing async operations
export const useAsync = (asyncFn, immediate = true) => {
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setError
  };
};

// Hook for managing clipboard operations
export const useClipboard = (timeout = 2000) => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);

      setTimeout(() => {
        setHasCopied(false);
      }, timeout);

      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setHasCopied(false);
      return false;
    }
  }, [timeout]);

  return {
    hasCopied,
    copyToClipboard
  };
};

// Hook for managing local storage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue
  };
};

// Hook for managing window dimensions
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Hook for managing media queries
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};