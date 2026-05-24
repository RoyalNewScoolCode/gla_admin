'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-hot-toast';

interface NavbarProps {
  user: any;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">GLA Admin</h1>
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
