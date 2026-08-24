import { Link } from 'react-router-dom';
import { Bot, Shield, Sparkles, Globe, MessageCircle, ChevronRight, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { TextReveal } from '../components/TextReveal';
import { SpotlightCard } from '../components/SpotlightCard';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingPage() {
  const { session } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sky-500/30 selection:text-zinc-900 dark:selection:text-white bg-white dark:bg-black">
      {/* Top Section (Nav + Hero) with Pearl Background */}
      <div className="relative w-full min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900/10 border-b border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
        {/* Glow Effects (Blue) */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Navigation */}
        <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center w-full"
      >
        <div className="flex items-center space-x-3 group cursor-pointer">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0, y: [0, -5, 0] }}
            transition={{ 
              scale: { type: "spring", stiffness: 260, damping: 20, delay: 0.2 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-zinc-900 dark:text-white transition-colors">
              <path d="M12 8V4H8"/>
              <rect width="16" height="12" x="4" y="8" rx="2"/>
              <path d="M2 14h2"/>
              <path d="M20 14h2"/>
              <path d="M15 13v2" className="text-sky-500 dark:text-sky-400" stroke="currentColor" />
              <path d="M9 13v2" className="text-sky-500 dark:text-sky-400" stroke="currentColor" />
            </svg>
          </motion.div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">BotEli</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {session ? (
            <Link 
              to="/panel" 
              className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl font-medium transition-colors text-sm shadow-md"
            >
              Ir al Panel
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="px-5 py-2.5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl font-medium transition-colors text-sm shadow-sm"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </motion.nav>

        {/* Hero Section */}
        <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center w-full">
          {/* Background Watermark Icons */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-[400px] h-[400px] absolute -left-20 top-0"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            <MessageCircle className="w-[450px] h-[450px] absolute -right-20 bottom-10" strokeWidth={1} />
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center w-full relative z-10"
          >
            <TextReveal 
              text="Tu negocio en piloto automático." 
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.05] max-w-5xl text-zinc-900 dark:text-white drop-shadow-sm"
            />
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12 leading-relaxed">
              Eli aprende todo sobre tu negocio, responde consultas en <span className="font-semibold text-zinc-900 dark:text-zinc-200">Instagram</span> y <span className="font-semibold text-zinc-900 dark:text-zinc-200">Messenger</span> al instante y se pausa automáticamente cuando necesitas intervenir.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <Link to="/panel" className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-zinc-900 dark:bg-white px-8 font-medium text-white dark:text-black transition-all hover:scale-105 shadow-xl shadow-zinc-900/20 dark:shadow-white/10 border border-transparent dark:border-zinc-200">
                  <span className="mr-2">Ir al Panel de Control</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link to="/demo" className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-zinc-900 dark:bg-white px-8 font-medium text-white dark:text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] shadow-xl shadow-zinc-900/20 dark:shadow-white/10 border border-transparent dark:border-zinc-200">
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                    <div className="relative h-full w-8 bg-white/20 dark:bg-black/10" />
                  </div>
                  <span className="mr-2 relative z-10">Hablar con Eli</span>
                  <Play className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform fill-current" />
                </Link>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Bento Grid Features */}
      <section className="relative z-10 py-24 bg-white dark:bg-zinc-950 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.03)] dark:shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.3)] border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
              Escala sin límites.
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Todo lo que necesitas para automatizar tus ventas, diseñado en una plataforma robusta y ultra rápida.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[250px]">
            {/* SpotlightCard 1 - Large */}
            <SpotlightCard className="md:col-span-2 p-8 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-xl" spotlightColor="rgba(56, 189, 248, 0.15)">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-500/20 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">IA Conversacional</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Respuestas naturales usando modelos de lenguaje avanzados. Tu bot no suena como un robot, suena como el mejor vendedor de tu equipo.
                </p>
              </div>
            </SpotlightCard>

            {/* SpotlightCard 2 */}
            <SpotlightCard className="p-8 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-xl" spotlightColor="rgba(16, 185, 129, 0.15)">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Handoff Silencioso</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  El bot se pausa automáticamente cuando detecta que un humano debe intervenir.
                </p>
              </div>
            </SpotlightCard>

            {/* SpotlightCard 3 */}
            <SpotlightCard className="p-8 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-xl" spotlightColor="rgba(245, 158, 11, 0.15)">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">RAG y Búsqueda</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Base de conocimiento semántica con pgvector para que el bot solo responda con tus datos reales.
                </p>
              </div>
            </SpotlightCard>

            {/* SpotlightCard 4 - Large */}
            <SpotlightCard className="md:col-span-2 p-8 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-xl" spotlightColor="rgba(244, 63, 94, 0.15)">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Auto-Aprendizaje Autónomo</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Cuando un agente humano interviene y da una respuesta nueva, el bot evalúa y aprende automáticamente esa nueva lógica de negocio para el futuro.
                </p>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* CTA Section (Pearl White / Zinc 50) */}
      <section className="relative z-10 py-32 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-black shadow-[inset_0_20px_50px_-20px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_20px_50px_-20px_rgba(0,0,0,0.3)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center mx-auto mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-zinc-900 dark:text-white transition-colors">
              <path d="M12 8V4H8"/>
              <rect width="16" height="12" x="4" y="8" rx="2"/>
              <path d="M2 14h2"/>
              <path d="M20 14h2"/>
              <path d="M15 13v2" className="text-sky-500" stroke="currentColor" />
              <path d="M9 13v2" className="text-sky-500" stroke="currentColor" />
            </svg>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            ¿Listo para automatizar?
          </h2>
          {session ? (
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
              Tu sistema ya está activo y configurado. Ingresa al panel de control desde la navegación superior.
            </p>
          ) : (
            <>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
                No necesitas tarjeta de crédito. Prueba el rendimiento de nuestra IA totalmente gratis integrando tus redes hoy mismo.
              </p>
            </>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.03)] dark:shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-zinc-900 dark:text-white transition-colors">
                  <path d="M12 8V4H8"/>
                  <rect width="16" height="12" x="4" y="8" rx="2"/>
                  <path d="M2 14h2"/>
                  <path d="M20 14h2"/>
                  <path d="M15 13v2" className="text-sky-500 dark:text-sky-400" stroke="currentColor" />
                  <path d="M9 13v2" className="text-sky-500 dark:text-sky-400" stroke="currentColor" />
                </svg>
                <span className="font-bold text-zinc-900 dark:text-white tracking-tight">BotEli</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                Atención al cliente autónoma impulsada por IA para Instagram y Messenger.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Secciones</h4>
              <ul className="space-y-3">
                {!session && (
                  <li><Link to="/demo" className="text-zinc-500 font-medium hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">Demo Interactiva</Link></li>
                )}
                <li><Link to="/login" className="text-zinc-500 font-medium hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">Portal de Acceso</Link></li>
                <li><Link to="/privacidad" className="text-zinc-500 font-medium hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">Política de Privacidad</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 dark:text-zinc-500 text-sm">&copy; {new Date().getFullYear()} BotEli.</p>
            <p className="text-zinc-400 dark:text-zinc-600 text-xs tracking-widest uppercase font-medium">
              <a href="https://instagram.com/javier" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">Developed by Javier</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
