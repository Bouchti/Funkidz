import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Film, 
  Eye, 
  EyeOff, 
  Upload, 
  Link as LinkIcon,
  Loader2,
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import api from '@/api/axios';
import { Button } from '@/app/components/ui-kit/Button';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Switch } from "@/app/components/ui/switch";

export function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState({ open: false });
  const [uploadFile, setUploadFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'IMAGE',
    service: '',
    is_visible: true
  });

  const { data: gallery, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const res = await api.get('/gallery/admin/');
      return res.data;
    }
  });

  const { data: services } = useQuery({
    queryKey: ['admin-services-minimal'],
    queryFn: async () => {
      const res = await api.get('/services/admin/services/');
      return res.data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (data) => {
      const form = new FormData();
      form.append('title', data.title);
      form.append('type', data.type);
      form.append('is_visible', data.is_visible);
      if (data.service) form.append('service', data.service);
      if (uploadFile) form.append('file', uploadFile);
      
      return api.post('/gallery/admin/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast.success('Média ajouté à la galerie');
      closeModal();
    },
    onError: () => toast.error('Erreur lors de l\'upload')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/gallery/admin/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast.success('Média supprimé');
    }
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, is_visible }) => api.patch(`/gallery/admin/${id}/`, { is_visible }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast.success('Visibilité mise à jour');
    }
  });

  const closeModal = () => {
    setModal({ open: false });
    setUploadFile(null);
    setFormData({ title: '', type: 'IMAGE', service: '', is_visible: true });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Galerie Photos & Vidéos</h1>
          <p className="text-gray-500 font-medium">Gérez les souvenirs publics de Funkidz.</p>
        </div>
        <Button onClick={() => setModal({ open: true })} className="rounded-2xl px-6">
          <Upload className="w-5 h-5 mr-2" /> Ajouter un Média
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--fun-purple)]" /></div>
        ) : gallery?.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-square rounded-[2rem] overflow-hidden bg-gray-200 shadow-sm hover:shadow-xl transition-all border border-gray-100"
          >
            {item.type === 'VIDEO' ? (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <Film className="w-12 h-12 text-white/20" />
                <video src={item.file_url} className="absolute inset-0 w-full h-full object-cover opacity-50" />
              </div>
            ) : (
              <img src={item.file_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            )}

            {/* Overlays */}
            <div className={`absolute top-4 left-4 p-2 rounded-xl backdrop-blur-md border border-white/20 text-white ${item.is_visible ? 'bg-black/20' : 'bg-red-500/50'}`}>
              {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl flex items-center justify-between gap-2 border border-white/20">
                <div className="min-w-0">
                  <p className="text-xs font-black text-gray-900 truncate">{item.title || 'Sans titre'}</p>
                  <p className="text-[10px] text-[var(--fun-purple)] font-black uppercase tracking-widest truncate">
                    {services?.find(s => s.id === item.service)?.title || 'Général'}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button 
                    onClick={() => toggleVisibilityMutation.mutate({ id: item.id, is_visible: !item.is_visible })}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    {item.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => window.confirm('Supprimer ce média ?') && deleteMutation.mutate(item.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {gallery?.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center text-gray-400 font-bold">La galerie est vide.</div>
        )}
      </div>

      {/* Upload Modal */}
      <Dialog open={modal.open} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="rounded-[2.5rem] p-8 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Ajouter au Portfolio</DialogTitle>
          </DialogHeader>

          <div className="py-6 space-y-6">
            {/* Drop Zone */}
            <div 
              className={`
                relative h-48 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden
                ${uploadFile ? 'border-[var(--fun-purple)] bg-[var(--fun-purple)]/5' : 'border-gray-200 hover:border-[var(--fun-purple)] hover:bg-gray-50'}
              `}
              onClick={() => document.getElementById('file-upload').click()}
            >
              {uploadFile ? (
                <>
                  <ImageIcon className="w-10 h-10 text-[var(--fun-purple)]" />
                  <p className="text-sm font-black text-[var(--fun-purple)]">{uploadFile.name}</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setUploadFile(null); }}
                    className="absolute top-4 right-4 p-1 bg-white rounded-full shadow-sm"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-300" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cliquez pour téléverser</p>
                </>
              )}
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                onChange={(e) => setUploadFile(e.target.files[0])}
                accept="image/*,video/*"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Légende / Titre</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="ex: Super Magie avec Sarah"
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)] outline-none"
                  >
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Vidéo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service associé</label>
                  <select 
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-[var(--fun-purple)] outline-none"
                  >
                    <option value="">Général</option>
                    {services?.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${formData.is_visible ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black text-gray-700">Rendre visible par tous</span>
                </div>
                <Switch 
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({...formData, is_visible: checked})}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={closeModal}>Annuler</Button>
            <Button onClick={() => uploadMutation.mutate(formData)} disabled={uploadMutation.isPending || !uploadFile}>
              {uploadMutation.isPending ? 'Téléversement...' : 'Ajouter à la galerie'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
