import type { Match } from '@/types';
import { MapBadge, ModeBadge, StatusBadge } from '@/components/Badges';
import SlotBar from '@/components/SlotBar';
import { Coins, Crosshair, Calendar, ChevronRight } from 'lucide-react';

interface Props {
  match: Match;
  joined?: boolean;
  onJoin?: () => void;
  onOpen?: () => void;
  actionLabel?: string;
}

export default function MatchCard({ match, joined, onJoin, onOpen, actionLabel }: Props) {
  const slotsLeft = match.totalSlots - match.joinedSlots;
  const full = slotsLeft <= 0;
  const date = new Date(match.startTime);

  return (
    <div className="card overflow-hidden transition hover:border-flame-500/40">
      <div className="relative bg-gradient-to-br from-ink-600 to-ink-800 p-4">
        <div className="absolute right-3 top-3">
          <StatusBadge status={match.status} />
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <MapBadge map={match.map} />
          <ModeBadge mode={match.mode} />
        </div>
        <h3 className="font-display text-lg font-semibold text-white">
          {match.title}
        </h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={12} />
          {date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-ink-500 border-y border-ink-500">
        <div className="px-3 py-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase text-gray-500">
            <Coins size={11} /> Entry
          </div>
          <div className="font-bold text-white">৳{match.entryFee}</div>
        </div>
        <div className="px-3 py-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase text-gray-500">
            <Crosshair size={11} /> Per Kill
          </div>
          <div className="font-bold text-win-400">৳{match.perKill}</div>
        </div>
        <div className="px-3 py-2.5 text-center">
          <div className="text-[10px] uppercase text-gray-500">Prize</div>
          <div className="font-bold text-flame-400">৳{match.prizePool}</div>
        </div>
      </div>

      <div className="p-4">
        <SlotBar value={match.joinedSlots} max={match.totalSlots} className="mb-3" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {full ? 'Slots full' : `${slotsLeft} seats left`}
          </span>
          {joined ? (
            <button onClick={onOpen} className="btn-win px-4 py-2 text-sm">
              View Room Info <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={onJoin}
              disabled={full || match.status !== 'Upcoming'}
              className="btn-flame px-4 py-2 text-sm"
            >
              {actionLabel ?? 'Join Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
