import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { MessageSquare, BookOpen, Settings,LogOut, Activity, Menu, X } from 'lucide-react';
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
      
      <aside className={`fixed md:relative w-64 h-screen border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md flex flex-col z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8">
              <path d="M55 35 V20 H40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" className="text-zinc-900 dark:text-white" />
              <line x1="10" y1="55" x2="18" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-zinc-900 dark:text-white" />
              <line x1="82" y1="55" x2="90" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-zinc-900 dark:text-white" />
              <rect x="18" y="35" width="64" height="40" rx="12" stroke="currentColor" strokeWidth="8" fill="none" className="text-zinc-900 dark:text-white" />
              <rect x="34" y="48" width="10" height="18" rx="5" className="fill-sky-500" />
              <rect x="56" y="48" width="10" height="18" rx="5" className="fill-sky-500" />
            </svg>
            <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">BotEli</span>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <button className="md:hidden text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white" onClick={() => setIsOpen(false)}>
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
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out ${
                  isActive 
                    ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm font-semibold' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <div className={`${isActive ? 'text-sky-500' : ''}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
            <p className="text-xs text-zinc-500 mb-1">Sesión iniciada como</p>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{user?.email}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
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
    <div className="flex h-screen bg-[#F2F2F2] dark:bg-[#0a0a0a] overflow-hidden relative transition-colors duration-300 selection:bg-sky-500/30 selection:text-white">

      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 h-screen overflow-hidden flex flex-col z-10 relative">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
              <path d="M55 35 V20 H40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" className="text-zinc-900 dark:text-white" />
              <line x1="10" y1="55" x2="18" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-zinc-900 dark:text-white" />
              <line x1="82" y1="55" x2="90" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-zinc-900 dark:text-white" />
              <rect x="18" y="35" width="64" height="40" rx="12" stroke="currentColor" strokeWidth="8" fill="none" className="text-zinc-900 dark:text-white" />
              <rect x="34" y="48" width="10" height="18" rx="5" className="fill-sky-500" />
              <rect x="56" y="48" width="10" height="18" rx="5" className="fill-sky-500" />
            </svg>
            <span className="font-bold text-zinc-900 dark:text-white tracking-tight">Eli Panel</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors">
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

import { ThemeProvider } from './context/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="boteli-theme">
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
    </ThemeProvider>
  );
}


