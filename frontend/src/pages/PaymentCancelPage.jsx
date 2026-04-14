import React from 'react';
import { Link } from 'react-router-dom';

export function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-16 pt-24">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-3xl font-bold">Paiement annule</h1>
          <p className="mb-6 text-gray-600">
            Votre paiement n a pas ete finalise. Vous pouvez reessayer quand vous le souhaitez.
          </p>
          <Link
            to="/mes-reservations"
            className="inline-flex rounded-full bg-[var(--fun-purple)] px-6 py-3 font-bold text-white"
          >
            Retour a mes reservations
          </Link>
        </div>
      </div>
    </div>
  );
}
