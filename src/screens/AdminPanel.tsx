import { useState } from 'react';
import TopBar from '@/components/TopBar';
import AdminDashboard from '@/screens/AdminDashboard';
import AdminMatches from '@/screens/AdminMatches';
import AdminRooms from '@/screens/AdminRooms';
import AdminPayments from '@/screens/AdminPayments';
import AdminUsers from '@/screens/AdminUsers';
import {
  LayoutDashboard,
  Swords,
  KeyRound,
  CheckCircle2,
  Users,
  Flame,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'matches'
  | 'rooms'
  | 'payments'
  | 'users';

const tabs: { id: AdminTab; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'matches', label: 'Matches', Icon: Swords },
  { id: 'rooms', label: 'Rooms', Icon: KeyRound },
  { id: 'payments', label: 'Payments', Icon: CheckCircle2 },
  { id: 'users', label: 'Users', Icon: Users },
];

export default function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('dashboard');

  return (
    <div className="min-h-screen bg-ink-900">
      <TopBar isAdmin />
      <div className="flex">
        {/* desktop sidebar */}
        <aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-56 shrink-0 border-r border-ink-500 bg-ink-800 p-3 md:block">
          <nav className="space-y-1">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  tab === id
                    ? 'bg-flame-500 text-white shadow-glowSoft'
                    : 'text-gray-400 hover:bg-ink-700 hover:text-white'
                }`}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* content */}
        <main className="min-h-[calc(100vh-65px)] flex-1 pb-20 md:pb-8">
          {tab === 'dashboard' && <AdminDashboard onNavigate={setTab} />}
          {tab === 'matches' && <AdminMatches />}
          {tab === 'rooms' && <AdminRooms />}
          {tab === 'payments' && <AdminPayments />}
          {tab === 'users' && <AdminUsers />}
        </main>
      </div>

      {/* mobile bottom nav for admin */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-500 bg-ink-800/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-1 py-2">
          {tabs.map(({ id, label, Icon }) => {
            const on = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="no-tap-highlight flex flex-1 flex-col items-center gap-1 rounded-xl py-1"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    on ? 'bg-flame-500 text-white shadow-glowSoft' : 'text-gray-500'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    on ? 'text-flame-400' : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
