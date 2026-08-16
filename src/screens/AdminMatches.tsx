import { useState } from 'react';
import { useApp } from '@/context';
import Modal from '@/components/Modal';
import { toast } from '@/components/Toast';
import { StatusBadge } from '@/components/Badges';
import type { Match, MatchMap, MatchMode, MatchStatus } from '@/types';
import { Plus, Pencil, Trash2, Radio, CheckCircle2, X } from 'lucide-react';

const maps: MatchMap[] = ['Bermuda', 'Kalahari', 'Purgatory'];
const modes: MatchMode[] = ['Solo', 'Duo', 'Squad'];

export default function AdminMatches() {
  const { db, createMatch, updateMatch, deleteMatch, setMatchStatus } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Match | null>(null);

  const blank = {
    title: '',
    map: 'Bermuda' as MatchMap,
    mode: 'Squad' as MatchMode,
    entryFee: 50,
    prizePool: 1000,
    perKill: 20,
    totalSlots: 48,
    startTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16),
  };
  const [f, setF] = useState(blank);

  const openCreate = () => {
    setEditing(null);
    setF(blank);
    setFormOpen(true);
  };

  const openEdit = (m: Match) => {
    setEditing(m);
    setF({
      title: m.title,
      map: m.map,
      mode: m.mode,
      entryFee: m.entryFee,
      prizePool: m.prizePool,
      perKill: m.perKill,
      totalSlots: m.totalSlots,
      startTime: m.startTime.slice(0, 16),
    });
    setFormOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) {
      toast('error', 'Title required');
      return;
    }
    const payload = {
      title: f.title,
      map: f.map,
      mode: f.mode,
      entryFee: Number(f.entryFee) || 0,
      prizePool: Number(f.prizePool) || 0,
      perKill: Number(f.perKill) || 0,
      totalSlots: Number(f.totalSlots) || 0,
      startTime: new Date(f.startTime).toISOString(),
    };
    if (editing) {
      updateMatch(editing.id, payload);
      toast('success', 'Match updated');
    } else {
      createMatch(payload);
      toast('success', 'Match created');
    }
    setFormOpen(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-white">Match Management</h2>
        <button onClick={openCreate} className="btn-flame px-4 py-2.5 text-sm">
          <Plus size={16} /> Create Match
        </button>
      </div>

      <div className="space-y-3">
        {db.matches.map((m) => (
          <div key={m.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-white">{m.title}</h3>
                  <StatusBadge status={m.status} />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {m.map} · {m.mode} · ৳{m.entryFee} entry · ৳{m.prizePool} prize · {m.joinedSlots}/{m.totalSlots} joined
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {new Date(m.startTime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {m.status !== 'Live' && (
                  <button
                    onClick={() => { setMatchStatus(m.id, 'Live'); toast('success', 'Match is now LIVE'); }}
                    className="btn-ghost px-3 py-2 text-xs"
                  >
                    <Radio size={13} /> Set Live
                  </button>
                )}
                {m.status !== 'Completed' && (
                  <button
                    onClick={() => { setMatchStatus(m.id, 'Completed'); toast('success', 'Match completed'); }}
                    className="btn-ghost px-3 py-2 text-xs"
                  >
                    <CheckCircle2 size={13} /> Complete
                  </button>
                )}
                <button onClick={() => openEdit(m)} className="btn-ghost px-3 py-2 text-xs">
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${m.title}"?`)) {
                      deleteMatch(m.id);
                      toast('info', 'Match deleted');
                    }
                  }}
                  className="btn px-3 py-2 text-xs bg-flame-500/15 text-flame-400 hover:bg-flame-500/25"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Match' : 'Create Match'}
        size="lg"
      >
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Match title" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Map</label>
              <select className="input" value={f.map} onChange={(e) => setF({ ...f, map: e.target.value as MatchMap })}>
                {maps.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Mode</label>
              <select className="input" value={f.mode} onChange={(e) => setF({ ...f, mode: e.target.value as MatchMode })}>
                {modes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Entry Fee (৳)</label>
              <input type="number" className="input" value={f.entryFee} onChange={(e) => setF({ ...f, entryFee: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Prize Pool (৳)</label>
              <input type="number" className="input" value={f.prizePool} onChange={(e) => setF({ ...f, prizePool: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Per Kill (৳)</label>
              <input type="number" className="input" value={f.perKill} onChange={(e) => setF({ ...f, perKill: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Total Slots</label>
              <input type="number" className="input" value={f.totalSlots} onChange={(e) => setF({ ...f, totalSlots: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Date & Time</label>
              <input type="datetime-local" className="input" value={f.startTime} onChange={(e) => setF({ ...f, startTime: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-flame w-full py-3">
            {editing ? 'Save Changes' : 'Create Match'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
