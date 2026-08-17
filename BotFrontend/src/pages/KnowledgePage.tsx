import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface KnowledgeItem {
  id: string;
  category: string;
  content: string;
  created_at: string;
}

import { useAppContext } from '../context/AppContext';
import ConfirmModal from '../components/ConfirmModal';

const API_URL = `${import.meta.env.VITE_API_URL}/knowledge`;

export default function KnowledgePage() {
  const { session } = useAuth();
  const { knowledge: items, isKnowledgeLoading: isLoading, fetchKnowledge } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Estado para modal de confirmación
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ category: '', content: '' });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${session?.access_token}` }
  });

  const openModal = (item?: KnowledgeItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ category: item.category, content: item.content });
    } else {
      setEditingId(null);
      setFormData({ category: '', content: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, getHeaders());
        toast.success('Conocimiento actualizado correctamente');
      } else {
        await axios.post(API_URL, formData, getHeaders());
        toast.success('Conocimiento creado exitosamente');
      }
      fetchKnowledge();
      closeModal();
    } catch (error) {
      console.error('Error saving knowledge', error);
      toast.error('Ocurrió un error al guardar');
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const performDelete = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`${API_URL}/${itemToDelete}`, getHeaders());
      toast.success('Conocimiento eliminado');
      fetchKnowledge(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting knowledge', error);
      toast.error('No se pudo eliminar el conocimiento');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Base de Conocimiento</h2>
          <p className="text-gray-400 text-sm md:text-base">Administra la información que Eli utilizará para responder.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-sky-600/30"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Conocimiento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500 glass rounded-2xl border-dashed">
            No hay información en la base de conocimiento. Agrega algo para que Eli pueda aprender.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="glass rounded-2xl p-6 transition-all duration-300 hover:border-gray-600 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs font-medium border border-sky-500/30">
                  {item.category}
                </span>
                <div className="flex space-x-2">
                  <button onClick={() => openModal(item)} className="text-gray-400 hover:text-sky-400 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteClick(item.id)} className="text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-6">
                {item.content}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
                Creado: {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass bg-gray-900/90 w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Editar Conocimiento' : 'Nuevo Conocimiento'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="ej. Precios, Horarios, FAQ"
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Contenido / Información</label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escribe aquí toda la información detallada que Eli debe saber sobre este tema..."
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-sky-600/30 font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmModal 
        isOpen={!!itemToDelete}
        title="Eliminar Conocimiento"
        message="¿Estás seguro que deseas eliminar esta información? Eli ya no podrá usarla para responder."
        onConfirm={performDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}



