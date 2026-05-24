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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
            GLA Admin
          </h1>
          <p className="text-center text-slate-600 mb-8">
            Podcast Management Dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@gla.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-100 rounded-lg">
            <p className="text-sm text-slate-600">
              <strong>Test Admin:</strong>
            </p>
            <p className="text-sm text-slate-600">
              Email: admin@gla.com
            </p>
            <p className="text-sm text-slate-600">
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
