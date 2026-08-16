import { useMemo, useState } from 'react';
import { useApp } from '@/context';
import type { MatchMode } from '@/types';
import MatchCard from '@/components/MatchCard';
import Modal from '@/components/Modal';
import { toast } from '@/components/Toast';
import { Swords, Coins, Crosshair, Trophy, ShieldCheck, X } from 'lucide-react';

const filters: ('All' | MatchMode)[] = ['All', 'Solo', 'Duo', 'Squad'];

export default function HomeScreen() {
  const { db, currentUser, joinMatch } = useApp();
  const [filter, setFilter] = useState<'All' | MatchMode>('All');
  const [joinTarget, setJoinTarget] = useState<string | null>(null);

  const matches = useMemo(
    () =>
      db.matches.filter(
        (m) => filter === 'All' || m.mode === filter
      ),
    [db.matches, filter]
  );

  const target = db.matches.find((m) => m.id === joinTarget);
  const joined = currentUser?.joinedMatches ?? [];

  const doJoin = () => {
    if (!target) return;
    const r = joinMatch(target.id);
    toast(r.ok ? 'success' : 'error', r.message);
    if (r.ok) setJoinTarget(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      {/* hero */}
      <div className="relative mb-5 overflow-hidden rounded-2xl border border-ink-500 bg-gradient-to-br from-flame-600/30 via-ink-700 to-ink-800 p-5">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-flame-500/20 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-flame-400">
              Welcome back
            </p>
            <h2 className="font-display text-2xl font-bold text-white">
              {currentUser?.name ?? 'Player'}
            </h2>
            <p className="mt-1 text-sm text-gray-300">
              Balance: <span className="font-bold text-win-400">৳{currentUser?.balance ?? 0}</span>
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-flame-500 shadow-glow">
            <Swords size={26} className="text-white" />
          </div>
        </div>
      </div>

      {/* filters */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              filter === f
                ? 'bg-flame-500 text-white shadow-glowSoft'
                : 'bg-ink-700 text-gray-400 border border-ink-500 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* matches */}
      {matches.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          <Trophy size={32} className="mx-auto mb-2 text-gray-600" />
          No matches in this category yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {matches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              joined={joined.includes(m.id)}
              onJoin={() => setJoinTarget(m.id)}
              onOpen={() => {}}
            />
          ))}
        </div>
      )}

      {/* join modal */}
      <Modal
        open={!!target}
        onClose={() => setJoinTarget(null)}
        title="Join Match"
        size="sm"
      >
        {target && (
          <div>
            <div className="mb-4 rounded-xl bg-ink-800 p-4">
              <h4 className="font-display text-lg font-semibold text-white">
                {target.title}
              </h4>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="text-[10px] uppercase text-gray-500">Entry</div>
                  <div className="font-bold text-white">৳{target.entryFee}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-gray-500">Per Kill</div>
                  <div className="font-bold text-win-400">৳{target.perKill}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-gray-500">Prize</div>
                  <div className="font-bold text-flame-400">৳{target.prizePool}</div>
                </div>
              </div>
            </div>

            <div className="mb-4 space-y-2 rounded-xl border border-ink-500 bg-ink-800 p-4 text-sm text-gray-300">
              <p className="flex items-center gap-2 font-semibold text-white">
                <ShieldCheck size={15} className="text-win-400" /> Match Rules
              </p>
              <ul className="list-disc space-y-1 pl-5 text-xs text-gray-400">
                <li>Entry fee ৳{target.entryFee} will be deducted instantly.</li>
                <li>Per kill reward: ৳{target.perKill}.</li>
                <li>Prize pool ৳{target.prizePool} split among winners.</li>
                <li>Room ID & password will appear in "My Matches" once admin publishes.</li>
                <li>No teaming, no hacking — fair play only.</li>
              </ul>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl bg-ink-800 px-4 py-3">
              <span className="text-sm text-gray-400">Your balance</span>
              <span
                className={`font-bold ${
                  (currentUser?.balance ?? 0) >= target.entryFee
                    ? 'text-win-400'
                    : 'text-flame-400'
                }`}
              >
                ৳{currentUser?.balance ?? 0}
              </span>
            </div>

            {(currentUser?.balance ?? 0) < target.entryFee ? (
              <div className="rounded-xl border border-flame-500/40 bg-flame-500/10 p-3 text-center text-sm text-flame-400">
                Insufficient balance. Please add money from the Wallet tab.
              </div>
            ) : (
              <button onClick={doJoin} className="btn-flame w-full py-3">
                <Coins size={16} /> Confirm & Pay ৳{target.entryFee}
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
