import { useState, useEffect } from 'react';
import { Key, Bot, Save, Loader2, Link2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import { useAppContext } from '../context/AppContext';

const API_URL = `${import.meta.env.VITE_API_URL}/bot-config`;

export default function SettingsPage() {
  const { session } = useAuth();
  const { config: globalConfig, isConfigLoading: loading, fetchConfig } = useAppContext();
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Estado local para edición, inicializado con la caché global
  const [config, setConfig] = useState({
    system_prompt: '',
    model: 'openai/gpt-oss-20b',
    temperature: 0.7,
    meta_access_token: '',
    meta_verify_token: '',
    is_active: true
  });

  // Cuando la caché global carga, actualizamos el estado local de edición
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
      toast.success('Configuración guardada exitosamente');
      fetchConfig(false); // Refresca caché global silenciosamente
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
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Configuración</h2>
          <p className="text-gray-400 text-sm md:text-base">Personaliza a Eli y conéctalo con tu página de Meta.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-sky-600/30 font-medium disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Configuración guardada exitosamente.</span>
        </div>
      )}

      <div className="space-y-6">
        
        {/* Core Bot Setup */}
        <div className="glass rounded-2xl p-4 md:p-8 border border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <Bot className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white">Comportamiento Base</h3>
                <p className="text-gray-400 text-xs md:text-sm">Define la personalidad y modelo de Eli.</p>
              </div>
            </div>
            
            {/* Activar/Desactivar Bot */}
            <div className="flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-800">
              <span className="text-sm font-medium text-gray-300">Estado del Bot:</span>
              <button
                onClick={() => setConfig({...config, is_active: !config.is_active})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.is_active ? 'bg-sky-500' : 'bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-bold ${config.is_active ? 'text-sky-400' : 'text-gray-500'}`}>
                {config.is_active ? 'ACTIVO' : 'PAUSADO'}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Definición del Asistente (Personalidad y Reglas)</label>
              <p className="text-xs text-gray-500 mb-3">Define quién es tu bot, cómo debe responder (formal, amigable) y qué reglas debe seguir. El sistema usará esto junto con tu Base de Conocimiento para responder.</p>
              <textarea
                value={config.system_prompt}
                onChange={(e) => setConfig({...config, system_prompt: e.target.value})}
                rows={4}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all resize-none"
                placeholder="Eres un asistente amigable especializado en ventas de cruceros..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Modelo de Inteligencia Artificial (Groq)</label>
              <p className="text-xs text-gray-500 mb-3">Si Groq cambia o depreca sus modelos en el futuro, simplemente escribe el nuevo identificador aquí.</p>
              <input
                type="text"
                value={config.model}
                onChange={(e) => setConfig({...config, model: e.target.value})}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono text-sm"
                placeholder="ej. openai/gpt-oss-20b"
              />
            </div>

          </div>
        </div>

        {/* Meta Integration Section */}
        <div className="glass rounded-2xl p-4 md:p-8 border border-gray-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Link2 className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-white">Conexión con Meta Webhooks</h3>
              <p className="text-gray-400 text-xs md:text-sm">Claves para enlazar con Instagram / Messenger</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Meta Access Token (Page Token)</label>
              <div className="relative">
                <input
                  type="password"
                  value={config.meta_access_token}
                  onChange={(e) => setConfig({...config, meta_access_token: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                  placeholder="EAAB..."
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center">
                <Key className="w-3 h-3 mr-1" />
                Lo obtienes en el panel de Meta for Developers.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Verify Token (Para el Webhook)</label>
              <div className="relative">
                <input
                  type="password"
                  value={config.meta_verify_token}
                  onChange={(e) => setConfig({...config, meta_verify_token: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                  placeholder="ej. mi_palabra_secreta_123"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Invéntalo tú y cópialo exactamente igual en la configuración del Webhook en Meta.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


