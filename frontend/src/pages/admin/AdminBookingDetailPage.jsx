import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  UserPlus, 
  CheckCircle2, 
  XSquare,
  Sparkles,
  Info,
  Save,
  Loader2,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import api from '@/api/axios';
import { Button } from '@/app/components/ui-kit/Button';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/components/ui/utils';

export function AdminBookingDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceValue, setPriceValue] = useState('');

  const { data: booking, isLoading } = useQuery({
    queryKey: ['admin-booking-detail', id],
    queryFn: async () => {
      const res = await api.get(`/bookings/admin/${id}/`);
      return res.data;
    }
  });

  const { data: availableAnimateurs } = useQuery({
    queryKey: ['admin-available-animateurs', booking?.event_date],
    queryFn: async () => {
      if (!booking?.event_date) return [];
      const res = await api.get(`/accounts/admin/available-animateurs/?date=${booking.event_date}`);
      return res.data;
    },
    enabled: !!booking?.event_date
  });

  const assignMutation = useMutation({
    mutationFn: async (animateurId) => {
      return api.post('/bookings/admin-assignments/', {
        booking: booking.id,
        animateur: animateurId,
        assigned_by: 'ADMIN',
        status: 'PENDING'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail', id] });
      toast.success('Animateur sollicité !');
    },
    onError: () => toast.error("Erreur lors de l'assignation")
  });

  const updateBookingMutation = useMutation({
    mutationFn: async (data) => {
      return api.patch(`/bookings/admin/${id}/`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail', id] });
      toast.success('Réservation mise à jour');
      setEditingPrice(false);
    },
    onError: () => toast.error('Erreur lors de la mise à jour')
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" /></div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/admin/bookings" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[var(--fun-purple)] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-1">Détails #{booking.booking_number}</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{booking.user_email}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Main Info Card */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--fun-purple)]/5 rounded-bl-[100%] flex items-center justify-end p-8">
              <Sparkles className="w-8 h-8 text-[var(--fun-purple)]/20" />
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Badge className="bg-gray-100 text-gray-700 font-black uppercase tracking-widest text-[10px] px-3 py-1">
                {booking.status}
              </Badge>
              <div className="h-4 w-px bg-gray-200"></div>
              <p className="text-sm font-bold text-gray-400">Créée le {format(new Date(booking.created_at), 'd MMMM yyyy HH:mm', { locale: fr })}</p>
            </div>

            <h2 className="text-4xl font-black text-gray-900 mb-8">{booking.service_title}</h2>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date de l'événement</p>
                  <p className="font-black text-gray-800 text-lg">{format(new Date(booking.event_date), 'EEEE d MMMM yyyy', { locale: fr })}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Heure & Durée</p>
                  <p className="font-black text-gray-800 text-lg">{booking.start_time.slice(0, 5)} • {booking.duration_minutes} min</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lieu</p>
                  <p className="font-black text-gray-800 text-lg">{booking.address}, {booking.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Invités</p>
                  <p className="font-black text-gray-800 text-lg">{booking.children_count} enfants</p>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-10 p-6 bg-gray-50 rounded-3xl border border-gray-100 italic text-gray-600 font-medium">
                <Info className="w-5 h-5 text-gray-400 mb-2" />
                "{booking.notes}"
              </div>
            )}
          </div>

          {/* Options Section */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-wider">Options Sélectionnées</h3>
            <div className="space-y-4">
              {booking.options?.map((opt) => (
                <div key={opt.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 group">
                  <span className="font-bold text-gray-800">{opt.name}</span>
                  <span className="font-black text-[var(--fun-purple)]">{opt.total_price}€</span>
                </div>
              ))}
              {(!booking.options || booking.options.length === 0) && <p className="text-gray-400 font-medium py-4">Aucune option supplémentaire.</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Pricing Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[var(--fun-purple)]/5 text-[var(--fun-purple)] rounded-2xl flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8" />
            </div>
            {editingPrice ? (
              <div className="w-full space-y-4">
                <div className="relative">
                  <input 
                    type="number"
                    value={priceValue}
                    onChange={(e) => setPriceValue(e.target.value)}
                    className="w-full pl-6 pr-12 py-3 bg-[var(--fun-light-bg)] rounded-xl border-2 border-[var(--fun-purple)] text-2xl font-black focus:outline-none"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400">€</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => updateBookingMutation.mutate({ final_price: priceValue })}>
                    <Save className="w-4 h-4 mr-2" /> Appliquer
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingPrice(false)}>Annuler</Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                  {booking.final_price ? 'Montant Final' : 'Montant Estimé'}
                </p>
                <p className="text-4xl font-black text-gray-900 mb-6">
                  {Number(booking.final_price || booking.estimated_price).toFixed(2)}€
                </p>
                <Button size="sm" variant="outline" className="w-full rounded-xl" onClick={() => {
                  setPriceValue(booking.final_price || booking.estimated_price);
                  setEditingPrice(true);
                }}>
                  Modifier le prix
                </Button>
              </>
            )}
          </div>

          {/* Animateur Assignment */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-wider">Assignation Animateur</h3>
            
            <div className="space-y-6">
              {/* Active Assignments */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">En cours</p>
                {booking.assignments?.length > 0 ? (
                  <div className="space-y-3">
                    {booking.assignments.map((as) => (
                      <div key={as.id} className="p-4 bg-[var(--fun-light-bg)] rounded-2xl border border-gray-200">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-gray-900">{as.animateur_name}</p>
                          <Badge className={cn("text-[8px] px-2", 
                            as.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 
                            as.status === 'REFUSED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          )}>
                            {as.status}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">
                          {format(new Date(as.assigned_at), 'd MMM HH:mm')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-400 px-2 italic">Aucun animateur assigné.</p>
                )}
              </div>

              {/* Suggestions */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Disponibles ce jour</p>
                <div className="space-y-2">
                  {availableAnimateurs?.filter(a => !booking.assignments.some(ba => ba.animateur === a.id)).map(anim => (
                    <div key={anim.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center font-black text-xs">
                          {anim.first_name[0]}{anim.last_name[0]}
                        </div>
                        <span className="text-sm font-bold text-gray-700">{anim.first_name} {anim.last_name}</span>
                      </div>
                      <button 
                        onClick={() => assignMutation.mutate(anim.id)}
                        disabled={assignMutation.isPending}
                        className="w-10 h-10 rounded-xl bg-white text-gray-400 hover:text-[var(--fun-purple)] hover:shadow-md transition-all flex items-center justify-center"
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {(!availableAnimateurs || availableAnimateurs.length === 0) && (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
                      <p className="text-xs font-bold text-red-400 leading-relaxed italic">
                        Aucun animateur disponible dans la base ! Vérifiez les plannings et les inscriptions.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
