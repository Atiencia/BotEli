import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, MessageCircle, Bot, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function DashboardPage() {
  const { analyticsData: data, isAnalyticsLoading: isLoading, analyticsError: error } = useAppContext();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-sky-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl max-w-md text-center">
          {error || 'No se pudieron cargar los datos'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto h-screen flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Métricas de Rendimiento</h2>
        <p className="text-gray-400">Analiza el volumen de conversaciones y el ahorro de tiempo gracias a tu bot.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Clientes</p>
              <p className="text-3xl font-bold text-white">{data.totalCustomers}</p>
            </div>
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Mensajes del Bot</p>
              <p className="text-3xl font-bold text-white">{data.totalBotMessages}</p>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Tiempo Ahorrado (Aprox)</p>
              <p className="text-3xl font-bold text-white">
                {/* Asumiendo que cada respuesta del bot le ahorra 2 minutos al humano */}
                {Math.round((data.totalBotMessages * 2) / 60)} horas
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl border border-gray-800 p-6 flex flex-col">
        <h3 className="text-xl font-semibold text-white mb-6">Actividad de los últimos 7 días</h3>
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#F3F4F6' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Legend />
              <Bar dataKey="user" name="Mensajes Recibidos" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bot" name="Respuestas del Bot" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


