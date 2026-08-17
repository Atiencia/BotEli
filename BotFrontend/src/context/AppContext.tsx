import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface Customer {
  id: string;
  platform_user_id: string;
  platform?: 'instagram' | 'messenger' | 'whatsapp';
  is_bot_active: boolean;
  profile_name?: string;
  updated_at: string;
}

interface KnowledgeItem {
  id: string;
  category: string;
  content: string;
  created_at: string;
}

interface AppContextType {
  // Customers / Chats
  customers: Customer[];
  isCustomersLoading: boolean;
  fetchCustomers: (showLoading?: boolean, skipNotifications?: boolean) => Promise<void>;
  pendingCount: number;

  // Knowledge
  knowledge: KnowledgeItem[];
  isKnowledgeLoading: boolean;
  fetchKnowledge: (showLoading?: boolean) => Promise<void>;

  // Analytics
  analyticsData: any;
  isAnalyticsLoading: boolean;
  analyticsError: string | null;
  fetchAnalytics: (showLoading?: boolean) => Promise<void>;

  // Config
  config: any;
  isConfigLoading: boolean;
  fetchConfig: (showLoading?: boolean) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_CUSTOMERS = `${import.meta.env.VITE_API_URL}/customers`;
const API_KNOWLEDGE = `${import.meta.env.VITE_API_URL}/knowledge`;
const API_ANALYTICS = `${import.meta.env.VITE_API_URL}/analytics`;
const API_CONFIG = `${import.meta.env.VITE_API_URL}/bot-config`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  
  // States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(true);
  
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [isKnowledgeLoading, setIsKnowledgeLoading] = useState(true);

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const [config, setConfig] = useState<any>(null);
  const [isConfigLoading, setIsConfigLoading] = useState(true);

  const prevCustomersRef = useRef<Customer[]>([]);

  // 1. Fetch Customers
  const fetchCustomers = async (showLoading = false, skipNotifications = false) => {
    if (!session?.access_token) return;
    try {
      if (showLoading) setIsCustomersLoading(true);
      const res = await axios.get(API_CUSTOMERS, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const newCustomers: Customer[] = res.data;
      
      if (!skipNotifications && prevCustomersRef.current.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
        newCustomers.forEach(newCust => {
          const oldCust = prevCustomersRef.current.find(c => c.id === newCust.id);
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

  // 2. Fetch Knowledge
  const fetchKnowledge = async (showLoading = false) => {
    if (!session?.access_token) return;
    try {
      if (showLoading) setIsKnowledgeLoading(true);
      const res = await axios.get(API_KNOWLEDGE, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setKnowledge(res.data);
    } catch (error) {
      console.error('Error fetching knowledge', error);
    } finally {
      if (showLoading) setIsKnowledgeLoading(false);
    }
  };

  // 3. Fetch Analytics
  const fetchAnalytics = async (showLoading = false) => {
    if (!session?.access_token) return;
    try {
      if (showLoading) setIsAnalyticsLoading(true);
      const res = await axios.get(API_ANALYTICS, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setAnalyticsData(res.data);
      setAnalyticsError(null);
    } catch (error) {
      console.error('Error fetching analytics', error);
      setAnalyticsError('Hubo un error al cargar las métricas.');
    } finally {
      if (showLoading) setIsAnalyticsLoading(false);
    }
  };

  // 4. Fetch Config
  const fetchConfig = async (showLoading = false) => {
    if (!session?.access_token) return;
    try {
      if (showLoading) setIsConfigLoading(true);
      const res = await axios.get(API_CONFIG, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setConfig({
        system_prompt: res.data.system_prompt || '',
        model: res.data.model || 'openai/gpt-oss-20b',
        temperature: res.data.temperature ?? 0.7,
        meta_access_token: res.data.meta_access_token || '',
        meta_verify_token: res.data.meta_verify_token || '',
        whatsapp_phone_id: res.data.whatsapp_phone_id || '',
        whatsapp_access_token: res.data.whatsapp_access_token || '',
        whatsapp_verify_token: res.data.whatsapp_verify_token || '',
        is_active: res.data.is_active ?? true
      });
    } catch (error) {
      console.error('Error fetching config', error);
    } finally {
      if (showLoading) setIsConfigLoading(false);
    }
  };

  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!session?.access_token) {
      initialLoadDone.current = false;
      return;
    }

    const isFirstLoad = !initialLoadDone.current;

    // Initial Load of EVERYTHING (o background sync si ya cargó)
    fetchCustomers(isFirstLoad);
    fetchKnowledge(isFirstLoad);
    fetchAnalytics(isFirstLoad);
    fetchConfig(isFirstLoad);
    
    initialLoadDone.current = true;
    
    // Realtime subscription for customers
    const customersChannel = supabase
      .channel('global_customers_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => {
        fetchCustomers(false);
        // Cuando hay nuevos chats, también actualizamos las métricas silenciosamente
        fetchAnalytics(false);
      })
      .subscribe();

    // Realtime subscription for knowledge (auto-aprendizaje en vivo)
    const knowledgeChannel = supabase
      .channel('global_knowledge_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'knowledge' }, () => {
        fetchKnowledge(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(customersChannel);
      supabase.removeChannel(knowledgeChannel);
    };
  }, [session]);

  const pendingCount = customers.filter(c => !c.is_bot_active).length;

  return (
    <AppContext.Provider value={{ 
      customers, isCustomersLoading, fetchCustomers, pendingCount,
      knowledge, isKnowledgeLoading, fetchKnowledge,
      analyticsData, isAnalyticsLoading, analyticsError, fetchAnalytics,
      config, isConfigLoading, fetchConfig
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext debe usarse dentro de un AppProvider');
  }
  return context;
}
