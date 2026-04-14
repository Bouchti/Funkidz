import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { FormInput } from '@/app/components/ui-kit/FormInput';
import { Button } from '@/app/components/ui-kit/Button';
import useAuthStore from '@/store/authStore';
import api from '@/api/axios';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login/', { email, password });
      const { access, refresh } = response.data;
      
      const userResponse = await api.get('/auth/me/', {
        headers: { Authorization: `Bearer ${access}` }
      });

      login({ access, refresh }, userResponse.data);
      toast.success('Bon retour parmi nous ! 🎉');

      // Redirect based on role or previous location
      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from);
      } else {
        const role = userResponse.data.role;
        if (role === 'ADMIN') navigate('/admin');
        else if (role === 'ANIMATEUR') navigate('/animateur/planning');
        else navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Identifiants invalides. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-[var(--fun-light-bg)] to-white flex items-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-[2rem] shadow-2xl p-10 border border-gray-100 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--fun-purple-light)] rounded-full blur-3xl opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
          
          <div className="relative">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-tr from-[var(--fun-purple)] to-[var(--fun-pink)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black mb-2 text-gray-900">Bienvenue !</h1>
              <p className="text-gray-500 font-medium">Connectez-vous pour gérer vos réservations</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Adresse Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                placeholder="votre@email.com"
                required
              />
              
              <FormInput
                label="Mot de passe"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                placeholder="••••••••"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group/check">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--fun-purple)] focus:ring-[var(--fun-purple-light)]" />
                  <span className="text-sm text-gray-500 group-hover/check:text-gray-700 transition-colors">Se souvenir de moi</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-bold text-[var(--fun-purple)] hover:text-[var(--fun-pink)] transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button 
                type="submit" 
                fullWidth 
                size="lg" 
                disabled={isLoading}
                className="py-6 rounded-2xl shadow-xl hover:shadow-[var(--fun-purple-light)] transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-500 font-medium">
                Pas encore de compte ?{' '}
                <Link to="/signup" className="text-[var(--fun-purple)] font-black hover:text-[var(--fun-pink)] transition-colors inline-flex items-center gap-1 group/link">
                  S'inscrire
                  <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
