import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function NotificationCenter() {
  const { customers } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Obtener los clientes que requieren ayuda
  const pendingChats = customers.filter(c => !c.is_bot_active);

  // Cerrar al clickear afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
      >
        <Bell className="w-5 h-5" />
        {pendingChats.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 shadow-lg ring-2 ring-gray-950 animate-bounce">
            {pendingChats.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-3 border-b border-gray-800 bg-gray-950/50">
            <h3 className="font-semibold text-gray-200 text-sm">Chats Pendientes</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {pendingChats.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Todo está en orden.
              </div>
            ) : (
              pendingChats.map(c => (
                <Link
                  key={c.id}
                  to={`/panel/chats?cliente=${c.platform_user_id}`}
                  onClick={() => setIsOpen(false)}
                  className="block p-3 border-b border-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <p className="text-xs text-gray-400 mb-1">Requiere ayuda humana</p>
                  <p className="text-sm font-medium text-gray-200 truncate">{c.platform_user_id}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
