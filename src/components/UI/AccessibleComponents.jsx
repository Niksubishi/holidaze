import React, { memo } from 'react';
import { useKeyboardNavigation, useFocusTrap, useRovingTabIndex } from '../../hooks/useKeyboardNavigation';
import { useTheme } from '../../context/ThemeContext';

// Accessible Menu Component
export const AccessibleMenu = memo(({ 
  items = [], 
  onItemSelect, 
  orientation = 'vertical',
  className = ''
}) => {
  const { theme } = useTheme();
  
  const {
    activeIndex,
    containerProps
  } = useKeyboardNavigation(items, {
    orientation,
    onActivate: (item, index) => onItemSelect?.(item, index)
  });

  return (
    <ul 
      {...containerProps}
      className={`focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      role="menu"
    >
      {items.map((item, index) => (
        <li
          key={item.id || index}
          role="menuitem"
          className={`cursor-pointer px-4 py-2 transition-colors ${
            index === activeIndex 
              ? 'bg-primary text-white' 
              : 'hover:bg-opacity-10 hover:bg-primary'
          }`}
          style={{ 
            color: index === activeIndex ? 'white' : theme.colors.text 
          }}
          aria-selected={index === activeIndex}
          id={`menu-item-${index}`}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
});

AccessibleMenu.displayName = 'AccessibleMenu';

// Accessible Modal with Focus Trap
export const AccessibleModal = memo(({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className = ''
}) => {
  const { theme, isDarkMode } = useTheme();
  
  const {
    containerProps
  } = useFocusTrap(isOpen);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        {...containerProps}
        className={`relative w-full max-w-md rounded-lg ${className}`}
        style={{ 
          backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
          color: theme.colors.text
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        onFocusTrapEscape={onClose}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 id="modal-title" className="text-lg font-semibold font-poppins">
              {title}
            </h2>
          </div>
        )}
        
        <div className="p-6">
          {children}
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
});

AccessibleModal.displayName = 'AccessibleModal';

// Accessible Tabs Component
export const AccessibleTabs = memo(({ 
  tabs = [], 
  activeTab, 
  onTabChange,
  className = ''
}) => {
  const { theme } = useTheme();
  
  const {
    getItemProps
  } = useRovingTabIndex(tabs, activeTab);

  return (
    <div className={`w-full ${className}`}>
      {/* Tab List */}
      <div 
        role="tablist" 
        className="flex border-b"
        style={{ borderColor: theme.colors.text, opacity: 0.2 }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id || index}
            {...getItemProps(index)}
            role="tab"
            aria-selected={index === activeTab}
            aria-controls={`tabpanel-${index}`}
            className={`px-4 py-2 font-poppins transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              index === activeTab 
                ? 'border-b-2 border-primary font-semibold' 
                : 'hover:bg-opacity-10 hover:bg-primary'
            }`}
            style={{ color: theme.colors.text }}
            onClick={() => onTabChange(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab, index) => (
        <div
          key={tab.id || index}
          id={`tabpanel-${index}`}
          role="tabpanel"
          aria-labelledby={`tab-${index}`}
          hidden={index !== activeTab}
          className="py-4"
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
});

AccessibleTabs.displayName = 'AccessibleTabs';

// Accessible Card Grid with Keyboard Navigation
export const AccessibleCardGrid = memo(({ 
  items = [], 
  onItemSelect,
  renderCard,
  columns = 4,
  className = ''
}) => {
  const {
    activeIndex,
    containerProps
  } = useKeyboardNavigation(items, {
    orientation: 'grid',
    onActivate: onItemSelect
  });

  return (
    <div 
      {...containerProps}
      className={`grid gap-6 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }}
      role="grid"
    >
      {items.map((item, index) => (
        <div
          key={item.id || index}
          role="gridcell"
          className={`transition-all duration-200 ${
            index === activeIndex 
              ? 'ring-2 ring-primary transform scale-105' 
              : ''
          }`}
          aria-selected={index === activeIndex}
          id={`card-${index}`}
        >
          {renderCard ? renderCard(item, index, index === activeIndex) : (
            <div className="p-4 rounded-lg border">
              {JSON.stringify(item)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

AccessibleCardGrid.displayName = 'AccessibleCardGrid';

// Skip Navigation Link
export const SkipNavigation = memo(() => {
  const { theme } = useTheme();
  
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <a
      href="#main-content"
      onClick={(e) => {
        e.preventDefault();
        skipToMain();
      }}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-white font-poppins"
      style={{
        backgroundColor: theme.colors.primary,
        color: 'white'
      }}
    >
      Skip to main content
    </a>
  );
});

SkipNavigation.displayName = 'SkipNavigation';

// Screen Reader Announcements
export const ScreenReaderAnnouncement = memo(({ message, priority = 'polite' }) => {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
});

ScreenReaderAnnouncement.displayName = 'ScreenReaderAnnouncement';