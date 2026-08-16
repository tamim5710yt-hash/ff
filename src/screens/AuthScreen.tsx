import { useState } from 'react';
import { useApp } from '@/context';
import { toast } from '@/components/Toast';
import { Flame, Phone, Lock, User, Gamepad2, Shield, ArrowLeft } from 'lucide-react';
import Modal from '@/components/Modal';

export default function AuthScreen() {
  const { login, signup, loginAdmin } = useApp();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [adminOpen, setAdminOpen] = useState(false);

  // login
  const [lPhone, setLPhone] = useState('');
  const [lPass, setLPass] = useState('');
  // signup
  const [sName, setSName] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sPass, setSPass] = useState('');
  const [sIgn, setSIgn] = useState('');
  const [sUid, setSUid] = useState('');
  // admin
  const [aUser, setAUser] = useState('');
  const [aPass, setAPass] = useState('');

  const fillDemo = () => {
    setLPhone('01700000000');
    setLPass('demo123');
  };

  const doLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const r = login(lPhone, lPass);
    toast(r.ok ? 'success' : 'error', r.message);
  };

  const doSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName || !sPhone || !sPass || !sIgn || !sUid) {
      toast('error', 'All fields are required including IGN & UID');
      return;
    }
    const r = signup({
      name: sName,
      phone: sPhone,
      password: sPass,
      inGameName: sIgn,
      inGameUID: sUid,
    });
    toast(r.ok ? 'success' : 'error', r.message);
  };

  const doAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const r = loginAdmin(aUser, aPass);
    toast(r.ok ? 'success' : 'error', r.message);
    if (r.ok) setAdminOpen(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-900 px-4 py-10">
      {/* glow background */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-flame-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-win-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-flame-500 shadow-glow">
            <Flame size={32} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-widest text-white">
            FF TOURNAMENT
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Free Fire Esports · Bangladesh
          </p>
        </div>

        <div className="card p-1.5">
          {/* tabs */}
          <div className="mb-4 flex gap-1 rounded-xl bg-ink-800 p-1">
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition ${
                  tab === t
                    ? 'bg-flame-500 text-white shadow-glowSoft'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="p-4">
            {tab === 'login' ? (
              <form onSubmit={doLogin} className="space-y-4">
                <div>
                  <label className="label">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      className="input pl-10"
                      placeholder="01XXXXXXXXX"
                      value={lPhone}
                      onChange={(e) => setLPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password"
                      className="input pl-10"
                      placeholder="••••••••"
                      value={lPass}
                      onChange={(e) => setLPass(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-flame w-full py-3">
                  Login
                </button>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="w-full text-center text-xs text-gray-400 hover:text-flame-400 transition"
                >
                  Use demo account (01700000000 / demo123)
                </button>
              </form>
            ) : (
              <form onSubmit={doSignup} className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input className="input pl-10" placeholder="Your name" value={sName} onChange={(e) => setSName(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" placeholder="01XXXXXXXXX" value={sPhone} onChange={(e) => setSPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Password</label>
                    <input type="password" className="input" placeholder="••••••" value={sPass} onChange={(e) => setSPass(e.target.value)} />
                  </div>
                </div>
                <div className="rounded-xl border border-info-500/30 bg-info-500/5 p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-info-400">
                    <Gamepad2 size={13} /> Free Fire In-Game Details (Required)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">In-Game Name (IGN)</label>
                      <input className="input" placeholder="IGN" value={sIgn} onChange={(e) => setSIgn(e.target.value)} />
                    </div>
                    <div>
                      <label className="label">In-Game UID</label>
                      <input className="input" placeholder="UID number" value={sUid} onChange={(e) => setSUid(e.target.value)} />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-flame w-full py-3">
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>

        <button
          onClick={() => setAdminOpen(true)}
          className="mx-auto mt-5 flex items-center gap-2 rounded-full border border-ink-500 bg-ink-700 px-4 py-2 text-xs font-semibold text-gray-300 hover:border-flame-500/40 hover:text-flame-400 transition"
        >
          <Shield size={14} /> Admin Login
        </button>
      </div>

      <Modal open={adminOpen} onClose={() => setAdminOpen(false)} title="Admin Login" size="sm">
        <form onSubmit={doAdmin} className="space-y-4">
          <div>
            <label className="label">Admin Username</label>
            <div className="relative">
              <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input className="input pl-10" placeholder="admin" value={aUser} onChange={(e) => setAUser(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="password" className="input pl-10" placeholder="••••••" value={aPass} onChange={(e) => setAPass(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn-flame w-full py-3">
            Enter Admin Mode
          </button>
          <button
            type="button"
            onClick={() => setAdminOpen(false)}
            className="flex w-full items-center justify-center gap-1 text-xs text-gray-400 hover:text-white"
          >
            <ArrowLeft size={12} /> Back to user login
          </button>
        </form>
      </Modal>
    </div>
  );
}
