import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, MessageCircle, Bot, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { analyticsData: data, isAnalyticsLoading: isLoading, analyticsError: error } = useAppContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="w-8 h-8 text-zinc-400 dark:text-zinc-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-6 rounded-xl max-w-md text-center text-sm font-medium">
          {error || 'No se pudieron cargar los datos'}
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen bg-transparent font-sans selection:bg-sky-500/30 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-8"
      >
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">Rendimiento</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">Métricas en tiempo real del volumen y ahorro generado por tu IA.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">Clientes</p>
            <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tighter">{data.totalCustomers}</p>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">Mensajes IA</p>
            <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tighter">{data.totalBotMessages}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">Horas Ahorradas</p>
            <div className="w-10 h-10 bg-[#111111] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tighter">
              {Math.round((data.totalBotMessages * 2) / 60)} <span className="text-xl font-medium text-zinc-400 dark:text-zinc-500">hrs</span>
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-8 flex flex-col"
      >
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight mb-8">Actividad de los últimos 7 días</h3>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#52525b" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip 
                cursor={{ fill: '#71717a', opacity: 0.1 }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#fff', fontSize: '14px' }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Bar dataKey="user" name="Mensajes Recibidos" fill="#71717a" radius={[4, 4, 0, 0]} barSize={32} />
              <Bar dataKey="bot" name="Respuestas de IA" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}


