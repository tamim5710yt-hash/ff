import { useMemo, useState } from 'react';
import { useApp } from '@/context';
import Modal from '@/components/Modal';
import { toast } from '@/components/Toast';
import { Search, Pencil, Gamepad2, Phone, Wallet } from 'lucide-react';
import type { User } from '@/types';

export default function AdminUsers() {
  const { db, updateUserBalance } = useApp();
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<User | null>(null);
  const [bal, setBal] = useState(0);

  const users = useMemo(() => {
    const term = q.trim().toLowerCase();
    return db.users
      .filter((u) => u.role === 'user')
      .filter(
        (u) =>
          !term ||
          u.name.toLowerCase().includes(term) ||
          u.phone.includes(term) ||
          u.inGameName.toLowerCase().includes(term) ||
          u.inGameUID.includes(term)
      );
  }, [db.users, q]);

  const openEdit = (u: User) => {
    setEdit(u);
    setBal(u.balance);
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (edit) {
      updateUserBalance(edit.id, Number(bal) || 0);
      toast('success', 'Balance updated');
      setEdit(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      <h2 className="mb-4 font-display text-2xl font-bold text-white">User Management</h2>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          className="input pl-10"
          placeholder="Search by name, phone, IGN or UID..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {users.length === 0 ? (
        <div className="card p-8 text-center text-gray-400">No users found.</div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500/15 text-lg font-bold text-flame-400">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Phone size={11} /> {u.phone}</span>
                      <span className="flex items-center gap-1"><Gamepad2 size={11} /> {u.inGameName || '—'}</span>
                      <span>UID: {u.inGameUID || '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-gray-500">Balance</div>
                    <div className="font-bold text-win-400">৳{u.balance}</div>
                  </div>
                  <button onClick={() => openEdit(u)} className="btn-ghost px-3 py-2 text-xs">
                    <Pencil size={13} /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title="Edit User Balance" size="sm">
        {edit && (
          <form onSubmit={save} className="space-y-4">
            <div className="rounded-xl bg-ink-800 px-4 py-3 text-sm text-gray-300">
              User: <span className="font-semibold text-white">{edit.name}</span> ({edit.phone})
            </div>
            <div>
              <label className="label">New Balance (৳)</label>
              <div className="relative">
                <Wallet size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  className="input pl-10"
                  value={bal}
                  onChange={(e) => setBal(Number(e.target.value))}
                />
              </div>
            </div>
            <button type="submit" className="btn-flame w-full py-3">Save Balance</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
