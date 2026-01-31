import { useState, useEffect, useCallback } from 'react';

const SETTINGS_KEY = 'clipmarker_settings';
const CATEGORIES_KEY = 'clipmarker_custom_categories';
const PRESETS_KEY = 'clipmarker_custom_presets';

/**
 * Default settings configuration
 */
const DEFAULT_SETTINGS = {
  autoSaveInterval: 30000, // 30 seconds
  soundEnabled: true,
  notificationDuration: 3000, // 3 seconds
  showHotkeyBadges: true,
};

/**
 * Hook for managing app settings with LocalStorage persistence
 */
export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch (err) {
        console.error('Failed to save settings:', err);
      }
    }
  }, [settings, isLoaded]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    isLoaded,
    updateSetting,
    resetSettings
  };
}

/**
 * Hook for managing custom categories with LocalStorage persistence
 */
export function useCustomCategories(defaultCategories) {
  const [categories, setCategories] = useState(defaultCategories);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load categories from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CATEGORIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load custom categories:', err);
    }
    setIsLoaded(true);
  }, []);

  // Save categories to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
      } catch (err) {
        console.error('Failed to save categories:', err);
      }
    }
  }, [categories, isLoaded]);

  const addCategory = useCallback((category) => {
    if (categories.length >= 8) return false;
    const newCategory = {
      ...category,
      id: category.id || `custom_${Date.now()}`,
      hotkey: String(categories.length + 1)
    };
    setCategories(prev => [...prev, newCategory]);
    return true;
  }, [categories.length]);

  const updateCategory = useCallback((id, updates) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    ));
  }, []);

  const removeCategory = useCallback((id) => {
    if (categories.length <= 1) return false;
    setCategories(prev => {
      const filtered = prev.filter(cat => cat.id !== id);
      // Reassign hotkeys
      return filtered.map((cat, index) => ({
        ...cat,
        hotkey: String(index + 1)
      }));
    });
    return true;
  }, [categories.length]);

  const reorderCategories = useCallback((fromIndex, toIndex) => {
    setCategories(prev => {
      const copy = [...prev];
      const [removed] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, removed);
      // Reassign hotkeys
      return copy.map((cat, index) => ({
        ...cat,
        hotkey: String(index + 1)
      }));
    });
  }, []);

  const loadPreset = useCallback((presetCategories) => {
    setCategories(presetCategories.map((cat, index) => ({
      ...cat,
      hotkey: String(index + 1)
    })));
  }, []);

  const resetToDefault = useCallback(() => {
    setCategories(defaultCategories.map((cat, index) => ({
      ...cat,
      hotkey: String(index + 1)
    })));
  }, [defaultCategories]);

  return {
    categories,
    isLoaded,
    addCategory,
    updateCategory,
    removeCategory,
    reorderCategories,
    loadPreset,
    resetToDefault
  };
}

/**
 * Hook for managing custom category presets with LocalStorage persistence
 */
export function useCustomPresets() {
  const [presets, setPresets] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load presets from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PRESETS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPresets(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load custom presets:', err);
    }
    setIsLoaded(true);
  }, []);

  // Save presets to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
      } catch (err) {
        console.error('Failed to save custom presets:', err);
      }
    }
  }, [presets, isLoaded]);

  const savePreset = useCallback((name, categories) => {
    const newPreset = {
      id: `preset_${Date.now()}`,
      name,
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji,
        color: cat.color,
        bgColor: cat.bgColor
      })),
      createdAt: new Date().toISOString()
    };
    setPresets(prev => [...prev, newPreset]);
    return newPreset;
  }, []);

  const deletePreset = useCallback((presetId) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
  }, []);

  const updatePreset = useCallback((presetId, name, categories) => {
    setPresets(prev => prev.map(p => 
      p.id === presetId 
        ? { 
            ...p, 
            name, 
            categories: categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              emoji: cat.emoji,
              color: cat.color,
              bgColor: cat.bgColor
            }))
          } 
        : p
    ));
  }, []);

  const importPresets = useCallback((importedPresets) => {
    if (Array.isArray(importedPresets)) {
      setPresets(importedPresets);
    }
  }, []);

  return {
    presets,
    isLoaded,
    savePreset,
    deletePreset,
    updatePreset,
    importPresets
  };
}
