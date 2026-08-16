import { useState } from 'react';
import { AppProvider, useApp } from '@/context';
import { toast } from '@/components/Toast';
import { ToastHost } from '@/components/Toast';
import AuthScreen from '@/screens/AuthScreen';
import TopBar from '@/components/TopBar';
import BottomNav, { type UserTab } from '@/components/BottomNav';
import HomeScreen from '@/screens/HomeScreen';
import MyMatchesScreen from '@/screens/MyMatchesScreen';
import WalletScreen from '@/screens/WalletScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import AdminPanel from '@/screens/AdminPanel';

function Shell() {
  const { currentUser, db, logout } = useApp();
  const [tab, setTab] = useState<UserTab>('home');

  if (db.isAdmin) return <AdminPanel />;
  if (!currentUser) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-ink-900">
      <TopBar />
      <main className="pb-24 md:pb-8">
        {tab === 'home' && <HomeScreen />}
        {tab === 'mymatches' && <MyMatchesScreen />}
        {tab === 'wallet' && <WalletScreen />}
        {tab === 'profile' && (
          <ProfileScreen
            onAdminLogin={() => {
              logout();
              toast('info', 'Log in as admin');
            }}
          />
        )}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
      <ToastHost />
    </AppProvider>
  );
}
