import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { FormInput } from '@/app/components/ui-kit/FormInput';
import { Button } from '@/app/components/ui-kit/Button';
import api from '@/api/axios';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const message = subject
        ? `Sujet : ${subject}\n\n${messageBody}`
        : messageBody;
      await api.post('/contact/', {
        name,
        email,
        phone: phone || undefined,
        message,
      });
      toast.success('Message envoyé ! Nous vous répondrons rapidement.');
      setSubject('');
      setMessageBody('');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: unknown } };
      toast.error(ax.response?.data ? JSON.stringify(ax.response.data) : 'Envoi impossible');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] bg-clip-text text-transparent uppercase tracking-tight">
              Contactez-nous
            </span>
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            Une question ? Un projet ? Nous sommes là pour vous aider ! ✨
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-[var(--fun-purple-light)] rounded-2xl flex items-center justify-center text-[var(--fun-purple)] shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 mb-1 uppercase tracking-wider text-sm">Email</h3>
                <p className="text-gray-600 font-medium">hello@funkidz.be</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-[var(--fun-orange-light)] rounded-2xl flex items-center justify-center text-[var(--fun-orange)] shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 mb-1 uppercase tracking-wider text-sm">Téléphone</h3>
                <p className="text-gray-600 font-medium">+32 123 456 789</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-[var(--fun-pink-light)] rounded-2xl flex items-center justify-center text-[var(--fun-pink)] shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 mb-1 uppercase tracking-wider text-sm">Localisation</h3>
                <p className="text-gray-600 font-medium">Bruxelles & Wallonie, Belgique</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--fun-purple)] to-[var(--fun-pink)] p-8 rounded-[2.5rem] shadow-xl text-white">
              <h3 className="font-black text-xl mb-4">On reste en contact ?</h3>
              <p className="text-white/80 mb-6 text-sm leading-relaxed">
                Suivez nos aventures sur les réseaux pour plus de magie !
              </p>
              <div className="flex gap-3">
                <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle size={20} />
                </span>
                <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--fun-purple-light)] opacity-20 blur-3xl -z-10 group-hover:scale-150 transition-transform duration-700" />
              <h2 className="text-3xl font-black mb-8 text-gray-900">Envoyez un message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    label="Nom complet"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                  />
                  <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@email.com"
                    required
                  />
                </div>
                <FormInput
                  label="Téléphone (optionnel)"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+32 …"
                />
                <FormInput
                  label="Sujet"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Comment pouvons-nous vous aider ?"
                  required
                />
                <div>
                  <label htmlFor="messageBody" className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest pl-1">
                    Message
                  </label>
                  <textarea
                    id="messageBody"
                    name="messageBody"
                    rows={6}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:ring-4 focus:ring-[var(--fun-purple-light)] focus:border-[var(--fun-purple)] transition-all bg-gray-50/30 font-medium"
                    placeholder="Dites-nous tout…"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full py-5 rounded-2xl shadow-xl hover:shadow-[var(--fun-purple-light)] transition-all group/btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Envoyer le message
                      <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
