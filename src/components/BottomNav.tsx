import { Home, Swords, Wallet, User } from 'lucide-react';

export type UserTab = 'home' | 'mymatches' | 'wallet' | 'profile';

interface Props {
  active: UserTab;
  onChange: (t: UserTab) => void;
}

const items = [
  { id: 'home' as const, label: 'Home', Icon: Home },
  { id: 'mymatches' as const, label: 'My Matches', Icon: Swords },
  { id: 'wallet' as const, label: 'Wallet', Icon: Wallet },
  { id: 'profile' as const, label: 'Profile', Icon: User },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-500 bg-ink-800/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="no-tap-highlight flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  on
                    ? 'bg-flame-500 text-white shadow-glowSoft'
                    : 'text-gray-500'
                }`}
              >
                <Icon size={18} />
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  on ? 'text-flame-400' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
