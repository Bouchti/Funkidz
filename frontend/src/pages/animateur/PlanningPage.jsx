import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  PlusCircle, 
  Info, 
  MapPin, 
  Users, 
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import api from '@/api/axios';
import { Button } from '@/app/components/ui-kit/Button';
import { unwrapListResponse } from '@/utils/apiHelpers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Badge } from '@/app/components/ui/badge';

moment.locale('fr');
const localizer = momentLocalizer(moment);

const STATUS_COLORS = {
  ACCEPTED: '#22c55e', // green-500
  PENDING: '#f59e0b',  // amber-500
  REFUSED: '#ef4444',  // red-500
  BLOCKED: '#94a3b8',  // slate-400
};

export function PlanningPage() {
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    blocked_date: moment().format('YYYY-MM-DD'),
    blocked_start: '09:00',
    blocked_end: '18:00',
    reason: ''
  });

  const { data: missions, isLoading: missionsLoading, isError: missionsError } = useQuery({
    queryKey: ['animateur-planning-all'],
    queryFn: async () => {
      const res = await api.get('/animateur/planning/');
      return unwrapListResponse(res.data);
    }
  });

  const { data: availabilities, isLoading: availLoading, isError: availError } = useQuery({
    queryKey: ['animateur-availabilities-planning'],
    queryFn: async () => {
      const res = await api.get('/animateur/availabilities/');
      return unwrapListResponse(res.data);
    }
  });
  const { data: availableMissions } = useQuery({
    queryKey: ['animateur-available-missions-planning'],
    queryFn: async () => {
      const res = await api.get('/animateur/available-missions/');
      return unwrapListResponse(res.data);
    }
  });

  const addBlockMutation = useMutation({
    mutationFn: async (data) =>
      api.post('/animateur/availabilities/', {
        ...data,
        blocked_start: data.blocked_start.length === 5 ? `${data.blocked_start}:00` : data.blocked_start,
        blocked_end: data.blocked_end.length === 5 ? `${data.blocked_end}:00` : data.blocked_end,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animateur-planning-all'] });
      queryClient.invalidateQueries({ queryKey: ['animateur-availabilities-planning'] });
      toast.success('Créneau bloqué ajouté');
      setBlockModalOpen(false);
    },
    onError: () => toast.error('Erreur lors de l\'ajout')
  });

  const events = useMemo(() => {
    const missionEvents = missions?.map(m => {
      const b = m.booking_details;
      const start = moment(`${b.event_date}T${b.start_time}`).toDate();
      const end = moment(start).add(b.duration_minutes, 'minutes').toDate();
      
      return {
        id: m.id,
        title: `${b.service_title} - ${b.city}`,
        start,
        end,
        resource: m,
        type: 'MISSION',
        status: m.status,
      };
    }) || [];

    const blockEvents = availabilities?.map(a => {
      const start = moment(`${a.blocked_date}T${a.blocked_start}`).toDate();
      const end = moment(`${a.blocked_date}T${a.blocked_end}`).toDate();
      
      return {
        id: a.id,
        title: `Indisponible: ${a.reason || 'Bloqué'}`,
        start,
        end,
        resource: a,
        type: 'BLOCKED',
        status: 'BLOCKED',
      };
    }) || [];

    return [...missionEvents, ...blockEvents];
  }, [missions, availabilities]);

  const eventStyleGetter = (event) => {
    const backgroundColor = STATUS_COLORS[event.status] || '#6366f1';
    return {
      style: {
        backgroundColor,
        borderRadius: '12px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        padding: '4px 8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }
    };
  };

  const handleNavigate = (action) => {
    const base = moment(currentDate);
    if (action === 'TODAY') return setCurrentDate(new Date());
    if (currentView === Views.MONTH) {
      setCurrentDate(
        action === 'PREV' ? base.subtract(1, 'month').toDate() : base.add(1, 'month').toDate()
      );
      return;
    }
    if (currentView === Views.WEEK) {
      setCurrentDate(
        action === 'PREV' ? base.subtract(1, 'week').toDate() : base.add(1, 'week').toDate()
      );
      return;
    }
    setCurrentDate(action === 'PREV' ? base.subtract(1, 'day').toDate() : base.add(1, 'day').toDate());
  };

  if (missionsLoading || availLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" /></div>;
  if (missionsError || availError) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-bold text-red-700">Impossible de charger le planning animateur.</p>
        <p className="mt-2 text-sm text-red-600">Verifiez que votre compte possede bien le role ANIMATEUR.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Mon Planning</h1>
          <p className="text-gray-500 font-medium">Visualisez vos missions et gérez votre temps.</p>
        </div>
        <div className="flex gap-3">
           <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm mr-4">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{status}</span>
                </div>
              ))}
           </div>
           <Button onClick={() => setBlockModalOpen(true)} className="rounded-2xl shrink-0">
             <PlusCircle className="w-5 h-5 mr-2" /> Bloquer un créneau
           </Button>
        </div>
      </div>

      <div className="flex-grow bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 min-h-[600px]">
        {events.length === 0 ? (
          <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-center">
            <p className="font-bold text-amber-700">Aucune mission assignee pour le moment.</p>
            <p className="mt-1 text-sm text-amber-700">
              Vous pouvez consulter les missions disponibles ({availableMissions?.length || 0}) ou bloquer vos indisponibilites.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/animateur/missions">Voir les missions</Link>
            </Button>
          </div>
        ) : null}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <button onClick={() => handleNavigate('TODAY')} className="rounded-lg border bg-white px-3 py-1 text-sm font-semibold">Aujourd'hui</button>
            <button onClick={() => handleNavigate('PREV')} className="rounded-lg border bg-white p-1.5"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => handleNavigate('NEXT')} className="rounded-lg border bg-white p-1.5"><ChevronRight className="h-4 w-4" /></button>
            <span className="ml-2 text-sm font-bold text-gray-700">{moment(currentDate).format('MMMM YYYY')}</span>
          </div>
          <div className="flex items-center gap-1">
            {[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${currentView === view ? 'bg-[var(--fun-purple)] text-white' : 'bg-white border'}`}
              >
                {view === Views.MONTH ? 'Mois' : view === Views.WEEK ? 'Semaine' : view === Views.DAY ? 'Jour' : 'Agenda'}
              </button>
            ))}
          </div>
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          date={currentDate}
          view={currentView}
          onView={setCurrentView}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          toolbar={false}
          onSelectEvent={setSelectedEvent}
          eventPropGetter={eventStyleGetter}
          messages={{
            next: "Suivant",
            previous: "Précédent",
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            agenda: "Agenda",
          }}
          culture="fr"
        />
      </div>

      {/* Event Details Drawer/Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="rounded-[2.5rem] p-8 max-w-lg">
          {selectedEvent && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[selectedEvent.status] }}></div>
                  {selectedEvent.type === 'MISSION' ? 'Détail Mission' : 'Créneau Bloqué'}
                </DialogTitle>
              </DialogHeader>

              {selectedEvent.type === 'MISSION' ? (
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <Badge className={`mb-3 ${STATUS_COLORS[selectedEvent.status]} bg-opacity-20 text-current`}>
                      {selectedEvent.status}
                    </Badge>
                    <h4 className="text-2xl font-black text-gray-900 mb-2">
                      {selectedEvent.resource.booking_details.service_title}
                    </h4>
                    <p className="text-gray-500 font-medium">Fête à {selectedEvent.resource.booking_details.city}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 font-bold text-gray-700">
                      <Calendar className="w-5 h-5 text-pink-500" />
                      {moment(selectedEvent.start).format('DD MMM YYYY')}
                    </div>
                    <div className="flex items-center gap-3 font-bold text-gray-700">
                      <Clock className="w-5 h-5 text-indigo-500" />
                      {moment(selectedEvent.start).format('HH:mm')} - {moment(selectedEvent.end).format('HH:mm')}
                    </div>
                    <div className="flex items-center gap-3 font-bold text-gray-700 col-span-2">
                      <MapPin className="w-5 h-5 text-amber-500" />
                      {selectedEvent.resource.booking_details.address}, {selectedEvent.resource.booking_details.city}
                    </div>
                  </div>

                  <Button className="w-full rounded-xl" asChild>
                    <a href={`/animateur/missions`}>Voir dans mes missions</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 italic font-medium text-gray-600">
                     <AlertCircle className="w-5 h-5 text-gray-400 mb-2" />
                     "{selectedEvent.resource.reason || 'Aucune raison spécifiée'}"
                   </div>
                   <div className="flex items-center gap-3 font-bold text-gray-700">
                      <Clock className="w-5 h-5 text-gray-400" />
                      Le {moment(selectedEvent.start).format('DD MMMM')} de {moment(selectedEvent.start).format('HH:mm')} à {moment(selectedEvent.end).format('HH:mm')}
                   </div>
                   <Button variant="outline" className="w-full rounded-xl text-red-500" onClick={() => setSelectedEvent(null)}>Fermer</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block Slot Modal */}
      <Dialog open={blockModalOpen} onOpenChange={setBlockModalOpen}>
        <DialogContent className="rounded-[2.5rem] p-8 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Bloquer un créneau</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
             <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
              <input 
                type="date" 
                value={formData.blocked_date}
                onChange={(e) => setFormData({...formData, blocked_date: e.target.value})}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Début</label>
                <input 
                  type="time" 
                  value={formData.blocked_start}
                  onChange={(e) => setFormData({...formData, blocked_start: e.target.value})}
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fin</label>
                <input 
                  type="time" 
                  value={formData.blocked_end}
                  onChange={(e) => setFormData({...formData, blocked_end: e.target.value})}
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Raison</label>
              <input 
                type="text" 
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setBlockModalOpen(false)}>Annuler</Button>
            <Button onClick={() => addBlockMutation.mutate(formData)} disabled={addBlockMutation.isPending}>
              {addBlockMutation.isPending ? 'Enregistrement...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
