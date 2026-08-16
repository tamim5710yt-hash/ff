import { useApp } from '@/context';
import { toast } from '@/components/Toast';
import {
  User as UserIcon,
  Phone,
  Gamepad2,
  Crosshair,
  Swords,
  LogOut,
  Shield,
  Wallet,
} from 'lucide-react';

interface Props {
  onAdminLogin: () => void;
}

export default function ProfileScreen({ onAdminLogin }: Props) {
  const { currentUser, logout } = useApp();
  const u = currentUser;

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      <h2 className="mb-4 font-display text-2xl font-bold text-white">Profile</h2>

      {/* profile header */}
      <div className="relative mb-5 overflow-hidden rounded-2xl border border-ink-500 bg-gradient-to-br from-ink-700 to-ink-800 p-5">
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-flame-500/20 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-flame-500 text-2xl font-bold text-white shadow-glowSoft">
            {u?.name?.charAt(0).toUpperCase() ?? 'P'}
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-white">{u?.name}</h3>
            <p className="text-sm text-gray-400">{u?.phone}</p>
            <span className="badge mt-1 bg-win-500/15 text-win-400">
              {u?.role === 'admin' ? 'Admin' : 'Player'}
            </span>
          </div>
        </div>
      </div>

      {/* game ids */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <InfoRow icon={<Gamepad2 size={16} />} label="In-Game Name (IGN)" value={u?.inGameName || '—'} />
        <InfoRow icon={<UserIcon size={16} />} label="In-Game UID" value={u?.inGameUID || '—'} />
        <InfoRow icon={<Phone size={16} />} label="Phone" value={u?.phone || '—'} />
        <InfoRow icon={<Wallet size={16} />} label="Balance" value={`৳${u?.balance ?? 0}`} accent />
      </div>

      {/* stats */}
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Career Stats
      </h3>
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard icon={<Swords size={18} />} label="Matches" value={u?.totalMatches ?? 0} />
        <StatCard icon={<Crosshair size={18} />} label="Total Kills" value={u?.totalKills ?? 0} />
        <StatCard icon={<Wallet size={18} />} label="Balance" value={`৳${u?.balance ?? 0}`} />
      </div>

      {/* actions */}
      <div className="space-y-3">
        <button
          onClick={() => {
            logout();
            toast('info', 'Logged out');
          }}
          className="btn-ghost w-full py-3 text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
        <button
          onClick={onAdminLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-500 bg-ink-700 py-3 text-sm font-semibold text-gray-300 hover:border-flame-500/40 hover:text-flame-400 transition"
        >
          <Shield size={16} /> Admin Login
        </button>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-500 bg-ink-700 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="text-flame-400">{icon}</span>
        {label}
      </div>
      <span className={`font-semibold ${accent ? 'text-win-400' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="card flex flex-col items-center gap-1 p-4 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-flame-500/15 text-flame-400">
        {icon}
      </div>
      <div className="font-display text-xl font-bold text-white">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}
