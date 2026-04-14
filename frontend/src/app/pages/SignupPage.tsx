import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { FormInput } from '@/app/components/ui-kit/FormInput';
import { Button } from '@/app/components/ui-kit/Button';
import api from '@/api/axios';

export function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CLIENT',
    adminKey: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas !');
      return;
    }

    setIsLoading(true);
    try {
      const trimmedName = formData.name.trim();
      const [firstName, ...rest] = trimmedName.split(/\s+/);
      const lastName = rest.join(' ');
      await api.post('/auth/register/', {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        first_name: firstName || '',
        last_name: lastName || '',
        phone: formData.phone,
        admin_key: formData.adminKey,
      });

      toast.success('Compte créé ! Vérifiez votre boîte mail pour activer votre compte.');
      navigate('/login');
    } catch (error: any) {
      const data = error.response?.data;
      if (data) {
        Object.keys(data).forEach(key => {
          toast.error(`${key}: ${data[key]}`);
        });
      } else {
        toast.error("Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-[var(--fun-light-bg)] to-white flex items-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-[2rem] shadow-2xl p-10 border border-gray-100 relative overflow-hidden group">
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--fun-orange-light)] rounded-full blur-3xl opacity-50 group-hover:scale-125 transition-transform duration-500"></div>

          <div className="relative">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-tr from-[var(--fun-orange)] to-[var(--fun-pink)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black mb-2 text-gray-900">Rejoignez-nous</h1>
              <p className="text-gray-500 font-medium">Faites partie de la famille FunKids</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="Nom Complet"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                icon={<User className="w-5 h-5" />}
                placeholder="Jean Dupont"
                required
              />
              
              <FormInput
                label="Adresse Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                icon={<Mail className="w-5 h-5" />}
                placeholder="votre@email.com"
                required
              />
              
              <FormInput
                label="Numéro de Téléphone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                icon={<Phone className="w-5 h-5" />}
                placeholder="+32 000 00 00 00"
                required={formData.role === 'ANIMATEUR'}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Type de compte</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 focus:border-[var(--fun-purple)] focus:outline-none"
                >
                  <option value="CLIENT">Client</option>
                  <option value="ANIMATEUR">Animateur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              {formData.role === 'ADMIN' ? (
                <FormInput
                  label="Clé d'inscription admin"
                  type="password"
                  name="adminKey"
                  value={formData.adminKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, adminKey: e.target.value }))}
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="Clé admin"
                  required
                />
              ) : null}
              
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Mot de passe"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="••••••••"
                  required
                />
                
                <FormInput
                  label="Confirmer"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button 
                type="submit" 
                fullWidth 
                size="lg" 
                disabled={isLoading}
                className="py-6 rounded-2xl shadow-xl hover:shadow-[var(--fun-orange-light)] transition-all bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] border-none"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Créer un compte"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500 font-medium">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="text-[var(--fun-purple)] font-black hover:text-[var(--fun-pink)] transition-colors inline-flex items-center gap-1 group/link">
                  Se connecter
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
