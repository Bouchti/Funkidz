import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Clock, 
  ChevronRight, 
  ListTodo,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import api from '@/api/axios';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui-kit/Button';
import { unwrapListResponse } from '@/utils/apiHelpers';

export function AnimateurDashboardPage() {
  const { data: stats, isLoading: isStatsLoading, isError: isStatsError } = useQuery({
    queryKey: ['animateur-stats'],
    queryFn: async () => {
      const res = await api.get('/animateur/stats/');
      return res.data;
    }
  });

  const { data: missions } = useQuery({
    queryKey: ['animateur-missions-recent'],
    queryFn: async () => {
      const res = await api.get('/animateur/planning/');
      return unwrapListResponse(res.data);
    }
  });

  const nextMission = stats?.next_mission;
  const missionDates = missions?.filter(m => m.status === 'ACCEPTED').map(m => new Date(m.booking_details.event_date)) || [];

  if (isStatsLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" /></div>;
  if (isStatsError) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-bold text-red-700">Impossible de charger le dashboard animateur.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Bonjour, Magicien ! ✨</h1>
          <p className="text-gray-500 font-medium">Prêt pour les prochaines aventures ?</p>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6"
        >
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">En attente</p>
            <h3 className="text-3xl font-black text-gray-900">{stats?.pending_count || 0} missions</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6"
        >
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Confirmées</p>
            <h3 className="text-3xl font-black text-gray-900">{stats?.accepted_count || 0} missions</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 hidden lg:block"
        >
          <div className="h-full bg-gradient-to-br from-[var(--fun-purple)] to-[var(--fun-pink)] p-6 rounded-[2.5rem] text-white flex items-center gap-4 relative overflow-hidden shadow-xl shadow-[var(--fun-purple)]/10">
             <Sparkles className="absolute -right-2 -bottom-2 w-24 h-24 opacity-10" />
             <div className="relative z-10 w-full text-center">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Status Staff</p>
               <p className="text-lg font-black">Expert Funkidz</p>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Next Mission & Recent Column */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[var(--fun-purple)]" />
                Prochaine Mission
              </h3>
            </div>

            {nextMission ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group"
              >
                <div className="relative z-10 grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Badge className="bg-green-100 text-green-600 font-black uppercase tracking-widest text-[9px] px-3 py-1 mb-3">
                        {nextMission.booking_details.service_title}
                      </Badge>
                      <h4 className="text-3xl font-black text-gray-900 leading-tight">
                        Fête Surprise de {nextMission.booking_details.first_name || 'Client'}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600 font-bold">
                        <CalendarIcon className="w-4 h-4 text-[var(--fun-purple)]" />
                        {format(new Date(nextMission.booking_details.event_date), 'EEEE d MMMM yyyy', { locale: fr })}
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 font-bold">
                        <Clock className="w-4 h-4 text-[var(--fun-purple)]" />
                        {nextMission.booking_details.start_time.slice(0, 5)} • {nextMission.booking_details.duration_minutes} min
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 font-bold">
                        <MapPin className="w-4 h-4 text-[var(--fun-purple)]" />
                        {nextMission.booking_details.city}
                      </div>
                    </div>

                    <Button className="w-full rounded-2xl py-4 h-auto shadow-lg shadow-[var(--fun-purple)]/20" asChild>
                      <Link to="/animateur/missions">
                        Voir les détails <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>

                  <div className="hidden md:flex items-center justify-center p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="text-center space-y-2">
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Invités</p>
                      <p className="text-2xl font-black text-gray-900">{nextMission.booking_details.children_count} enfants</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
                <p className="text-gray-400 font-bold mb-4">Aucune mission confirmée à venir.</p>
                <Button variant="outline" className="rounded-xl" asChild>
                  <Link to="/animateur/missions">Chercher des missions</Link>
                </Button>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                 <ListTodo className="w-6 h-6 text-indigo-500" />
                 Missions Récentes
              </h3>
              <Link to="/animateur/missions" className="text-sm font-bold text-[var(--fun-purple)] hover:underline flex items-center gap-1">
                Tout voir <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {missions?.slice(0, 3).map((m) => (
                  <div key={m.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{m.booking_details.service_title}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                          {format(new Date(m.booking_details.event_date), 'd MMM', { locale: fr })} • {m.booking_details.city}
                        </p>
                      </div>
                    </div>
                    <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      m.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {m.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Calendar Column */}
        <div className="lg:col-span-4">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-6">
            <CalendarIcon className="w-6 h-6 text-pink-500" />
            Mon Mois
          </h3>
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center">
            <DayPicker 
              locale={fr}
              modifiers={{ mission: missionDates }}
              modifiersStyles={{ 
                mission: { 
                  fontWeight: 'bold', 
                  backgroundColor: 'var(--fun-purple)', 
                  color: 'white',
                  borderRadius: '12px'
                } 
              }}
              mode="single"
              className="font-bold animateur-mini-calendar"
            />
            <div className="mt-6 w-full p-4 bg-[var(--fun-light-bg)] rounded-2xl flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[var(--fun-purple)]"></div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Jours avec missions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
