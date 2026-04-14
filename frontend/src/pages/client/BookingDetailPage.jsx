import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Users, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Info,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

import api from '@/api/axios';
import { Button } from '@/app/components/ui-kit/Button';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/components/ui/utils';

const STATUS_STEPS = [
  { id: 'PENDING', label: 'Demande reçue', description: 'En attente de validation admin' },
  { id: 'CONFIRMED', label: 'Confirmée', description: 'Le créneau est validé' },
  { id: 'PAID', label: 'Payée', description: 'Acompte/Paiement reçu' },
  { id: 'DONE', label: 'Terminée', description: 'Événement passé' }
];

export function BookingDetailPage() {
  const { id } = useParams();

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking-detail', id],
    queryFn: async () => {
      const res = await api.get(`/bookings/${id}/`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 px-4 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen pt-40 px-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black mb-2">Réservation introuvable</h2>
        <p className="text-gray-500 mb-8">Nous ne parvenons pas à charger les détails de cette réservation.</p>
        <Button to="/bookings" variant="outline">Retour à mes réservations</Button>
      </div>
    );
  }

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.id === booking.status);
  const isCancelled = booking.status === 'CANCELLED';

  return (
    <div className="min-h-screen pt-28 pb-16 bg-[var(--fun-light-bg)]/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link 
          to="/bookings" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--fun-purple)] font-bold mb-8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Retour aux réservations
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100 overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)]"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black text-gray-400 font-mono tracking-widest">#{booking.booking_number}</span>
                    {isCancelled && <Badge variant="destructive" className="rounded-full uppercase text-[10px]">ANNULÉE</Badge>}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                    {booking.service?.title}
                  </h1>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Montant total</p>
                  <p className="text-4xl font-black text-[var(--fun-purple)]">{Number(booking.estimated_price).toFixed(2)} €</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 bg-[var(--fun-light-bg)] p-6 rounded-[2rem]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--fun-orange)] shadow-sm">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="font-bold text-gray-900">{format(new Date(booking.event_date), 'EEEE d MMMM yyyy', { locale: fr })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--fun-pink)] shadow-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Heure</p>
                    <p className="font-bold text-gray-900">{booking.start_time?.slice(0, 5)} ({booking.duration_minutes} min)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--fun-purple)] shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Lieu</p>
                    <p className="font-bold text-gray-900">{booking.address}, {booking.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--fun-blue)] shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Invités</p>
                    <p className="font-bold text-gray-900">{booking.children_count} enfants</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Status Timeline */}
            {!isCancelled && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100"
              >
                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--fun-purple)]/10 text-[var(--fun-purple)] flex items-center justify-center text-sm">✓</span>
                  Suivi de votre réservation
                </h3>
                
                <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-gray-100 after:absolute after:top-0 after:left-4 after:w-0.5 after:bg-[var(--fun-purple)] after:transition-all after:duration-500"
                  style={{ afterHeight: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%` }}>
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStatusIndex;
                    const isCurrent = idx === currentStatusIndex;

                    return (
                      <div key={step.id} className="relative pl-12">
                        <div className={cn(
                          "absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10",
                          isCompleted ? "bg-[var(--fun-purple)] border-[var(--fun-purple)] shadow-[0_0_10px_rgba(138,0,255,0.4)]" : "bg-white border-gray-200"
                        )} />
                        <div className={cn(
                          "transition-all duration-300",
                          isCompleted ? "opacity-100" : "opacity-40"
                        )}>
                          <p className={cn("font-black text-lg", isCompleted ? "text-gray-900" : "text-gray-500")}>
                            {step.label}
                            {isCurrent && (
                              <Badge className="ml-3 bg-[var(--fun-purple)]/10 text-[var(--fun-purple)] border-none text-[10px] font-black uppercase tracking-widest">Étape actuelle</Badge>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 font-medium">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Options List */}
            {booking.options?.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100"
              >
                <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-wider">Magie supplémentaire</h3>
                <div className="space-y-3">
                  {booking.options.map(({ option }) => (
                    <div key={option.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[var(--fun-pink)] shadow-sm group-hover:scale-110 transition-transform">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-800">{option.name}</span>
                      </div>
                      <span className="font-black text-[var(--fun-purple)]">+{Number(option.price).toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Payment Card */}
            {booking.status === 'CONFIRMED' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-[var(--fun-purple)] to-[var(--fun-pink)] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[var(--fun-purple)]/20 text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-2">Finaliser ma fête</h3>
                <p className="text-white/80 text-sm mb-6 font-medium leading-relaxed">
                  Votre réservation est confirmée ! Payez maintenant pour bloquer définitivement le créneau.
                </p>
                <Button to={`/payment/${booking.id}`} size="lg" className="w-full !bg-white !text-[var(--fun-purple)] shadow-xl font-black hover:scale-105 transition-all">
                  Payer {Number(booking.estimated_price).toFixed(2)}€
                </Button>
              </motion.div>
            )}

            {/* Animator Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-wider">Votre Animateur</h3>
              {booking.assignments?.length > 0 ? (
                <div className="space-y-4 text-center py-4">
                  <div className="w-20 h-20 rounded-full bg-[var(--fun-orange)]/10 text-[var(--fun-orange)] flex items-center justify-center mx-auto shadow-inner">
                    <User className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="font-black text-xl text-gray-900">
                      {booking.assignments[0].animateur?.first_name || "L'animateur magique"}
                    </p>
                    <p className="text-gray-500 font-medium text-sm">Assigné à votre fête</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <Info className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    L'animateur idéal sera assigné dès que le paiement sera effectué.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Contact Support */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Besoin d'aide ?</h3>
              <p className="text-gray-600 font-medium text-sm mb-6">Un doute, une question de derniere minute ?</p>
              <Button to="/contact" variant="outline" className="w-full rounded-2xl">Contactez-nous</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
