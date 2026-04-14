import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  AlertCircle, 
  CreditCard,
  XCircle,
  CheckCircle2,
  Clock4,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import api from '@/api/axios';
import { unwrapListResponse } from '@/utils/apiHelpers';
import { Button } from '@/app/components/ui-kit/Button';
import { Badge } from '@/app/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

const STATUS_CONFIG = {
  PENDING: {
    label: 'En attente',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock4
  },
  CONFIRMED: {
    label: 'Confirmé',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CheckCircle2
  },
  PAYMENT_PENDING: {
    label: 'Paiement en attente',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: CreditCard
  },
  PAID: {
    label: 'Payé',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle2
  },
  CANCELLED: {
    label: 'Annulé',
    color: 'bg-gray-100 text-gray-500 border-gray-200',
    icon: XCircle
  },
  DONE: {
    label: 'Terminé',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: CheckCircle2
  }
};

export function MyBookingsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/');
      return unwrapListResponse(res.data);
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      return api.patch(`/bookings/${id}/cancel/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      toast.success('Réservation annulée avec succès.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Erreur lors de l'annulation.");
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 px-4 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 bg-gradient-to-b from-white to-[var(--fun-light-bg)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Mes Réservations</h1>
            <p className="text-gray-600">Retrouvez l'historique de vos moments magiques</p>
          </div>
          <Button to="/booking" className="w-fit">
            Nouvelle Réservation
          </Button>
        </div>

        {bookings?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border border-gray-100"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune réservation pour le moment</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Vous n'avez pas encore planifié de fête. Prêt à créer des souvenirs inoubliables ?
            </p>
            <Button to="/booking" size="lg">Planifier ma première fête</Button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {bookings?.map((booking, index) => {
              const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Visual & Service */}
                    <div className="flex-1 flex gap-6 items-center">
                      <div className="w-20 h-20 rounded-2xl bg-[var(--fun-light-bg)] flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-50">
                        {booking.service?.image_url ? (
                          <img src={booking.service.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-8 h-8 text-[var(--fun-purple)]/20" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", status.color)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                          <span className="text-xs font-bold text-gray-400 font-mono">#{booking.booking_number}</span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 group-hover:text-[var(--fun-purple)] transition-colors">
                          {booking.service?.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(booking.event_date), 'd MMMM yyyy', { locale: fr })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.start_time?.slice(0, 5)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end gap-4 pt-6 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <div className="text-right">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Prix Estimé</p>
                        <p className="text-2xl font-black text-[var(--fun-purple)]">
                          {Number(booking.estimated_price).toFixed(2)} €
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Cancel Button */}
                        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <XCircle className="w-6 h-6" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2rem]">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Annuler cette réservation ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Êtes-vous sûr de vouloir annuler votre fête ?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">Rester</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => cancelMutation.mutate(booking.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                                >
                                  Oui, annuler
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {/* Pay Button */}
                        {booking.status === 'CONFIRMED' && (
                          <Button to={`/payment/${booking.id}`} size="sm" className="shadow-lg shadow-[var(--fun-purple)]/20">
                            Payer <CreditCard className="w-4 h-4 ml-2" />
                          </Button>
                        )}

                        {/* Details Link */}
                        <Link 
                          to={`/bookings/${booking.id}`}
                          className="flex items-center justify-center w-12 h-12 bg-[var(--fun-purple)]/5 text-[var(--fun-purple)] rounded-2xl hover:bg-[var(--fun-purple)] hover:text-white transition-all"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
