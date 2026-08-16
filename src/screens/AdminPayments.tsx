import { useState } from 'react';
import { useApp } from '@/context';
import { toast } from '@/components/Toast';
import { TxStatusBadge } from '@/components/Badges';
import { Check, X, Clock } from 'lucide-react';
import type { TxStatus } from '@/types';

export default function AdminPayments() {
  const { db, approveTx, rejectTx } = useApp();
  const [filter, setFilter] = useState<'Pending' | 'All'>('Pending');

  const txs = db.transactions
    .filter((t) => (filter === 'Pending' ? t.status === 'Pending' : true))
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  const act = (id: string, approve: boolean) => {
    if (approve) {
      approveTx(id);
      toast('success', 'Payment approved');
    } else {
      rejectTx(id);
      toast('info', 'Payment rejected');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-white">Payment Verification</h2>
        <div className="flex gap-1 rounded-xl bg-ink-800 p-1">
          {(['Pending', 'All'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                filter === t ? 'bg-flame-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {txs.length === 0 ? (
        <div className="card p-8 text-center text-gray-400">
          <Clock size={28} className="mx-auto mb-2 text-gray-600" />
          No {filter.toLowerCase()} transactions.
        </div>
      ) : (
        <div className="space-y-3">
          {txs.map((t) => (
            <div key={t.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{t.userName}</span>
                    <TxStatusBadge status={t.status as TxStatus} />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {t.type} · {t.method} · ৳{t.amount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.type === 'Deposit' ? 'TrxID' : 'Number'}: {t.trxId}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(t.timestamp).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                {t.status === 'Pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => act(t.id, true)}
                      className="btn-win px-4 py-2 text-xs"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => act(t.id, false)}
                      className="btn px-4 py-2 text-xs bg-flame-500/15 text-flame-400 hover:bg-flame-500/25"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">Resolved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
