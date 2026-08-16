import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

let pushFn: ((t: ToastType, m: string) => void) | null = null;

export function toast(type: ToastType, message: string) {
  pushFn?.(type, message);
}

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    pushFn = (type, message) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, type, message }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
    };
    return () => {
      pushFn = null;
    };
  }, []);

  return (
    <div className="fixed top-4 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const Icon =
          t.type === 'success' ? CheckCircle2 : t.type === 'error' ? XCircle : Info;
        const color =
          t.type === 'success'
            ? 'border-win-500/50 text-win-400'
            : t.type === 'error'
            ? 'border-flame-500/50 text-flame-400'
            : 'border-info-500/50 text-info-400';
        return (
          <div
            key={t.id}
            className={`flex items-center gap-2 rounded-xl border bg-ink-800/95 px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur animate-slideUp ${color}`}
          >
            <Icon size={16} />
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
