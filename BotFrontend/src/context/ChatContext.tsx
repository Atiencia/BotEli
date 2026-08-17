import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface Customer {
  id: string;
  platform_user_id: string;
  platform?: 'instagram' | 'messenger' | 'whatsapp';
  is_bot_active: boolean;
  updated_at: string;
}

interface ChatContextType {
  customers: Customer[];
  isCustomersLoading: boolean;
  fetchCustomers: (showLoading?: boolean) => Promise<void>;
  pendingCount: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const API_CUSTOMERS = `${import.meta.env.VITE_API_URL}/customers`;

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(true);
  const prevCustomersRef = useRef<Customer[]>([]);

  const fetchCustomers = async (showLoading = false) => {
    if (!session?.access_token) return;
    
    try {
      if (showLoading) setIsCustomersLoading(true);
      const res = await axios.get(API_CUSTOMERS, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const newCustomers: Customer[] = res.data;
      
      // Lógica de notificaciones de navegador (Handoff)
      if (prevCustomersRef.current.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
        newCustomers.forEach(newCust => {
          const oldCust = prevCustomersRef.current.find(c => c.id === newCust.id);
          // Si antes el bot estaba activo y ahora no lo está (alguien o el bot lo pausó)
          if (oldCust && oldCust.is_bot_active && !newCust.is_bot_active) {
            new Notification('¡Necesito Ayuda!', {
              body: `El cliente ${newCust.platform_user_id} necesita intervención humana.`,
              icon: '/favicon.svg'
            });
          }
        });
      }
      
      prevCustomersRef.current = newCustomers;
      setCustomers(newCustomers);
    } catch (error) {
      console.error('Error fetching customers globally', error);
    } finally {
      if (showLoading) setIsCustomersLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.access_token) return;

    // Carga inicial
    fetchCustomers(true);
    
    // Suscripción Global a Tiempo Real
    const customersChannel = supabase
      .channel('global_customers_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => {
        // Actualización silenciosa (showLoading = false)
        fetchCustomers(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(customersChannel);
    };
  }, [session]);

  const pendingCount = customers.filter(c => !c.is_bot_active).length;

  return (
    <ChatContext.Provider value={{ customers, isCustomersLoading, fetchCustomers, pendingCount }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext debe usarse dentro de un ChatProvider');
  }
  return context;
}
