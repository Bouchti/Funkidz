import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Info, 
  X,
  PlusCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

import api from '@/api/axios';
import { Button } from '@/app/components/ui-kit/Button';
import { unwrapListResponse } from '@/utils/apiHelpers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";

export function AvailabilityPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    blocked_date: format(new Date(), 'yyyy-MM-dd'),
    blocked_start: '09:00',
    blocked_end: '18:00',
    reason: ''
  });

  const { data: availabilities, isLoading, isError } = useQuery({
    queryKey: ['animateur-availabilities'],
    queryFn: async () => {
      const res = await api.get('/animateur/availabilities/');
      return unwrapListResponse(res.data);
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data) =>
      api.post('/animateur/availabilities/', {
        ...data,
        blocked_start: data.blocked_start.length === 5 ? `${data.blocked_start}:00` : data.blocked_start,
        blocked_end: data.blocked_end.length === 5 ? `${data.blocked_end}:00` : data.blocked_end,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animateur-availabilities'] });
      toast.success('Période d\'indisponibilité ajoutée');
      setModalOpen(false);
      setFormData({ blocked_date: format(new Date(), 'yyyy-MM-dd'), blocked_start: '09:00', blocked_end: '18:00', reason: '' });
    },
    onError: () => toast.error('Erreur lors de l\'ajout')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/animateur/availabilities/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animateur-availabilities'] });
      toast.success('Période supprimée');
    }
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Mes Disponibilités</h1>
          <p className="text-gray-500 font-medium">Bloquez les créneaux où vous n'êtes pas disponible pour travailler.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="rounded-2xl px-6">
          <PlusCircle className="w-5 h-5 mr-2" /> Bloquer un créneau
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
             <AlertTriangle className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10" />
             <div className="relative z-10 space-y-4">
               <h3 className="text-xl font-black uppercase tracking-wider">Note Importante</h3>
               <p className="text-indigo-100 font-medium text-sm leading-relaxed">
                 Les créneaux bloqués ici sont visibles par l'administration lors de l'attribution des missions.
               </p>
               <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                 <p className="text-xs font-bold italic opacity-80">
                   "Une indisponibilité claire permet une meilleure organisation pour toute la team !"
                 </p>
               </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
             <Clock className="w-6 h-6 text-indigo-500" />
             Créneaux Bloqués
          </h3>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" /></div>
            ) : isError ? (
              <div className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100 text-center text-red-700 font-bold">
                Impossible de charger vos disponibilités.
              </div>
            ) : availabilities?.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-12 border-2 border-dashed border-gray-100 text-center text-gray-400 font-bold">
                Aucun créneau bloqué. Vous êtes libre comme l'air ! 🕊️
              </div>
            ) : (
              availabilities?.map((avail) => (
                <motion.div 
                  key={avail.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                       <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900">
                        {format(new Date(avail.blocked_date), 'EEEE d MMMM yyyy', { locale: fr })}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {avail.blocked_start.slice(0, 5)} - {avail.blocked_end.slice(0, 5)}</span>
                        {avail.reason && <span className="flex items-center gap-1"><Info className="w-3 h-3" /> {avail.reason}</span>}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { if(window.confirm('Supprimer ce créneau ?')) deleteMutation.mutate(avail.id) }}
                    className="p-4 rounded-2xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-[2.5rem] p-8 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Bloquer un créneau</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
              <input 
                type="date" 
                value={formData.blocked_date}
                onChange={(e) => setFormData({...formData, blocked_date: e.target.value})}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Heure de début</label>
                <input 
                  type="time" 
                  value={formData.blocked_start}
                  onChange={(e) => setFormData({...formData, blocked_start: e.target.value})}
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Heure de fin</label>
                <input 
                  type="time" 
                  value={formData.blocked_end}
                  onChange={(e) => setFormData({...formData, blocked_end: e.target.value})}
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Raison (Optionnel)</label>
              <input 
                type="text" 
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                placeholder="Ex: Rendez-vous médical, Congés..."
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={() => addMutation.mutate(formData)} disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Enregistrement...' : 'Bloquer le créneau'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
