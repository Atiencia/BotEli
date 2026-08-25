import { Link } from 'react-router-dom';
import { MessageSquare, Pause, Search, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { session } = useAuth();


  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sky-500/30 selection:text-zinc-900 dark:selection:text-white bg-white dark:bg-black">
      {/* Navbar */}
      <header className="w-full bg-white/80 dark:bg-black/50 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 z-50 sticky top-0">
        <nav className="max-w-7xl mx-auto px-6 h-[72px] flex justify-between items-center">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-zinc-900 dark:text-white">
              <path d="M12 8V4H8"/>
              <rect width="16" height="12" x="4" y="8" rx="2"/>
              <path d="M2 14h2"/>
              <path d="M20 14h2"/>
              <path d="M15 13v2" className="text-sky-500" />
              <path d="M9 13v2" className="text-sky-500" />
            </svg>
            <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">BotEli</span>
          </Link>

          {/* Right: Links & Actions */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              <a href="#como-funciona" className="text-sm font-medium text-zinc-900 dark:text-white hover:opacity-80 transition-opacity">Cómo funciona</a>
              <Link to="/demo" className="text-sm font-medium text-zinc-900 dark:text-white hover:opacity-80 transition-opacity">Probar demo</Link>
            </div>

            {session ? (
              <Link to="/panel" className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full text-sm font-semibold transition-colors shadow-sm">
                Ir al Panel
              </Link>
            ) : (
              <Link to="/login" className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full text-sm font-semibold transition-colors shadow-sm">
                Iniciar sesión
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 w-full bg-[#0a0a0a] overflow-hidden flex items-center border-b border-zinc-800">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 lg:pt-32 lg:pb-40 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="flex flex-col items-start">

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
            >
              Tu negocio en<br/>piloto<br/>automático.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-zinc-400 max-w-md mb-10 leading-relaxed"
            >
              Eli aprende todo sobre tu negocio y responde consultas al instante. Se pausa sola apenas detecta que necesitás intervenir vos.
            </motion.p>
          </div>

          {/* Right Graphic/Mockup Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center lg:justify-center lg:pl-12 relative"
          >
            <div className="relative w-full max-w-[360px] bg-white rounded-[2.5rem] p-6 shadow-2xl border-[6px] border-[#1f1f1f]">
              
              {/* Mockup Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
                <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center bg-white">
                  <svg className="w-5 h-5 text-zinc-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8V4H8"/>
                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/>
                    <path d="M20 14h2"/>
                    <path d="M15 13v2" className="text-sky-500" />
                    <path d="M9 13v2" className="text-sky-500" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-zinc-600">en línea</span>
                </div>
              </div>

              {/* Mockup Chat */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.8, delayChildren: 0.5 } }
                }}
                className="flex flex-col gap-4"
              >
                {/* User Message */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, x: -20, originX: 0, originY: 1 },
                    visible: { opacity: 1, scale: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 15 } }
                  }}
                  className="flex flex-col items-start max-w-[85%]"
                >
                  <div className="bg-zinc-100 text-zinc-900 rounded-2xl rounded-tl-sm px-4 py-3 text-[15px] leading-snug">
                    Hola! ¿Tienen el vestido negro en talle M?
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 ml-1 font-medium">03:46</span>
                </motion.div>

                {/* Typing indicator */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, x: 20, originX: 1, originY: 1 },
                    visible: { opacity: 1, scale: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 15 } }
                  }}
                  className="flex justify-end w-full"
                >
                  <div className="bg-zinc-100 rounded-full px-4 py-2.5 flex items-center gap-1.5 w-fit">
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>

                {/* Bot Message */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, x: 20, originX: 1, originY: 1 },
                    visible: { opacity: 1, scale: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 15 } }
                  }}
                  className="flex flex-col items-end self-end max-w-[90%]"
                >
                  <div className="bg-zinc-900 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-[15px] leading-snug shadow-sm">
                    ¡Hola! Sí, tenemos 3 unidades en talle M. ¿Te paso el link para reservarlo?
                  </div>
                  <div className="flex items-center gap-1 mt-1 mr-1">
                    <span className="text-[10px] text-zinc-400 font-medium">03:47 · automatizado</span>
                    <svg className="w-3 h-3 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                      <polyline points="24 6 13 17 10 14"></polyline>
                    </svg>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 pt-20 pb-12 lg:pt-28 lg:pb-16 bg-[#F2F2F2] dark:bg-zinc-950 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.03)] dark:shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.3)] border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-3">
              Escala sin límites
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
              Todo lo que necesitás para automatizar tus ventas, en una plataforma robusta y ultra rápida.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Card 1 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              whileHover={{ scale: 1.02, rotate: -1, y: -5, transition: { type: "spring", stiffness: 300 } }}
              className="p-6 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.1)] transition-all group cursor-default"
            >
              <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black mb-5 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-[13px] text-zinc-400 mb-3 tracking-tight group-hover:text-sky-500 transition-colors">[responde]</div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">IA conversacional</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-[15px] leading-relaxed">
                  Respuestas naturales con modelos de lenguaje avanzados. Eli no suena como un robot, suena como el mejor vendedor de tu equipo.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              whileHover={{ scale: 1.02, rotate: 1, y: -5, transition: { type: "spring", stiffness: 300 } }}
              className="p-6 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.1)] transition-all group cursor-default"
            >
              <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black mb-5 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Pause className="w-4 h-4" fill="currentColor" strokeWidth={1} />
              </div>
              <div>
                <div className="font-mono text-[13px] text-zinc-400 mb-3 tracking-tight group-hover:text-sky-500 transition-colors">[traspasa]</div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">Handoff silencioso</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-[15px] leading-relaxed">
                  El bot se pausa automáticamente en cuanto detecta que necesitás intervenir vos, sin fricciones para el cliente.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              whileHover={{ scale: 1.02, rotate: -1, y: -5, transition: { type: "spring", stiffness: 300 } }}
              className="p-6 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.1)] transition-all group cursor-default"
            >
              <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black mb-5 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-[13px] text-zinc-400 mb-3 tracking-tight group-hover:text-sky-500 transition-colors">[busca]</div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">RAG y búsqueda</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-[15px] leading-relaxed">
                  Base de conocimiento semántica con pgvector, para que el bot solo responda con tus datos reales.
                </p>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              whileHover={{ scale: 1.02, rotate: 1, y: -5, transition: { type: "spring", stiffness: 300 } }}
              className="p-6 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.1)] transition-all group cursor-default"
            >
              <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black mb-5 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-[13px] text-zinc-400 mb-3 tracking-tight group-hover:text-sky-500 transition-colors">[aprende]</div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">Auto-aprendizaje autónomo</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-[15px] leading-relaxed">
                  Cuando intervenís y das una respuesta nueva, Eli evalúa y aprende esa lógica automáticamente para el futuro.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 border-t border-zinc-800 bg-[#0a0a0a] shadow-[inset_0_20px_50px_-20px_rgba(0,0,0,0.3)]">
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-white transition-colors">
              <path d="M12 8V4H8"/>
              <rect width="16" height="12" x="4" y="8" rx="2"/>
              <path d="M2 14h2"/>
              <path d="M20 14h2"/>
              <path d="M15 13v2" className="text-sky-500" stroke="currentColor" />
              <path d="M9 13v2" className="text-sky-500" stroke="currentColor" />
            </svg>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            ¿Listo para automatizar?
          </h2>
          {session ? (
            <>
              <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
                Tu sistema ya está activo y configurado. Ingresa al panel de control desde la navegación superior.
              </p>
              <Link to="/panel" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-black bg-white rounded-full hover:bg-zinc-200 transition-colors shadow-lg">
                Ir al Panel
              </Link>
            </>
          ) : (
            <>
              <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
                No necesitas tarjeta de crédito. Prueba el rendimiento de nuestra IA totalmente gratis integrando tus redes hoy mismo.
              </p>
              <Link to="/demo" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-black bg-white rounded-full hover:bg-zinc-200 transition-colors shadow-lg">
                Ir a demo
              </Link>
            </>
          )}
        </motion.div>
      </section>

      {/* Tres pasos Section */}
      <section id="como-funciona" className="relative z-10 py-32 lg:py-40 bg-white dark:bg-black border-t border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-24"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-5">
              Tres pasos, cero código
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto">
              De cero a atención automática antes de terminar tu café.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-0 relative"
            style={{ perspective: 1000 }}
          >
            {/* Vertical Dividers for Desktop */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/3 w-px bg-zinc-100 dark:bg-zinc-800/50"></div>
            <div className="hidden md:block absolute top-0 bottom-0 left-2/3 w-px bg-zinc-100 dark:bg-zinc-800/50"></div>

            {/* Step 1 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, rotateY: 90, z: -200, scale: 0.8 },
                visible: { opacity: 1, rotateY: 0, z: 0, scale: 1, transition: { type: "spring", stiffness: 60, damping: 15 } }
              }}
              whileHover={{ scale: 1.05, y: -10, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="md:pr-12 group cursor-default"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="font-mono text-sm text-sky-500 mb-4 block transition-colors group-hover:text-sky-400">01</span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">Conectá tus redes</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[15px] group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                Vinculá tu red social en un par de clics.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, rotateY: 90, z: -200, scale: 0.8 },
                visible: { opacity: 1, rotateY: 0, z: 0, scale: 1, transition: { type: "spring", stiffness: 60, damping: 15 } }
              }}
              whileHover={{ scale: 1.05, y: -10, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="md:px-12 group cursor-default"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="font-mono text-sm text-sky-500 mb-4 block transition-colors group-hover:text-sky-400">02</span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">Entrená a Eli</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[15px] group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                Cargá tu catálogo, precios y preguntas frecuentes. Eli arma su propia base de conocimiento.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, rotateY: 90, z: -200, scale: 0.8 },
                visible: { opacity: 1, rotateY: 0, z: 0, scale: 1, transition: { type: "spring", stiffness: 60, damping: 15 } }
              }}
              whileHover={{ scale: 1.05, y: -10, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="md:pl-12 group cursor-default"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="font-mono text-sm text-sky-500 mb-4 block transition-colors group-hover:text-sky-400">03</span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">Eli responde sola</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[15px] group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                Atiende consultas al instante, a cualquier hora, y te avisa solo cuando de verdad hacés falta vos.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 bg-[#0a0a0a] mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white transition-colors">
                  <path d="M12 8V4H8"/>
                  <rect width="16" height="12" x="4" y="8" rx="2"/>
                  <path d="M2 14h2"/>
                  <path d="M20 14h2"/>
                  <path d="M15 13v2" className="text-sky-500" stroke="currentColor" />
                  <path d="M9 13v2" className="text-sky-500" stroke="currentColor" />
                </svg>
                <span className="font-bold text-white tracking-tight">BotEli</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                Atención al cliente autónoma impulsada por IA para Instagram y Messenger.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Secciones</h4>
              <ul className="space-y-3">
                {!session && (
                  <li><Link to="/demo" className="text-zinc-400 font-medium hover:text-white text-sm transition-colors">Demo Interactiva</Link></li>
                )}
                <li><Link to="/login" className="text-zinc-400 font-medium hover:text-white text-sm transition-colors">Portal de Acceso</Link></li>
                <li><Link to="/privacidad" className="text-zinc-400 font-medium hover:text-white text-sm transition-colors">Política de Privacidad</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-sm">&copy; {new Date().getFullYear()} BotEli.</p>
            <p className="text-zinc-500 text-xs tracking-widest uppercase font-medium">
              <a href="https://instagram.com/javier" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">Developed by Javier</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
