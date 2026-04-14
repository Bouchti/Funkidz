import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Sparkles, 
  Check, 
  X,
  Clock,
  Euro,
  Tag,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import api from '@/api/axios';
import { Button } from '@/app/components/ui-kit/Button';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Switch } from "@/app/components/ui/switch";

export function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState({ open: false, service: null });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    base_price: '',
    duration_minutes: '',
    category: '',
    is_active: true,
    selected_options: []
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const res = await api.get('/services/admin/services/');
      return res.data;
    }
  });

  const { data: options } = useQuery({
    queryKey: ['admin-options-all'],
    queryFn: async () => {
      const res = await api.get('/services/admin/options/');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (modal.service) {
        return api.patch(`/services/admin/services/${modal.service.id}/`, data);
      }
      return api.post('/services/admin/services/', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success(modal.service ? 'Service mis à jour' : 'Service créé');
      closeModal();
    },
    onError: () => toast.error('Une erreur est survenue')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/services/admin/services/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service supprimé');
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }) => api.patch(`/services/admin/services/${id}/`, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Statut mis à jour');
    }
  });

  const openModal = (service = null) => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        base_price: service.base_price,
        duration_minutes: service.duration_minutes,
        category: service.category,
        is_active: service.is_active,
        selected_options: service.options.map(o => o.option.id)
      });
      setModal({ open: true, service });
    } else {
      setFormData({
        title: '',
        description: '',
        base_price: '',
        duration_minutes: '',
        category: 'Magie',
        is_active: true,
        selected_options: []
      });
      setModal({ open: true, service: null });
    }
  };

  const closeModal = () => setModal({ open: false, service: null });

  const toggleOption = (optId) => {
    setFormData(prev => ({
      ...prev,
      selected_options: prev.selected_options.includes(optId)
        ? prev.selected_options.filter(id => id !== optId)
        : [...prev.selected_options, optId]
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Nos Services</h1>
          <p className="text-gray-500 font-medium">Configurez les formules et prestations disponibles.</p>
        </div>
        <Button onClick={() => openModal()} className="rounded-2xl px-6">
          <Plus className="w-5 h-5 mr-2" /> Nouveau Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" /></div>
        ) : services?.map((service) => (
          <motion.div
            key={service.id}
            layoutId={service.id}
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-8 flex-grow">
              <div className="flex justify-between items-start mb-6">
                <Badge className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${service.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {service.is_active ? 'Actif' : 'Inactif'}
                </Badge>
                <div className="flex gap-2">
                  <button onClick={() => openModal(service)} className="p-2 text-gray-400 hover:text-[var(--fun-purple)] transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => window.confirm('Supprimer ce service ?') && deleteMutation.mutate(service.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{service.title}</h3>
              <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6">{service.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Euro className="w-4 h-4" />
                  <span className="text-sm font-black text-gray-700">{service.base_price}€</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-black text-gray-700">{service.duration_minutes} min</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {service.options?.slice(0, 3).map(opt => (
                  <Badge key={opt.id} variant="secondary" className="bg-gray-50 text-[10px] text-gray-500 lowercase px-2">
                    {opt.option.name}
                  </Badge>
                ))}
                {service.options?.length > 3 && (
                  <Badge variant="secondary" className="bg-gray-50 text-[10px] text-gray-400 px-2">
                    +{service.options.length - 3} plus
                  </Badge>
                )}
              </div>
            </div>

            <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visibilité publique</span>
              <Switch 
                checked={service.is_active}
                onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: service.id, is_active: checked })}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* CRUD Modal */}
      <Dialog open={modal.open} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="rounded-[2.5rem] p-0 overflow-hidden max-w-2xl sm:max-w-3xl">
          <div className="flex flex-col h-[85vh]">
            <DialogHeader className="p-8 border-b border-gray-100 shrink-0">
              <DialogTitle className="text-2xl font-black">
                {modal.service ? 'Modifier le Service' : 'Nouveau Service'}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-grow overflow-y-auto p-8 space-y-8 no-scrollbar">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre de la prestation</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="ex: Pack Anniversaire Magique"
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="ex: Anniversaire"
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-[var(--fun-purple)]"
                ></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prix de Base (€)</label>
                  <div className="relative">
                    <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="number" 
                      value={formData.base_price}
                      onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                      className="w-full pl-10 pr-5 py-3 bg-gray-50 border-none rounded-2xl font-black focus:ring-2 focus:ring-[var(--fun-purple)]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Durée (minutes)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="number" 
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                      className="w-full pl-10 pr-5 py-3 bg-gray-50 border-none rounded-2xl font-black focus:ring-2 focus:ring-[var(--fun-purple)]"
                    />
                  </div>
                </div>
              </div>

              {/* Options Selector */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Options Compatibles</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {options?.map(opt => {
                    const isSelected = formData.selected_options.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleOption(opt.id)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          isSelected 
                            ? 'bg-[var(--fun-purple)] border-[var(--fun-purple)] text-white shadow-md' 
                            : 'bg-white border-gray-100 text-gray-600 hover:border-[var(--fun-purple)]/30'
                        }`}
                      >
                        <span className="text-xs font-bold truncate pr-2">{opt.name}</span>
                        {isSelected ? <Check className="w-3 h-3 flex-shrink-0" /> : <Plus className="w-3 h-3 flex-shrink-0 opacity-30" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <DialogFooter className="p-8 border-t border-gray-100 shrink-0 bg-gray-50/50">
              <Button variant="outline" onClick={closeModal}>Annuler</Button>
              <Button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending}>
                {mutation.isPending ? 'Enregistrement...' : (modal.service ? 'Mettre à jour' : 'Créer le service')}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
