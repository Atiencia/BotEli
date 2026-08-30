import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Eye, EyeOff, Mail, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { session } = useAuth();

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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans bg-zinc-100 dark:bg-black selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black relative overflow-hidden">

      {/* Subtle Monochrome Corner Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-zinc-300/40 dark:bg-zinc-800/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-zinc-300/40 dark:bg-zinc-800/20 blur-3xl pointer-events-none" />

      {/* Top Navigation */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/"
          className="p-2.5 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors inline-flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
          title="Volver al inicio"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Main Dual-Card Container (Overlapping Layout matching reference image in Black & White) */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center my-auto">

        {/* Left: Floating Form Card */}
        <div className="w-full md:w-[430px] bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.14)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] border border-zinc-200/80 dark:border-zinc-800 p-8 sm:p-10 relative z-20 md:-mr-12">

          {/* Header Title with Underline */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white inline-block relative pb-2.5">
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-black dark:bg-white rounded-full" />
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            {/* Email Field with Left Accent Border */}
            <div className="relative flex items-center bg-zinc-50/70 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl shadow-xs border-l-4 border-l-black dark:border-l-white overflow-hidden px-3.5 py-3 transition-all focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white">
              <Mail className="w-4 h-4 text-zinc-400 mr-2.5 flex-shrink-0" />
              <span className="text-zinc-300 dark:text-zinc-600 mr-2.5 select-none font-light">|</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresá tu correo"
                required
                className="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
              />
            </div>

            {/* Password Field with Left Accent Border */}
            <div className="relative flex items-center bg-zinc-50/70 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl shadow-xs border-l-4 border-l-black dark:border-l-white overflow-hidden px-3.5 py-3 transition-all focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white">
              <Key className="w-4 h-4 text-zinc-400 mr-2.5 flex-shrink-0" />
              <span className="text-zinc-300 dark:text-zinc-600 mr-2.5 select-none font-light">|</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá tu contraseña"
                required
                className="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-zinc-400 hover:text-black dark:hover:text-white focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Forgot Password */}
            {isLogin && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  className="text-xs font-semibold text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{isLogin ? 'INICIAR SESIÓN' : 'REGISTRARME'}</span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-400 text-[11px] uppercase">o</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-2xs hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Continuar con Google</span>
          </button>

          {/* Mobile Switcher */}
          <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400 md:hidden">
            <span>{isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}</span>{' '}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="font-bold text-black dark:text-white underline ml-1"
            >
              {isLogin ? 'Registrate' : 'Iniciá sesión'}
            </button>
          </div>
        </div>

        {/* Right: Curved Fluid Wave Welcome Panel in Deep Pure Black (Enlarged) */}
        <div className="hidden md:flex flex-col items-center justify-center text-center w-[540px] h-[560px] rounded-3xl bg-black dark:bg-zinc-950 text-white p-12 relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.35)] border border-zinc-800 dark:border-zinc-800/80">

          {/* Organic Fluid Wave Background Layers (Monochrome) */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 500 500" preserveAspectRatio="none" className="w-full h-full text-white">
              <path d="M0,120 C160,240 320,40 500,140 L500,0 L0,0 Z" fill="currentColor" />
              <path d="M0,320 C140,460 360,220 500,360 L500,500 L0,500 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          {/* Welcome Message */}
          <div className="relative z-10 mb-10 max-w-md">
            <h2 className="text-4xl font-black tracking-widest uppercase mb-4 text-white">
              {isLogin ? '¡BIENVENIDO!' : '¡HOLA!'}
            </h2>
            <p className="text-base text-zinc-300 dark:text-zinc-400 leading-relaxed font-normal [text-wrap:balance]">
              {isLogin
                ? 'Ingresá tus datos y comenzá a automatizar tus ventas con nosotros.'
                : 'Creá tu cuenta y comenzá a potenciar tu negocio con inteligencia artificial.'}
            </p>
          </div>

          {/* Switch Mode Button */}
          <div className="relative z-10">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="px-12 py-3.5 rounded-xl border border-white/40 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer text-white"
            >
              {isLogin ? 'REGISTRARSE' : 'INICIAR SESIÓN'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
