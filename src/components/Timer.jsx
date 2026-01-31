import { Play, Pause, Square, Clock } from 'lucide-react';
import { formatTime } from '../utils/formatters';
import { useTheme } from '../ThemeProvider';

function Timer({ 
  isRunning, 
  isPaused, 
  elapsedTime, 
  sessionName, 
  onStart, 
  onPause, 
  onStop, 
  onSessionNameChange 
}) {
  const { theme } = useTheme();

  return (
    <div className={`${theme.glass} rounded-2xl p-6 md:p-8 text-center`}>
      {/* Timer Display */}
      <div className="mb-6">
        <div className={`text-5xl md:text-7xl font-mono font-bold ${theme.text.primary} tracking-wider`}>
          {formatTime(elapsedTime)}
        </div>
        <div className={`flex items-center justify-center gap-2 mt-2 ${theme.text.muted}`}>
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {isRunning 
              ? isPaused 
                ? 'Sesión pausada' 
                : 'Grabando...' 
              : 'Listo para grabar'}
          </span>
        </div>
      </div>

      {/* Session Name Input */}
      <div className="mb-6">
        <input
          type="text"
          value={sessionName}
          onChange={(e) => onSessionNameChange(e.target.value)}
          placeholder="Nombre de la sesión (ej: Minecraft EP.1)"
          disabled={isRunning}
          className={`w-full px-4 py-3 rounded-xl ${theme.card} ${theme.text.primary} placeholder-gray-500 
            focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <button
            onClick={onStart}
            disabled={!sessionName.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 
              text-white font-semibold rounded-xl shadow-lg shadow-green-500/30
              hover:shadow-green-500/50 hover:scale-105 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Play className="w-5 h-5" />
            Iniciar Sesión
          </button>
        ) : (
          <>
            <button
              onClick={isPaused ? onStart : onPause}
              className={`flex items-center gap-2 px-5 py-3 
                ${isPaused 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30 hover:shadow-green-500/50' 
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/30 hover:shadow-yellow-500/50'
                }
                text-white font-semibold rounded-xl shadow-lg
                hover:scale-105 transition-all duration-200`}
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5" />
                  Reanudar
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  Pausar
                </>
              )}
            </button>
            <button
              onClick={onStop}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-rose-500 
                text-white font-semibold rounded-xl shadow-lg shadow-red-500/30
                hover:shadow-red-500/50 hover:scale-105 transition-all duration-200"
            >
              <Square className="w-5 h-5" />
              Detener
            </button>
          </>
        )}
      </div>

      {/* Hotkey Hints */}
      {!isRunning && (
        <p className={`mt-4 text-xs ${theme.text.muted}`}>
          Presiona <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Ctrl+S</kbd> para iniciar rápidamente
        </p>
      )}
    </div>
  );
}

export default Timer;
