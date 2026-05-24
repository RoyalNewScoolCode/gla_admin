'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { audioApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this podcast?')) {
      return;
    }

    try {
      setDeleting(id);
      await audioApi.deleteAudio(id, token!);
      toast.success('Podcast deleted');
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-slate-400 font-medium animate-pulse">Loading your library...</p>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-white/10">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-white text-xl font-bold">Your library is empty</p>
        <p className="text-slate-400 mt-2 max-w-xs mx-auto text-sm">
          Get started by uploading your first podcast or church message.
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
                  {new Date(podcast.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <button
                onClick={() => handleDelete(podcast._id)}
                disabled={deleting === podcast._id}
                className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
                title="Delete Message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
