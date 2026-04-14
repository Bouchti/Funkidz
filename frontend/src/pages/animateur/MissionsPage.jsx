import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  Hand,
  Info,
  Loader2,
  Check,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

import api from '@/api/axios';
import { Button } from '@/app/components/ui-kit/Button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { unwrapListResponse } from '@/utils/apiHelpers';

const MISSION_STATUSES = [
  { value: 'PENDING', label: 'En attente', color: 'bg-amber-100 text-amber-700' },
  { value: 'ACCEPTED', label: 'Acceptées', color: 'bg-green-100 text-green-700' },
  { value: 'REFUSED', label: 'Refusées', color: 'bg-red-100 text-red-700' },
  { value: 'DONE', label: 'Terminées', color: 'bg-gray-100 text-gray-700' },
];

export function MissionsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('PENDING');

  const { data: missions, isLoading: isMissionsLoading, isError: isMissionsError } = useQuery({
    queryKey: ['animateur-missions', activeTab],
    queryFn: async () => {
      const res = await api.get('/animateur/planning/');
      return unwrapListResponse(res.data);
    }
  });

  const { data: availableMissions, isLoading: isAvailableLoading, isError: isAvailableError } = useQuery({
    queryKey: ['animateur-available-missions'],
    queryFn: async () => {
      const res = await api.get('/animateur/available-missions/');
      return unwrapListResponse(res.data);
    }
  });

  const respondMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return api.patch(`/animateur/assignments/${id}/respond/`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['animateur-missions'] });
      queryClient.invalidateQueries({ queryKey: ['animateur-stats'] });
      toast.success(variables.status === 'ACCEPTED' ? 'Mission acceptée ! 🎉' : 'Mission refusée.');
    },
    onError: () => toast.error('Une erreur est survenue.')
  });

  const claimMutation = useMutation({
    mutationFn: async (bookingId) => {
      return api.post('/animateur/self-assign/', { booking_id: bookingId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animateur-available-missions'] });
      queryClient.invalidateQueries({ queryKey: ['animateur-missions'] });
      toast.success('Vous vous êtes positionné sur cette mission ! 👍');
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Erreur lors de l\'assignation.')
  });

  const filteredMissions = (missions || []).filter((m) => m.status === activeTab);

  const MissionCard = ({ mission, isAvailable = false }) => {
    const b = mission.booking_details || mission; // Handle different object structures
    
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 group relative"
      >
        <div className="flex justify-between items-start mb-6">
          <Badge className="bg-[var(--fun-light-bg)] text-[var(--fun-purple)] font-black uppercase tracking-widest text-[9px] px-3 py-1">
            {b.service_title}
          </Badge>
          {!isAvailable && (
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
               Assignée le {format(new Date(mission.assigned_at), 'd MMM')}
             </span>
          )}
        </div>

        <h4 className="text-xl font-black text-gray-900 mb-4 truncate">
          {b.first_name ? `Fête de ${b.first_name}` : 'Mission Funkidz'}
        </h4>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
            <Calendar className="w-4 h-4 text-pink-500" />
            {format(new Date(b.event_date), 'EEEE d MMMM yyyy', { locale: fr })}
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
            <Clock className="w-4 h-4 text-indigo-500" />
            {b.start_time.slice(0, 5)} • {b.duration_minutes} min
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
            <MapPin className="w-4 h-4 text-amber-500" />
            {b.address}, {b.city}
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
            <Users className="w-4 h-4 text-blue-500" />
            {b.children_count} enfants
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50 flex items-center justify-between gap-3">
          {isAvailable ? (
            <Button size="sm" onClick={() => claimMutation.mutate(b.id)} className="w-full rounded-xl" disabled={claimMutation.isPending}>
              Me positionner <Hand className="w-4 h-4 ml-2" />
            </Button>
          ) : activeTab === 'PENDING' ? (
            <>
              <Button size="sm" variant="outline" className="flex-1 rounded-xl text-red-500 hover:bg-red-50 hover:border-red-500" onClick={() => respondMutation.mutate({ id: mission.id, status: 'REFUSED' })}>
                <XCircle className="w-4 h-4 mr-2" /> Refuser
              </Button>
              <Button size="sm" className="flex-1 rounded-xl bg-green-500 hover:bg-green-600 border-none" onClick={() => respondMutation.mutate({ id: mission.id, status: 'ACCEPTED' })}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Accepter
              </Button>
            </>
          ) : activeTab === 'ACCEPTED' ? (
            <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
              <Check className="w-5 h-5" /> Mission Confirmée
            </div>
          ) : (
            <div className="text-xs font-black uppercase text-gray-400 tracking-widest">
              {mission.status}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Mes Missions</h1>
        <p className="text-gray-500 font-medium">Gérez vos prestas, de la proposition à la réalisation.</p>
      </div>
      {isMissionsError ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-center font-bold text-red-700">
          Impossible de charger vos missions animateur.
        </div>
      ) : null}

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <Tabs defaultValue="PENDING" onValueChange={setActiveTab}>
            <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 w-full md:w-auto h-auto">
              {MISSION_STATUSES.map(s => (
                <TabsTrigger 
                  key={s.value} 
                  value={s.value}
                  className="px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-[var(--fun-purple)] data-[state=active]:text-white transition-all"
                >
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-8">
              {isMissionsLoading ? (
                <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" /></div>
              ) : filteredMissions.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[2.5rem] border border-gray-100">
                  <Info className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">Aucune mission ici pour le moment.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredMissions.map((m) => (
                    <MissionCard key={m.id} mission={m} />
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </div>

        {/* Available Missions Pool */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest text-sm flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Missions Libres
            </h3>
          </div>
          
          <div className="space-y-6">
            {isAvailableLoading ? (
               <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
            ) : isAvailableError ? (
              <div className="bg-red-50 rounded-3xl p-8 border border-red-100 text-center">
                <p className="text-sm font-bold text-red-700">Impossible de charger les missions libres.</p>
              </div>
            ) : availableMissions?.length === 0 ? (
              <div className="bg-gray-50 rounded-3xl p-8 border-2 border-dashed border-gray-200 text-center">
                 <p className="text-xs font-bold text-gray-400 italic">Toutes les missions du catalogue ont déjà trouvé preneur ! Revenez plus tard. 🎩</p>
              </div>
            ) : (
              availableMissions?.map((m) => (
                <MissionCard key={m.id} mission={m} isAvailable />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
