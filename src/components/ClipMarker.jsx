import { useState, useCallback, useEffect } from 'react';
import { Palette, History, Undo2, Keyboard, Settings, FolderOpen, Download, Eye, Trash2, X, Edit, PenLine } from 'lucide-react';
import Timer from './Timer';
import CategoryButtons from './CategoryButtons';
import ClipsList from './ClipsList';
import Timeline from './Timeline';
import ExportPanel from './ExportPanel';
import Notifications, { useNotifications } from './Notifications';
import SettingsPanel from './SettingsPanel';
import CategoryEditor from './CategoryEditor';
import ConfirmModal from './ConfirmModal';
import { useTimer } from '../hooks/useTimer';
import { useClips } from '../hooks/useClips';
import { useStorage } from '../hooks/useStorage';
import { useHotkeys } from '../hooks/useHotkeys';
import { useSettings, useCustomCategories, useCustomPresets } from '../hooks/useSettings';
import { DEFAULT_CATEGORIES } from '../config/categories';
import { THEMES } from '../config/themes';
import { useTheme } from '../ThemeProvider';
import { generateId, formatTime } from '../utils/formatters';
import { exportToJSON, exportToYouTube, downloadFile } from '../utils/exporters';

function ClipMarker() {
  const { theme, currentTheme, setCurrentTheme, themes } = useTheme();
  const { notifications, notify, dismiss, playSound } = useNotifications();
  
  // State
  const [sessionName, setSessionName] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null); // For manual timestamp input
  const [editingClip, setEditingClip] = useState(null); // For clip editing

  // Hooks
  const timer = useTimer();
  const clipsManager = useClips();
  const storage = useStorage();
  const { settings, updateSetting, resetSettings } = useSettings();
  const customCategories = useCustomCategories(DEFAULT_CATEGORIES);
  const categories = customCategories.categories;
  const customPresets = useCustomPresets();

  // Auto-save current session
  useEffect(() => {
    if (timer.isRunning && sessionId && settings.autoSaveInterval > 0) {
      const saveInterval = setInterval(() => {
        const currentSession = {
          id: sessionId,
          name: sessionName,
          startedAt: sessionStartedAt,
          endedAt: null,
          duration: timer.elapsedTime,
          status: timer.isPaused ? 'paused' : 'recording',
          clips: clipsManager.clips
        };
        storage.saveCurrentSession(currentSession);
      }, settings.autoSaveInterval);

      return () => clearInterval(saveInterval);
    }
  }, [timer.isRunning, timer.isPaused, sessionId, sessionName, sessionStartedAt, timer.elapsedTime, clipsManager.clips, storage, settings.autoSaveInterval]);

  // Handle session start
  const handleStart = useCallback(() => {
    if (!timer.isRunning) {
      const newId = generateId();
      setSessionId(newId);
      setSessionStartedAt(new Date().toISOString());
      timer.start();
      notify('🎮 ¡Sesión iniciada! Marca los mejores momentos', 'success');
    } else {
      timer.start(); // Resume
      notify('▶️ Sesión reanudada', 'info');
    }
  }, [timer, notify]);

  // Handle session pause
  const handlePause = useCallback(() => {
    timer.pause();
    notify('⏸️ Sesión pausada', 'info');
  }, [timer, notify]);

  // Handle session stop
  const handleStop = useCallback(() => {
    const endedAt = new Date().toISOString();
    const finalSession = {
      id: sessionId,
      name: sessionName,
      startedAt: sessionStartedAt,
      endedAt,
      duration: timer.elapsedTime,
      status: 'stopped',
      clips: clipsManager.clips
    };
    
    // Save to history if there are clips
    if (clipsManager.clips.length > 0) {
      storage.saveSession(finalSession);
    }
    
    storage.clearCurrentSession();
    timer.stop();
    timer.reset();
    clipsManager.clearClips();
    setSessionName('');
    setSessionId(null);
    setSessionStartedAt(null);
    
    notify('⏹️ Sesión finalizada y guardada', 'success');
  }, [timer, clipsManager, storage, sessionId, sessionName, sessionStartedAt, notify]);

  // Handle marking a clip
  const handleMarkClip = useCallback((category) => {
    // Manual mode: show timestamp input (requires session name)
    if (manualMode) {
      if (!sessionName.trim()) {
        notify('⚠️ Ingresa un nombre de sesión primero', 'error');
        return;
      }
      setPendingCategory(category);
      return;
    }
    
    // Auto mode: use current timer time
    if (!timer.isRunning || timer.isPaused) return;
    
    const clip = clipsManager.addClip(category, timer.elapsedTime);
    // Play sound only, no visual notification
    playSound('success');
  }, [timer, clipsManager, playSound, manualMode, sessionName, notify]);

  // Handle manual clip creation with custom timestamp
  const handleManualClipCreate = useCallback((timestampSeconds) => {
    if (!pendingCategory) return;
    
    // Check for duplicate timestamp
    if (clipsManager.hasTimestamp(timestampSeconds)) {
      notify('⚠️ Ya existe un clip en ese momento', 'error');
      return;
    }
    
    clipsManager.addClip(pendingCategory, timestampSeconds);
    playSound('success');
    setPendingCategory(null);
  }, [pendingCategory, clipsManager, playSound, notify]);

  // Handle clip edit save
  const handleSaveClipEdit = useCallback((clipId, updates) => {
    // Check for duplicate timestamp (excluding current clip)
    if (updates.timestamp !== undefined && clipsManager.hasTimestamp(updates.timestamp, clipId)) {
      notify('⚠️ Ya existe un clip en ese momento', 'error');
      return false;
    }
    
    clipsManager.updateClip(clipId, updates);
    notify('✅ Clip actualizado', 'success');
    setEditingClip(null);
    return true;
  }, [clipsManager, notify]);

  // Handle save manual session
  const handleSaveManualSession = useCallback(() => {
    if (!sessionName.trim()) {
      notify('⚠️ Ingresa un nombre de sesión', 'error');
      return;
    }
    
    if (clipsManager.clips.length === 0) {
      notify('⚠️ No hay clips para guardar', 'error');
      return;
    }
    
    // Calculate duration from highest timestamp
    const maxTimestamp = Math.max(...clipsManager.clips.map(c => c.timestamp));
    
    const manualSession = {
      id: `manual_${Date.now()}`,
      name: sessionName,
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      duration: maxTimestamp,
      status: 'manual',
      clips: clipsManager.clips
    };
    
    storage.saveSession(manualSession);
    clipsManager.clearClips();
    setSessionName('');
    
    notify('✅ Sesión manual guardada en historial', 'success');
  }, [sessionName, clipsManager, storage, notify]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (clipsManager.undoLastDelete()) {
      notify('↩️ Clip restaurado', 'info');
    }
  }, [clipsManager, notify]);

  // Handle config import
  const handleImportConfig = useCallback((config) => {
    // Import settings
    if (config.settings) {
      Object.entries(config.settings).forEach(([key, value]) => {
        updateSetting(key, value);
      });
    }
    
    // Import categories
    if (config.categories && Array.isArray(config.categories)) {
      customCategories.loadPreset(config.categories);
    }

    // Import custom presets
    if (config.customPresets && Array.isArray(config.customPresets)) {
      customPresets.importPresets(config.customPresets);
    }

    // Import sessions (if included in backup)
    if (config.sessions && Array.isArray(config.sessions)) {
      config.sessions.forEach(session => {
        storage.saveSession(session);
      });
    }

    // Import theme
    if (config.theme && setCurrentTheme) {
      setCurrentTheme(config.theme);
    }

    notify('✅ Configuración importada correctamente', 'success');
  }, [updateSetting, customCategories, customPresets, storage, setCurrentTheme, notify]);

  // Hotkeys
  useHotkeys({
    'ctrl+s': () => {
      if (!timer.isRunning && sessionName.trim()) {
        handleStart();
      }
    },
    'ctrl+p': handlePause,
    'ctrl+q': () => {
      if (timer.isRunning) handleStop();
    },
    'ctrl+z': handleUndo,
    '1': () => handleMarkClip(categories[0]),
    '2': () => handleMarkClip(categories[1]),
    '3': () => handleMarkClip(categories[2]),
    '4': () => handleMarkClip(categories[3]),
  }, timer.isRunning || !timer.isPaused);

  // Build current session object for export
  const currentSession = {
    id: sessionId || 'unsaved',
    name: sessionName || 'Nueva Sesión',
    startedAt: sessionStartedAt,
    endedAt: null,
    duration: timer.elapsedTime,
    clips: clipsManager.clips
  };

  return (
    <div className={`min-h-screen ${theme.background}`}>
      {/* Notifications */}
      <Notifications notifications={notifications} onDismiss={dismiss} />

      {/* Header */}
      <header className="py-6 px-4 relative z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${theme.text.primary} flex items-center gap-2`}>
              🎬 ClipMarker
            </h1>
            <p className={`text-sm ${theme.text.muted}`}>
              Tu asistente de gameplays by <span className={theme.text.secondary}>FeresDev</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo Button */}
            {clipsManager.canUndo && (
              <button
                onClick={handleUndo}
                className={`p-2 rounded-xl ${theme.card} hover:bg-white/10 transition-colors`}
                title="Deshacer (Ctrl+Z)"
              >
                <Undo2 className={`w-5 h-5 ${theme.text.muted}`} />
              </button>
            )}

            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setShowThemes(!showThemes)}
                className={`p-2 rounded-xl ${theme.card} hover:bg-white/10 transition-colors`}
                title="Cambiar tema"
              >
                <Palette className={`w-5 h-5 ${theme.text.muted}`} />
              </button>
              
              {showThemes && (
                <div className={`absolute right-0 top-full mt-2 ${theme.glass} rounded-xl p-2 min-w-48 z-50`}>
                  {Object.entries(themes).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentTheme(key);
                        setShowThemes(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left
                        ${currentTheme === key ? 'bg-white/20' : 'hover:bg-white/10'} transition-colors`}
                    >
                      <div className={`w-4 h-4 rounded-full ${t.background}`} />
                      <span className={theme.text.primary}>{t.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Editor Button */}
            <button
              onClick={() => setShowCategoryEditor(true)}
              className={`p-2 rounded-xl ${theme.card} hover:bg-white/10 transition-colors`}
              title="Editor de categorías"
            >
              <FolderOpen className={`w-5 h-5 ${theme.text.muted}`} />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-xl ${theme.card} hover:bg-white/10 transition-colors`}
              title="Configuración"
            >
              <Settings className={`w-5 h-5 ${theme.text.muted}`} />
            </button>

            {/* History Button */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-xl ${theme.card} hover:bg-white/10 transition-colors`}
              title="Historial de sesiones"
            >
              <History className={`w-5 h-5 ${theme.text.muted}`} />
            </button>

            {/* Keyboard Shortcuts Help */}
            <button
              className={`p-2 rounded-xl ${theme.card} hover:bg-white/10 transition-colors group relative`}
              title="Atajos de teclado"
            >
              <Keyboard className={`w-5 h-5 ${theme.text.muted}`} />
              <div className={`absolute right-0 top-full mt-2 bg-gray-900 border border-white/20 rounded-xl p-4 min-w-64
                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl`}>
                <h4 className={`font-semibold ${theme.text.primary} mb-2`}>Atajos de teclado</h4>
                <div className={`space-y-1 text-sm ${theme.text.muted}`}>
                  <div className="flex justify-between">
                    <span>Iniciar sesión</span>
                    <kbd className="px-1.5 bg-white/10 rounded">Ctrl+S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Pausar</span>
                    <kbd className="px-1.5 bg-white/10 rounded">Ctrl+P</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Detener</span>
                    <kbd className="px-1.5 bg-white/10 rounded">Ctrl+Q</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Deshacer</span>
                    <kbd className="px-1.5 bg-white/10 rounded">Ctrl+Z</kbd>
                  </div>
                  <hr className="border-white/10 my-2" />
                  <div className="flex justify-between">
                    <span>🔥 Épico</span>
                    <kbd className="px-1.5 bg-white/10 rounded">1</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>😂 Gracioso</span>
                    <kbd className="px-1.5 bg-white/10 rounded">2</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>💀 Fail</span>
                    <kbd className="px-1.5 bg-white/10 rounded">3</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>⭐ Thumbnail</span>
                    <kbd className="px-1.5 bg-white/10 rounded">4</kbd>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Timer */}
          <Timer
            isRunning={timer.isRunning}
            isPaused={timer.isPaused}
            elapsedTime={timer.elapsedTime}
            sessionName={sessionName}
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
            onSessionNameChange={setSessionName}
          />

          {/* Manual Mode Toggle + Category Buttons */}
          <div className="space-y-4">
            {/* Manual Mode Toggle */}
            <div className="flex items-center justify-between">
              <p className={`text-sm ${theme.text.muted}`}>
                {manualMode ? '✏️ Modo manual: ingresa timestamp' : '⏱️ Modo automático: usa timer actual'}
              </p>
              <button
                onClick={() => setManualMode(!manualMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  manualMode 
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white' 
                    : `${theme.card} ${theme.text.muted} hover:bg-white/10`
                }`}
              >
                <PenLine className="w-4 h-4" />
                {manualMode ? 'Manual' : 'Auto'}
              </button>
            </div>

            {/* Category Buttons */}
            <CategoryButtons
              categories={categories}
              onMarkClip={handleMarkClip}
              disabled={!manualMode && (!timer.isRunning || timer.isPaused)}
            />

            {/* Save Manual Session Button */}
            {manualMode && clipsManager.clips.length > 0 && (
              <button
                onClick={handleSaveManualSession}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                  bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold
                  hover:opacity-90 transition-opacity shadow-lg"
              >
                <Download className="w-5 h-5" />
                Guardar Sesión Manual ({clipsManager.clips.length} clips)
              </button>
            )}
          </div>

          {/* Clips List */}
          <ClipsList
            clips={clipsManager.clips}
            categories={categories}
            onRemoveClip={clipsManager.removeClip}
            onUpdateNote={clipsManager.updateClipNote}
            onEditClip={setEditingClip}
          />

          {/* Timeline */}
          <Timeline
            clips={clipsManager.clips}
            totalDuration={timer.elapsedTime}
          />

          {/* Export Panel */}
          <ExportPanel
            session={currentSession}
            onNotify={notify}
          />
        </div>
      </main>

      {/* Session History Modal */}
      {showHistory && (
        <SessionHistoryModal 
          theme={theme}
          sessions={storage.sessions}
          onClose={() => setShowHistory(false)}
          onDeleteSession={storage.deleteSession}
          formatTime={formatTime}
          exportToJSON={exportToJSON}
          exportToYouTube={exportToYouTube}
          downloadFile={downloadFile}
          notify={notify}
        />
      )}

      {/* Settings Panel Modal */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSetting={updateSetting}
        onReset={resetSettings}
        categories={categories}
        customPresets={customPresets.presets}
        sessions={storage.sessions}
        onImportConfig={handleImportConfig}
      />

      {/* Category Editor Modal */}
      <CategoryEditor
        isOpen={showCategoryEditor}
        onClose={() => setShowCategoryEditor(false)}
        categories={categories}
        onAddCategory={customCategories.addCategory}
        onUpdateCategory={customCategories.updateCategory}
        onRemoveCategory={customCategories.removeCategory}
        onReorderCategories={customCategories.reorderCategories}
        onLoadPreset={customCategories.loadPreset}
        onResetToDefault={customCategories.resetToDefault}
        customPresets={customPresets.presets}
        onSavePreset={customPresets.savePreset}
        onDeletePreset={customPresets.deletePreset}
      />

      {/* Timestamp Input Modal (for manual mode) */}
      {pendingCategory && (
        <TimestampInputModal
          theme={theme}
          category={pendingCategory}
          onConfirm={handleManualClipCreate}
          onClose={() => setPendingCategory(null)}
          existingTimestamps={clipsManager.clips.map(c => c.timestamp)}
        />
      )}

      {/* Clip Edit Modal */}
      {editingClip && (
        <ClipEditModal
          theme={theme}
          clip={editingClip}
          categories={categories}
          onSave={handleSaveClipEdit}
          onClose={() => setEditingClip(null)}
          existingTimestamps={clipsManager.clips.map(c => c.timestamp)}
        />
      )}
    </div>
  );
}

// Session History Modal Component
function SessionHistoryModal({ 
  theme, 
  sessions, 
  onClose, 
  onDeleteSession,
  formatTime,
  exportToJSON,
  exportToYouTube,
  downloadFile,
  notify
}) {
  const [expandedSession, setExpandedSession] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, name }

  const handleExportJSON = (session) => {
    const jsonContent = exportToJSON(session);
    const filename = `${session.name.replace(/[^a-z0-9]/gi, '_')}-clips.json`;
    downloadFile(jsonContent, filename, 'application/json');
    notify('📥 JSON descargado', 'success');
  };

  const handleExportYouTube = async (session) => {
    const timestamps = exportToYouTube(session);
    try {
      await navigator.clipboard.writeText(timestamps);
      notify('📋 Timestamps copiados al portapapeles', 'success');
    } catch {
      // Fallback: download as text file
      downloadFile(timestamps, `${session.name}-youtube.txt`, 'text/plain');
      notify('📥 Timestamps descargados', 'success');
    }
  };

  const handleDelete = (sessionId, sessionName) => {
    setDeleteConfirm({ id: sessionId, name: sessionName });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteSession(deleteConfirm.id);
      notify('🗑️ Sesión eliminada', 'info');
      setDeleteConfirm(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className={`${theme.glass} rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${theme.text.primary}`}>
            📚 Historial de Sesiones
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className={`w-5 h-5 ${theme.text.muted}`} />
          </button>
        </div>
        
        {sessions.length === 0 ? (
          <p className={`text-center py-8 ${theme.text.muted}`}>
            No hay sesiones guardadas
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.slice().reverse().map((session) => (
              <div key={session.id} className={`rounded-xl ${theme.card} overflow-hidden`}>
                {/* Session Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold ${theme.text.primary} truncate`}>
                        {session.name || 'Sin nombre'}
                      </h4>
                      <p className={`text-sm ${theme.text.muted}`}>
                        {new Date(session.startedAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {' · '}
                        {formatTime(session.duration)}
                      </p>
                      <p className={`text-sm ${theme.text.secondary}`}>
                        {session.clips.length} clips marcados
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setExpandedSession(
                          expandedSession === session.id ? null : session.id
                        )}
                        className={`p-2 rounded-lg hover:bg-white/10 transition-colors`}
                        title="Ver clips"
                      >
                        <Eye className={`w-4 h-4 ${theme.text.muted}`} />
                      </button>
                      <button
                        onClick={() => handleExportJSON(session)}
                        className={`p-2 rounded-lg hover:bg-white/10 transition-colors`}
                        title="Descargar JSON"
                      >
                        <Download className={`w-4 h-4 ${theme.text.muted}`} />
                      </button>
                      <button
                        onClick={() => handleExportYouTube(session)}
                        className={`p-2 rounded-lg hover:bg-white/10 transition-colors text-red-400`}
                        title="Copiar timestamps YouTube"
                      >
                        📺
                      </button>
                      <button
                        onClick={() => handleDelete(session.id, session.name)}
                        className={`p-2 rounded-lg hover:bg-red-500/20 transition-colors`}
                        title="Eliminar sesión"
                      >
                        <Trash2 className={`w-4 h-4 text-red-400`} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Clips List */}
                {expandedSession === session.id && session.clips.length > 0 && (
                  <div className="border-t border-white/10 p-4 bg-black/20">
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {session.clips.map((clip) => (
                        <div 
                          key={clip.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                        >
                          <span className={`font-mono text-sm ${theme.text.muted}`}>
                            {clip.timestampFormatted}
                          </span>
                          <span className="text-lg">{clip.category.emoji}</span>
                          <span className={`text-sm ${theme.text.primary}`}>
                            {clip.category.name}
                          </span>
                          {clip.note && (
                            <span className={`text-sm ${theme.text.muted} truncate flex-1`}>
                              - {clip.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Eliminar Sesión"
        message={`¿Estás seguro de eliminar la sesión "${deleteConfirm?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}

// Timestamp Input Modal (for manual clip creation)
function TimestampInputModal({ theme, category, onConfirm, onClose, existingTimestamps = [] }) {
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    
    if (mins < 0 || secs < 0 || secs >= 60) {
      setError('Formato inválido');
      return;
    }
    
    const totalSeconds = mins * 60 + secs;
    const timestampMs = totalSeconds * 1000; // Convert to milliseconds
    
    if (existingTimestamps.includes(timestampMs)) {
      setError('Ya existe un clip en ese momento');
      return;
    }
    
    onConfirm(timestampMs);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`text-lg font-bold ${theme.text.primary} mb-4`}>
          {category.emoji} {category.name}
        </h3>
        
        <p className={`text-sm ${theme.text.muted} mb-4`}>
          Ingresa el timestamp para este clip:
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            value={minutes}
            onChange={(e) => { setMinutes(e.target.value); setError(''); }}
            placeholder="00"
            min="0"
            className={`w-20 px-3 py-2 rounded-lg bg-white/10 ${theme.text.primary}
              border border-white/20 focus:border-white/40 focus:outline-none text-center text-xl`}
            autoFocus
          />
          <span className={`text-2xl ${theme.text.muted}`}>:</span>
          <input
            type="number"
            value={seconds}
            onChange={(e) => { setSeconds(e.target.value); setError(''); }}
            placeholder="00"
            min="0"
            max="59"
            className={`w-20 px-3 py-2 rounded-lg bg-white/10 ${theme.text.primary}
              border border-white/20 focus:border-white/40 focus:outline-none text-center text-xl`}
          />
        </div>
        
        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2.5 rounded-xl bg-white/10 ${theme.text.muted}
              hover:bg-white/20 transition-colors`}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500
              text-white font-medium hover:opacity-90 transition-opacity"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

// Clip Edit Modal
function ClipEditModal({ theme, clip, categories, onSave, onClose, existingTimestamps = [] }) {
  // Convert from milliseconds to display values
  const totalSecs = Math.floor(clip.timestamp / 1000);
  const [minutes, setMinutes] = useState(Math.floor(totalSecs / 60).toString());
  const [seconds, setSeconds] = useState((totalSecs % 60).toString());
  const [selectedCategory, setSelectedCategory] = useState(clip.category.id);
  const [note, setNote] = useState(clip.note || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    
    if (mins < 0 || secs < 0 || secs >= 60) {
      setError('Formato inválido');
      return;
    }
    
    const totalSeconds = mins * 60 + secs;
    const timestampMs = totalSeconds * 1000; // Convert to milliseconds
    
    // Check for duplicate (excluding current clip)
    if (timestampMs !== clip.timestamp && existingTimestamps.includes(timestampMs)) {
      setError('Ya existe un clip en ese momento');
      return;
    }
    
    const category = categories.find(c => c.id === selectedCategory) || clip.category;
    
    onSave(clip.id, {
      timestamp: timestampMs,
      category,
      note
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`text-lg font-bold ${theme.text.primary} mb-4`}>
          ✏️ Editar Clip
        </h3>
        
        {/* Timestamp */}
        <label className={`block text-sm ${theme.text.muted} mb-2`}>Timestamp</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            value={minutes}
            onChange={(e) => { setMinutes(e.target.value); setError(''); }}
            min="0"
            className={`w-20 px-3 py-2 rounded-lg bg-white/10 ${theme.text.primary}
              border border-white/20 focus:border-white/40 focus:outline-none text-center`}
          />
          <span className={`text-xl ${theme.text.muted}`}>:</span>
          <input
            type="number"
            value={seconds}
            onChange={(e) => { setSeconds(e.target.value); setError(''); }}
            min="0"
            max="59"
            className={`w-20 px-3 py-2 rounded-lg bg-white/10 ${theme.text.primary}
              border border-white/20 focus:border-white/40 focus:outline-none text-center`}
          />
        </div>
        
        {/* Category */}
        <label className={`block text-sm ${theme.text.muted} mb-2`}>Categoría</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg bg-white/10 ${theme.text.primary}
            border border-white/20 focus:border-white/40 focus:outline-none mb-4`}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.emoji} {cat.name}
            </option>
          ))}
        </select>
        
        {/* Note */}
        <label className={`block text-sm ${theme.text.muted} mb-2`}>Nota (opcional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Añadir nota..."
          className={`w-full px-3 py-2 rounded-lg bg-white/10 ${theme.text.primary}
            border border-white/20 focus:border-white/40 focus:outline-none mb-4`}
        />
        
        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2.5 rounded-xl bg-white/10 ${theme.text.muted}
              hover:bg-white/20 transition-colors`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500
              text-white font-medium hover:opacity-90 transition-opacity"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClipMarker;
