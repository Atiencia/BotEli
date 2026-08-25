import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { User, Bot, Search, PauseCircle, PlayCircle, Send, Loader2, ArrowLeft, Image as ImageIcon, X} from 'lucide-react';
import { Instagram } from '../components/icons/Instagram';
import { Messenger } from '../components/icons/Messenger';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ChatMessage {
  id: string;
  platform_user_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const API_CHATS = `${import.meta.env.VITE_API_URL}/chats`;
const API_CUSTOMERS = `${import.meta.env.VITE_API_URL}/customers`;

export default function ChatsPage() {
  const { session } = useAuth();
  const { customers, isCustomersLoading, fetchCustomers } = useAppContext();
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [isChatsLoading, setIsChatsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Nuevo estado para el chat manual
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const clienteFromUrl = searchParams.get('cliente');

  // Si hay un cliente en la URL y ya cargaron los clientes, autoseleccionarlo
  useEffect(() => {
    if (clienteFromUrl && customers.length > 0) {
      const customerToSelect = customers.find(c => c.platform_user_id === clienteFromUrl);
      if (customerToSelect && (!selectedCustomer || selectedCustomer.id !== customerToSelect.id)) {
        setSelectedCustomer(customerToSelect);
        // Limpiamos la URL para no forzar la selección infinitamente si cambian de chat
        searchParams.delete('cliente');
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [clienteFromUrl, customers, selectedCustomer, searchParams, setSearchParams]);

  // Sincronizar el cliente seleccionado con los cambios en tiempo real de la base de datos
  useEffect(() => {
    if (selectedCustomer && customers.length > 0) {
      const updatedCustomer = customers.find(c => c.platform_user_id === selectedCustomer.platform_user_id);
      if (updatedCustomer && updatedCustomer.is_bot_active !== selectedCustomer.is_bot_active) {
        setSelectedCustomer(updatedCustomer);
      }
    }
  }, [customers, selectedCustomer?.platform_user_id]);

  const selectedCustomerId = selectedCustomer?.platform_user_id;

  useEffect(() => {
    if (!session?.access_token || !selectedCustomerId) return;

    fetchChats(selectedCustomerId, true); // Pasar true para la carga inicial

    // Escuchar nuevos mensajes en el chat actual
    const chatsChannel = supabase
      .channel('chats_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {
        fetchChats(selectedCustomerId, false); // Falso en realtime
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatsChannel);
    };
  }, [session, selectedCustomerId]);

  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };
    // Usar setTimeout para esperar a que el DOM se actualice completamente
    setTimeout(scrollToBottom, 50);
  }, [chats]);

  const fetchChats = async (platformUserId: string, showLoading = false) => {
    try {
      if (showLoading) setIsChatsLoading(true);
      const res = await axios.get(API_CHATS, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      const filtered = res.data
        .filter((c: ChatMessage) => c.platform_user_id === platformUserId)
        .filter((c: ChatMessage) => !c.content.startsWith('[SYSTEM'));
      setChats(filtered);
    } catch (error) {
      console.error('Error fetching chats', error);
    } finally {
      if (showLoading) setIsChatsLoading(false);
    }
  };

  const toggleBot = async (customer: any) => {
    try {
      const res = await axios.post(
        `${API_CUSTOMERS}/${customer.platform_user_id}/toggle`,
        { is_bot_active: !customer.is_bot_active },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );
      // Forzar recarga global rápida de clientes para que todos los componentes se enteren sin disparar notificaciones de escritorio
      fetchCustomers(false, true);
      
      if (selectedCustomer?.platform_user_id === customer.platform_user_id) {
        setSelectedCustomer(res.data);
      }
      toast.success(res.data.is_bot_active ? 'Bot reanudado' : 'Bot pausado (Handoff activo)');
    } catch (error) {
      console.error('Error toggling bot status', error);
      toast.error('Error al cambiar el estado del bot');
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImageFile) || !selectedCustomer || !session?.access_token) return;

    setSending(true);
    let finalImageUrl = undefined;

    try {
      if (selectedImageFile) {
        setUploadingImage(true);
        const fileExt = selectedImageFile.name.split('.').pop();
        const fileName = `${selectedCustomer.platform_user_id}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('chat-images')
          .upload(fileName, selectedImageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('chat-images')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrl;
        setUploadingImage(false);
      }

      await axios.post(`${API_CHATS}/send`, {
        platform_user_id: selectedCustomer.platform_user_id,
        message: newMessage.trim(),
        ...(finalImageUrl ? { image_url: finalImageUrl } : {})
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      
      setNewMessage('');
      handleRemoveImage();
      fetchChats(selectedCustomer.platform_user_id);
    } catch (error: any) {
      console.error('Error sending message', error);
      const errorMsg = error.response?.data?.error || 'Error desconocido';
      toast.error(
        `Error de Meta API: ${errorMsg}. Si usas el Simulador, no puedes enviar mensajes reales.`,
        { duration: 5000 }
      );
    } finally {
      setSending(false);
      setUploadingImage(false);
    }
  };
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB.');
      return;
    }

    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderMessageContent = (content: string) => {
    if (content.startsWith('[IMAGE: ') && content.includes(']')) {
      const tagEndIndex = content.indexOf(']');
      const imageUrl = content.substring(8, tagEndIndex);
      const remainingText = content.substring(tagEndIndex + 1).trim();
      
      return (
        <div className="flex flex-col gap-2">
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            <img src={imageUrl} alt="Adjunto" className="max-w-[200px] max-h-[300px] object-contain rounded-lg border border-zinc-800 hover:opacity-90 transition-opacity" />
          </a>
          {remainingText && <span>{remainingText}</span>}
        </div>
      );
    }
    return <span>{content}</span>;
  };

  const filteredCustomers = customers.filter(c => 
    c.platform_user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-4 md:mb-6 shrink-0">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Bandeja de Entrada</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Supervisa las conversaciones y pausa el bot si necesitas intervenir (Handoff).</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar Clientes */}
        <div className={`w-full md:w-1/3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex-col overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ${selectedCustomer ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Buscar cliente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isCustomersLoading ? (
              <div className="p-10 flex flex-col items-center justify-center text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-4 text-sm text-zinc-500 text-center">No hay clientes recientes.</div>
            ) : (
              filteredCustomers.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCustomer(c)}
                  className={`p-4 border-b border-zinc-200/80 dark:border-zinc-800/50 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors ${selectedCustomer?.id === c.id ? 'bg-zinc-50 dark:bg-zinc-800/50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 relative">
                        <User className="w-5 h-5 text-zinc-500 dark:text-zinc-300" />
                        {c.platform === 'instagram' && <Instagram className="w-5 h-5 absolute -bottom-1.5 -right-1.5 bg-white dark:bg-zinc-900 rounded-full shadow-[0_0_0_2px_#ffffff] dark:shadow-[0_0_0_2px_#18181b]" />}
                        {c.platform === 'messenger' && <Messenger className="w-5 h-5 absolute -bottom-1.5 -right-1.5 bg-white dark:bg-zinc-900 rounded-full shadow-[0_0_0_2px_#ffffff] dark:shadow-[0_0_0_2px_#18181b]" />}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{c.profile_name || c.platform_user_id}</div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                          {c.is_bot_active ? (
                            <span className="text-sky-400 flex items-center gap-1"><Bot className="w-3 h-3"/> Bot Activo</span>
                          ) : (
                            <span className="text-amber-500 flex items-center gap-1"><User className="w-3 h-3"/> Humano al mando</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex-col overflow-hidden relative shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ${!selectedCustomer ? 'hidden md:flex' : 'flex'}`}>
          {selectedCustomer ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/20 shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedCustomer(null)}
                    className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-zinc-500 dark:text-zinc-300" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{selectedCustomer.profile_name || selectedCustomer.platform_user_id}</div>
                    <div className="text-xs text-zinc-500 hidden sm:block truncate mt-0.5">Última act: {new Date(selectedCustomer.updated_at).toLocaleTimeString()}</div>
                  </div>
                </div>
                <button 
                  onClick={() => toggleBot(selectedCustomer)}
                  className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2 transition-all ${
                    selectedCustomer.is_bot_active 
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800' 
                      : 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-500/20'
                  }`}
                >
                  {selectedCustomer.is_bot_active ? (
                    <><PauseCircle className="w-4 h-4"/><span className="hidden sm:inline">Pausar Bot (Handoff)</span><span className="sm:hidden">Pausar</span></>
                  ) : (
                    <><PlayCircle className="w-4 h-4"/><span className="hidden sm:inline">Reanudar Bot</span><span className="sm:hidden">Reanudar</span></>
                  )}
                </button>
              </div>

              {/* Messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {isChatsLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                  </div>
                ) : chats.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                    No hay mensajes en esta conversación.
                  </div>
                ) : (
                  [...chats].reverse().map((msg) => {
                    const isBot = msg.role === 'assistant';
                    return (
                      <div key={msg.id} className={`flex ${isBot ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`flex max-w-[80%] space-x-3 ${isBot ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                          <div className="shrink-0 mt-1">
                            {isBot ? (
                              <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                                  <path d="M55 35 V20 H40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" className="text-white dark:text-black" />
                                  <line x1="10" y1="55" x2="18" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-white dark:text-black" />
                                  <line x1="82" y1="55" x2="90" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-white dark:text-black" />
                                  <rect x="18" y="35" width="64" height="40" rx="12" stroke="currentColor" strokeWidth="8" fill="none" className="text-white dark:text-black" />
                                  <rect x="34" y="48" width="10" height="18" rx="5" className="fill-sky-500" />
                                  <rect x="56" y="48" width="10" height="18" rx="5" className="fill-sky-500" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <User className="w-5 h-5 text-zinc-300" />
                              </div>
                            )}
                          </div>
                          <div className={`flex flex-col ${isBot ? 'items-end' : 'items-start'}`}>
                            <div className="text-xs text-zinc-500 mb-1 px-1 flex items-center space-x-2">
                              <span>{isBot ? 'Eli' : `Cliente`}</span>
                            </div>
                            <div className={`px-4 py-3 text-[15px] leading-snug shadow-sm ${
                                isBot 
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl rounded-tr-sm' 
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-2xl rounded-tl-sm'
                            }`}>
                              {renderMessageContent(msg.content)}
                            </div>
                            {/* Metadata */}
                            <div className={`text-[10px] text-zinc-400 mt-1 font-medium ${isBot ? 'text-right mr-1' : 'ml-1'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              {isBot && ' · automatizado'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Chat Input */}
              <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 shrink-0">
                {!selectedCustomer.is_bot_active ? (
                  <div className="flex flex-col gap-3">
                    {imagePreviewUrl && (
                      <div className="relative inline-block w-max bg-zinc-100 dark:bg-zinc-950 rounded-lg p-2 border border-zinc-200 dark:border-zinc-700 shadow-md">
                        <img src={imagePreviewUrl} alt="Preview" className="max-h-32 md:max-h-48 object-contain rounded-md" />
                        <button 
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 md:gap-3">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                      />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage || sending}
                      className="p-3 text-sky-400 hover:bg-sky-500/10 rounded-xl transition-colors disabled:opacity-50 border border-transparent"
                    >
                      {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Mensaje..."
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      disabled={sending || uploadingImage}
                    />
                    <button
                      type="submit"
                      disabled={(!newMessage.trim() && !selectedImageFile) || sending || uploadingImage}
                      className="px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </form>
                </div>
                ) : (
                  <div className="text-center text-sm text-zinc-500 py-2">
                    Pausa el bot (Handoff) para enviar mensajes manualmente.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-4">
              <Bot className="w-12 h-12 text-gray-700" />
              <p>Selecciona una conversación para ver los mensajes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



