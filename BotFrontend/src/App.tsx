import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { MessageSquare, BookOpen, Settings, Bot, LogOut, Activity, Menu, X } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import KnowledgePage from './pages/KnowledgePage';
import ChatsPage from './pages/ChatsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SimulatorPage from './pages/SimulatorPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';

import NotificationCenter from './components/NotificationCenter';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const navItems = [
    { path: '/panel/metricas', label: 'Métricas', icon: <Activity className="w-5 h-5" /> },
    { path: '/panel', label: 'Conocimiento', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/panel/chats', label: 'Conversaciones', icon: <MessageSquare className="w-5 h-5" /> },
    { path: '/panel/settings', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`fixed md:relative w-64 h-screen border-r border-gray-800 bg-gray-950/95 md:bg-gray-950/50 backdrop-blur-xl flex flex-col z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-400">
                Eli
              </h1>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out border ${
                  isActive 
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-sm' 
                    : 'border-transparent text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
              >
                <div className={`${isActive ? 'text-sky-400' : ''}`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800 space-y-4">
          <div className="px-4 py-2 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-1">Sesión iniciada como</p>
            <p className="text-sm font-medium text-gray-300 truncate">{user?.email}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden text-gray-100 relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 h-screen overflow-hidden flex flex-col z-10 relative">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Eli Panel</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white bg-gray-900 rounded-lg border border-gray-800">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1f2937', 
              color: '#f3f4f6', 
              border: '1px solid #374151', 
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#10b981', 
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', 
                secondary: '#fff',
              },
            },
          }}
        />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/demo" element={<SimulatorPage />} />
            <Route path="/privacidad" element={<PrivacyPolicyPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/panel" element={<DashboardLayout />}>
                <Route index element={<KnowledgePage />} />
                <Route path="metricas" element={<DashboardPage />} />
                <Route path="chats" element={<ChatsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}


