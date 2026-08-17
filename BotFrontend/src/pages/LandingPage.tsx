import { Link } from 'react-router-dom';
import { Bot, ArrowRight, Zap, Shield, BarChart3, Clock, Sparkles, Globe, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans selection:bg-sky-500/30">
      {/* Background Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-sky-600/8 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[200px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center anim-fade-in">
        <div className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform duration-300">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-400">
            Bot Eli
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {!session && (
            <Link to="/demo" className="hidden sm:flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Probar Demo
            </Link>
          )}
          {session ? (
            <Link 
              to="/panel" 
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-lg shadow-sky-600/20 font-medium transition-all hover:-translate-y-0.5"
            >
              Ir al Panel
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl font-medium transition-all hover:-translate-y-0.5 backdrop-blur-sm"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-8 anim-fade-in-up">
          <Zap className="w-3.5 h-3.5" />
          <span>Inteligencia Artificial + Automatización</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] max-w-5xl anim-fade-in-up anim-delay-100">
          Tu negocio en <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 animate-gradient-x">
            piloto automático
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-16 leading-relaxed anim-fade-in-up anim-delay-200">
          Eli aprende todo sobre tu negocio, responde consultas en Instagram y Messenger al instante y se pausa automáticamente cuando necesitas intervenir.
        </p>

        {/* Social proof / Stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-8 anim-fade-in-up anim-delay-300">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-4 h-4 text-sky-500" />
            <span className="text-sm">Respuestas en <span className="text-white font-semibold">&lt;2s</span></span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">Handoff <span className="text-white font-semibold">silencioso</span></span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm">Aprende de <span className="text-white font-semibold">cada conversación</span></span>
          </div>
        </div>
      </main>

     

      {/* Features Grid */}
      <section className="relative z-10 py-32 border-t border-white/5 bg-gradient-to-b from-gray-950 to-gray-950/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 anim-fade-in-up">
            <span className="inline-block text-sky-400 text-sm font-semibold uppercase tracking-widest mb-4">Características</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Todo lo que necesitas para<br className="hidden md:block"/> automatizar tus ventas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Bot className="w-5 h-5" />, title: "IA Conversacional", desc: "Respuestas naturales y contextuales usando modelos de lenguaje de última generación.", color: "text-sky-400", bg: "bg-sky-500/10" },
              { icon: <Shield className="w-5 h-5" />, title: "Handoff Silencioso", desc: "El bot se pausa sin avisar al cliente cuando detecta que un humano debe tomar el control.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: <BarChart3 className="w-5 h-5" />, title: "Métricas en Vivo", desc: "Dashboard con gráficos de actividad, mensajes procesados y tiempo ahorrado en tiempo real.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
              { icon: <Globe className="w-5 h-5" />, title: "Base de Conocimiento", desc: "Enseña al bot sobre tus productos con búsqueda semántica vectorial (pgvector + RAG).", color: "text-amber-400", bg: "bg-amber-500/10" },
              { icon: <Sparkles className="w-5 h-5" />, title: "Auto-Aprendizaje", desc: "Cuando un humano interviene y responde, el bot guarda esa respuesta y la usa automáticamente la próxima vez.", color: "text-rose-400", bg: "bg-rose-500/10" },
              { icon: <Zap className="w-5 h-5" />, title: "Velocidad Extrema", desc: "Inferencia con Groq en menos de 2 segundos. Tus clientes nunca esperan.", color: "text-violet-400", bg: "bg-violet-500/10" },
            ].map((f, idx) => (
              <div key={idx} className="group bg-gray-900/30 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 anim-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center anim-fade-in-up">
          <div className="w-16 h-16 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-sky-500/20 animate-float">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            ¿Listo para automatizar<br className="hidden md:block"/> tu negocio?
          </h2>
          {session ? (
            <>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                Tu sistema ya está activo y configurado. Ingresa al panel de control.
              </p>
              <Link 
                to="/panel" 
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-sky-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/30 group"
              >
                <span className="text-white">Ir al Panel</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                Prueba Eli ahora mismo con nuestra demo interactiva. Sin registro, sin necesidad de pago.
              </p>
              <Link 
                to="/demo" 
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-sky-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/30 group"
              >
                <span className="text-white">Probar</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">Bot Eli</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Plataforma de atención al cliente impulsada por inteligencia artificial para Instagram y Messenger.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Producto</h4>
              <ul className="space-y-3">
                {!session && (
                  <li><Link to="/demo" className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />Demo Interactiva</Link></li>
                )}
                <li><Link to="/login" className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />Iniciar Sesión</Link></li>
                <li><Link to="/privacidad" className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />Política de Privacidad</Link></li>
              </ul>
            </div>

            {/* Tech */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Tecnologías</h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'Supabase', 'Groq', 'pgvector', 'Meta API', 'Vercel'].map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-white/5 border border-white/5 rounded-md text-gray-500">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} Bot Eli.</p>
            <p className="text-gray-700 text-xs">DEVELOPED BY JAVIER</p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradientX {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .anim-fade-in-up {
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .anim-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .anim-delay-100 { animation-delay: 100ms; }
        .anim-delay-200 { animation-delay: 200ms; }
        .anim-delay-300 { animation-delay: 300ms; }
        .anim-delay-400 { animation-delay: 400ms; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradientX 4s ease infinite;
        }
      `}} />
    </div>
  );
}
