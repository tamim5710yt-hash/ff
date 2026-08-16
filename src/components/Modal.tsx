import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;
  const w = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-md';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative w-full ${w} card rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slideUp`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-500 bg-ink-700/95 px-5 py-4 backdrop-blur">
            <h3 className="font-display text-lg font-semibold tracking-wide text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-ink-600 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
