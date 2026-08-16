import { useMemo, useState } from 'react';
import { useApp } from '@/context';
import Modal from '@/components/Modal';
import { toast } from '@/components/Toast';
import { TxStatusBadge } from '@/components/Badges';
import type { TxMethod } from '@/types';
import { Wallet, Plus, Minus, ArrowDownLeft, ArrowUpRight, Coins } from 'lucide-react';

export default function WalletScreen() {
  const { db, currentUser, deposit, withdraw } = useApp();
  const [depOpen, setDepOpen] = useState(false);
  const [wdOpen, setWdOpen] = useState(false);

  const [depAmount, setDepAmount] = useState('');
  const [depMethod, setDepMethod] = useState<TxMethod>('bKash');
  const [depTrx, setDepTrx] = useState('');
  const [wdAmount, setWdAmount] = useState('');
  const [wdMethod, setWdMethod] = useState<TxMethod>('bKash');
  const [wdNumber, setWdNumber] = useState('');

  const myTx = useMemo(
    () =>
      db.transactions
        .filter((t) => t.userId === currentUser?.id)
        .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)),
    [db.transactions, currentUser?.id]
  );

  const submitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = deposit(Number(depAmount) || 0, depMethod, depTrx);
    toast(r.ok ? 'success' : 'error', r.message);
    if (r.ok) {
      setDepOpen(false);
      setDepAmount('');
      setDepTrx('');
    }
  };

  const submitWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const r = withdraw(Number(wdAmount) || 0, wdMethod, wdNumber);
    toast(r.ok ? 'success' : 'error', r.message);
    if (r.ok) {
      setWdOpen(false);
      setWdAmount('');
      setWdNumber('');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      <h2 className="mb-4 font-display text-2xl font-bold text-white">Wallet</h2>

      {/* balance card */}
      <div className="relative mb-5 overflow-hidden rounded-2xl border border-flame-500/30 bg-gradient-to-br from-ink-700 to-ink-800 p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-flame-500/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <Wallet size={14} /> Total Balance
          </div>
          <div className="mt-1 font-display text-4xl font-bold text-white">
            ৳{currentUser?.balance ?? 0}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setDepOpen(true)}
              className="btn-win flex-1 py-3 text-sm"
            >
              <Plus size={16} /> Add Money
            </button>
            <button
              onClick={() => setWdOpen(true)}
              className="btn-ghost flex-1 py-3 text-sm"
            >
              <Minus size={16} /> Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* history */}
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Transaction History
      </h3>
      {myTx.length === 0 ? (
        <div className="card p-8 text-center text-gray-400">
          <Coins size={28} className="mx-auto mb-2 text-gray-600" />
          No transactions yet.
        </div>
      ) : (
        <div className="space-y-2">
          {myTx.map((t) => {
            const incoming = t.type === 'Deposit';
            const sign = incoming ? '+' : '-';
            const color =
              t.type === 'Deposit'
                ? 'text-win-400'
                : t.type === 'Withdrawal'
                ? 'text-flame-400'
                : 'text-warn-400';
            return (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-ink-500 bg-ink-700 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      incoming
                        ? 'bg-win-500/15 text-win-400'
                        : 'bg-flame-500/15 text-flame-400'
                    }`}
                  >
                    {incoming ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.type}</div>
                    <div className="text-xs text-gray-500">
                      {t.method} · {new Date(t.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`font-bold ${color}`}>
                    {sign}৳{t.amount}
                  </span>
                  <TxStatusBadge status={t.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* deposit modal */}
      <Modal open={depOpen} onClose={() => setDepOpen(false)} title="Add Money" size="sm">
        <form onSubmit={submitDeposit} className="space-y-4">
          <div className="rounded-xl border border-info-500/30 bg-info-500/5 p-4 text-sm">
            <p className="mb-2 font-semibold text-info-400">Send money to:</p>
            <div className="space-y-1 text-gray-300">
              <div>bKash Personal: <span className="font-mono font-bold text-white">01711-223344</span></div>
              <div>Nagad Personal: <span className="font-mono font-bold text-white">01899-887766</span></div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Send the amount, then enter the TrxID below. Your deposit will be
              approved by admin.
            </p>
          </div>

          <div>
            <label className="label">Method</label>
            <div className="flex gap-2">
              {(['bKash', 'Nagad'] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setDepMethod(m)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition ${
                    depMethod === m
                      ? 'border-flame-500 bg-flame-500/15 text-flame-400'
                      : 'border-ink-500 bg-ink-800 text-gray-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Amount (৳)</label>
            <input
              type="number"
              className="input"
              placeholder="100"
              value={depAmount}
              onChange={(e) => setDepAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Transaction ID (TrxID)</label>
            <input
              className="input"
              placeholder="e.g. 8F9K2L1M7Q"
              value={depTrx}
              onChange={(e) => setDepTrx(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-flame w-full py-3">
            Submit Deposit Request
          </button>
        </form>
      </Modal>

      {/* withdraw modal */}
      <Modal open={wdOpen} onClose={() => setWdOpen(false)} title="Withdraw" size="sm">
        <form onSubmit={submitWithdraw} className="space-y-4">
          <div className="rounded-xl bg-ink-800 px-4 py-3 text-sm text-gray-300">
            Available balance:{' '}
            <span className="font-bold text-win-400">৳{currentUser?.balance ?? 0}</span>
          </div>
          <div>
            <label className="label">Method</label>
            <div className="flex gap-2">
              {(['bKash', 'Nagad'] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setWdMethod(m)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition ${
                    wdMethod === m
                      ? 'border-flame-500 bg-flame-500/15 text-flame-400'
                      : 'border-ink-500 bg-ink-800 text-gray-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Amount (৳) — minimum ৳50</label>
            <input
              type="number"
              className="input"
              placeholder="100"
              value={wdAmount}
              onChange={(e) => setWdAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Your {wdMethod} Number</label>
            <input
              className="input"
              placeholder="01XXXXXXXXX"
              value={wdNumber}
              onChange={(e) => setWdNumber(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-flame w-full py-3">
            Submit Withdrawal Request
          </button>
        </form>
      </Modal>
    </div>
  );
}
