import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  Calendar as CalendarIcon, 
  Check, 
  Loader2, 
  MapPin, 
  Users, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Info,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

import { Stepper } from '@/app/components/ui-kit/Stepper';
import { FormInput } from '@/app/components/ui-kit/FormInput';
import { Button } from '@/app/components/ui-kit/Button';
import { Calendar } from '@/app/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { cn } from '@/app/components/ui/utils';

import api from '@/api/axios';
import { unwrapListResponse } from '@/utils/apiHelpers';
import { usePriceCalculator } from '@/hooks/usePriceCalculator';

const steps = [
  { number: 1, title: 'Formule', description: 'Service & options' },
  { number: 2, title: 'Logistique', description: 'Date, heure & lieu' },
  { number: 3, title: 'Confirmation', description: 'Récapitulatif' },
];

const HOURS_TO_MINUTES = {
  '1': 60,
  '1.5': 90,
  '2': 120,
  '3': 180,
};

export function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramService = searchParams.get('service');

  const [currentStep, setCurrentStep] = useState(1);
  const [serviceId, setServiceId] = useState(paramService || '');
  const [childrenCount, setChildrenCount] = useState(10);
  const [durationHoursKey, setDurationHoursKey] = useState('2');
  const [optionQuantities, setOptionQuantities] = useState({});

  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  useEffect(() => {
    if (paramService) setServiceId(paramService);
  }, [paramService]);

  const durationMinutes = HOURS_TO_MINUTES[durationHoursKey] ?? 120;
  const eventDateStr = date ? format(date, 'yyyy-MM-dd') : '';

  const { data: servicesList, isLoading: loadingServices } = useQuery({
    queryKey: ['booking-services-list'],
    queryFn: async () => {
      const res = await api.get('/services/');
      return unwrapListResponse(res.data).filter((s) => s.is_active);
    },
  });

  const { data: serviceDetail, isLoading: loadingDetail } = useQuery({
    queryKey: ['booking-service-detail', serviceId],
    enabled: Boolean(serviceId),
    queryFn: async () => {
      const res = await api.get(`/services/${serviceId}/`);
      return res.data;
    },
  });

  const { data: availabilityData, isLoading: loadingSlots } = useQuery({
    queryKey: ['booking-availability', eventDateStr],
    enabled: Boolean(eventDateStr) && currentStep >= 2,
    queryFn: async () => {
      const res = await api.get('/bookings/availability/', {
        params: { date: eventDateStr },
      });
      return res.data;
    },
  });

  const slots = availabilityData?.slots || [];

  const priceResult = usePriceCalculator(
    serviceDetail,
    optionQuantities,
    Math.max(1, Number(childrenCount) || 1),
    durationMinutes
  );

  const selectedOptionsPayload = useMemo(() => {
    return Object.entries(optionQuantities)
      .filter(([, q]) => q > 0)
      .map(([id, quantity]) => ({ id, quantity }));
  }, [optionQuantities]);

  const toggleOption = (optionId) => {
    setOptionQuantities((prev) => ({
      ...prev,
      [optionId]: prev[optionId] ? 0 : 1,
    }));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const timeStr = startTime.length === 5 ? `${startTime}:00` : startTime;
      const res = await api.post('/bookings/create/', {
        service: serviceId,
        event_date: eventDateStr,
        start_time: timeStr,
        address,
        city,
        children_count: Math.max(1, Number(childrenCount) || 1),
        duration_minutes: durationMinutes,
        notes: notes || '',
        selected_options: selectedOptionsPayload,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessBooking(data);
      toast.success('Réservation enregistrée !');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (err) => {
      const d = err.response?.data;
      toast.error(
        d?.detail || d?.non_field_errors?.[0] || 'Impossible de confirmer la réservation.'
      );
    },
  });

  const step1Valid = Boolean(serviceId);
  const step2Valid =
    Boolean(date) &&
    Boolean(startTime) &&
    Boolean(address?.trim()) &&
    Boolean(city?.trim());
  const step3Valid = termsAccepted;

  const goNext = () => {
    if (currentStep === 1 && !step1Valid) {
      toast.error('Choisissez un service.');
      return;
    }
    if (currentStep === 2 && !step2Valid) {
      toast.error('Renseignez la date, le créneau, l’adresse et la ville.');
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (successBooking) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 bg-gradient-to-b from-white to-[var(--fun-light-bg)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--fun-orange)] via-[var(--fun-pink)] to-[var(--fun-purple)]"></div>
          
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">Presque là ! 🎉</h1>
          <p className="text-gray-600 mb-6">Votre demande de réservation a été envoyée avec succès.</p>
          
          <div className="bg-[var(--fun-light-bg)] rounded-3xl p-6 mb-8 border-2 border-dashed border-gray-200">
            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">Numéro de réservation</p>
            <p className="text-4xl font-black text-[var(--fun-purple)] font-mono">
              #{successBooking.booking_number}
            </p>
          </div>
          
          <div className="flex items-start gap-4 text-left p-4 bg-blue-50 rounded-2xl mb-8 border border-blue-100">
            <Info className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
            <p className="text-sm text-blue-700 leading-relaxed">
              <strong>En attente de confirmation admin.</strong> Notre équipe vérifie la disponibilité de nos animateurs. Vous recevrez une confirmation par email très bientôt !
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={() => navigate('/bookings')} variant="outline" size="lg" className="w-full">
              Mes Réservations
            </Button>
            <Button onClick={() => navigate('/')} size="lg" className="w-full">
              Accueil
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const PageTransition = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white to-[var(--fun-light-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1.5 bg-[var(--fun-purple)]/10 text-[var(--fun-purple)] rounded-full text-sm font-bold mb-4">
              ✨ Créons des Souvenirs
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-[var(--fun-orange)] via-[var(--fun-pink)] to-[var(--fun-purple)] bg-clip-text text-transparent">
                Réservez Votre Magie
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-12">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <PageTransition key="step1">
                  <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-gray-100 space-y-8">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--fun-orange)] to-[var(--fun-pink)] flex items-center justify-center text-white shadow-lg">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">Formule & Options</h2>
                        <p className="text-gray-500">Personnalisez votre événement</p>
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wider">
                        Quel service vous fait rêver ?
                      </label>
                      {loadingServices ? (
                        <div className="flex justify-center py-10 bg-gray-50 rounded-2xl">
                          <Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" />
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {(servicesList || []).map((s) => (
                            <button
                              key={s.id}
                              onClick={() => {
                                setServiceId(s.id);
                                setOptionQuantities({});
                              }}
                              className={cn(
                                "flex flex-col items-start p-5 rounded-[1.5rem] border-2 transition-all text-left",
                                serviceId === s.id
                                  ? "border-[var(--fun-purple)] bg-[var(--fun-purple)]/5 shadow-lg ring-1 ring-[var(--fun-purple)]"
                                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                              )}
                            >
                              <div className="flex justify-between items-center w-full mb-2">
                                <span className={cn(
                                  "font-black text-lg",
                                  serviceId === s.id ? "text-[var(--fun-purple)]" : "text-gray-900"
                                )}>
                                  {s.title}
                                </span>
                                {serviceId === s.id && <Check className="w-5 h-5 text-[var(--fun-purple)]" />}
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{s.description}</p>
                              <span className="font-bold text-[var(--fun-purple)] mt-auto">
                                À partir de {Number(s.base_price).toFixed(2)} €
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {serviceDetail && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8 pt-6 border-t border-gray-100"
                      >
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-black text-gray-700 mb-3 flex items-center gap-2">
                              <Users className="w-4 h-4 text-[var(--fun-orange)]" /> NOMBRE D'ENFANTS
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min={1}
                                value={childrenCount}
                                onChange={(e) => setChildrenCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-[var(--fun-purple)] focus:ring-4 focus:ring-[var(--fun-purple)]/10 transition-all font-bold text-lg"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-black text-gray-700 mb-3 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[var(--fun-pink)]" /> DURÉE SOUHAITÉE
                            </label>
                            <select
                              value={durationHoursKey}
                              onChange={(e) => setDurationHoursKey(e.target.value)}
                              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-[var(--fun-purple)] focus:ring-4 focus:ring-[var(--fun-purple)]/10 transition-all font-bold text-lg appearance-none bg-white"
                            >
                              <option value="1">1 heure</option>
                              <option value="1.5">1 h 30 min</option>
                              <option value="2">2 heures</option>
                              <option value="3">3 heures</option>
                            </select>
                          </div>
                        </div>

                        {serviceDetail.options?.length > 0 && (
                          <div className="space-y-4">
                            <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wider">
                              Ajoutez un peu de magie (Options)
                            </label>
                            <div className="grid gap-3">
                              {serviceDetail.options.map(({ option }) => (
                                <label
                                  key={option.id}
                                  className={cn(
                                    "flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all",
                                    optionQuantities[option.id] > 0
                                      ? "border-[var(--fun-pink)] bg-[var(--fun-pink)]/5 shadow-md"
                                      : "border-gray-50 hover:border-gray-200"
                                  )}
                                >
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all",
                                    optionQuantities[option.id] > 0
                                      ? "bg-[var(--fun-pink)] border-[var(--fun-pink)] text-white"
                                      : "border-gray-300 bg-white"
                                  )}>
                                    <input
                                      type="checkbox"
                                      className="hidden"
                                      checked={optionQuantities[option.id] > 0}
                                      onChange={() => toggleOption(option.id)}
                                    />
                                    {optionQuantities[option.id] > 0 && <Check className="w-5 h-5" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <span className="font-bold text-gray-900">{option.name}</span>
                                      <span className="font-black text-[var(--fun-pink)]">
                                        +{Number(option.price).toFixed(2)} €
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{option.description}</p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </PageTransition>
              )}

              {currentStep === 2 && (
                <PageTransition key="step2">
                  <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-gray-100 space-y-8">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--fun-purple)] to-[var(--fun-blue)] flex items-center justify-center text-white shadow-lg">
                        <CalendarIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">Date & Lieu</h2>
                        <p className="text-gray-500">Où et quand la magie opère ?</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Date Selection */}
                      <div className="space-y-4">
                        <label className="block text-sm font-black text-gray-700 uppercase tracking-wider">
                          Choisissez le grand jour
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className={cn(
                              "w-full flex items-center gap-4 px-6 py-5 rounded-2xl border-2 transition-all font-bold text-lg text-left",
                              date ? "border-[var(--fun-purple)] bg-[var(--fun-purple)]/5" : "border-gray-100"
                            )}>
                              <CalendarIcon className="w-6 h-6 text-[var(--fun-purple)]" />
                              {date ? format(date, 'PPP', { locale: fr }) : "Sélectionner une date"}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden shadow-2xl border-none">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={(d) => d < new Date()}
                              initialFocus
                              className="p-4"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Time Selection */}
                      <div className="space-y-4">
                        <label className="block text-sm font-black text-gray-700 uppercase tracking-wider">
                          À quelle heure ?
                        </label>
                        {!date ? (
                          <div className="h-[68px] flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 text-sm font-medium">Choisissez d'abord une date</p>
                          </div>
                        ) : loadingSlots ? (
                          <div className="flex justify-center py-5">
                            <Loader2 className="w-8 h-8 animate-spin text-[var(--fun-purple)]" />
                          </div>
                        ) : slots.length === 0 ? (
                          <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 text-sm font-medium">
                            Désolé, plus de créneaux disponibles ce jour-là.
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {slots.map((slot) => {
                              const s = slot.slice(0, 5);
                              return (
                                <button
                                  key={slot}
                                  onClick={() => setStartTime(s)}
                                  className={cn(
                                    "py-3 rounded-xl border-2 font-bold transition-all",
                                    startTime === s
                                      ? "bg-[var(--fun-purple)] border-[var(--fun-purple)] text-white shadow-md scale-105"
                                      : "border-gray-100 hover:border-gray-200 bg-white"
                                  )}
                                >
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-gray-100">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormInput
                          label="ADRESSE DE L'ÉVÉNEMENT"
                          name="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Rue et numéro"
                          required
                          className="!px-6 !py-4 rounded-2xl font-bold"
                        />
                        <FormInput
                          label="VILLE"
                          name="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Ex: Bruxelles, Waterloo..."
                          required
                          className="!px-6 !py-4 rounded-2xl font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wider">
                          Notes & Précisions (Optionnel)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={4}
                          className="w-full px-6 py-4 rounded-[1.5rem] border-2 border-gray-100 focus:border-[var(--fun-purple)] focus:ring-4 focus:ring-[var(--fun-purple)]/10 transition-all font-medium bg-white"
                          placeholder="Informations utiles (digicode, parking, demande spéciale...)"
                        />
                      </div>
                    </div>
                  </div>
                </PageTransition>
              )}

              {currentStep === 3 && (
                <PageTransition key="step3">
                  <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-gray-100 space-y-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--fun-orange)]/10 to-transparent rounded-bl-full pointer-events-none"></div>
                    
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--fun-pink)] to-[var(--fun-purple)] flex items-center justify-center text-white shadow-lg">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">Vérification Finale</h2>
                        <p className="text-gray-500">Tout est prêt pour la fête ?</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-[2rem] p-8 space-y-6 border border-gray-100">
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">QUOI</p>
                          <div className="space-y-1">
                            <p className="font-black text-lg text-gray-900">{serviceDetail?.title}</p>
                            <p className="text-gray-600 font-medium">{childrenCount} enfants • {durationHoursKey}h</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">QUAND</p>
                          <div className="space-y-1">
                            <p className="font-black text-lg text-gray-900">
                              {date ? format(date, 'EEEE d MMMM yyyy', { locale: fr }) : "-"}
                            </p>
                            <p className="text-gray-600 font-medium">À partir de {startTime}</p>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">OÙ</p>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[var(--fun-pink)]" />
                            <p className="font-bold text-gray-800">{address}, {city}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">OPTIONS SÉLECTIONNÉES</p>
                        {selectedOptionsPayload.length === 0 ? (
                          <p className="text-sm text-gray-500 italic">Aucune option supplémentaire</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedOptionsPayload.map(({ id }) => {
                              const opt = serviceDetail?.options?.find((o) => o.option.id === id);
                              return opt ? (
                                <div key={id} className="flex justify-between items-center bg-white px-4 py-2 rounded-xl">
                                  <span className="font-bold text-gray-700">{opt.option.name}</span>
                                  <span className="text-[var(--fun-purple)] font-black">+{Number(opt.option.price).toFixed(2)}€</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="flex items-start gap-4 cursor-pointer group bg-white p-4 rounded-2xl border-2 border-transparent hover:border-[var(--fun-purple)]/20 transition-all">
                        <div className={cn(
                          "mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                          termsAccepted ? "bg-[var(--fun-purple)] border-[var(--fun-purple)] text-white" : "border-gray-300 bg-white"
                        )}>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                          />
                          {termsAccepted && <Check className="w-4 h-4" />}
                        </div>
                        <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                          Je confirme l'exactitude des informations et j'accepte les{' '}
                          <Link to="/terms" className="text-[var(--fun-purple)] font-black hover:underline underline-offset-4">
                            Conditions Générales de Vente
                          </Link>.
                        </span>
                      </label>

                      <Button
                        type="button"
                        size="lg"
                        className="w-full h-16 text-xl shadow-xl shadow-[var(--fun-purple)]/20"
                        disabled={!step3Valid || mutation.isPending}
                        onClick={() => mutation.mutate()}
                      >
                        {mutation.isPending ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Vérification...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span>Confirmer la Réservation</span>
                            <Sparkles className="w-6 h-6" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </PageTransition>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goPrev}
                  className="rounded-2xl px-8"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" /> Retour
                </Button>
              ) : <div />}
              
              {currentStep < 3 ? (
                <Button 
                  type="button" 
                  onClick={goNext}
                  className="rounded-2xl px-10"
                >
                  Continuer <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              ) : null}
            </div>
          </div>

          {/* Right Sidebar - Pricing Recap */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <motion.div
              layout
              className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] p-6 text-white text-center">
                <p className="text-sm font-black uppercase tracking-widest opacity-90">Estimation de Prix</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-5xl font-black">{priceResult.estimated_price.toFixed(2)}</span>
                  <span className="text-2xl font-bold">€</span>
                </div>
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                {!serviceDetail ? (
                  <div className="text-center py-10">
                    <Info className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Choisissez un service pour voir le détail du prix.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {priceResult.lines.map((line) => (
                        <div key={line.key} className="flex justify-between items-start">
                          <div className="max-w-[70%]">
                            <p className="font-bold text-gray-800 text-sm leading-tight">{line.label}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-tight">{line.formula}</p>
                          </div>
                          <span className="font-black text-gray-900 whitespace-nowrap">
                            {line.amount.toFixed(2)} €
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100">
                      <div className="bg-[var(--fun-light-bg)] rounded-2xl p-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Formule de calcul</p>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                          {priceResult.formula_summary}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-xs text-blue-700 leading-normal">
                        Prix net, hors taxes éventuelles selon votre localisation. Aucun paiement ne vous est demandé maintenant.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
