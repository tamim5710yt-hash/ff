import { useApp } from '@/context';
import type { AdminTab } from '@/screens/AdminPanel';
import {
  Users,
  Swords,
  Clock,
  Coins,
  Plus,
  KeyRound,
  CheckCircle2,
  UserCog,
} from 'lucide-react';

interface Props {
  onNavigate: (t: AdminTab) => void;
}

export default function AdminDashboard({ onNavigate }: Props) {
  const { db } = useApp();
  const totalUsers = db.users.filter((u) => u.role === 'user').length;
  const activeMatches = db.matches.filter(
    (m) => m.status === 'Upcoming' || m.status === 'Live'
  ).length;
  const pendingPayments = db.transactions.filter((t) => t.status === 'Pending').length;
  const cashPool = db.matches.reduce((s, m) => s + m.joinedSlots * m.entryFee, 0);

  const metrics = [
    { label: 'Total Users', value: totalUsers, icon: <Users size={20} />, color: 'text-info-400 bg-info-500/15' },
    { label: 'Active Matches', value: activeMatches, icon: <Swords size={20} />, color: 'text-flame-400 bg-flame-500/15' },
    { label: 'Pending Payments', value: pendingPayments, icon: <Clock size={20} />, color: 'text-warn-400 bg-warn-500/15' },
    { label: 'Total Cash Pool', value: `৳${cashPool}`, icon: <Coins size={20} />, color: 'text-win-400 bg-win-500/15' },
  ];

  const actions: { label: string; icon: React.ReactNode; tab: AdminTab }[] = [
    { label: 'Create Match', icon: <Plus size={18} />, tab: 'matches' },
    { label: 'Room IDs', icon: <KeyRound size={18} />, tab: 'rooms' },
    { label: 'Verify Payments', icon: <CheckCircle2 size={18} />, tab: 'payments' },
    { label: 'Manage Users', icon: <UserCog size={18} />, tab: 'users' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      <h2 className="mb-4 font-display text-2xl font-bold text-white">Dashboard</h2>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="card p-4">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${m.color}`}>
              {m.icon}
            </div>
            <div className="font-display text-2xl font-bold text-white">{m.value}</div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500">{m.label}</div>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => onNavigate(a.tab)}
            className="card flex flex-col items-center gap-2 p-4 transition hover:border-flame-500/40 hover:bg-ink-600"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500/15 text-flame-400">
              {a.icon}
            </div>
            <span className="text-xs font-semibold text-gray-200">{a.label}</span>
          </button>
        ))}
      </div>

      {/* recent pending */}
      <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Recent Pending Transactions
      </h3>
      {pendingPayments === 0 ? (
        <div className="card p-6 text-center text-sm text-gray-400">
          No pending payments. All clear!
        </div>
      ) : (
        <div className="space-y-2">
          {db.transactions
            .filter((t) => t.status === 'Pending')
            .slice(0, 4)
            .map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-ink-500 bg-ink-700 px-4 py-3"
              >
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t.userName} · {t.type}
                  </div>
                  <div className="text-xs text-gray-500">{t.method} · {t.trxId}</div>
                </div>
                <div className="font-bold text-warn-400">৳{t.amount}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
