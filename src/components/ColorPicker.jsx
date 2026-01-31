import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

// Preset gradients for category buttons
const GRADIENT_PRESETS = [
  { id: 'orange-red', from: 'orange-500', to: 'red-500', label: 'Fuego' },
  { id: 'yellow-orange', from: 'yellow-400', to: 'orange-400', label: 'Sol' },
  { id: 'purple-pink', from: 'purple-500', to: 'pink-500', label: 'Neón' },
  { id: 'blue-cyan', from: 'blue-500', to: 'cyan-500', label: 'Océano' },
  { id: 'green-emerald', from: 'green-500', to: 'emerald-500', label: 'Bosque' },
  { id: 'indigo-purple', from: 'indigo-500', to: 'purple-500', label: 'Galaxia' },
  { id: 'rose-pink', from: 'rose-500', to: 'pink-500', label: 'Rosa' },
  { id: 'amber-yellow', from: 'amber-400', to: 'yellow-500', label: 'Oro' },
  { id: 'teal-cyan', from: 'teal-500', to: 'cyan-500', label: 'Agua' },
  { id: 'red-rose', from: 'red-500', to: 'rose-500', label: 'Carmesí' },
  { id: 'lime-green', from: 'lime-500', to: 'green-500', label: 'Lima' },
  { id: 'fuchsia-purple', from: 'fuchsia-500', to: 'purple-500', label: 'Magenta' },
];

/**
 * Creates Tailwind gradient classes from preset
 */
export function getGradientClasses(preset) {
  return {
    color: `from-${preset.from} to-${preset.to}`,
    bgColor: `bg-gradient-to-r from-${preset.from} to-${preset.to}`
  };
}

/**
 * Color/gradient picker component
 */
function ColorPicker({ isOpen, onClose, onSelect, selectedGradient }) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  // Parse selected gradient to find matching preset
  const getSelectedPresetId = () => {
    if (!selectedGradient) return null;
    const match = GRADIENT_PRESETS.find(p => 
      selectedGradient.includes(p.from) && selectedGradient.includes(p.to)
    );
    return match?.id || null;
  };

  const selectedId = getSelectedPresetId();

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className={`${theme.glass} rounded-2xl p-4 max-w-sm w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h4 className={`text-lg font-semibold ${theme.text.primary}`}>
            Seleccionar Color
          </h4>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className={`w-4 h-4 ${theme.text.muted}`} />
          </button>
        </div>

        {/* Gradient Grid */}
        <div className="grid grid-cols-3 gap-3">
          {GRADIENT_PRESETS.map((preset) => {
            const isSelected = selectedId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  const { color, bgColor } = getGradientClasses(preset);
                  onSelect({ color, bgColor, presetId: preset.id });
                  onClose();
                }}
                className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all
                  ${isSelected ? 'ring-2 ring-white/50 scale-105' : 'hover:scale-105'}`}
              >
                <div className={`w-full h-8 rounded-lg bg-gradient-to-r from-${preset.from} to-${preset.to}`} />
                <span className={`text-xs ${theme.text.muted}`}>{preset.label}</span>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                    <Check className="w-3 h-3 text-gray-900" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;
export { GRADIENT_PRESETS };
