'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { audioApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const LANGUAGES = ['en', 'fr', 'sw'];
const ALBUMS = {
  en: ['Exhortation', 'Prayer', 'Teaching', 'Editification', 'Testimonies', 'Books'],
  fr: ['Exhortation', 'Prière', 'Enseignement', 'Édification', 'Témoignages', 'Livres'],
  sw: ['Kuhimiza', 'Maombi', 'Mafundisho', 'Kujenzi', 'Uhuhuda', 'Vitabu'],
};

interface UploadFormProps {
  onUploadSuccess: () => void;
}

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const token = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: 'GLA',
    language: 'en',
    album: 'Exhortation',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'language' && { album: ALBUMS[value as keyof typeof ALBUMS][0] }),
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'audio'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'image') {
        setImage(file);
      } else {
        setAudio(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image || !audio) {
      toast.error('Please select both image and audio files');
      return;
    }

    try {
      setLoading(true);

      const uploadFormData = new FormData();
      uploadFormData.append('title', formData.title);
      uploadFormData.append('artist', formData.artist);
      uploadFormData.append('album', formData.album);
      uploadFormData.append('language', formData.language);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('type', 'Podcast');
      uploadFormData.append('image', image);
      uploadFormData.append('audio', audio);

      await audioApi.uploadAudio(uploadFormData, token!);

      toast.success('Podcast téléchargé avec succès !');
      setFormData({
        title: '',
        artist: 'GLA',
        language: 'en',
        album: 'Exhortation',
        description: '',
      });
      setImage(null);
      setAudio(null);
      onUploadSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Échec du téléchargement');
    } finally {
      setLoading(false);
    }
  };

  const albumOptions = ALBUMS[formData.language as keyof typeof ALBUMS] || [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#111827] rounded-3xl border border-white/10 shadow-2xl p-8 md:p-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Publier du Contenu</h2>
          <p className="text-slate-400">Ajoutez un nouveau podcast ou enseignement à la bibliothèque GLA.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
              Titre du Podcast
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-5 py-4 bg-[#0B1120] border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="ex: Le Pouvoir de la Foi"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Language */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                Langue
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-[#0B1120] border border-white/10 rounded-2xl text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase() === 'EN' ? 'Anglais' : lang.toUpperCase() === 'FR' ? 'Français' : 'Swahili'}
                  </option>
                ))}
              </select>
            </div>

            {/* Album */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                Catégorie / Album
              </label>
              <select
                name="album"
                value={formData.album}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-[#0B1120] border border-white/10 rounded-2xl text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
              >
                {albumOptions.map((album) => (
                  <option key={album} value={album}>
                    {album}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Artist */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
              Orateur / Artiste
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-[#0B1120] border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Nom de l'artiste"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
              Description du Message
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-5 py-4 bg-[#0B1120] border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="De quoi parle ce message ? (Ajoutez les références bibliques ici)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                Image de Couverture
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="hidden"
                  id="image-input"
                />
                <label 
                  htmlFor="image-input" 
                  className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/10 rounded-3xl hover:bg-white/5 hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  {image ? (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <p className="text-sm font-medium text-blue-400 text-center break-all">{image.name}</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-white">Sélectionner une Image</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG jusqu'à 10 Mo</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Audio Upload */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                Enregistrement Audio
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e, 'audio')}
                  className="hidden"
                  id="audio-input"
                />
                <label 
                  htmlFor="audio-input" 
                  className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/10 rounded-3xl hover:bg-white/5 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
                >
                  {audio ? (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <p className="text-sm font-medium text-blue-400 text-center break-all">{audio.name}</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-white">Sélectionner un Audio</p>
                      <p className="text-xs text-slate-500 mt-1">MP3, WAV jusqu'à 100 Mo</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] mt-10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publication en cours...
              </span>
            ) : 'Publier le Podcast'}
          </button>
        </form>
      </div>
    </div>
  );
}
