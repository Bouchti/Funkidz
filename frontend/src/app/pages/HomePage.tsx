import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Star, Users, Calendar, Award, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui-kit/Button';
import { ServiceCard } from '@/app/components/ui-kit/ServiceCard';
import { testimonials } from '@/app/data/mockData';
import api from '@/api/axios';
import { unwrapListResponse } from '@/utils/apiHelpers';

export function HomePage() {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services-featured'],
    queryFn: async () => {
      const response = await api.get('/services/');
      const list = unwrapListResponse(response.data);
      return list.filter((s: any) => s.is_active);
    }
  });

  const featuredServices = services 
    ? services.slice(0, 3).map((s: any) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        price: parseFloat(s.base_price),
        duration: `${s.duration_minutes} min`,
        image: s.image_url || 'https://images.unsplash.com/photo-1595116971913-b52f8ccca4c0?q=80&w=1080',
        rating: 5, // Mock rating as backend doesn't have it yet
        popular: true
      }))
    : [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--fun-light-bg)] via-white to-[var(--fun-light-bg)] pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-[var(--fun-orange)] blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-[var(--fun-pink)] blur-3xl animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-[var(--fun-purple)] blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full shadow-lg">
                <span className="text-[var(--fun-purple)] font-bold">🎉 #1 Animation Enfants en Belgique</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[var(--fun-orange)] via-[var(--fun-pink)] to-[var(--fun-purple)] bg-clip-text text-transparent">
                  Des Moments Magiques
                </span>
                <br />
                pour Chaque Fête
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl">
                Services d'animation professionnels pour fêtes d'enfants, anniversaires et événements spéciaux. Des souvenirs inoubliables depuis 2015 ! 🎈
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button to="/services" size="lg">
                  Explorer les Services
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button to="/contact" variant="outline" size="lg">
                  Contactez-nous
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto lg:mx-0">
                <div className="text-center p-4 bg-white rounded-2xl shadow-lg border border-gray-50">
                  <p className="text-3xl font-bold text-[var(--fun-purple)]">500+</p>
                  <p className="text-sm text-gray-600">Fêtes Réussies</p>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl shadow-lg border border-gray-50">
                  <p className="text-3xl font-bold text-[var(--fun-orange)]">5.0</p>
                  <p className="text-sm text-gray-600">Note Moyenne</p>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl shadow-lg border border-gray-50">
                  <p className="text-3xl font-bold text-[var(--fun-pink)]">98%</p>
                  <p className="text-sm text-gray-600">Taux de Retour</p>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1595116971913-b52f8ccca4c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwcGFydHklMjBiYWxsb29ucyUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2ODkxNTA2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Kids Party"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--fun-orange)] to-[var(--fun-pink)] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Approuvé par les Parents</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--fun-yellow)] text-[var(--fun-yellow)]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[var(--fun-orange)]/10 to-[var(--fun-pink)]/10 hover:shadow-lg transition-shadow border border-transparent hover:border-[var(--fun-orange)]/20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--fun-orange)] to-[var(--fun-pink)] flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Équipe Professionnelle</h3>
              <p className="text-gray-600 text-sm">Des animateurs expérimentés passionnés</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[var(--fun-purple)]/10 to-[var(--fun-blue)]/10 hover:shadow-lg transition-shadow border border-transparent hover:border-[var(--fun-purple)]/20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--fun-purple)] flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Réservation Flexible</h3>
              <p className="text-gray-600 text-sm">Système de réservation en ligne facile</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[var(--fun-blue)]/10 to-[var(--fun-purple)]/10 hover:shadow-lg transition-shadow border border-transparent hover:border-[var(--fun-blue)]/20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--fun-blue)] flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Qualité Garantie</h3>
              <p className="text-gray-600 text-sm">Satisfaction totale garantie</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[var(--fun-yellow)]/10 to-[var(--fun-orange)]/10 hover:shadow-lg transition-shadow border border-transparent hover:border-[var(--fun-yellow)]/20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--fun-yellow)] to-[var(--fun-orange)] flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Mieux Noté</h3>
              <p className="text-gray-600 text-sm">5 étoiles par les parents satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gradient-to-b from-white to-[var(--fun-light-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] bg-clip-text text-transparent">
                Services Populaires
              </span>
            </h2>
            <p className="text-xl text-gray-600">Découvrez nos options d'animation les plus appréciées</p>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-[var(--fun-purple)] animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredServices.map((service: any) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Button to="/services" variant="outline" size="lg">
              Voir tous les Services
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[var(--fun-purple)] to-[var(--fun-blue)] bg-clip-text text-transparent">
                Des Parents Heureux
              </span>
            </h2>
            <p className="text-xl text-gray-600">Ce que nos clients disent de nous</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-[var(--fun-purple)] transition-colors"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'fill-[var(--fun-yellow)] text-[var(--fun-yellow)]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-[var(--fun-purple)]">{testimonial.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--fun-orange)] via-[var(--fun-pink)] to-[var(--fun-purple)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à rendre votre fête inoubliable ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Réservez maintenant et laissez-nous créer des souvenirs magiques pour votre journée spéciale ! 🎉
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              to="/booking" 
              size="lg" 
              className="!bg-white !text-[var(--fun-purple)] hover:!bg-gray-100 border-none font-black shadow-xl scale-110 hover:scale-115 transition-all"
            >
              Réserver Maintenant
              <Sparkles className="w-5 h-5" />
            </Button>
            <Button 
              to="/contact" 
              variant="outline" 
              size="lg" 
              className="!border-white !text-white hover:!bg-white hover:!text-[var(--fun-purple)] !bg-transparent font-bold transition-all"
            >
              Contactez-nous
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
