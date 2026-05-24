'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { audioApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import PodcastList from '@/components/PodcastList';
import UploadForm from '@/components/UploadForm';
import VerseManager from '@/components/VerseManager';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, token } = useAuthStore();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'podcasts' | 'upload' | 'verses'>('podcasts');
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
    <div className="min-h-screen bg-[#030712]">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Tableau de Bord
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Gérez vos podcasts, versets et contenu pour les membres.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('podcasts')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'podcasts'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Bibliothèque
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Télécharger
            </button>
            <button
              onClick={() => setActiveTab('verses')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'verses'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Versets
            </button>
          </div>
        </div>

        {/* Content Area with Glassmorphism effect */}
        <div className="relative">
          {activeTab === 'podcasts' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PodcastList
                podcasts={podcasts}
                loading={loading}
                onRefresh={loadPodcasts}
              />
            </div>
          )}
          {activeTab === 'upload' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <UploadForm
                onUploadSuccess={() => {
                  setActiveTab('podcasts');
                  loadPodcasts();
                }}
              />
            </div>
          )}
          {activeTab === 'verses' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <VerseManager />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
