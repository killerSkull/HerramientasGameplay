import { useTheme } from '../ThemeProvider';

function Timeline({ clips, totalDuration, onClipClick }) {
  const { theme } = useTheme();

  if (totalDuration === 0) {
    return null;
  }

  // Group clips that are too close together
  const getMarkerPosition = (timestamp) => {
    return (timestamp / totalDuration) * 100;
  };

  return (
    <div className={`${theme.glass} rounded-2xl p-4 md:p-6`}>
      <h3 className={`text-lg font-semibold ${theme.text.primary} mb-4 flex items-center gap-2`}>
        📊 Timeline
      </h3>

      {/* Timeline Bar */}
      <div className="relative">
        {/* Background Track */}
        <div className={`h-8 md:h-10 ${theme.card} rounded-full overflow-hidden relative`}>
          {/* Progress gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20" />
        </div>

        {/* Clip Markers */}
        <div className="absolute inset-0 flex items-center">
          {clips.map((clip, index) => {
            const position = getMarkerPosition(clip.timestamp);
            
            return (
              <div
                key={clip.id}
                className="absolute group"
                style={{ 
                  left: `${position}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {/* Marker Line */}
                <div 
                  className={`w-1 h-8 md:h-10 ${clip.category.bgColor} rounded-full 
                    shadow-lg cursor-pointer transform transition-all duration-200
                    group-hover:scale-x-150 group-hover:shadow-xl`}
                  onClick={() => onClipClick?.(clip)}
                />
                
                {/* Emoji on top */}
                <div 
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg md:text-xl
                    transform transition-all duration-200 group-hover:scale-125 group-hover:-translate-y-1
                    cursor-pointer select-none"
                  onClick={() => onClipClick?.(clip)}
                >
                  {clip.category.emoji}
                </div>

                {/* Tooltip on hover */}
                <div 
                  className={`absolute top-12 left-1/2 -translate-x-1/2 
                    ${theme.glass} px-3 py-2 rounded-lg text-sm whitespace-nowrap
                    opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                    ${theme.text.primary} z-10`}
                >
                  <div className="font-mono font-semibold">{clip.timestampFormatted}</div>
                  <div className={`text-xs ${theme.text.muted}`}>{clip.category.name}</div>
                  {clip.note && (
                    <div className={`text-xs ${theme.text.secondary} max-w-32 truncate`}>
                      {clip.note}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Labels */}
      <div className={`flex justify-between mt-2 text-xs ${theme.text.muted} font-mono`}>
        <span>00:00:00</span>
        <span>{formatDuration(totalDuration)}</span>
      </div>

      {/* Legend */}
      {clips.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          {getUniqueCategories(clips).map(cat => (
            <div key={cat.id} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${cat.bgColor}`} />
              <span className={`text-xs ${theme.text.muted}`}>
                {cat.emoji} {cat.name} ({getClipCount(clips, cat.id)})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [hours, minutes, seconds]
    .map(val => val.toString().padStart(2, '0'))
    .join(':');
}

function getUniqueCategories(clips) {
  const seen = new Set();
  return clips.filter(clip => {
    if (seen.has(clip.category.id)) return false;
    seen.add(clip.category.id);
    return true;
  }).map(clip => clip.category);
}

function getClipCount(clips, categoryId) {
  return clips.filter(c => c.category.id === categoryId).length;
}

export default Timeline;
