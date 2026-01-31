import { useState, useCallback } from 'react';
import { generateId } from '../utils/formatters';
import { formatTime } from '../utils/formatters';

/**
 * Hook for managing clips
 */
export function useClips() {
  const [clips, setClips] = useState([]);
  const [lastDeletedClip, setLastDeletedClip] = useState(null);

  const addClip = useCallback((category, timestamp, note = '') => {
    const newClip = {
      id: generateId(),
      timestamp,
      timestampFormatted: formatTime(timestamp),
      category,
      note,
      createdAt: new Date().toISOString()
    };
    
    setClips(prev => [...prev, newClip]);
    return newClip;
  }, []);

  const removeClip = useCallback((clipId) => {
    setClips(prev => {
      const clipToRemove = prev.find(c => c.id === clipId);
      if (clipToRemove) {
        setLastDeletedClip(clipToRemove);
      }
      return prev.filter(c => c.id !== clipId);
    });
  }, []);

  const updateClipNote = useCallback((clipId, note) => {
    setClips(prev => prev.map(clip => 
      clip.id === clipId ? { ...clip, note, updatedAt: new Date().toISOString() } : clip
    ));
  }, []);

  const updateClip = useCallback((clipId, updates) => {
    setClips(prev => prev.map(clip => {
      if (clip.id !== clipId) return clip;
      
      const updated = { ...clip, ...updates, updatedAt: new Date().toISOString() };
      
      // Recalculate formatted time if timestamp changed
      if (updates.timestamp !== undefined) {
        updated.timestampFormatted = formatTime(updates.timestamp);
      }
      
      return updated;
    }));
  }, []);

  const hasTimestamp = useCallback((timestamp, excludeClipId = null) => {
    return clips.some(clip => 
      clip.timestamp === timestamp && clip.id !== excludeClipId
    );
  }, [clips]);

  const undoLastDelete = useCallback(() => {
    if (lastDeletedClip) {
      setClips(prev => [...prev, lastDeletedClip].sort((a, b) => a.timestamp - b.timestamp));
      setLastDeletedClip(null);
      return true;
    }
    return false;
  }, [lastDeletedClip]);

  const clearClips = useCallback(() => {
    setClips([]);
    setLastDeletedClip(null);
  }, []);

  const getClipsByCategory = useCallback((categoryId) => {
    return clips.filter(clip => clip.category.id === categoryId);
  }, [clips]);

  const getSortedClips = useCallback((sortBy = 'timestamp') => {
    const sorted = [...clips];
    switch (sortBy) {
      case 'category':
        return sorted.sort((a, b) => a.category.name.localeCompare(b.category.name));
      case 'createdAt':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'timestamp':
      default:
        return sorted.sort((a, b) => a.timestamp - b.timestamp);
    }
  }, [clips]);

  const loadClips = useCallback((loadedClips) => {
    setClips(loadedClips);
  }, []);

  return {
    clips,
    addClip,
    removeClip,
    updateClipNote,
    updateClip,
    hasTimestamp,
    undoLastDelete,
    clearClips,
    getClipsByCategory,
    getSortedClips,
    loadClips,
    canUndo: !!lastDeletedClip
  };
}
