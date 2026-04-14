import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_KEY = 'funkidz_cookie_choice';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem(COOKIE_KEY);
    if (!choice) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (value) => {
    localStorage.setItem(COOKIE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
      <p className="mb-3 text-sm text-gray-700">
        Nous utilisons des cookies essentiels pour le bon fonctionnement du site.
        Consultez notre page{' '}
        <Link to="/rgpd" className="font-semibold text-[var(--fun-purple)] hover:underline">
          RGPD
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => handleChoice('accepted')}
          className="rounded-lg bg-[var(--fun-purple)] px-4 py-2 text-sm font-semibold text-white"
        >
          Accepter
        </button>
        <button
          onClick={() => handleChoice('refused')}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}
