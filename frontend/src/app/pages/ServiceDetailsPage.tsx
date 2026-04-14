import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Check,
  Clock,
  Users,
  ArrowLeft,
  Plus,
  Minus,
  Loader2,
  Info,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/app/components/ui-kit/Button';
import api from '@/api/axios';

export function ServiceDetailsPage() {
  const { id } = useParams();
  const [childrenCount, setChildrenCount] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const response = await api.get(`/services/${id}/`);
      setDurationMinutes(response.data.duration_minutes);
      return response.data;
    }
  });

  const totalPrice = useMemo(() => {
    if (!service) return 0;
    
    let total = parseFloat(service.base_price);
    
    service.options.forEach(({ option }: any) => {
      const quantity = selectedOptions[option.id] || 0;
      if (quantity > 0) {
        const price = parseFloat(option.price);
        
        if (option.pricing_type === 'FIXED') {
          total += price * quantity;
        } else if (option.pricing_type === 'PER_CHILD') {
          total += price * childrenCount * quantity;
        } else if (option.pricing_type === 'PER_HOUR') {
          total += price * (durationMinutes / 60) * quantity;
        }
      }
    });
    
    return total.toFixed(2);
  }, [service, childrenCount, durationMinutes, selectedOptions]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: prev[optionId] ? 0 : 1
    }));
  };

  const updateOptionQuantity = (optionId: string, delta: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: Math.max(0, (prev[optionId] || 0) + delta)
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--fun-purple)] animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Service non trouvé</h2>
          <Button to="/services">Retour aux Services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-[var(--fun-purple)] hover:text-[var(--fun-pink)] mb-8 font-bold transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Retour aux Services
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Column */}
          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={service.image_url || 'https://images.unsplash.com/photo-1595116971913-b52f8ccca4c0?q=80&w=1080'}
                alt={service.title}
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <Info className="text-[var(--fun-purple)]" />
                 Détails du Service
               </h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500">Catégorie</span>
                   <span className="font-bold text-[var(--fun-purple)] px-3 py-1 bg-[var(--fun-purple-light)] rounded-full text-xs uppercase tracking-wider">
                     {service.category}
                   </span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500">Durée de base</span>
                   <span className="font-bold">{service.duration_minutes} minutes</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Info Column */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-[var(--fun-yellow)]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-sm text-gray-400 font-medium">(5.0)</span>
              </div>
              <h1 className="text-5xl font-bold mb-4 text-gray-900">{service.title}</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed italic border-l-4 border-[var(--fun-pink)] pl-6">
                {service.description}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-[var(--fun-orange)]/10 rounded-xl flex items-center justify-center text-[var(--fun-orange)]">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Enfants</p>
                    <div className="flex items-center justify-between">
                       <span className="font-bold">{childrenCount}</span>
                       <div className="flex gap-2">
                         <button onClick={() => setChildrenCount(Math.max(1, childrenCount - 1))} className="text-gray-400 hover:text-[var(--fun-orange)]"><Minus size={14} /></button>
                         <button onClick={() => setChildrenCount(childrenCount + 1)} className="text-gray-400 hover:text-[var(--fun-orange)]"><Plus size={14} /></button>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-[var(--fun-purple)]/10 rounded-xl flex items-center justify-center text-[var(--fun-purple)]">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Durée</p>
                    <select 
                      value={durationMinutes} 
                      onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                      className="w-full bg-transparent border-none p-0 font-bold text-gray-900 focus:ring-0 text-sm"
                    >
                      <option value={60}>1 heure</option>
                      <option value={90}>1h 30min</option>
                      <option value={120}>2 heures</option>
                      <option value={180}>3 heures</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[var(--fun-purple)] to-[var(--fun-pink)] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Sparkles size={80} />
                </div>
                <div className="relative">
                  <p className="text-sm font-bold uppercase tracking-widest text-white/80 mb-2">Total Estimé</p>
                  <p className="text-5xl font-black mb-1">
                    €{totalPrice}
                  </p>
                  <p className="text-xs text-white/60">Prix hors TVA. Frais de déplacement non inclus.</p>
                </div>
              </div>
            </div>

            {/* Options */}
            {service.options?.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                   Personnalisez votre Fête
                   <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Options</span>
                </h3>
                <div className="space-y-4">
                  {service.options.map(({ option }: any) => (
                    <div
                      key={option.id}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 ${
                        selectedOptions[option.id] > 0
                          ? 'border-[var(--fun-purple)] bg-[var(--fun-purple)]/5 shadow-md'
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => toggleOption(option.id)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedOptions[option.id] > 0
                              ? 'border-[var(--fun-purple)] bg-[var(--fun-purple)] text-white'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {selectedOptions[option.id] > 0 && <Check className="w-5 h-5" />}
                        </button>
                        <div>
                          <p className="font-bold text-gray-900">{option.name}</p>
                          <p className="text-xs text-gray-500">{option.pricing_type} pricing</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-black text-[var(--fun-purple)] text-lg">+€{option.price}</span>
                        {selectedOptions[option.id] > 0 && (
                          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-2.5 py-1.5 shadow-sm">
                            <button onClick={() => updateOptionQuantity(option.id, -1)} className="text-gray-400 hover:text-[var(--fun-purple)]"><Minus size={14} /></button>
                            <span className="font-bold text-sm w-4 text-center">{selectedOptions[option.id]}</span>
                            <button onClick={() => updateOptionQuantity(option.id, 1)} className="text-gray-400 hover:text-[var(--fun-purple)]"><Plus size={14} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              to={`/booking?service=${service.id}`}
              fullWidth
              size="lg"
              className="py-6 text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            >
              Réserver ce Service 🎉
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Star({ size, fill, className }: { size: number, fill?: string, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={fill || "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
