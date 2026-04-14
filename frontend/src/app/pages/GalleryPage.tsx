import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Camera } from 'lucide-react';
import api from '@/api/axios';
import { unwrapListResponse } from '@/utils/apiHelpers';

const TYPE_LABELS: Record<string, string> = {
  all: 'Tout',
  IMAGE: 'Photos',
  VIDEO: 'Vidéos',
};

export function GalleryPage() {
  const [selectedType, setSelectedType] = useState('all');

  const { data: galleryItems, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const response = await api.get('/gallery/');
      return unwrapListResponse(response.data);
    },
  });

  const types = galleryItems
    ? ['all', ...new Set(galleryItems.map((img: { type?: string }) => img.type).filter(Boolean))]
    : ['all'];

  const filteredImages =
    selectedType === 'all'
      ? galleryItems
      : galleryItems?.filter((img: { type?: string }) => img.type === selectedType);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] bg-clip-text text-transparent">
              Galerie
            </span>
          </h1>
          <p className="text-xl text-gray-500 font-medium italic">Souvenirs de nos événements magiques ✨</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {types.map((t: string) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`px-8 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-sm ${
                selectedType === t
                  ? 'bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:text-[var(--fun-purple)] hover:bg-[var(--fun-purple-light)] border border-gray-100'
              }`}
            >
              {TYPE_LABELS[t] ?? t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[var(--fun-purple)] animate-spin" />
          </div>
        ) : (
          <>
            {filteredImages && filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredImages.map((image: { id: string; file_url?: string; title?: string; type?: string }) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-4 border-white"
                  >
                    <img
                      src={image.file_url}
                      alt={image.title || `Galerie ${image.id}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                      <div className="text-white">
                        <p className="font-black text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          {image.title || 'Moment magique'}
                        </p>
                        <p className="text-xs text-white/70 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 uppercase tracking-widest font-bold">
                          {image.type === 'VIDEO' ? 'Vidéo' : 'Photo'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="text-gray-300 w-10 h-10" />
                </div>
                <p className="text-gray-400 font-medium italic">Aucun média dans cette catégorie.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
