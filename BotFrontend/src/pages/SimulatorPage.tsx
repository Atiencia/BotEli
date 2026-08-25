import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  User, 
  Send, 
  ArrowLeft, 
  MessageSquare, 
  BarChart3, 
  BookOpen, 
  Users, 
  Clock, 
  Zap, 
  Settings, 
  PauseCircle, 
  PlayCircle,
  Image as ImageIcon, 
  Plus, 
  Search,
  MessageCircle, 
  Activity,
  Sparkles,
  ChevronLeft,
  Video,
  Camera,
  Mic,
  Phone
} from 'lucide-react';
import { Instagram } from '../components/icons/Instagram';
import { Messenger } from '../components/icons/Messenger';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isHuman?: boolean;
}

const SimulatorPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  
  // Chat Bot Tab State
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: '¡Hola! Soy Eli, el asistente de IA de StyleAura. Pruébame escribiendo alguna pregunta, por ejemplo: "¿Cuánto cuestan las camisetas oversize?"'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulatedHandoff, setIsSimulatedHandoff] = useState(false);
  const [showReactivated, setShowReactivated] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversaciones Tab State
  const [isBotPaused, setIsBotPaused] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    const newMessages = [...messages, { role: 'user', content: userMessage } as ChatMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const API_URL = `${import.meta.env.VITE_API_URL}/simulate`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content })) 
        })
      });

      if (!response.ok) throw new Error('Error al simular');
      
      const data = await response.json();
      
      if (data.reply || data.response) {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: data.reply || data.response
        }]);
      }
      
      if (data.handoff) {
        setIsSimulatedHandoff(true);
      }
    } catch (error) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Error de conexión. Asegúrate de que el backend esté corriendo y la URL sea correcta.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendSimulatedImage = async () => {
    if (isLoading || isRecording) return;
    
    const simulatedMessage = '[Imagen adjunta] ¿Tienen este modelo en talla M?';
      
    const newMessages = [...messages, { role: 'user', content: simulatedMessage } as ChatMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const API_URL = `${import.meta.env.VITE_API_URL}/simulate`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: simulatedMessage,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content })) 
        })
      });

      if (!response.ok) throw new Error('Error al simular imagen');
      
      const data = await response.json();
      
      if (data.reply || data.response) {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: data.reply || data.response
        }]);
      }
      
      if (data.handoff) {
        setIsSimulatedHandoff(true);
      }
    } catch (error) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Error de conexión.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAudioRecording = async () => {
    if (isRecording) {
      // Detener grabación
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Detener todas las pistas de audio para liberar el micrófono
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);

        // Convertir blob a base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64data = (reader.result as string).split(',')[1];
          await sendSimulatedAudio(base64data);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordTime(0);
      recordTimerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      alert('No se pudo acceder al micrófono. Por favor, permite el acceso para enviar notas de voz.');
    }
  };

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  const sendSimulatedAudio = async (audioBase64: string) => {
    setIsLoading(true);
    const API_URL = `${import.meta.env.VITE_API_URL}/simulate/audio`;
    
    // Mostramos un mensaje temporal mientras carga
    const tempMessage: ChatMessage = { role: 'user', content: '🎙️ [Procesando nota de voz...]' };
    const newMessages = [...messages, tempMessage];
    setMessages(newMessages);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          audioBase64,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content })) 
        })
      });

      if (!response.ok) throw new Error('Error al simular audio');
      
      const data = await response.json();
      
      // Actualizamos el mensaje temporal con el texto transcrito
      const finalUserMessage: ChatMessage = { role: 'user', content: `🎙️ ${data.transcribedText || '[Audio]'}` };
      const updatedMessages = [...messages, finalUserMessage];
      
      if (data.reply || data.response) {
        updatedMessages.push({ 
          role: 'assistant', 
          content: data.reply || data.response
        });
      }
      
      setMessages(updatedMessages);

      if (data.handoff) {
        setIsSimulatedHandoff(true);
      }
    } catch (error) {
      setMessages([...newMessages.slice(0, -1), { role: 'user', content: '🎙️ [Error al enviar nota de voz]' }, { 
        role: 'assistant', 
        content: 'Error de conexión procesando el audio.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateHumanResponse = () => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '¡Hola! Sí, tenemos este modelo disponible en talla M por $45 USD. ¿Te gustaría apartarlo? 😊',
      isHuman: true
    }]);
    setIsSimulatedHandoff(false);
    setShowReactivated(true);
    setTimeout(() => setShowReactivated(false), 3000);
  };

  const renderChatBot = () => (
    <div className="flex flex-col h-full items-center justify-center p-4">
      {/* iPhone Device Frame */}
      <div className="relative w-full max-w-[375px] h-[750px] max-h-full bg-white dark:bg-black rounded-[50px] border-[12px] border-zinc-200 dark:border-zinc-900 shadow-2xl flex flex-col overflow-hidden shrink-0">
        
        {/* Dynamic Island / Notch area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-200 dark:bg-zinc-900 rounded-b-2xl z-20"></div>

        {/* IG Direct Header */}
        <div className="flex items-center justify-between px-3 py-3 pt-8 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-900 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <button className="text-zinc-900 dark:text-white hover:opacity-70 transition-opacity">
              <ChevronLeft className="w-8 h-8 -ml-2" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
                <img src="/logo.jpg" alt="StyleAura" className="w-full h-full object-cover opacity-80" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-sky-900 flex items-center justify-center text-xs font-bold text-sky-200">SA</div>'; }} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-zinc-900 dark:text-white text-[15px] font-semibold tracking-tight">styleaura_oficial</span>
                  <svg aria-label="Verificado" className="w-3.5 h-3.5 text-blue-500 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z"></path></svg>
                </div>
                <span className="text-zinc-500 text-[12px]">Cuenta comercial</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-zinc-900 dark:text-white">
            <Phone className="w-6 h-6" />
            <Video className="w-6 h-6" />
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white dark:bg-black flex flex-col">
          
          {/* Profile Info in chat */}
          <div className="flex flex-col items-center justify-center pt-4 pb-6 gap-2">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
                <img src="/logo.jpg" alt="StyleAura" className="w-full h-full object-cover opacity-80" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-sky-900 flex items-center justify-center text-3xl font-bold text-sky-200">SA</div>'; }} />
            </div>
            <h2 className="text-zinc-900 dark:text-white text-xl font-semibold mt-1">StyleAura Oficial</h2>
            <p className="text-zinc-500 text-[14px]">styleaura_oficial • Instagram</p>
            <p className="text-zinc-500 text-[14px]">24 mil seguidores • 150 publicaciones</p>
            <button className="bg-zinc-800 text-white text-[14px] font-semibold px-4 py-1.5 rounded-lg mt-2 hover:bg-zinc-700 transition-colors">Ver perfil</button>
          </div>
          
          <div className="text-center text-zinc-600 text-[12px] my-4 font-medium">Hoy 2:30 p.m.</div>

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-1 group`}>
              {msg.role === 'assistant' && (
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-sky-200 mr-2 shrink-0 self-end mb-1 ${msg.isHuman ? 'bg-amber-600' : 'bg-sky-900'}`}>
                  {msg.isHuman ? '👩‍💼' : 'SA'}
                </div>
              )}
              <div className={`max-w-[75%] rounded-3xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-tl-sm' 
                  : msg.isHuman 
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-700/50 rounded-tr-sm' 
                    : 'bg-zinc-900 dark:bg-[#262626] text-white rounded-tr-sm'
              }`}>
                <p className="whitespace-pre-wrap text-[15px] leading-snug">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-end mb-1">
              <div className="w-7 h-7 rounded-full bg-sky-900 flex items-center justify-center text-[10px] font-bold text-sky-200 mr-2 shrink-0 self-end mb-1">
                SA
              </div>
              <div className="bg-[#262626] rounded-3xl px-4 py-4 flex gap-1.5 items-center h-[42px]">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* IG Direct Input Area / Handoff Banner */}
        <div className="px-3 py-3 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-900 pb-8 shrink-0 relative">
          
          {showReactivated && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500/90 text-zinc-900 dark:text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-fade-in-up z-20">
              <span>✅</span> Bot Reactivado
            </div>
          )}

          {isSimulatedHandoff ? (
            <div className="flex flex-col gap-3 animate-fade-in">
              <div className="bg-amber-900/40 border border-amber-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-amber-500 text-lg mb-1">⚠️</span>
                <p className="text-amber-500 text-sm font-medium">Bot pausado temporalmente</p>
                <p className="text-amber-500/70 text-xs mt-0.5">Derivado a agente humano</p>
              </div>
              <button 
                onClick={simulateHumanResponse}
                className="w-full bg-blue-600 hover:bg-blue-700 text-zinc-900 dark:text-white font-medium py-3 rounded-xl transition-colors text-sm shadow-lg shadow-blue-900/20"
              >
                Simular respuesta del agente
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={sendSimulatedImage}
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0 hover:bg-blue-600 transition-colors"
                disabled={isRecording}
              >
                <Camera className="w-5 h-5 text-zinc-900 dark:text-white" />
              </button>
              <div className="flex-1 relative flex items-center">
                {isRecording ? (
                  <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full py-2.5 pl-4 pr-12 flex items-center justify-between overflow-hidden">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-zinc-900 dark:text-white text-[15px] font-medium">
                        {Math.floor(recordTime / 60)}:{(recordTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    {/* Visualizer Waveform */}
                    <div className="flex gap-[3px] items-center h-4 mr-2">
                      <div className="w-[3px] bg-sky-400 rounded-full animate-waveform-1"></div>
                      <div className="w-[3px] bg-sky-400 rounded-full animate-waveform-2"></div>
                      <div className="w-[3px] bg-sky-400 rounded-full animate-waveform-3"></div>
                      <div className="w-[3px] bg-sky-400 rounded-full animate-waveform-4"></div>
                      <div className="w-[3px] bg-sky-400 rounded-full animate-waveform-2"></div>
                      <div className="w-[3px] bg-sky-400 rounded-full animate-waveform-1"></div>
                      <div className="w-[3px] bg-sky-400 rounded-full animate-waveform-3"></div>
                      <div className="w-[3px] bg-sky-400 rounded-full animate-waveform-4"></div>
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Mensaje..."
                    className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full py-2.5 pl-4 pr-10 text-[15px] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none"
                    disabled={isLoading}
                  />
                )}
                {!isRecording && (
                  <button 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 p-1.5 text-zinc-900 dark:text-white disabled:opacity-0 transition-opacity"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
                {!input.trim() && (
                  <button 
                    type="button"
                    onClick={toggleAudioRecording}
                    className={`absolute right-3 transition-all ${isRecording ? 'text-red-500' : 'text-zinc-900 dark:text-white hover:opacity-70'}`}
                  >
                    {isRecording ? (
                       <div className="w-4 h-4 rounded-sm bg-red-500 hover:bg-red-600 transition-colors" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              {!input.trim() && !isRecording && (
                <div className="flex items-center gap-3 text-zinc-900 dark:text-white shrink-0 pr-1">
                  <button type="button" onClick={sendSimulatedImage} className="hover:opacity-70">
                    <ImageIcon className="w-6 h-6" />
                  </button>
                  <Plus className="w-6 h-6" />
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );

  const renderConversaciones = () => (
    <div className="flex h-full border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-hidden bg-white dark:bg-[#0a0a0a]">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/80">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm text-zinc-900 dark:text-zinc-300 focus:outline-none pointer-events-none"
              readOnly
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Active User */}
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 relative">
              <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
              <Instagram className="w-4 h-4 absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full shadow-[0_0_0_2px_#ffffff] dark:shadow-[0_0_0_2px_#18181b]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                  María García
                </h4>
                <span className="text-[10px] text-zinc-500">2:41 p.m.</span>
              </div>
              <p className="text-xs text-sky-400 truncate mt-0.5">Sí, qué colores tienen?</p>
              <div className="mt-1 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isBotPaused ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                <span className={`text-[10px] uppercase tracking-wider ${isBotPaused ? 'text-amber-500' : 'text-green-500'}`}>{isBotPaused ? 'Humano al mando' : 'Bot Activo'}</span>
              </div>
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500"></div>
          </div>
          
          {/* Other Users */}
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800/50 hover:bg-zinc-50 hover:dark:bg-zinc-800/30 cursor-pointer flex items-center gap-3 opacity-70">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 relative">
              <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
              <Messenger className="w-4 h-4 absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full shadow-[0_0_0_2px_#ffffff] dark:shadow-[0_0_0_2px_#18181b]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                  Carlos López
                </h4>
                <span className="text-[10px] text-zinc-500">1:15 p.m.</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">Necesito hablar con alguien</p>
              <div className="mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-[10px] text-amber-500 uppercase tracking-wider">Humano al mando</span>
              </div>
            </div>
          </div>

          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800/50 hover:bg-zinc-50 hover:dark:bg-zinc-800/30 cursor-pointer flex items-center gap-3 opacity-70">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 relative">
              <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
              <Messenger className="w-4 h-4 absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full shadow-[0_0_0_2px_#ffffff] dark:shadow-[0_0_0_2px_#18181b]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                  Ana Rodríguez
                </h4>
                <span className="text-[10px] text-zinc-500">Ayer</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">Gracias por la información</p>
              <div className="mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-[10px] text-green-500 uppercase tracking-wider">Bot Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Panel */}
      <div className="w-full md:w-2/3 flex flex-col relative">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            </div>
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-white text-sm flex items-center gap-2">
                Cliente: María García <Instagram className="w-4 h-4 text-pink-500" />
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Última act: 2:41:58 p.m.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsBotPaused(p => !p)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 border ${
              isBotPaused 
                ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20' 
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20'
            }`}
          >
            {isBotPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
            {isBotPaused ? 'Reactivar Bot' : 'Pausar Bot (Handoff)'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Msg 1 */}
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-4">
              <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            </div>
            <div className="max-w-[85%] sm:max-w-[75%]">
              <div className="flex items-center gap-1 mb-1 ml-1 text-[11px] text-zinc-500">
                <span className="font-medium">Cliente</span>
                <span>•</span>
                <span>2:35 p.m.</span>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-2.5 rounded-2xl rounded-tl-sm text-[15px]">
                Hola, tienen polos oversize?
              </div>
            </div>
          </div>

          {/* Msg 2 */}
          <div className="flex gap-3 justify-end">
            <div className="max-w-[85%] sm:max-w-[75%]">
              <div className="flex items-center justify-end gap-1 mb-1 mr-1 text-[11px] text-zinc-500">
                <span>2:35 p.m.</span>
                <span>•</span>
                <span className="font-medium text-sky-400">Eli</span>
              </div>
              <div className="bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-2xl rounded-tr-sm text-[15px] shadow-sm">
                ¡Hola María! Sí, tenemos polos oversize disponibles en tallas S, M, L y XL. ¿Te gustaría ver los colores disponibles?
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center shrink-0 mt-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                <path d="M55 35 V20 H40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" className="text-white dark:text-black" />
                <line x1="10" y1="55" x2="18" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-white dark:text-black" />
                <line x1="82" y1="55" x2="90" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-white dark:text-black" />
                <rect x="18" y="35" width="64" height="40" rx="12" stroke="currentColor" strokeWidth="8" fill="none" className="text-white dark:text-black" />
                <rect x="34" y="48" width="10" height="18" rx="5" className="fill-sky-500" />
                <rect x="56" y="48" width="10" height="18" rx="5" className="fill-sky-500" />
              </svg>
            </div>
          </div>

          {/* Msg 3 */}
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-4">
              <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            </div>
            <div className="max-w-[85%] sm:max-w-[75%]">
              <div className="flex items-center gap-1 mb-1 ml-1 text-[11px] text-zinc-500">
                <span className="font-medium">Cliente</span>
                <span>•</span>
                <span>2:41 p.m.</span>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-2.5 rounded-2xl rounded-tl-sm text-[15px]">
                Sí, qué colores tienen?
              </div>
            </div>
          </div>

          {/* Msg 4 */}
          <div className="flex gap-3 justify-end">
            <div className="max-w-[85%] sm:max-w-[75%]">
              <div className="flex items-center justify-end gap-1 mb-1 mr-1 text-[11px] text-zinc-500">
                <span>2:41 p.m.</span>
                <span>•</span>
                <span className="font-medium text-sky-400">Eli</span>
              </div>
              <div className="bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-2xl rounded-tr-sm text-[15px] shadow-sm">
                ¡Genial! Tenemos en negro, blanco, beige y azul marino. Todos a S/. 45.00. ¿Cuál te interesa?
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center shrink-0 mt-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                <path d="M55 35 V20 H40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" className="text-white dark:text-black" />
                <line x1="10" y1="55" x2="18" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-white dark:text-black" />
                <line x1="82" y1="55" x2="90" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-white dark:text-black" />
                <rect x="18" y="35" width="64" height="40" rx="12" stroke="currentColor" strokeWidth="8" fill="none" className="text-white dark:text-black" />
                <rect x="34" y="48" width="10" height="18" rx="5" className="fill-sky-500" />
                <rect x="56" y="48" width="10" height="18" rx="5" className="fill-sky-500" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="flex items-center gap-2">
            <button disabled className="p-2 text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 transition-colors cursor-not-allowed hidden sm:block">
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Escribe un mensaje para intervenir..."
              disabled
              className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2.5 px-4 text-sm text-zinc-900 dark:text-zinc-300 placeholder-zinc-500 focus:outline-none cursor-not-allowed"
            />
            <button disabled className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-lg cursor-not-allowed">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800/50 px-3 py-1 rounded-full shadow-lg">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-1">
          </p>
        </div>
      </div>
    </div>
  );

  const renderMetricas = () => {
    const chartData = [
      { day: 'Lun', received: 12, bot: 10 },
      { day: 'Mar', received: 18, bot: 16 },
      { day: 'Mié', received: 8, bot: 7 },
      { day: 'Jue', received: 25, bot: 22 },
      { day: 'Vie', received: 15, bot: 14 },
      { day: 'Sáb', received: 20, bot: 18 },
      { day: 'Dom', received: 10, bot: 9 },
    ];
    const maxVal = 25;

    return (
      <div className="space-y-4 h-full overflow-y-auto pr-2">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white tracking-tight">Métricas de Rendimiento</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Resumen de la actividad del bot</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">Total Clientes</p>
              <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tighter">24</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">Mensajes IA</p>
              <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tighter">1,847</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">Horas Ahorradas</p>
              <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tighter">61 <span className="text-xl font-medium text-zinc-400 dark:text-zinc-500">hrs</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 mt-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white tracking-tight">Actividad de los últimos 7 días</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                <span className="text-zinc-500 dark:text-zinc-400">Mensajes Recibidos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-zinc-500 dark:text-zinc-400">Respuestas del Bot</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between px-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="flex items-end gap-1 h-48">
                  {/* Received bar */}
                  <div className="w-4 sm:w-6 bg-sky-400 hover:bg-sky-500 rounded-t-sm transition-colors relative group" style={{ height: `${(d.received / maxVal) * 100}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-xs px-2 py-1 rounded text-white dark:text-zinc-900 whitespace-nowrap transition-opacity pointer-events-none z-10 shadow-sm">
                      {d.received}
                    </div>
                  </div>
                  {/* Bot bar */}
                  <div className="w-4 sm:w-6 bg-emerald-400 hover:bg-emerald-500 rounded-t-sm transition-colors relative group" style={{ height: `${(d.bot / maxVal) * 100}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-xs px-2 py-1 rounded text-white dark:text-zinc-900 whitespace-nowrap transition-opacity pointer-events-none z-10 shadow-sm">
                      {d.bot}
                    </div>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-zinc-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderConocimiento = () => (
    <div className="h-full overflow-y-auto pr-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white tracking-tight">Base de Conocimiento</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Información que el bot usa para responder</p>
        </div>
        <button disabled className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 border border-zinc-800 px-4 py-2 rounded-lg text-sm cursor-not-allowed">
          <Plus className="w-4 h-4" />
          Nuevo
        </button>
      </div>

      {/* Auto-aprendizaje badge */}
      <div className="mb-5 flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <p className="text-sm text-emerald-300">
          <span className="font-semibold">Auto-aprendizaje activo:</span> cuando un humano responde una consulta desconocida, el bot guarda esa respuesta automáticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Catálogo de Productos', badge: 'catálogo', desc: 'Camisetas Oversize "Urban Drop" desde $25 USD. Pantalones Cargo "Street" a $45 USD. Hoodies "Minimal" a $55 USD. 100% algodón orgánico.' },
          { title: 'Política de Envíos', badge: 'logística', desc: 'Envíos a toda Argentina. Estándar $5 USD (3-5 días). Express $10 USD (24hs). Gratis en compras +$50 USD. Vía FedEx y DHL.' },
          { title: 'Métodos de Pago y Cambios', badge: 'pagos', desc: 'Aceptamos Visa, Mastercard, Amex, PayPal y transferencias. Cambios hasta 30 días con etiquetas y sin uso.' },
          { title: '¿Cuál es la dirección del centro comercial donde tienen sucursal en BA?', badge: 'auto-aprendido', desc: 'La sucursal del Abasto está ubicada en Urquiza 152, Av. Ecuador, Buenos Aires.' }
        ].map((item, i) => (
          <div key={i} className={`border rounded-2xl p-5 transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 cursor-default shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ${
            i === 3 
              ? 'bg-emerald-900/10 border-emerald-500/20 hover:bg-emerald-900/20' 
              : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          }`}>
            <div className="font-mono text-[13px] mb-3 tracking-tight transition-colors flex items-center gap-1">
              <span className={i === 3 ? 'text-emerald-400' : 'text-zinc-500'}>[{item.badge}]</span>
              {i === 3 && <Sparkles className="w-3 h-3 text-emerald-400 inline" />}
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-2 tracking-tight">{item.title}</h3>
            <p className="text-[14px] text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfiguracion = () => (
    <div className="space-y-6 max-w-3xl mx-auto h-full overflow-y-auto pr-2">
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-lg flex gap-3 text-sm">
        <Activity className="w-5 h-5 shrink-0" />
        <p>Modo de Solo Lectura - Los campos están deshabilitados en la demo. En la aplicación real podrás modificar cómo se comporta tu bot en tiempo real.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-1">System Prompt</label>
          <textarea 
            disabled
            rows={5}
            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm text-zinc-900 dark:text-zinc-400 focus:outline-none resize-none cursor-not-allowed"
            value="Eres un asistente virtual amable y profesional para una tienda de ropa. Tu objetivo es ayudar a los clientes con información sobre polos oversize, tallas, colores y precios. Siempre responde en español."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-1">Modelo AI</label>
            <select disabled className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-900 dark:text-zinc-400 cursor-not-allowed appearance-none">
              <option>openai/gpt-oss-20b (Groq)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-1">Temperatura</label>
            <input type="text" disabled value="0.7" className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-900 dark:text-zinc-400 cursor-not-allowed" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-1">Token de Meta</label>
          <input type="password" disabled value="EAAGm0PX4ZCQoBO..." className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-900 dark:text-zinc-400 cursor-not-allowed font-mono" />
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex justify-end">
          <button disabled className="bg-zinc-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 relative overflow-hidden font-sans selection:bg-sky-500/30">
      {/* Background grids */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

      {/* Floating CTA */}
      <Link to='/login' className='fixed bottom-6 right-6 z-50 bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-transform flex items-center justify-center text-sm'>
        Crear cuenta gratis
      </Link>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-8 md:pt-12 pb-20 md:pb-12 flex flex-col h-[100dvh]">
        
        {/* Header Area */}
        <div className="flex flex-col items-center justify-center gap-6 mb-8">
          <div className="w-full relative flex items-center justify-center">
            <Link to="/" className="absolute left-0 inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white text-center">
              Experiencia Demo
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 bg-white dark:bg-zinc-900/50 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm overflow-x-auto w-full md:w-auto items-center justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { id: 'chat', label: 'Chat Bot', icon: MessageSquare },
              { id: 'conversaciones', label: 'Conversaciones', icon: Users },
              { id: 'metricas', label: 'Métricas', icon: BarChart3 },
              { id: 'conocimiento', label: 'Conocimiento', icon: BookOpen },
              { id: 'configuracion', label: 'Configuración', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-100 hover:dark:bg-zinc-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area - Glass Card */}
        <div className="bg-zinc-50 dark:bg-zinc-950/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-2xl flex-1 flex flex-col min-h-0 overflow-hidden">
          {activeTab === 'chat' && renderChatBot()}
          {activeTab === 'conversaciones' && renderConversaciones()}
          {activeTab === 'metricas' && renderMetricas()}
          {activeTab === 'conocimiento' && renderConocimiento()}
          {activeTab === 'configuracion' && renderConfiguracion()}
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;
