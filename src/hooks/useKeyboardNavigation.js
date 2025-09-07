import { useEffect, useCallback, useRef, useState } from 'react';

// Hook for keyboard navigation within a list/grid
export const useKeyboardNavigation = (items = [], options = {}) => {
  const {
    initialIndex = 0,
    loop = true,
    disabled = false,
    onActivate = () => {},
    orientation = 'vertical' // 'vertical', 'horizontal', or 'grid'
  } = options;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef(null);

  // Move to next item
  const moveNext = useCallback(() => {
    if (disabled || items.length === 0) return;
    
    setActiveIndex(current => {
      if (current < items.length - 1) {
        return current + 1;
      }
      return loop ? 0 : current;
    });
  }, [disabled, items.length, loop]);

  // Move to previous item
  const movePrevious = useCallback(() => {
    if (disabled || items.length === 0) return;
    
    setActiveIndex(current => {
      if (current > 0) {
        return current - 1;
      }
      return loop ? items.length - 1 : current;
    });
  }, [disabled, items.length, loop]);

  // Move to specific index
  const moveToIndex = useCallback((index) => {
    if (disabled || index < 0 || index >= items.length) return;
    setActiveIndex(index);
  }, [disabled, items.length]);

  // Activate current item
  const activateItem = useCallback(() => {
    if (disabled || activeIndex < 0 || activeIndex >= items.length) return;
    onActivate(items[activeIndex], activeIndex);
  }, [disabled, activeIndex, items, onActivate]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'grid') {
          event.preventDefault();
          moveNext();
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'grid') {
          event.preventDefault();
          movePrevious();
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'grid') {
          event.preventDefault();
          moveNext();
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'grid') {
          event.preventDefault();
          movePrevious();
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        activateItem();
        break;
      case 'Home':
        event.preventDefault();
        moveToIndex(0);
        break;
      case 'End':
        event.preventDefault();
        moveToIndex(items.length - 1);
        break;
      default:
        break;
    }
  }, [disabled, orientation, moveNext, movePrevious, activateItem, moveToIndex, items.length]);

  // Set up keyboard event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    activeIndex,
    setActiveIndex: moveToIndex,
    moveNext,
    movePrevious,
    activateItem,
    containerRef,
    containerProps: {
      ref: containerRef,
      tabIndex: 0,
      role: 'listbox',
      'aria-activedescendant': items[activeIndex]?.id || null
    }
  };
};

// Hook for modal keyboard navigation (focus trapping)
export const useFocusTrap = (isActive = true) => {
  const containerRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  // Get all focusable elements
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="link"]'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors));
  }, []);

  // Handle keyboard navigation within trap
  const handleKeyDown = useCallback((event) => {
    if (!isActive) return;

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      // Let parent component handle escape
      const escapeEvent = new CustomEvent('focustrap-escape', { bubbles: true });
      containerRef.current?.dispatchEvent(escapeEvent);
    }
  }, [isActive, getFocusableElements]);

  // Set initial focus
  useEffect(() => {
    if (isActive && containerRef.current) {
      const focusableElements = getFocusableElements();
      const elementToFocus = firstFocusableRef.current || focusableElements[0];
      elementToFocus?.focus();
    }
  }, [isActive, getFocusableElements]);

  // Set up event listeners
  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);

  return {
    containerRef,
    firstFocusableRef,
    lastFocusableRef,
    containerProps: {
      ref: containerRef,
      onKeyDown: handleKeyDown
    }
  };
};

// Hook for skip navigation
export const useSkipNavigation = () => {
  const skipLinkRef = useRef(null);
  const mainContentRef = useRef(null);

  const skipToMain = useCallback(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
      mainContentRef.current.scrollIntoView();
    }
  }, []);

  const handleSkipLinkClick = useCallback((event) => {
    event.preventDefault();
    skipToMain();
  }, [skipToMain]);

  return {
    skipLinkRef,
    mainContentRef,
    skipToMain,
    skipLinkProps: {
      ref: skipLinkRef,
      href: '#main-content',
      onClick: handleSkipLinkClick,
      className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded'
    },
    mainContentProps: {
      ref: mainContentRef,
      id: 'main-content',
      tabIndex: -1
    }
  };
};

// Hook for roving tabindex (for complex widgets)
export const useRovingTabIndex = (items = [], initialIndex = 0) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  
  const getTabIndex = useCallback((index) => {
    return index === activeIndex ? 0 : -1;
  }, [activeIndex]);

  const handleFocus = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const handleKeyDown = useCallback((event, index) => {
    let newIndex = activeIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = index < items.length - 1 ? index + 1 : 0;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = index > 0 ? index - 1 : items.length - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    setActiveIndex(newIndex);
    // Focus the new element
    setTimeout(() => {
      const newElement = document.querySelector(`[data-roving-index="${newIndex}"]`);
      newElement?.focus();
    }, 0);
  }, [activeIndex, items.length]);

  return {
    activeIndex,
    setActiveIndex,
    getTabIndex,
    handleFocus,
    handleKeyDown,
    getItemProps: (index) => ({
      tabIndex: getTabIndex(index),
      onFocus: () => handleFocus(index),
      onKeyDown: (event) => handleKeyDown(event, index),
      'data-roving-index': index
    })
  };
};

// Hook for accessible announcements
export const useAnnouncements = () => {
  const [announcement, setAnnouncement] = useState('');
  const announcementRef = useRef(null);

  const announce = useCallback((message, priority = 'polite') => {
    setAnnouncement(''); // Clear first to ensure screen readers pick up the change
    setTimeout(() => {
      setAnnouncement(message);
    }, 10);
  }, []);

  return {
    announce,
    announcementRef,
    announcementProps: {
      ref: announcementRef,
      'aria-live': 'polite',
      'aria-atomic': true,
      className: 'sr-only'
    },
    announcement
  };
};