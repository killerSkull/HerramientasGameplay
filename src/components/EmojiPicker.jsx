import { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

// Common gaming/content creation emojis
const EMOJI_CATEGORIES = {
  gaming: ['🔥', '💀', '🎮', '🏆', '⚔️', '🎯', '💥', '⚡', '🎪', '🕹️'],
  reactions: ['😂', '😱', '🤯', '😭', '🥺', '😤', '🤣', '😎', '🙈', '💪'],
  achievements: ['⭐', '✨', '🌟', '💎', '👑', '🎖️', '🏅', '🥇', '🏵️', '🎗️'],
  actions: ['💡', '🚀', '⏱️', '📸', '🎬', '🎥', '📍', '🔔', '💬', '✅'],
  misc: ['❌', '⚠️', '🔄', '🎁', '💰', '❤️', '🧠', '👀', '🤔', '🎉']
};

/**
 * Simple emoji picker component
 */
function EmojiPicker({ isOpen, onClose, onSelect, selectedEmoji }) {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('gaming');

  if (!isOpen) return null;

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
            Seleccionar Emoji
          </h4>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className={`w-4 h-4 ${theme.text.muted}`} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 mb-3 overflow-x-auto">
          {Object.entries(EMOJI_CATEGORIES).map(([key, emojis]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors whitespace-nowrap ${
                activeCategory === key 
                  ? 'bg-white/20 ' + theme.text.primary 
                  : theme.text.muted + ' hover:bg-white/10'
              }`}
            >
              {emojis[0]} {key}
            </button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="grid grid-cols-5 gap-2">
          {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className={`p-3 text-2xl rounded-xl transition-all hover:scale-110
                ${selectedEmoji === emoji ? 'bg-white/20 ring-2 ring-white/40' : 'hover:bg-white/10'}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmojiPicker;
