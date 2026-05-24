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
  });
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      uploadFormData.append('type', 'Podcast');
      uploadFormData.append('image', image);
      uploadFormData.append('audio', audio);

      await audioApi.uploadAudio(uploadFormData, token!);

      toast.success('Podcast uploaded successfully!');
      setFormData({
        title: '',
        artist: 'GLA',
        language: 'en',
        album: 'Exhortation',
      });
      setImage(null);
      setAudio(null);
      onUploadSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const albumOptions = ALBUMS[formData.language as keyof typeof ALBUMS] || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload New Podcast</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Podcast Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter podcast title"
            />
          </div>

          {/* Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Language *
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Album *
              </label>
              <select
                name="album"
                value={formData.album}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Artist
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Artist name"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Podcast Image *
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'image')}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer block">
                <div className="text-4xl mb-2">🖼️</div>
                {image ? (
                  <p className="text-sm font-semibold text-slate-900">
                    {image.name}
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-900">
                      Click to upload image
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Audio Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Audio File *
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, 'audio')}
                className="hidden"
                id="audio-input"
              />
              <label htmlFor="audio-input" className="cursor-pointer block">
                <div className="text-4xl mb-2">🎵</div>
                {audio ? (
                  <p className="text-sm font-semibold text-slate-900">
                    {audio.name}
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-900">
                      Click to upload audio
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      MP3, WAV, M4A up to 100MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            {loading ? 'Uploading...' : 'Upload Podcast'}
          </button>
        </form>
      </div>
    </div>
  );
}
