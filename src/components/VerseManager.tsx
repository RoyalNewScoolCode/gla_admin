'use client';

import { useState, useEffect } from 'react';
import { verseApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function VerseManager() {
  const { token } = useAuthStore();
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingVerse, setEditingVerse] = useState<any | null>(null);
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingVerse) return;
    try {
      await verseApi.updateVerse(editingVerse._id, editingVerse, token);
      setEditingVerse(null);
      loadVerses();
    } catch (error) {
      console.error('Failed to update verse:', error);
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
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingVerse(verse)}
                  className="p-3 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-2xl transition-all duration-300"
                  title="Modifier le verset"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
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
            </div>
          ))
        )}
      </div>

      {/* Edit Verse Modal */}
      {editingVerse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Modifier le Verset</h2>
                <p className="text-slate-400 text-sm mt-1">Mettez à jour le contenu du verset.</p>
              </div>
              <button onClick={() => setEditingVerse(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Texte du Verset</label>
                <textarea
                  required
                  value={editingVerse.text}
                  onChange={(e) => setEditingVerse({ ...editingVerse, text: e.target.value })}
                  className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Référence</label>
                  <input
                    type="text"
                    required
                    value={editingVerse.reference}
                    onChange={(e) => setEditingVerse({ ...editingVerse, reference: e.target.value })}
                    className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Langue</label>
                  <select
                    value={editingVerse.language}
                    onChange={(e) => setEditingVerse({ ...editingVerse, language: e.target.value })}
                    className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
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
                  id="editIsFeatured"
                  checked={editingVerse.isFeatured}
                  onChange={(e) => setEditingVerse({ ...editingVerse, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-white/10 bg-[#0B1120] text-blue-600 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="editIsFeatured" className="text-sm font-bold text-slate-300 cursor-pointer">Définir comme Verset du Jour</label>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingVerse(null)}
                  className="flex-1 px-6 py-4 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
