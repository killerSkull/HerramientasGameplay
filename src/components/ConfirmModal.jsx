import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

/**
 * Reusable confirmation modal for destructive actions
 */
function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger' // 'danger' | 'warning' | 'info'
}) {
  const { theme } = useTheme();
  
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <Trash2 className="w-8 h-8 text-red-400" />,
      iconBg: 'bg-red-500/20',
      button: 'bg-gradient-to-r from-red-500 to-rose-500'
    },
    warning: {
      icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
      iconBg: 'bg-amber-500/20',
      button: 'bg-gradient-to-r from-amber-500 to-orange-500'
    },
    info: {
      icon: <AlertTriangle className="w-8 h-8 text-blue-400" />,
      iconBg: 'bg-blue-500/20',
      button: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    }
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl
          animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className={`w-5 h-5 ${theme.text.muted}`} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full ${styles.iconBg} flex items-center justify-center`}>
            {styles.icon}
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold ${theme.text.primary} text-center mb-2`}>
          {title}
        </h3>

        {/* Message */}
        <p className={`text-sm ${theme.text.muted} text-center mb-6`}>
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2.5 rounded-xl bg-white/10 ${theme.text.primary}
              hover:bg-white/20 transition-colors font-medium`}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-xl ${styles.button}
              text-white font-medium hover:opacity-90 transition-opacity`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
