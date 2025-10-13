import { useEffect, useCallback } from 'react';

// Custom hook for keyboard navigation
export const useKeyboardNavigation = (keyHandlers, dependencies = []) => {
  const handleKeyDown = useCallback((event) => {
    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    
    // Create a key combination string
    const keyCombo = [
      ctrlKey && 'ctrl',
      metaKey && 'cmd',
      shiftKey && 'shift',
      altKey && 'alt',
      key.toLowerCase()
    ].filter(Boolean).join('+');
    
    // Check if we have a handler for this key combination
    if (keyHandlers[keyCombo]) {
      event.preventDefault();
      keyHandlers[keyCombo](event);
    } else if (keyHandlers[key.toLowerCase()]) {
      event.preventDefault();
      keyHandlers[key.toLowerCase()](event);
    }
  }, dependencies);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Common keyboard shortcuts for the notes app
export const useNotesKeyboardShortcuts = (handlers) => {
  const keyHandlers = {
    'ctrl+n': handlers.createNote,
    'cmd+n': handlers.createNote,
    'ctrl+f': handlers.focusSearch,
    'cmd+f': handlers.focusSearch,
    'ctrl+/': handlers.showShortcuts,
    'cmd+/': handlers.showShortcuts,
    'escape': handlers.closeModal,
    'ctrl+k': handlers.openCommandPalette,
    'cmd+k': handlers.openCommandPalette,
  };

  useKeyboardNavigation(keyHandlers, [handlers]);
};

export default useKeyboardNavigation;
