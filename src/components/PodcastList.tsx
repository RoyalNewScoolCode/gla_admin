'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { audioApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const LANGUAGES = ['en', 'fr', 'sw'];
const ALBUMS = {
  en: ['Exhortation', 'Prayer', 'Teaching', 'Editification', 'Testimonies', 'Books'],
  fr: ['Exhortation', 'Prière', 'Enseignement', 'Édification', 'Témoignages', 'Livres'],
  sw: ['Kuhimiza', 'Maombi', 'Mafundisho', 'Kujenzi', 'Uhuhuda', 'Vitabu'],
};

interface Podcast {
  _id: string;
  title: string;
  artist: string;
  album: string;
  language: string;
  imageUrl: string;
  audioUrl: string;
  description?: string;
  createdAt: string;
}

interface PodcastListProps {
  podcasts: Podcast[];
  loading: boolean;
  onRefresh: () => void;
}

export default function PodcastList({
  podcasts,
  loading,
  onRefresh,
}: PodcastListProps) {
  const token = useAuthStore((state) => state.token);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce podcast ?')) {
      return;
    }

    try {
      setDeleting(id);
      await audioApi.deleteAudio(id, token!);
      toast.success('Podcast supprimé');
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Échec de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPodcast) return;

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append('title', editingPodcast.title);
      formData.append('artist', editingPodcast.artist);
      formData.append('album', editingPodcast.album);
      formData.append('language', editingPodcast.language);
      formData.append('description', editingPodcast.description || '');
      formData.append('createdAt', editingPodcast.createdAt);

      await audioApi.updateAudio(editingPodcast._id, formData, token!);
      toast.success('Podcast mis à jour avec succès');
      setEditingPodcast(null);
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Échec de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-slate-400 font-medium animate-pulse">Chargement de votre bibliothèque...</p>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-white/10">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-white text-xl font-bold">Votre bibliothèque est vide</p>
        <p className="text-slate-400 mt-2 max-w-xs mx-auto text-sm">
          Commencez par télécharger votre premier podcast ou message de l'église.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {podcasts.map((podcast) => (
        <div
          key={podcast._id}
          className="group bg-[#111827] rounded-3xl border border-white/10 overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300 transform hover:-translate-y-1"
        >
          {/* Image */}
          <div className="relative h-56 bg-slate-900">
            {podcast.imageUrl ? (
              <Image
                src={podcast.imageUrl}
                alt={podcast.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <span className="text-white text-5xl">🎙️</span>
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/10">
                {podcast.language}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex justify-between items-start gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg truncate group-hover:text-blue-400 transition-colors">
                  {podcast.title}
                </h3>
                <p className="text-sm font-medium text-slate-400">{podcast.artist}</p>
              </div>
              <span className="px-3 py-1 bg-blue-600/10 text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-blue-600/20">
                {podcast.album}
              </span>
            </div>

            {/* Description Snippet */}
            {podcast.description && (
              <p className="text-sm text-slate-500 mt-4 line-clamp-2 leading-relaxed italic">
                "{podcast.description}"
              </p>
            )}

            {/* Audio Player */}
            {podcast.audioUrl && (
              <div className="mt-6 p-1 bg-black/30 rounded-2xl border border-white/5">
                <audio
                  controls
                  className="w-full h-10 custom-audio-player"
                  src={podcast.audioUrl}
                />
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {new Date(podcast.createdAt).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPodcast(podcast)}
                  className="p-2.5 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all duration-300"
                  title="Modifier le Message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(podcast._id)}
                  disabled={deleting === podcast._id}
                  className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
                  title="Supprimer le Message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingPodcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Modifier le Podcast</h2>
                <p className="text-slate-400 text-sm mt-1">Mettez à jour les informations du message.</p>
              </div>
              <button 
                onClick={() => setEditingPodcast(null)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Titre</label>
                  <input
                    type="text"
                    value={editingPodcast.title}
                    onChange={(e) => setEditingPodcast({...editingPodcast, title: e.target.value})}
                    className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Orateur</label>
                  <input
                    type="text"
                    value={editingPodcast.artist}
                    onChange={(e) => setEditingPodcast({...editingPodcast, artist: e.target.value})}
                    className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Langue</label>
                  <select
                    value={editingPodcast.language}
                    onChange={(e) => {
                      const newLang = e.target.value;
                      setEditingPodcast({
                        ...editingPodcast, 
                        language: newLang,
                        album: ALBUMS[newLang as keyof typeof ALBUMS][0]
                      });
                    }}
                    className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Catégorie</label>
                  <select
                    value={editingPodcast.album}
                    onChange={(e) => setEditingPodcast({...editingPodcast, album: e.target.value})}
                    className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {ALBUMS[editingPodcast.language as keyof typeof ALBUMS].map(album => (
                      <option key={album} value={album}>{album}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date de Publication</label>
                <input
                  type="datetime-local"
                  value={new Date(editingPodcast.createdAt).toISOString().slice(0, 16)}
                  onChange={(e) => setEditingPodcast({...editingPodcast, createdAt: new Date(e.target.value).toISOString()})}
                  className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  value={editingPodcast.description || ''}
                  onChange={(e) => setEditingPodcast({...editingPodcast, description: e.target.value})}
                  rows={4}
                  className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingPodcast(null)}
                  className="flex-1 px-6 py-4 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                >
                  {updating ? 'Mise à jour...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
