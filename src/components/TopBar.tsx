import { Flame, LogOut } from 'lucide-react';
import { useApp } from '@/context';

interface Props {
  isAdmin?: boolean;
}

export default function TopBar({ isAdmin = false }: Props) {
  const { currentUser, logout, exitAdmin } = useApp();
  return (
    <header className="sticky top-0 z-30 border-b border-ink-500 bg-ink-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-flame-500 shadow-glowSoft">
            <Flame size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-widest text-white leading-none">
              FF TOURNAMENT
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-flame-400">
              {isAdmin ? 'Admin Panel' : 'Free Fire Esports'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isAdmin && currentUser && (
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-ink-700 px-3 py-1.5 border border-ink-500">
              <span className="text-xs text-gray-400">Balance</span>
              <span className="text-sm font-bold text-win-400">
                ৳{currentUser.balance}
              </span>
            </div>
          )}
          <button
            onClick={isAdmin ? exitAdmin : logout}
            className="btn-ghost px-3 py-2 text-xs"
          >
            <LogOut size={14} /> {isAdmin ? 'Exit' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  );
}
