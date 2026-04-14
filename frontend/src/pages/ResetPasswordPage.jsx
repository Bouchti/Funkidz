import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/api/axios';

export function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [uidb64, setUidb64] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/password-reset-confirm/', {
        uidb64,
        token,
        new_password: password,
      });
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Impossible de reinitialiser le mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16 pt-24">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold">Nouveau mot de passe</h1>
          <p className="mb-6 text-sm text-gray-600">
            Renseignez votre UID et votre nouveau mot de passe.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="uidb64"
              value={uidb64}
              onChange={(e) => setUidb64(e.target.value)}
              required
            />
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              type="password"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--fun-purple)] px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'En cours...' : 'Valider'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
