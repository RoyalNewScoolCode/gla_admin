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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Church Verses</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isAdding ? 'Cancel' : 'Add New Verse'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Verse Text</label>
            <textarea
              required
              value={newVerse.text}
              onChange={(e) => setNewVerse({ ...newVerse, text: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reference (e.g. John 3:16)</label>
              <input
                type="text"
                required
                value={newVerse.reference}
                onChange={(e) => setNewVerse({ ...newVerse, reference: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
              <select
                value={newVerse.language}
                onChange={(e) => setNewVerse({ ...newVerse, language: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={newVerse.isFeatured}
              onChange={(e) => setNewVerse({ ...newVerse, isFeatured: e.target.checked })}
              className="w-4 height-4 text-blue-600"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700">Set as Featured (Verse of the Day)</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Save Verse
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {loading ? (
          <p>Loading verses...</p>
        ) : verses.length === 0 ? (
          <p className="text-slate-500 italic">No verses found.</p>
        ) : (
          verses.map((verse) => (
            <div key={verse._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                    {verse.language}
                  </span>
                  {verse.isFeatured && (
                    <span className="text-xs font-bold uppercase px-2 py-0.5 bg-amber-100 rounded text-amber-700">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-slate-800 font-medium italic">"{verse.text}"</p>
                <p className="text-slate-500 text-sm mt-1">— {verse.reference}</p>
              </div>
              <button
                onClick={() => handleDelete(verse._id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
