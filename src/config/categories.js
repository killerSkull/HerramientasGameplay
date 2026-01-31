// Default categories configuration
export const DEFAULT_CATEGORIES = [
  { 
    id: 'epic',
    name: 'Épico', 
    emoji: '🔥', 
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
    hotkey: '1'
  },
  { 
    id: 'funny',
    name: 'Gracioso', 
    emoji: '😂', 
    color: 'from-yellow-400 to-orange-400',
    bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-400',
    hotkey: '2'
  },
  { 
    id: 'fail',
    name: 'Fail', 
    emoji: '💀', 
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    hotkey: '3'
  },
  { 
    id: 'thumbnail',
    name: 'Thumbnail', 
    emoji: '⭐', 
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    hotkey: '4'
  }
];

// Category presets for different use cases
export const CATEGORY_PRESETS = {
  streamer: DEFAULT_CATEGORIES,
  competitive: [
    { id: 'clutch', name: 'Clutch', emoji: '🎯', color: 'from-red-500 to-orange-500', bgColor: 'bg-gradient-to-r from-red-500 to-orange-500', hotkey: '1' },
    { id: 'ace', name: 'Ace', emoji: '🏆', color: 'from-yellow-400 to-amber-500', bgColor: 'bg-gradient-to-r from-yellow-400 to-amber-500', hotkey: '2' },
    { id: 'fail', name: 'Fail', emoji: '💀', color: 'from-purple-500 to-pink-500', bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500', hotkey: '3' },
    { id: 'strategy', name: 'Estrategia', emoji: '🧠', color: 'from-blue-500 to-indigo-500', bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500', hotkey: '4' },
  ],
  speedrun: [
    { id: 'wr', name: 'WR Pace', emoji: '🏅', color: 'from-amber-400 to-yellow-500', bgColor: 'bg-gradient-to-r from-amber-400 to-yellow-500', hotkey: '1' },
    { id: 'pb', name: 'PB Pace', emoji: '✨', color: 'from-green-400 to-emerald-500', bgColor: 'bg-gradient-to-r from-green-400 to-emerald-500', hotkey: '2' },
    { id: 'mistake', name: 'Error', emoji: '❌', color: 'from-red-500 to-rose-500', bgColor: 'bg-gradient-to-r from-red-500 to-rose-500', hotkey: '3' },
    { id: 'split', name: 'Split', emoji: '⏱️', color: 'from-cyan-400 to-blue-500', bgColor: 'bg-gradient-to-r from-cyan-400 to-blue-500', hotkey: '4' },
  ]
};
