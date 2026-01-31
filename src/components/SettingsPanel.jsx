import { useState, useRef } from 'react';
import { X, Settings, RotateCcw, Download, Upload } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

const AUTO_SAVE_OPTIONS = [
  { value: 0, label: 'Deshabilitado' },
  { value: 10000, label: '10 segundos' },
  { value: 30000, label: '30 segundos' },
  { value: 60000, label: '1 minuto' },
];

const NOTIFICATION_DURATION_OPTIONS = [
  { value: 2000, label: '2 segundos' },
  { value: 3000, label: '3 segundos' },
  { value: 5000, label: '5 segundos' },
];

/**
 * Settings panel modal component
 */
function SettingsPanel({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdateSetting, 
  onReset,
  categories,
  customPresets = [],
  sessions = [],
  onImportConfig
}) {
  const { theme, currentTheme } = useTheme();
  const fileInputRef = useRef(null);
  const [includeHistory, setIncludeHistory] = useState(false);

  if (!isOpen) return null;

  // Export config as JSON file
  const handleExportConfig = () => {
    const config = {
      version: '1.2',
      exportedAt: new Date().toISOString(),
      settings: settings,
      categories: categories,
      customPresets: customPresets,
      theme: currentTheme
    };

    // Optionally include session history
    if (includeHistory && sessions && sessions.length > 0) {
      config.sessions = sessions;
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clipmarker-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import config from JSON file
  const handleImportConfig = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        
        // Validate config structure
        if (!config.version || !config.settings) {
          alert('Archivo de configuración inválido');
          return;
        }

        // Call parent handler with imported config
        if (onImportConfig) {
          onImportConfig(config);
        }
      } catch (err) {
        alert('Error al leer el archivo: ' + err.message);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className={`${theme.glass} rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings className={`w-5 h-5 ${theme.text.secondary}`} />
            <h3 className={`text-xl font-bold ${theme.text.primary}`}>
              Configuración
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors`}
          >
            <X className={`w-5 h-5 ${theme.text.muted}`} />
          </button>
        </div>

        {/* Settings Options */}
        <div className="space-y-6">
          {/* Auto-save Interval */}
          <div>
            <label className={`block text-sm font-medium ${theme.text.primary} mb-2`}>
              Guardado automático
            </label>
            <select
              value={settings.autoSaveInterval}
              onChange={(e) => onUpdateSetting('autoSaveInterval', Number(e.target.value))}
              className={`w-full px-4 py-2.5 rounded-xl ${theme.card} ${theme.text.primary}
                border border-white/20 focus:border-white/40 focus:outline-none
                bg-transparent cursor-pointer`}
            >
              {AUTO_SAVE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-gray-800">
                  {opt.label}
                </option>
              ))}
            </select>
            <p className={`mt-1 text-xs ${theme.text.muted}`}>
              Guarda automáticamente la sesión mientras grabas
            </p>
          </div>

          {/* Sound Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <label className={`block text-sm font-medium ${theme.text.primary}`}>
                Sonidos de notificación
              </label>
              <p className={`text-xs ${theme.text.muted}`}>
                Reproduce sonidos al marcar clips
              </p>
            </div>
            <button
              onClick={() => onUpdateSetting('soundEnabled', !settings.soundEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Notification Duration */}
          <div>
            <label className={`block text-sm font-medium ${theme.text.primary} mb-2`}>
              Duración de notificaciones
            </label>
            <select
              value={settings.notificationDuration}
              onChange={(e) => onUpdateSetting('notificationDuration', Number(e.target.value))}
              className={`w-full px-4 py-2.5 rounded-xl ${theme.card} ${theme.text.primary}
                border border-white/20 focus:border-white/40 focus:outline-none
                bg-transparent cursor-pointer`}
            >
              {NOTIFICATION_DURATION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-gray-800">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Show Hotkey Badges */}
          <div className="flex items-center justify-between">
            <div>
              <label className={`block text-sm font-medium ${theme.text.primary}`}>
                Mostrar atajos de teclado
              </label>
              <p className={`text-xs ${theme.text.muted}`}>
                Muestra badges de hotkeys en los botones
              </p>
            </div>
            <button
              onClick={() => onUpdateSetting('showHotkeyBadges', !settings.showHotkeyBadges)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.showHotkeyBadges ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                settings.showHotkeyBadges ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Export/Import Section */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <h4 className={`text-sm font-medium ${theme.text.primary} mb-3`}>
            Backup de Configuración
          </h4>
          
          {/* Include History Checkbox */}
          {sessions.length > 0 && (
            <label className={`flex items-center gap-2 mb-3 cursor-pointer`}>
              <input
                type="checkbox"
                checked={includeHistory}
                onChange={(e) => setIncludeHistory(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500"
              />
              <span className={`text-sm ${theme.text.primary}`}>
                Incluir historial de sesiones ({sessions.length})
              </span>
            </label>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={handleExportConfig}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium
                hover:opacity-90 transition-opacity`}
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                ${theme.card} hover:bg-white/10 transition-colors ${theme.text.primary}
                border border-white/20`}
            >
              <Upload className="w-4 h-4" />
              Importar
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              className="hidden"
            />
          </div>
          <p className={`mt-2 text-xs ${theme.text.muted}`}>
            Exporta tus ajustes y categorías personalizadas
          </p>
        </div>

        {/* Reset Button */}
        <div className="mt-4">
          <button
            onClick={onReset}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              ${theme.card} hover:bg-white/10 transition-colors ${theme.text.muted}`}
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer valores por defecto
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;

