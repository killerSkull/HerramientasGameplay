import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'clipmarker_sessions';
const CURRENT_SESSION_KEY = 'clipmarker_current_session';

/**
 * Hook for LocalStorage persistence
 */
export function useStorage() {
  const [sessions, setSessions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load sessions from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSessions(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
    setIsLoaded(true);
  }, []);

  // Save sessions to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch (err) {
        console.error('Failed to save sessions:', err);
      }
    }
  }, [sessions, isLoaded]);

  const saveSession = useCallback((session) => {
    setSessions(prev => {
      const existing = prev.findIndex(s => s.id === session.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = session;
        return updated;
      }
      return [...prev, session];
    });
  }, []);

  const deleteSession = useCallback((sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  }, []);

  const getSession = useCallback((sessionId) => {
    return sessions.find(s => s.id === sessionId);
  }, [sessions]);

  const saveCurrentSession = useCallback((session) => {
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
    } catch (err) {
      console.error('Failed to save current session:', err);
    }
  }, []);

  const loadCurrentSession = useCallback(() => {
    try {
      const stored = localStorage.getItem(CURRENT_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error('Failed to load current session:', err);
      return null;
    }
  }, []);

  const clearCurrentSession = useCallback(() => {
    try {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    } catch (err) {
      console.error('Failed to clear current session:', err);
    }
  }, []);

  return {
    sessions,
    isLoaded,
    saveSession,
    deleteSession,
    getSession,
    saveCurrentSession,
    loadCurrentSession,
    clearCurrentSession
  };
}
