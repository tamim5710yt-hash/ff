import type { MatchMap, MatchMode, MatchStatus, TxStatus } from '@/types';
import { Map, Users, User, UserPlus, Radio, CheckCircle2, Clock, XCircle } from 'lucide-react';

export function MapBadge({ map }: { map: MatchMap }) {
  return (
    <span className="badge bg-ink-600 text-info-400 border border-info-500/30">
      <Map size={11} /> {map}
    </span>
  );
}

export function ModeBadge({ mode }: { mode: MatchMode }) {
  const Icon = mode === 'Solo' ? User : mode === 'Duo' ? UserPlus : Users;
  return (
    <span className="badge bg-ink-600 text-gray-200 border border-ink-500">
      <Icon size={11} /> {mode}
    </span>
  );
}

export function StatusBadge({ status }: { status: MatchStatus }) {
  if (status === 'Live')
    return (
      <span className="badge bg-flame-500/15 text-flame-400 border border-flame-500/40 animate-pulseLive">
        <Radio size={11} /> LIVE
      </span>
    );
  if (status === 'Completed')
    return (
      <span className="badge bg-ink-600 text-gray-400 border border-ink-500">
        <CheckCircle2 size={11} /> Completed
      </span>
    );
  return (
    <span className="badge bg-win-500/15 text-win-400 border border-win-500/30">
      <Clock size={11} /> Upcoming
    </span>
  );
}

export function TxStatusBadge({ status }: { status: TxStatus }) {
  if (status === 'Approved')
    return (
      <span className="badge bg-win-500/15 text-win-400">
        <CheckCircle2 size={11} /> Approved
      </span>
    );
  if (status === 'Rejected')
    return (
      <span className="badge bg-flame-500/15 text-flame-400">
        <XCircle size={11} /> Rejected
      </span>
    );
  return (
    <span className="badge bg-warn-500/15 text-warn-400">
      <Clock size={11} /> Pending
    </span>
  );
}
