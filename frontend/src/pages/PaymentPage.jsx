import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Loader2, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import api from '@/api/axios';
import { Button } from '@/app/components/ui-kit/Button';

export function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/payments/create-checkout-session/', {
        booking_id: bookingId
      });
      return res.data;
    },
    onSuccess: (data) => {
      // data.url est l'URL de redirection fournie par la session Stripe
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Lien de paiement manquant.");
        navigate('/bookings');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Erreur lors de la création de la session de paiement.");
      navigate('/bookings');
    }
  });

  useEffect(() => {
    if (bookingId) {
      mutation.mutate();
    }
  }, [bookingId]);

  return (
    <div className="min-h-screen pt-40 flex items-center justify-center bg-[var(--fun-light-bg)] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center border border-gray-100"
      >
        {mutation.isPending ? (
          <>
            <div className="w-20 h-20 bg-[var(--fun-purple)]/5 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" />
              <CreditCard className="w-5 h-5 text-[var(--fun-purple)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-4">Initialisation du paiement</h1>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              Nous préparons votre connexion sécurisée avec Stripe. Vous allez être redirigé vers l'interface de paiement...
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 py-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Paiement 100% Sécurisé
            </div>
          </>
        ) : mutation.isError ? (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-4">Oups ! Une erreur</h1>
            <p className="text-gray-500 font-medium mb-8">
              Impossible d'établir la connexion avec le service de paiement.
            </p>
            <Button to="/bookings" variant="outline" className="w-full">Retour aux réservations</Button>
          </>
        ) : null}
      </motion.div>
    </div>
  );
}
