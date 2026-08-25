import { useState, useEffect } from 'react';
import { Key, Bot, Save, Loader2, Link2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { useAppContext } from '../context/AppContext';

const API_URL = `${import.meta.env.VITE_API_URL}/bot-config`;

export default function SettingsPage() {
  const { session } = useAuth();
  const { config: globalConfig, isConfigLoading: loading, fetchConfig } = useAppContext();
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [config, setConfig] = useState({
    system_prompt: '',
    model: 'openai/gpt-oss-20b',
    temperature: 0.7,
    meta_access_token: '',
    meta_verify_token: '',
    is_active: true
  });

  useEffect(() => {
    if (globalConfig) {
      setConfig(globalConfig);
    }
  }, [globalConfig]);

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${session?.access_token}` }
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess(false);
      await axios.post(API_URL, config, getHeaders());
      setSuccess(true);
      toast.success('Configuración guardada exitosamente', {
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid #27272a',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
      });
      fetchConfig(false); 
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error saving config', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-transparent">
        <Loader2 className="w-8 h-8 text-zinc-400 dark:text-zinc-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 md:p-10 max-w-4xl mx-auto pb-24 font-sans text-zinc-900 dark:text-zinc-100 bg-transparent min-h-screen"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-zinc-200 dark:border-zinc-900 pb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">Configuración</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">Personaliza la lógica de Eli y las conexiones de plataforma.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black px-6 py-2.5 rounded-full transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </header>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Configuración guardada correctamente en Supabase.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        
        {/* Core Bot Setup */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="p-6 md:p-8 border-b border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-transparent">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">Comportamiento Base</h3>
                <p className="text-zinc-500 text-sm">Define la personalidad y reglas de la IA.</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-zinc-100 dark:bg-black px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-inner">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Estado:</span>
              <button
                onClick={() => setConfig({...config, is_active: !config.is_active})}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${config.is_active ? 'bg-emerald-500 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white dark:bg-black transition-transform shadow-sm ${config.is_active ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
              <span className={`text-xs font-bold tracking-widest uppercase ${config.is_active ? 'text-emerald-600 dark:text-white' : 'text-zinc-500'}`}>
                {config.is_active ? 'Activo' : 'Pausado'}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">System Prompt</label>
              <p className="text-xs text-zinc-500 mb-4">Instrucciones que el bot seguirá al pie de la letra antes de consultar la base de datos.</p>
              <textarea
                value={config.system_prompt}
                onChange={(e) => setConfig({...config, system_prompt: e.target.value})}
                rows={5}
                className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors resize-none text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-sm"
                placeholder="Eres un asistente amigable especializado en ventas..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Modelo LLM</label>
              <p className="text-xs text-zinc-500 mb-4">El identificador exacto del modelo usado en el backend (ej. Groq / Llama).</p>
              <input
                type="text"
                value={config.model}
                onChange={(e) => setConfig({...config, model: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors font-mono text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-sm"
                placeholder="llama3-70b-8192"
              />
            </div>
          </div>
        </section>

        {/* Meta Integration Section */}
        <section className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-zinc-200 dark:border-zinc-900 flex items-center space-x-4 bg-zinc-50/50 dark:bg-transparent">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shrink-0 shadow-sm">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">Integración Meta Webhooks</h3>
              <p className="text-zinc-500 text-sm">Credenciales para la comunicación con Facebook e Instagram.</p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Meta Access Token</label>
              <p className="text-xs text-zinc-500 mb-4 flex items-center gap-1"><Key className="w-3 h-3" /> Token de acceso de la página generado en Meta Developers.</p>
              <input
                type="password"
                value={config.meta_access_token}
                onChange={(e) => setConfig({...config, meta_access_token: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors font-mono text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-sm"
                placeholder="EAAB..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Verify Token</label>
              <p className="text-xs text-zinc-500 mb-4 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Debe coincidir exactamente con el token configurado en tu Webhook de Meta.</p>
              <input
                type="password"
                value={config.meta_verify_token}
                onChange={(e) => setConfig({...config, meta_verify_token: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors font-mono text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-sm"
                placeholder="ej. mi_palabra_secreta_123"
              />
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  );
}


