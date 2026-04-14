import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Euro, 
  Tag, 
  Info,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
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

const PRICING_TYPES = [
  { value: 'FIXED', label: 'Fixe', desc: 'S\'ajoute simplement au total' },
  { value: 'PER_CHILD', label: 'Par enfant', desc: 'Multiplié par le nombre d\'enfants' },
  { value: 'PER_HOUR', label: 'Par heure', desc: 'Multiplié par la durée en heures' },
];

export function AdminOptionsPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState({ open: false, option: null });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    pricing_type: 'FIXED',
    is_active: true
  });

  const { data: options, isLoading } = useQuery({
    queryKey: ['admin-options'],
    queryFn: async () => {
      const res = await api.get('/services/admin/options/');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (modal.option) {
        return api.patch(`/services/admin/options/${modal.option.id}/`, data);
      }
      return api.post('/services/admin/options/', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-options'] });
      toast.success(modal.option ? 'Option mise à jour' : 'Option créée');
      closeModal();
    },
    onError: () => toast.error('Une erreur est survenue')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/services/admin/options/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-options'] });
      toast.success('Option supprimée');
    }
  });

  const openModal = (option = null) => {
    if (option) {
      setFormData({
        name: option.name,
        description: option.description,
        price: option.price,
        pricing_type: option.pricing_type,
        is_active: option.is_active
      });
      setModal({ open: true, option });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        pricing_type: 'FIXED',
        is_active: true
      });
      setModal({ open: true, option: null });
    }
  };

  const closeModal = () => setModal({ open: false, option: null });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Options Additionnelles</h1>
          <p className="text-gray-500 font-medium">Gérez les suppléments et variantes de services.</p>
        </div>
        <Button onClick={() => openModal()} className="rounded-2xl px-6">
          <Plus className="w-5 h-5 mr-2" /> Nouvelle Option
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Nom / Description</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Type de Calcul</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Prix Unitaire</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Statut</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--fun-purple)] mx-auto" />
                  </td>
                </tr>
              ) : options?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-gray-400 font-bold">Aucune option créée.</td>
                </tr>
              ) : (
                options?.map((opt) => (
                  <tr key={opt.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 leading-none mb-1">{opt.name}</p>
                      <p className="text-xs font-medium text-gray-400 line-clamp-1">{opt.description || 'Sans description'}</p>
                    </td>
                    <td className="px-6 py-6">
                      <Badge variant="secondary" className="bg-indigo-50 text-[10px] text-indigo-600 font-black uppercase tracking-wider px-2">
                        {PRICING_TYPES.find(t => t.value === opt.pricing_type)?.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-6 font-black text-gray-700">
                      {opt.price}€
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        {opt.is_active ? (
                          <>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-green-600">Actif</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <span className="text-gray-400">Désactivé</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(opt)}
                          className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-[var(--fun-purple)] hover:bg-[var(--fun-purple)]/5 transition-all flex items-center justify-center"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => window.confirm('Supprimer cette option ?') && deleteMutation.mutate(opt.id)}
                          className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      <Dialog open={modal.open} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="rounded-[2.5rem] p-8 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              {modal.option ? 'Modifier l\'Option' : 'Nouvelle Option'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom de l'option</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="ex: Barbe à papa à volonté"
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de Calcul</label>
              <div className="grid grid-cols-1 gap-3">
                {PRICING_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({...formData, pricing_type: type.value})}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left ${
                      formData.pricing_type === type.value 
                        ? 'bg-[var(--fun-purple)]/5 border-[var(--fun-purple)] shadow-sm' 
                        : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.pricing_type === type.value ? 'border-[var(--fun-purple)]' : 'border-gray-200'
                    }`}>
                      {formData.pricing_type === type.value && <div className="w-2 h-2 rounded-full bg-[var(--fun-purple)]"></div>}
                    </div>
                    <div>
                      <p className={`font-black uppercase tracking-widest text-[10px] ${formData.pricing_type === type.value ? 'text-[var(--fun-purple)]' : 'text-gray-400'}`}>
                        {type.label}
                      </p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{type.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prix (€)</label>
                <div className="relative">
                  <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full pl-10 pr-5 py-3 bg-gray-50 border-none rounded-2xl font-black focus:ring-2 focus:ring-[var(--fun-purple)]"
                  />
                </div>
              </div>
              <div className="space-y-2 flex flex-col items-center justify-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Est Actif</label>
                <Switch 
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description courte</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-[var(--fun-purple)]"
              ></textarea>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={closeModal}>Annuler</Button>
            <Button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending}>
              {mutation.isPending ? 'Enregistrement...' : (modal.option ? 'Mettre à jour' : 'Créer l\'option')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
