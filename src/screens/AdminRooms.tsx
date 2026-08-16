import { useState } from 'react';
import { useApp } from '@/context';
import { toast } from '@/components/Toast';
import { StatusBadge } from '@/components/Badges';
import { KeyRound, Users } from 'lucide-react';

export default function AdminRooms() {
  const { db, setRoomInfo } = useApp();
  const upcoming = db.matches.filter(
    (m) => m.status === 'Upcoming' || m.status === 'Live'
  );
  const [selected, setSelected] = useState<string>(upcoming[0]?.id ?? '');
  const [roomId, setRoomId] = useState('');
  const [roomPass, setRoomPass] = useState('');

  const match = db.matches.find((m) => m.id === selected);

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;
    if (!roomId.trim() || !roomPass.trim()) {
      toast('error', 'Room ID and Password required');
      return;
    }
    setRoomInfo(match.id, roomId, roomPass);
    toast('success', 'Room info published — players can now see it');
    setRoomId('');
    setRoomPass('');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      <h2 className="mb-4 font-display text-2xl font-bold text-white">Room ID Distribution</h2>

      {upcoming.length === 0 ? (
        <div className="card p-8 text-center text-gray-400">
          No upcoming matches. Create one first.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* match list */}
          <div className="space-y-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Select a match
            </p>
            {upcoming.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelected(m.id);
                  setRoomId(m.roomId);
                  setRoomPass(m.roomPassword);
                }}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected === m.id
                    ? 'border-flame-500 bg-flame-500/10'
                    : 'border-ink-500 bg-ink-700 hover:border-ink-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{m.title}</h3>
                  <StatusBadge status={m.status} />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {m.map} · {m.mode} · {m.joinedSlots}/{m.totalSlots} joined
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Users size={11} /> {m.participants.length} participants
                </p>
                {m.roomId && (
                  <p className="mt-1 text-xs text-win-400">
                    Room ID already set: {m.roomId}
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* form */}
          <div className="card p-5">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <KeyRound size={16} className="text-flame-400" /> Publish Room Info
            </p>
            {match ? (
              <form onSubmit={publish} className="space-y-4">
                <div className="rounded-xl bg-ink-800 px-4 py-3 text-sm text-gray-300">
                  For match: <span className="font-semibold text-white">{match.title}</span>
                </div>
                <div>
                  <label className="label">Room ID</label>
                  <input className="input" placeholder="e.g. 541209" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                </div>
                <div>
                  <label className="label">Room Password</label>
                  <input className="input" placeholder="e.g. ff2026" value={roomPass} onChange={(e) => setRoomPass(e.target.value)} />
                </div>
                <button type="submit" className="btn-flame w-full py-3">
                  Publish to Players
                </button>
                <p className="text-center text-xs text-gray-500">
                  Joined players will see this in their "My Matches" screen.
                </p>
              </form>
            ) : (
              <p className="text-sm text-gray-400">Select a match to publish room info.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
