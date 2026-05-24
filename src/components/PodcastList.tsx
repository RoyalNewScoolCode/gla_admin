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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 text-lg">No podcasts yet</p>
        <p className="text-slate-500 text-sm mt-2">
          Create your first podcast by clicking the Upload New tab
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {podcasts.map((podcast) => (
        <div
          key={podcast._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          {/* Image */}
          <div className="relative h-40 bg-slate-200">
            {podcast.imageUrl ? (
              <Image
                src={podcast.imageUrl}
                alt={podcast.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                <span className="text-white text-4xl">🎙️</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-slate-900 truncate">
              {podcast.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1">{podcast.artist}</p>

            {/* Metadata */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                {podcast.language}
              </span>
              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                {podcast.album}
              </span>
            </div>

            {/* Date */}
            <p className="text-xs text-slate-500 mt-3">
              {new Date(podcast.createdAt).toLocaleDateString()}
            </p>

            {/* Audio Player */}
            {podcast.audioUrl && (
              <div className="mt-4">
                <audio
                  controls
                  className="w-full h-8"
                  src={podcast.audioUrl}
                />
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(podcast._id)}
              disabled={deleting === podcast._id}
              className="w-full mt-4 px-3 py-2 bg-red-100 hover:bg-red-200 disabled:bg-slate-100 text-red-700 disabled:text-slate-500 font-semibold text-sm rounded transition"
            >
              {deleting === podcast._id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
