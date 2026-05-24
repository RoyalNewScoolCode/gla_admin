'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { audioApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import PodcastList from '@/components/PodcastList';
import UploadForm from '@/components/UploadForm';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, token } = useAuthStore();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'podcasts' | 'upload'>('podcasts');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated || !token) {
      router.push('/login');
      return;
    }

    loadPodcasts();
  }, [isAuthenticated, token, mounted, router]);

  const loadPodcasts = async () => {
    try {
      setLoading(true);
      const data = await audioApi.getAllAudio();
      setPodcasts(data);
    } catch (error) {
      console.error('Failed to load podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Podcast Management
          </h1>
          <p className="text-slate-600 mt-2">
            Upload, manage, and organize your podcasts
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('podcasts')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'podcasts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            My Podcasts ({podcasts.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload New
          </button>
        </div>

        {/* Content */}
        {activeTab === 'podcasts' ? (
          <PodcastList
            podcasts={podcasts}
            loading={loading}
            onRefresh={loadPodcasts}
          />
        ) : (
          <UploadForm
            onUploadSuccess={() => {
              setActiveTab('podcasts');
              loadPodcasts();
            }}
          />
        )}
      </main>
    </div>
  );
}
