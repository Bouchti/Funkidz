import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  PartyPopper, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/app/components/ui-kit/Button';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // session_id=... is in query params from Stripe redirect

  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-white to-[var(--fun-light-bg)] px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 text-center border border-gray-100 relative overflow-hidden"
      >
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--fun-orange)]/5 rounded-bl-full -z-0"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[var(--fun-purple)]/5 rounded-tr-full -z-0"></div>

        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 150, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Paiement Confirmé ! <span className="inline-block animate-bounce">🎈</span>
            </h1>
            <p className="text-xl text-gray-600 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
              C'est officiel, la magie est en route ! Votre réservation est maintenant entièrement validée.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid sm:grid-cols-2 gap-4 mb-12"
          >
            <div className="bg-[var(--fun-light-bg)] p-6 rounded-3xl border border-gray-100 flex flex-col items-center">
              <PartyPopper className="w-8 h-8 text-[var(--fun-pink)] mb-2" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Célébration</p>
              <p className="font-bold text-gray-800">Préparez les confettis !</p>
            </div>
            <div className="bg-[var(--fun-light-bg)] p-6 rounded-3xl border border-gray-100 flex flex-col items-center">
              <Sparkles className="w-8 h-8 text-[var(--fun-orange)] mb-2" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Magie</p>
              <p className="font-bold text-gray-800">Assignation en cours</p>
            </div>
          </motion.div>

          <div className="space-y-4">
            <Button 
              to="/bookings" 
              size="lg" 
              className="w-full h-16 text-xl shadow-xl shadow-[var(--fun-purple)]/20"
            >
              Voir ma réservation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 text-gray-500 font-bold hover:text-[var(--fun-purple)] transition-colors flex items-center justify-center gap-2"
            >
              Retour à l'accueil
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            Merci de votre confiance !
          </div>
        </div>
      </motion.div>
    </div>
  );
}
