import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-[var(--fun-purple-light)] to-[var(--fun-pink-light)]">
          <span className="text-6xl">404</span>
        </div>
        <h1 className="mb-3 text-3xl font-bold">Page introuvable</h1>
        <p className="mb-8 text-gray-600">
          Oups, cette page n existe pas ou a ete deplacee.
        </p>
        <Link
          to="/"
          className="inline-flex rounded-full bg-[var(--fun-purple)] px-6 py-3 font-bold text-white transition hover:opacity-90"
        >
          Retour a l accueil
        </Link>
      </div>
    </div>
  );
}
