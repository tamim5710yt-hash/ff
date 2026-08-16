interface Props {
  value: number;
  max: number;
  className?: string;
}

export default function SlotBar({ value, max, className = '' }: Props) {
  const pct = Math.min(100, (value / max) * 100);
  const full = value >= max;
  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-gray-400">Slots filled</span>
        <span className={full ? 'font-bold text-flame-400' : 'font-bold text-white'}>
          {value}/{max}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-600">
        <div
          className={`h-full rounded-full transition-all ${
            full ? 'bg-flame-500' : 'bg-gradient-to-r from-win-500 to-win-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
