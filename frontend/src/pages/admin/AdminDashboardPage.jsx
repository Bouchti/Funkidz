import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  CalendarCheck, 
  CreditCard, 
  TrendingUp, 
  Clock,
  ArrowRight,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

import api from '@/api/axios';
import { Badge } from '@/app/components/ui/badge';

const STATS_CONFIG = [
  { key: 'total_bookings', label: 'Réservations', icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'pending_count', label: 'En attente', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'confirmed_count', label: 'Confirmées', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { key: 'paid_count', label: 'Payées', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
];

export function AdminDashboardPage() {
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/bookings/admin/stats/');
      return res.data;
    }
  });

  const { data: recentPending, isLoading: isPendingLoading } = useQuery({
    queryKey: ['admin-recent-pending'],
    queryFn: async () => {
      const res = await api.get('/bookings/admin/?status=PENDING&limit=5');
      return res.data.results || res.data;
    }
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Tableau de Bord</h1>
        <p className="text-gray-500 font-medium">L'état de la magie Funkidz en un coup d'œil.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_CONFIG.map((stat, idx) => {
          const Icon = stat.icon;
          const value = stats ? stats[stat.key] : '...';

          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6"
            >
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black text-gray-900 leading-tight">
                  {isStatsLoading ? '...' : value}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Recent Pending Bookings */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              Demandes Prioritaires
            </h3>
            <Link to="/admin/bookings?status=PENDING" className="text-sm font-bold text-[var(--fun-purple)] hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            {isPendingLoading ? (
              <div className="p-12 text-center text-gray-400">Chargement...</div>
            ) : recentPending?.length === 0 ? (
              <div className="p-12 text-center text-gray-400">Aucune demande en attente. C'est calme... 🪄</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentPending?.map((booking) => (
                  <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--fun-light-bg)] flex items-center justify-center text-[var(--fun-purple)] font-black text-xs">
                        {booking.booking_number}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{booking.user_email}</p>
                        <p className="text-sm text-gray-500 font-medium">
                          {booking.service_title} • {format(new Date(booking.event_date), 'd MMM')}, {booking.start_time.slice(0, 5)}
                        </p>
                      </div>
                    </div>
                    <Link 
                      to={`/admin/bookings/${booking.id}`}
                      className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[var(--fun-purple)] hover:border-[var(--fun-purple)] shadow-sm group-hover:shadow-md transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Stats Overview */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-indigo-500" />
            CA (Confirmés/Payés)
          </h3>
          <div className="bg-gradient-to-br from-[var(--fun-purple)] to-[var(--fun-pink)] p-8 rounded-[2.5rem] text-white shadow-xl shadow-[var(--fun-purple)]/20 overflow-hidden relative">
            <TrendingUp className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10" />
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-widest text-white/70 mb-2">Chiffre d'Affaires Total</p>
              <h4 className="text-5xl font-black mb-6">
                {isStatsLoading ? '...€' : `${(stats?.total_revenue || 0).toFixed(2)}€`}
              </h4>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <p className="text-xs font-bold leading-relaxed">
                  Basé sur les réservations ayant le statut <span className="underline">PAYÉ</span> uniquement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
