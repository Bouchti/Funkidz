import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { FormInput } from '@/app/components/ui-kit/FormInput';
import { Button } from '@/app/components/ui-kit/Button';
import api from '@/api/axios';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/password-reset/', { email });
      toast.success('Si un compte existe, un email a été envoyé.');
    } catch {
      toast.error('Impossible d’envoyer la demande pour le moment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-[var(--fun-light-bg)] to-white flex items-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-[2rem] shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-[var(--fun-purple)] to-[var(--fun-pink)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Mot de passe oublié</h1>
            <p className="text-gray-500 text-sm mt-2">Indiquez votre email pour recevoir un lien de réinitialisation.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
            />
            <Button type="submit" fullWidth size="lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Envoyer'}
            </Button>
            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="font-bold text-[var(--fun-purple)]">
                Retour à la connexion
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
