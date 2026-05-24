'use client';

import { useState, useEffect } from 'react';
import { verseApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function VerseManager() {
  const { token } = useAuthStore();
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newVerse, setNewVerse] = useState({
    text: '',
    reference: '',
    language: 'en',
    isFeatured: true
  });

  const loadVerses = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await verseApi.getAllVerses(token);
      setVerses(data);
    } catch (error) {
      console.error('Failed to load verses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerses();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await verseApi.createVerse(newVerse, token);
      setNewVerse({ text: '', reference: '', language: 'en', isFeatured: true });
      setIsAdding(false);
      loadVerses();
    } catch (error) {
      console.error('Failed to create verse:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure?')) return;
    try {
      await verseApi.deleteVerse(id, token);
      loadVerses();
    } catch (error) {
      console.error('Failed to delete verse:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Versets de l'Église</h2>
          <p className="text-slate-400 mt-1">Gérez le verset du jour pour l'application mobile.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
            isAdding 
              ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
              : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
          }`}
        >
          {isAdding ? 'Annuler' : 'Ajouter un Verset'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[#111827] p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Texte du Verset</label>
            <textarea
              required
              value={newVerse.text}
              onChange={(e) => setNewVerse({ ...newVerse, text: e.target.value })}
              className="w-full px-5 py-4 bg-[#0B1120] border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              rows={3}
              placeholder="Entrez le texte du verset..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Référence (ex: Jean 3:16)</label>
              <input
                type="text"
                required
                value={newVerse.reference}
                onChange={(e) => setNewVerse({ ...newVerse, reference: e.target.value })}
                className="w-full px-5 py-4 bg-[#0B1120] border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Livre Chapitre:Verset"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Langue</label>
              <select
                value={newVerse.language}
                onChange={(e) => setNewVerse({ ...newVerse, language: e.target.value })}
                className="w-full px-5 py-4 bg-[#0B1120] border border-white/10 rounded-2xl text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
              >
                <option value="en">Anglais</option>
                <option value="fr">Français</option>
                <option value="sw">Swahili</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
            <input
              type="checkbox"
              id="isFeatured"
              checked={newVerse.isFeatured}
              onChange={(e) => setNewVerse({ ...newVerse, isFeatured: e.target.checked })}
              className="w-5 h-5 rounded-lg border-white/10 bg-[#0B1120] text-blue-600 focus:ring-offset-0 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-sm font-bold text-slate-300 cursor-pointer">Définir comme Verset du Jour</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all duration-300 transform hover:-translate-y-1"
          >
            Enregistrer le Verset
          </button>
        </form>
      )}

      <div className="grid gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
            <p className="text-slate-500 font-medium">Chargement des versets...</p>
          </div>
        ) : verses.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10 shadow-inner">
            <div className="text-5xl mb-4 opacity-20">📖</div>
            <p className="text-slate-400 font-medium text-lg">Aucun verset trouvé.</p>
            <p className="text-slate-600 text-sm mt-1">Commencez par ajouter la Parole de Dieu pour aujourd'hui.</p>
          </div>
        ) : (
          verses.map((verse) => (
            <div key={verse._id} className="group bg-[#111827] p-6 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 tracking-widest">
                    {verse.language === 'en' ? 'Anglais' : verse.language === 'fr' ? 'Français' : 'Swahili'}
                  </span>
                  {verse.isFeatured && (
                    <span className="text-[10px] font-bold uppercase px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                      Verset du Jour
                    </span>
                  )}
                </div>
                <p className="text-white text-lg font-medium italic leading-relaxed">"{verse.text}"</p>
                <p className="text-blue-400 font-bold mt-2 text-sm tracking-wide">— {verse.reference}</p>
              </div>
              <button
                onClick={() => handleDelete(verse._id)}
                className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300"
                title="Supprimer le verset"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
