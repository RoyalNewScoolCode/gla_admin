'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login(email, password);

      // Check if user is admin
      if (response.user.role !== 'admin') {
        toast.error('Only admins can access this dashboard');
        setLoading(false);
        return;
      }

      setAuth(response.user, response.token);
      toast.success('Login successful');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="text-white font-bold text-4xl">G</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            GLA Admin
          </h1>
          <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">
            Portail de Gestion
          </p>
        </div>

        <div className="bg-[#111827] rounded-[2.5rem] border border-white/10 shadow-2xl p-10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-5 bg-[#0B1120] border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="admin@gla.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-6 py-5 bg-[#0B1120] border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Accès Test</p>
              <div className="space-y-1">
                <p className="text-sm text-slate-300">
                  <span className="text-slate-500">Email:</span> admin@gla.com
                </p>
                <p className="text-sm text-slate-300">
                  <span className="text-slate-500">Pass:</span> admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
