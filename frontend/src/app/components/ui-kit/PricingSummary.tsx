import React from 'react';
import { Check } from 'lucide-react';

interface PricingSummaryProps {
  service: {
    name: string;
    price: number;
  };
  options: {
    name: string;
    price: number;
  }[];
  eventDetails: {
    date?: string;
    time?: string;
    duration?: string;
    guests?: number;
  };
  /** Si fourni, remplace le calcul local (aligné sur l’API / détail service). */
  estimatedTotal?: number;
  /** Afficher ou non la ligne TVA (estimation locale uniquement). */
  showVat?: boolean;
}

export function PricingSummary({
  service,
  options,
  eventDetails,
  estimatedTotal,
  showVat = true,
}: PricingSummaryProps) {
  const subtotal = service.price + options.reduce((sum, opt) => sum + opt.price, 0);
  const base = estimatedTotal ?? subtotal;
  const tax = showVat ? base * 0.21 : 0;
  const total = showVat ? base + tax : base;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Récapitulatif</h3>

      <div className="space-y-4 mb-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Service</h4>
          <div className="flex justify-between items-center bg-[var(--fun-light-bg)] rounded-xl p-3">
            <span>{service.name}</span>
            <span className="font-bold text-[var(--fun-purple)]">€{service.price.toFixed(2)}</span>
          </div>
        </div>

        {options.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Options</h4>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 rounded-xl p-3"
                >
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    {option.name}
                  </span>
                  <span className="font-bold">+€{option.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(eventDetails.date ||
          eventDetails.time ||
          eventDetails.duration ||
          eventDetails.guests) && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Événement</h4>
            <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
              {eventDetails.date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{eventDetails.date}</span>
                </div>
              )}
              {eventDetails.time && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Heure</span>
                  <span className="font-medium">{eventDetails.time}</span>
                </div>
              )}
              {eventDetails.duration && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée</span>
                  <span className="font-medium">{eventDetails.duration}</span>
                </div>
              )}
              {eventDetails.guests != null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Enfants</span>
                  <span className="font-medium">{eventDetails.guests}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t-2 border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Sous-total estimé</span>
          <span>€{base.toFixed(2)}</span>
        </div>
        {showVat && (
          <div className="flex justify-between text-gray-600">
            <span>TVA (21 %)</span>
            <span>€{tax.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2 border-t border-gray-200">
          <span>Total {showVat ? 'TTC' : ''}</span>
          <span className="text-[var(--fun-purple)]">€{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-[var(--fun-orange)]/10 to-[var(--fun-pink)]/10 rounded-xl">
        <p className="text-sm text-center text-gray-700">
          Annulation gratuite jusqu’à 48 h avant l’événement
        </p>
      </div>
    </div>
  );
}
