import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  ShieldCheck, 
  Users,
  Search,
  ExternalLink,
  Loader2,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

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

export function AdminAnimateursPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState({ open: false });
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: 'TempPassword123!' // Default temp password
  });

  const { data: animateurs, isLoading } = useQuery({
    queryKey: ['admin-animateurs', searchTerm],
    queryFn: async () => {
      const res = await api.get('/accounts/profiles/');
      // Filter manually if API search not implemented
      if (!searchTerm) return res.data;
      return res.data.filter(a => 
        a.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => api.post('/accounts/admin/create-animateur/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-animateurs'] });
      toast.success('Animateur créé avec succès');
      setModal({ open: false });
      setFormData({ email: '', first_name: '', last_name: '', phone: '', password: 'TempPassword123!' });
    },
    onError: (err) => {
      const msg = err.response?.data?.email?.[0] || 'Erreur lors de la création';
      toast.error(msg);
    }
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async ({ id, is_available }) => api.patch(`/accounts/profiles/${id}/`, { is_available }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-animateurs'] });
      toast.success('Disponibilité mise à jour');
    }
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">L'Equipe Funkidz</h1>
          <p className="text-gray-500 font-medium">Gérez vos talents et leurs plannings.</p>
        </div>
        <Button onClick={() => setModal({ open: true })} className="rounded-2xl px-6 bg-gradient-to-r from-[var(--fun-purple)] to-[var(--fun-pink)] border-none">
          <UserPlus className="w-5 h-5 mr-2" /> Recruter un Animateur
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex items-center">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher un animateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--fun-light-bg)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--fun-purple)] transition-all font-medium"
          />
        </div>
      </div>

      {/* Animateur Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" /></div>
        ) : animateurs?.map((anim) => (
          <motion.div
            key={anim.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-500 flex items-center justify-center font-black text-xl shadow-inner uppercase">
                  {anim.first_name[0]}{anim.last_name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-[var(--fun-purple)] transition-colors">{anim.first_name} {anim.last_name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3" /> Animateur Certifié
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium truncate">{anim.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{anim.phone || 'Non renseigné'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disponibilité</p>
                  <p className={`text-sm font-black ${anim.is_available ? 'text-green-600' : 'text-gray-400'}`}>
                    {anim.is_available ? 'Disponible' : 'Indisponible'}
                  </p>
                </div>
                <Switch 
                  checked={anim.is_available}
                  onCheckedChange={(checked) => toggleAvailabilityMutation.mutate({ id: anim.id, is_available: checked })}
                />
              </div>

              <Button variant="outline" className="w-full rounded-xl gap-2 font-black text-xs uppercase tracking-widest py-3 h-auto" disabled>
                <Calendar className="w-4 h-4" /> Voir Planning (Bientôt)
              </Button>
            </div>
          </motion.div>
        ))}
        {animateurs?.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center text-gray-400 font-bold">Aucun animateur trouvé.</div>
        )}
      </div>

      {/* Creation Modal */}
      <Dialog open={modal.open} onOpenChange={(open) => !open && setModal({ open: false })}>
        <DialogContent className="rounded-[2.5rem] p-8 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Nouveau Compte Animateur</DialogTitle>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
                <input 
                  type="text" 
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom</label>
                <input 
                  type="text" 
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email (Identifiant)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-12 pr-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
                />
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
              <Lock className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1">Mot de passe provisoire</p>
                <p className="text-sm font-bold text-amber-600">Le compte sera créé avec le mot de passe par défaut. L'animateur pourra le modifier plus tard.</p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setModal({ open: false })}>Annuler</Button>
            <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Création...' : 'Créer le compte'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
