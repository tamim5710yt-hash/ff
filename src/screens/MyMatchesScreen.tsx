import { useMemo, useState } from 'react';
import { useApp } from '@/context';
import MatchCard from '@/components/MatchCard';
import Modal from '@/components/Modal';
import { toast } from '@/components/Toast';
import { KeyRound, Copy, Eye, EyeOff, Gamepad2 } from 'lucide-react';

export default function MyMatchesScreen() {
  const { db, currentUser } = useApp();
  const [tab, setTab] = useState<'Upcoming' | 'Completed'>('Upcoming');
  const [roomTarget, setRoomTarget] = useState<string | null>(null);

  const joined = currentUser?.joinedMatches ?? [];
  const myMatches = useMemo(
    () => db.matches.filter((m) => joined.includes(m.id)),
    [db.matches, joined]
  );

  const filtered = myMatches.filter((m) =>
    tab === 'Upcoming'
      ? m.status === 'Upcoming' || m.status === 'Live'
      : m.status === 'Completed'
  );

  const target = db.matches.find((m) => m.id === roomTarget);

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      <h2 className="mb-4 font-display text-2xl font-bold text-white">My Matches</h2>

      <div className="mb-5 flex gap-1 rounded-xl bg-ink-800 p-1">
        {(['Upcoming', 'Completed'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              tab === t
                ? 'bg-flame-500 text-white shadow-glowSoft'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          <Gamepad2 size={32} className="mx-auto mb-2 text-gray-600" />
          No {tab.toLowerCase()} matches. Join one from the Home tab.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              joined
              onOpen={() => setRoomTarget(m.id)}
            />
          ))}
        </div>
      )}

      {/* room info modal */}
      <Modal
        open={!!target}
        onClose={() => setRoomTarget(null)}
        title="Room Information"
        size="sm"
      >
        {target && (
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-white">
              {target.title}
            </h4>
            {target.roomId && target.roomPassword ? (
              <div className="space-y-3">
                <RoomRow label="Room ID" value={target.roomId} />
                <RoomRow label="Password" value={target.roomPassword} secret />
                <div className="rounded-xl border border-win-500/30 bg-win-500/10 p-3 text-xs text-win-400">
                  Join the room quickly — slots may fill fast. Good luck!
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-warn-500/30 bg-warn-500/10 p-4 text-center text-sm text-warn-400">
                Room ID & Password not published yet. The admin will publish it
                before the match starts. Please check back soon.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function RoomRow({
  label,
  value,
  secret,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const [show, setShow] = useState(!secret);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value);
    toast('success', `${label} copied`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between rounded-xl bg-ink-800 px-4 py-3">
      <div>
        <div className="text-[10px] uppercase text-gray-500">{label}</div>
        <div className="font-mono text-lg font-bold text-white">
          {show ? value : '••••••'}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {secret && (
          <button
            onClick={() => setShow((s) => !s)}
            className="rounded-lg p-2 text-gray-400 hover:bg-ink-600 hover:text-white"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        <button
          onClick={copy}
          className="rounded-lg p-2 text-gray-400 hover:bg-ink-600 hover:text-flame-400"
        >
          {copied ? <KeyRound size={16} className="text-win-400" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}
