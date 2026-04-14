import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Filter } from 'lucide-react';
import { ServiceCard } from '@/app/components/ui-kit/ServiceCard';
import api from '@/api/axios';
import { unwrapListResponse } from '@/utils/apiHelpers';

export function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const { data: services, isLoading } = useQuery({
    queryKey: ['services-all'],
    queryFn: async () => {
      const response = await api.get('/services/');
      const list = unwrapListResponse(response.data);
      return list.filter((s: any) => s.is_active);
    }
  });

  const categories = services 
    ? ['ALL', ...new Set(services.map((s: any) => s.category))]
    : ['ALL'];

  const filteredServices = services
    ? (selectedCategory === 'ALL' 
        ? services 
        : services.filter((s: any) => s.category === selectedCategory)
      ).map((s: any) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        price: parseFloat(s.base_price),
        duration: `${s.duration_minutes} min`,
        image: s.image_url || 'https://images.unsplash.com/photo-1595116971913-b52f8ccca4c0?q=80&w=1080',
        rating: 5,
        popular: s.category === 'Anniversaire' // Mock indicator for now
      }))
    : [];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] bg-clip-text text-transparent">
              Nos Services
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des animations professionnelles pour chaque occasion. Découvrez notre large gamme d'options pour rendre votre événement vraiment spécial ! 🎉
          </p>
        </div>

        {/* Categories / Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <div className="flex items-center gap-2 mr-4 text-gray-500 font-bold text-xs uppercase tracking-widest">
            <Filter size={16} />
            Filtrer par :
          </div>
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-[var(--fun-purple)] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:text-[var(--fun-purple)] hover:bg-[var(--fun-purple-light)] border border-gray-100 shadow-sm'
              }`}
            >
              {cat === 'ALL' ? 'Tout' : cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[var(--fun-purple)] animate-spin" />
          </div>
        ) : (
          <>
            {filteredServices.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service: any) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-lg italic">Aucun service trouvé dans cette catégorie.</p>
                <button 
                  onClick={() => setSelectedCategory('ALL')}
                  className="mt-4 text-[var(--fun-purple)] font-bold hover:underline"
                >
                  Voir tous les services
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
