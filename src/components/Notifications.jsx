import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

function Notifications({ notifications, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map((notification) => (
        <Toast 
          key={notification.id} 
          notification={notification} 
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

function Toast({ notification, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(notification.id), 300);
    }, notification.duration || 3000);

    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-500/30';
      case 'error':
        return 'border-red-500/30';
      case 'info':
      default:
        return 'border-cyan-500/30';
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 
        bg-gray-900/95 backdrop-blur-lg rounded-xl border ${getBorderColor()}
        shadow-xl transform transition-all duration-300
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
    >
      {getIcon()}
      <span className="text-white text-sm font-medium">{notification.message}</span>
      <button
        onClick={handleDismiss}
        className="ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

export default Notifications;

// Create a beep sound using Web Audio API
const playBeep = (frequency = 800, duration = 100, volume = 0.3) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (err) {
    console.warn('Could not play sound:', err);
  }
};

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const notify = (message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
  };

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Play sound only (no visual notification)
  const playSound = (type = 'success') => {
    const sounds = {
      success: { frequency: 880, duration: 100 },
      error: { frequency: 300, duration: 200 },
      info: { frequency: 600, duration: 80 }
    };
    const sound = sounds[type] || sounds.success;
    playBeep(sound.frequency, sound.duration);
  };

  return { notifications, notify, dismiss, playSound };
}
