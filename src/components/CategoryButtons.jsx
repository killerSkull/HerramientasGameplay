import { useTheme } from '../ThemeProvider';

function CategoryButtons({ categories, onMarkClip, disabled }) {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onMarkClip(category)}
          disabled={disabled}
          className={`relative group p-4 md:p-6 rounded-2xl ${category.bgColor} 
            text-white font-semibold shadow-lg
            transform transition-all duration-200
            hover:scale-105 hover:shadow-xl
            active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
            overflow-hidden`}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <span className="text-3xl md:text-4xl">{category.emoji}</span>
            <span className="text-sm md:text-base font-medium">{category.name}</span>
            {category.hotkey && (
              <kbd className="absolute top-1 right-1 px-1.5 py-0.5 text-xs bg-black/30 rounded">
                {category.hotkey}
              </kbd>
            )}
          </div>

          {/* Ripple effect placeholder */}
          <div className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 rounded-full transition-transform duration-300 origin-center" />
        </button>
      ))}
    </div>
  );
}

export default CategoryButtons;
