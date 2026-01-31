import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook for keyboard shortcuts
 */
export function useHotkeys(shortcuts, enabled = true) {
  const handlersRef = useRef(shortcuts);
  
  // Keep handlers ref updated
  useEffect(() => {
    handlersRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((e) => {
    if (!enabled) return;
    
    // Don't trigger if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const handlers = handlersRef.current;
    
    // Check for modifier combinations first
    const ctrl = e.ctrlKey || e.metaKey;
    
    for (const [shortcut, handler] of Object.entries(handlers)) {
      if (!handler) continue;
      
      const parts = shortcut.toLowerCase().split('+');
      const key = parts[parts.length - 1];
      const needsCtrl = parts.includes('ctrl') || parts.includes('cmd');
      const needsShift = parts.includes('shift');
      const needsAlt = parts.includes('alt');
      
      const matchesKey = e.key.toLowerCase() === key || e.code.toLowerCase() === `key${key}` || e.code.toLowerCase() === `digit${key}`;
      const matchesCtrl = needsCtrl === ctrl;
      const matchesShift = needsShift === e.shiftKey;
      const matchesAlt = needsAlt === e.altKey;
      
      if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
        e.preventDefault();
        handler(e);
        return;
      }
    }
  }, [enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
