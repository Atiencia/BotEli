import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass bg-gray-900/95 w-full max-w-sm rounded-3xl border border-gray-700 shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 relative flex flex-col items-center text-center">
        
        {/* Botón Cerrar (Esquina) */}
        <button 
          onClick={onCancel} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors bg-gray-800/50 hover:bg-gray-700 rounded-full p-1.5"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icono Principal (Centrado Arriba) */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        {/* Título */}
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        
        {/* Mensaje */}
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          {message}
        </p>
        
        {/* Botones */}
        <div className="flex justify-center space-x-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-red-600/30 font-medium text-sm"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
