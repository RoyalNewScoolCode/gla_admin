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
    <nav className="bg-[#0B1120] border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">GLA Admin</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">System Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-300 group"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
