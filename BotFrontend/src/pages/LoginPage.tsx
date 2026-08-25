import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Eye, EyeOff} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { session } = useAuth();
  
  // Bot Tracking State
  const headRef = useRef<HTMLDivElement>(null);
  const [headStyle, setHeadStyle] = useState({ rotateX: 0, rotateY: 0, translateX: 0, translateY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headRef.current) return;
      
      const rect = headRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const distX = mouseX - centerX;
      const distY = mouseY - centerY;
      
      const maxDistX = window.innerWidth / 2;
      const maxDistY = window.innerHeight / 2;
      
      const rotateY = (distX / maxDistX) * 25; // max 25deg rotation
      const rotateX = -(distY / maxDistY) * 25;
      const translateX = (distX / maxDistX) * 20; // max 20px translation
      const translateY = (distY / maxDistY) * 20;
      
      setHeadStyle({ rotateX, rotateY, translateX, translateY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (session) {
      navigate('/panel');
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/panel');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        navigate('/panel');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/panel`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar con Google');
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans selection:bg-sky-500/30 selection:text-zinc-900 dark:selection:text-white bg-white dark:bg-black">
      {/* Actions */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
        <Link to="/" className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors" title="Volver al inicio">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between items-center p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-xs mx-auto flex-1 flex flex-col justify-center">
          
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-3">
              {isLogin ? 'Bienvenido' : 'Crea tu cuenta'}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              {/* {isLogin ? 'Por favor ingresa tus datos' : 'Ingresa tus datos para registrarte'} */}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-0 focus:border-zinc-900 dark:focus:border-white transition-colors"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-2 pr-10 bg-transparent border-0 border-b border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-0 focus:border-zinc-900 dark:focus:border-white transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between mt-6 mb-8 text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 border border-zinc-300 dark:border-zinc-600 rounded-sm checked:bg-zinc-900 dark:checked:bg-white checked:border-zinc-900 dark:checked:border-white transition-all cursor-pointer" />
                    <svg className="absolute w-3 h-3 text-white dark:text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">Recordarme por 30 días</span>
                </label>
                <button type="button" className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-full text-white dark:text-black bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-white dark:focus:ring-offset-black font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
              )}
            </button>
          </form>

          {/* Botón Google */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 mt-4 rounded-full text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all font-semibold"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continuar con Google</span>
          </button>
        </div>

        <div className="mt-8 text-center pb-4">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-zinc-900 dark:text-white hover:underline focus:outline-none"
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </div>
      </div>

      {/* Right Side: Decorative elements */}
      <div className="hidden lg:flex w-1/2 bg-black items-center justify-center relative overflow-hidden border-l border-zinc-800">
        
        <div className="relative z-10 flex flex-col items-center justify-center mt-12" style={{ perspective: 1000 }}>
          
          {/* Glow Effect */}
          <motion.div 
            animate={{ 
              x: headStyle.translateX * 5, 
              y: headStyle.translateY * 5 
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-1/2 left-1/2 -ml-[200px] -mt-[200px] w-[400px] h-[400px] bg-white/50 dark:bg-white/40 rounded-full blur-[100px] z-0 animate-pulse pointer-events-none"
          />

          {/* Unified Bot Entrance Container */}
          <motion.div
            initial={{ scale: 0.6, x: 250, y: -150, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="z-20 relative flex flex-col items-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            style={{ perspective: 1000 }}
          >
            {/* Bot Head (Mouse Tracking) */}
            <motion.div
              ref={headRef}
              animate={{ 
                rotateX: headStyle.rotateX,
                rotateY: headStyle.rotateY,
                x: headStyle.translateX,
                y: headStyle.translateY
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{ transformStyle: 'preserve-3d', transformOrigin: 'bottom center' }}
              className="z-20 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-40 h-40 text-zinc-900 dark:text-white">
                <path d="M 50 30 L 50 12 L 32 12" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="15" y1="55" x2="5" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                <line x1="85" y1="55" x2="95" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                <rect x="15" y="30" width="70" height="50" rx="12" className="fill-[#EBEBEB] dark:fill-zinc-800" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
                <rect x="35" y="45" width="8" height="20" rx="4" className="fill-sky-500" />
                <rect x="57" y="45" width="8" height="20" rx="4" className="fill-sky-500" />
              </svg>
            </motion.div>

            {/* Bot Body (Static) */}
            <div className="z-10 -mt-10 pointer-events-none relative">
                <svg width="220" height="220" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900 dark:text-white">
                  <rect x="40" y="0" width="20" height="12" className="fill-zinc-900 dark:fill-white" />
                  <g>
                    <path d="M 30 20 Q 0 50 15 85 Q 20 85 25 75 Q 35 50 30 20 Z" className="fill-zinc-900 dark:fill-white" />
                    <path d="M 26 20 Q -4 50 11 85 Q 16 85 21 75 Q 31 50 26 20 Z" className="fill-[#EBEBEB] dark:fill-zinc-800" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
                  </g>
                  <g>
                    <path d="M 70 20 Q 100 50 85 85 Q 80 85 75 75 Q 65 50 70 20 Z" className="fill-zinc-900 dark:fill-white" />
                    <path d="M 74 20 Q 104 50 89 85 Q 84 85 79 75 Q 69 50 74 20 Z" className="fill-[#EBEBEB] dark:fill-zinc-800" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
                  </g>
                  <path d="M 25 12 Q 50 0 75 12 C 95 35 75 95 50 95 C 25 95 5 35 25 12 Z" className="fill-[#EBEBEB] dark:fill-zinc-800" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
                  <path d="M 32 18 Q 18 50 42 88" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 68 18 Q 82 50 58 88" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="50" cy="48" r="10" className="fill-sky-500" stroke="currentColor" strokeWidth="5" />
                  <circle cx="50" cy="48" r="4.5" className="fill-zinc-900 dark:fill-white" />
                </svg>
              </div>
          </motion.div>

          {/* <h2 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-12 mb-4">
            BotEli
          </h2> */}
        </div>
      </div>
    </div>
  );
}
