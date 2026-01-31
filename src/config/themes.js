// Theme configurations
export const THEMES = {
  darkPurple: {
    id: 'darkPurple',
    name: 'Dark Purple Gaming',
    background: 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900',
    primary: 'purple',
    accent: 'cyan',
    glass: 'bg-white/10 backdrop-blur-lg border border-white/20',
    card: 'bg-white/5 backdrop-blur-md border border-white/10',
    text: {
      primary: 'text-white',
      secondary: 'text-purple-300',
      muted: 'text-gray-400'
    }
  },
  neonCyberpunk: {
    id: 'neonCyberpunk',
    name: 'Neon Cyberpunk',
    background: 'bg-gradient-to-br from-black via-pink-900 to-purple-900',
    primary: 'pink',
    accent: 'purple',
    glass: 'bg-white/10 backdrop-blur-lg border border-pink-500/30',
    card: 'bg-white/5 backdrop-blur-md border border-pink-500/20',
    text: {
      primary: 'text-white',
      secondary: 'text-pink-300',
      muted: 'text-gray-400'
    }
  },
  oceanBlue: {
    id: 'oceanBlue',
    name: 'Ocean Blue',
    background: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900',
    primary: 'cyan',
    accent: 'teal',
    glass: 'bg-white/10 backdrop-blur-lg border border-cyan-500/30',
    card: 'bg-white/5 backdrop-blur-md border border-cyan-500/20',
    text: {
      primary: 'text-white',
      secondary: 'text-cyan-300',
      muted: 'text-gray-400'
    }
  },
  forestGreen: {
    id: 'forestGreen',
    name: 'Forest Green',
    background: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900',
    primary: 'emerald',
    accent: 'teal',
    glass: 'bg-white/10 backdrop-blur-lg border border-emerald-500/30',
    card: 'bg-white/5 backdrop-blur-md border border-emerald-500/20',
    text: {
      primary: 'text-white',
      secondary: 'text-emerald-300',
      muted: 'text-gray-400'
    }
  },
  sunsetOrange: {
    id: 'sunsetOrange',
    name: 'Sunset Orange',
    background: 'bg-gradient-to-br from-orange-900 via-red-900 to-pink-900',
    primary: 'orange',
    accent: 'pink',
    glass: 'bg-white/10 backdrop-blur-lg border border-orange-500/30',
    card: 'bg-white/5 backdrop-blur-md border border-orange-500/20',
    text: {
      primary: 'text-white',
      secondary: 'text-orange-300',
      muted: 'text-gray-400'
    }
  }
};

export const DEFAULT_THEME = 'darkPurple';
