import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  rating: number;
  popular?: boolean;
}

interface ServiceCardProps {
  service: ServiceData;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
      {service.popular && (
        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-[var(--fun-yellow)] to-[var(--fun-orange)] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
          ⭐ Popular
        </div>
      )}
      
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--fun-light-bg)] to-white">
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < service.rating
                  ? 'fill-[var(--fun-yellow)] text-[var(--fun-yellow)]'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">({service.rating})</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-bold text-[var(--fun-purple)]">€{service.price}</span>
            <span className="text-gray-500 text-sm ml-1">per event</span>
          </div>
          <div className="text-sm text-gray-500">
            ⏱️ {service.duration}
          </div>
        </div>
        
        <Link
          to={`/services/${service.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] text-white font-medium hover:shadow-lg transition-all duration-200 group-hover:scale-105"
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
