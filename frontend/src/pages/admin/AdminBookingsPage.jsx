import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  CreditCard,
  UserPlus,
  Eye,
  Loader2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import api from '@/api/axios';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui-kit/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";

const STATUS_CONFIG = {
  PENDING: { label: 'En attente', color: 'bg-amber-100 text-amber-700' },
  CONFIRMED: { label: 'Confirmé', color: 'bg-blue-100 text-blue-700' },
  PAYMENT_PENDING: { label: 'Paiement en attente', color: 'bg-purple-100 text-purple-700' },
  PAID: { label: 'Payé', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Annulé', color: 'bg-gray-100 text-gray-400' },
  DONE: { label: 'Terminé', color: 'bg-gray-100 text-gray-700' },
};

export function AdminBookingsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [confirmModal, setConfirmModal] = useState({ open: false, booking: null, finalPrice: '' });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings', statusFilter, searchTerm],
    queryFn: async () => {
      let url = '/bookings/admin/';
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const res = await api.get(`${url}?${params.toString()}`);
      return res.data.results || res.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, final_price }) => {
      return api.patch(`/bookings/admin/${id}/`, { status, final_price });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Statut mis à jour avec succès');
      setConfirmModal({ open: false, booking: null, finalPrice: '' });
    },
    onError: () => toast.error('Erreur lors de la mise à jour')
  });

  const filteredBookings = bookings; // Filtering is handled by API usually, but I'll add search logic if API search is missing

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Gestion des Réservations</h1>
          <p className="text-gray-500 font-medium font-sans">Visualisez et gérez toutes les fêtes Funkidz.</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher par numéro ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--fun-light-bg)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--fun-purple)] transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400 mr-2" />
          <div className="flex bg-[var(--fun-light-bg)] p-1 rounded-2xl">
            {['ALL', 'PENDING', 'CONFIRMED', 'PAID', 'CANCELLED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  statusFilter === s ? 'bg-white text-[var(--fun-purple)] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {s === 'ALL' ? 'Tout' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Réf / Client</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Service</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date & Heure</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Statut</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Montant</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--fun-purple)] mx-auto" />
                  </td>
                </tr>
              ) : filteredBookings?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-12 text-center text-gray-400 font-bold">Aucune réservation trouvée.</td>
                </tr>
              ) : (
                filteredBookings?.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 leading-none mb-1">#{booking.booking_number}</p>
                      <p className="text-sm font-medium text-gray-400">{booking.user_email}</p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-bold text-gray-800">{booking.service_title}</p>
                      <p className="text-xs text-gray-400 font-medium">{booking.children_count} enfants • {booking.duration_minutes} min</p>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 font-bold text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {format(new Date(booking.event_date), 'd MMM yyyy')}
                      </div>
                      <p className="text-xs text-gray-400 font-medium pl-6">{booking.start_time.slice(0, 5)}</p>
                    </td>
                    <td className="px-6 py-6">
                      <Badge className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${STATUS_CONFIG[booking.status]?.color}`}>
                        {STATUS_CONFIG[booking.status]?.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <p className="font-black text-gray-900">
                        {Number(booking.final_price || booking.estimated_price).toFixed(2)}€
                      </p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        {booking.final_price ? 'Final' : 'Estimé'}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* Contextual Action Buttons */}
                        {booking.status === 'PENDING' && (
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => setConfirmModal({ open: true, booking, finalPrice: booking.estimated_price })}
                              className="w-10 h-10 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                              title="Confirmer"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => {
                                if(window.confirm('Refuser cette réservation ?')) {
                                  updateStatusMutation.mutate({ id: booking.id, status: 'CANCELLED' });
                                }
                              }}
                              className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                              title="Refuser"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                        
                        {booking.status === 'CONFIRMED' && (
                          <button 
                            className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                            title="Lien paiement"
                          >
                            <CreditCard className="w-5 h-5" />
                          </button>
                        )}

                        <Link 
                          to={`/admin/bookings/${booking.id}`}
                          className="w-10 h-10 rounded-xl bg-[var(--fun-purple)]/5 text-[var(--fun-purple)] hover:bg-[var(--fun-purple)] hover:text-white transition-all flex items-center justify-center shadow-sm"
                          title="Voir détails"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={confirmModal.open} onOpenChange={(open) => !open && setConfirmModal({ ...confirmModal, open: false })}>
        <DialogContent className="rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Confirmer la Réservation</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <p className="text-gray-500 font-medium leading-relaxed">
              Veuillez confirmer ou ajuster le prix final pour la réservation <span className="font-black text-gray-900">#{confirmModal.booking?.booking_number}</span>.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 tracking-widest uppercase ml-1">Prix Final (€)</label>
              <input 
                type="number" 
                value={confirmModal.finalPrice}
                onChange={(e) => setConfirmModal({ ...confirmModal, finalPrice: e.target.value })}
                className="w-full px-6 py-4 bg-[var(--fun-light-bg)] border-none rounded-2xl text-xl font-black text-gray-900 focus:ring-2 focus:ring-[var(--fun-purple)]"
              />
              <p className="text-[10px] text-gray-400 font-bold mt-1">Estimé à l'origine : {confirmModal.booking?.estimated_price}€</p>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setConfirmModal({ open: false, booking: null, finalPrice: '' })}>
              Annuler
            </Button>
            <Button 
              onClick={() => updateStatusMutation.mutate({ 
                id: confirmModal.booking.id, 
                status: 'CONFIRMED', 
                final_price: confirmModal.finalPrice 
              })}
              disabled={updateStatusMutation.isPending}
            >
              Confirmé le créneau
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
