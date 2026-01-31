import { useState } from 'react';
import { X, Plus, Trash2, GripVertical, RotateCcw, Folder, Save } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { CATEGORY_PRESETS } from '../config/categories';
import EmojiPicker from './EmojiPicker';
import ColorPicker, { GRADIENT_PRESETS } from './ColorPicker';

/**
 * Category Editor modal component
 */
function CategoryEditor({ 
  isOpen, 
  onClose, 
  categories, 
  onAddCategory, 
  onUpdateCategory, 
  onRemoveCategory, 
  onReorderCategories,
  onLoadPreset,
  onResetToDefault,
  customPresets = [],
  onSavePreset,
  onDeletePreset
}) {
  const { theme } = useTheme();
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [emojiPickerFor, setEmojiPickerFor] = useState(null);
  const [colorPickerFor, setColorPickerFor] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showPresets, setShowPresets] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (categories.length >= 8) return;
    
    // Get a random gradient from presets
    const randomPreset = GRADIENT_PRESETS[Math.floor(Math.random() * GRADIENT_PRESETS.length)];
    const color = `from-${randomPreset.from} to-${randomPreset.to}`;
    const bgColor = `bg-gradient-to-r from-${randomPreset.from} to-${randomPreset.to}`;
    
    onAddCategory({
      name: 'Nueva',
      emoji: '⭐',
      color,
      bgColor
    });
  };

  const handleStartEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleSaveEdit = (id) => {
    if (editingName.trim()) {
      onUpdateCategory(id, { name: editingName.trim() });
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    onReorderCategories(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className={`${theme.glass} rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Folder className={`w-5 h-5 ${theme.text.secondary}`} />
            <h3 className={`text-xl font-bold ${theme.text.primary}`}>
              Editor de Categorías
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors`}
          >
            <X className={`w-5 h-5 ${theme.text.muted}`} />
          </button>
        </div>

        {/* Presets Section */}
        <div className="mb-4 space-y-2">
          {/* Load Preset Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl 
                ${theme.card} hover:bg-white/10 transition-colors ${theme.text.primary}`}
            >
              <span>Cargar preset...</span>
              <span className={theme.text.muted}>▼</span>
            </button>
            
            {showPresets && (
              <div className={`absolute left-0 right-0 top-full mt-1 bg-gray-900 border border-white/20 rounded-xl p-2 z-10 shadow-xl max-h-60 overflow-y-auto`}>
                {/* Built-in Presets */}
                <p className={`px-3 py-1 text-xs ${theme.text.muted} uppercase`}>Presets integrados</p>
                {Object.entries(CATEGORY_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onLoadPreset(preset);
                      setShowPresets(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 
                      transition-colors ${theme.text.primary} capitalize`}
                  >
                    {key === 'streamer' && '🎥 '}
                    {key === 'competitive' && '🏆 '}
                    {key === 'speedrun' && '⏱️ '}
                    {key}
                  </button>
                ))}
                
                {/* Custom Presets */}
                {customPresets.length > 0 && (
                  <>
                    <hr className="border-white/10 my-2" />
                    <p className={`px-3 py-1 text-xs ${theme.text.muted} uppercase`}>Mis presets</p>
                    {customPresets.map((preset) => (
                      <div key={preset.id} className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onLoadPreset(preset.categories);
                            setShowPresets(false);
                          }}
                          className={`flex-1 text-left px-3 py-2 rounded-lg hover:bg-white/10 
                            transition-colors ${theme.text.primary}`}
                        >
                          ⭐ {preset.name}
                        </button>
                        <button
                          onClick={() => onDeletePreset(preset.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                          title="Eliminar preset"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Save Current as Preset */}
          <div className="flex gap-2">
            {showSavePreset ? (
              <>
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="Nombre del preset..."
                  className={`flex-1 px-3 py-2 rounded-xl ${theme.card} ${theme.text.primary}
                    border border-white/20 focus:border-white/40 focus:outline-none`}
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (newPresetName.trim() && onSavePreset) {
                      onSavePreset(newPresetName.trim(), categories);
                      setNewPresetName('');
                      setShowSavePreset(false);
                    }
                  }}
                  disabled={!newPresetName.trim()}
                  className={`px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 
                    text-white font-medium hover:opacity-90 transition-opacity
                    ${!newPresetName.trim() ? 'opacity-50' : ''}`}
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setShowSavePreset(false);
                    setNewPresetName('');
                  }}
                  className={`p-2 rounded-xl ${theme.card} hover:bg-white/10 transition-colors`}
                >
                  <X className={`w-5 h-5 ${theme.text.muted}`} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowSavePreset(true)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                  ${theme.card} hover:bg-white/10 transition-colors ${theme.text.muted}`}
              >
                <Save className="w-4 h-4" />
                Guardar categorías como preset
              </button>
            )}
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-2 mb-4">
          {categories.map((category, index) => (
            <div
              key={category.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 p-3 rounded-xl ${theme.card} 
                ${draggedIndex === index ? 'opacity-50' : ''} 
                transition-all cursor-move`}
            >
              {/* Drag Handle */}
              <GripVertical className={`w-4 h-4 ${theme.text.muted} flex-shrink-0`} />
              
              {/* Hotkey Badge */}
              <span className={`w-6 h-6 flex items-center justify-center rounded-lg 
                bg-white/10 text-xs ${theme.text.muted} flex-shrink-0`}>
                {category.hotkey}
              </span>

              {/* Emoji Button */}
              <button
                onClick={() => setEmojiPickerFor(category.id)}
                className="text-xl flex-shrink-0 hover:scale-110 transition-transform"
              >
                {category.emoji}
              </button>

              {/* Name Input/Display */}
              {editingId === category.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleSaveEdit(category.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(category.id)}
                  className={`flex-1 px-2 py-1 rounded-lg bg-white/10 ${theme.text.primary}
                    border border-white/20 focus:border-white/40 focus:outline-none`}
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => handleStartEdit(category)}
                  className={`flex-1 text-left ${theme.text.primary} hover:underline`}
                >
                  {category.name}
                </button>
              )}

              {/* Color Picker Button */}
              <button
                onClick={() => setColorPickerFor(category.id)}
                className={`w-8 h-6 rounded-lg ${category.bgColor} flex-shrink-0 
                  hover:scale-105 transition-transform border border-white/20`}
              />

              {/* Delete Button */}
              <button
                onClick={() => onRemoveCategory(category.id)}
                disabled={categories.length <= 1}
                className={`p-1.5 rounded-lg hover:bg-red-500/20 transition-colors 
                  ${categories.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <Trash2 className={`w-4 h-4 ${theme.text.muted}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Category Button */}
        <button
          onClick={handleAddCategory}
          disabled={categories.length >= 8}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
            border-2 border-dashed border-white/20 hover:border-white/40 
            transition-colors ${theme.text.muted}
            ${categories.length >= 8 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Plus className="w-4 h-4" />
          {categories.length >= 8 ? 'Máximo 8 categorías' : 'Añadir categoría'}
        </button>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex gap-2">
          <button
            onClick={onResetToDefault}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              ${theme.card} hover:bg-white/10 transition-colors ${theme.text.muted}`}
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer
          </button>
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500
              text-white font-medium hover:opacity-90 transition-opacity`}
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Emoji Picker Modal */}
      <EmojiPicker
        isOpen={emojiPickerFor !== null}
        onClose={() => setEmojiPickerFor(null)}
        onSelect={(emoji) => {
          if (emojiPickerFor) {
            onUpdateCategory(emojiPickerFor, { emoji });
          }
        }}
        selectedEmoji={emojiPickerFor ? categories.find(c => c.id === emojiPickerFor)?.emoji : null}
      />

      {/* Color Picker Modal */}
      <ColorPicker
        isOpen={colorPickerFor !== null}
        onClose={() => setColorPickerFor(null)}
        onSelect={({ color, bgColor }) => {
          if (colorPickerFor) {
            onUpdateCategory(colorPickerFor, { color, bgColor });
          }
        }}
        selectedGradient={colorPickerFor ? categories.find(c => c.id === colorPickerFor)?.color : null}
      />
    </div>
  );
}

export default CategoryEditor;
