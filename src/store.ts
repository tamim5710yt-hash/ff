import type { DB, Match, Transaction, User } from '@/types';

const KEY = 'ff_tournament_db_v1';

const now = () => new Date().toISOString();
const inHours = (h: number) =>
  new Date(Date.now() + h * 3600 * 1000).toISOString();

export function seed(): DB {
  const demoUser: User = {
    id: 'u_demo',
    name: 'Demo Player',
    phone: '01700000000',
    password: 'demo123',
    balance: 500,
    inGameName: 'BD_GhostX',
    inGameUID: '88451209',
    role: 'user',
    joinedMatches: [],
    totalKills: 14,
    totalMatches: 3,
  };
  const admin: User = {
    id: 'u_admin',
    name: 'admin',
    phone: 'admin',
    password: 'admin123',
    balance: 0,
    inGameName: '',
    inGameUID: '',
    role: 'admin',
    joinedMatches: [],
    totalKills: 0,
    totalMatches: 0,
  };

  const matches: Match[] = [
    {
      id: 'm_1',
      title: 'Friday Night Squad Clash',
      map: 'Bermuda',
      mode: 'Squad',
      entryFee: 50,
      prizePool: 3000,
      perKill: 20,
      totalSlots: 48,
      joinedSlots: 32,
      startTime: inHours(3),
      status: 'Upcoming',
      roomId: '',
      roomPassword: '',
      participants: [],
    },
    {
      id: 'm_2',
      title: 'Pro Duo League — Kalahari',
      map: 'Kalahari',
      mode: 'Duo',
      entryFee: 30,
      prizePool: 1800,
      perKill: 15,
      totalSlots: 24,
      joinedSlots: 24,
      startTime: inHours(-1),
      status: 'Live',
      roomId: '541209',
      roomPassword: 'ff2026',
      participants: [],
    },
    {
      id: 'm_3',
      title: 'Solo Sniper Showdown',
      map: 'Purgatory',
      mode: 'Solo',
      entryFee: 20,
      prizePool: 1000,
      perKill: 10,
      totalSlots: 12,
      joinedSlots: 8,
      startTime: inHours(26),
      status: 'Upcoming',
      roomId: '',
      roomPassword: '',
      participants: [],
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 't_1',
      userId: 'u_demo',
      userName: 'Demo Player',
      type: 'Deposit',
      amount: 500,
      method: 'bKash',
      trxId: '8F9K2L1M7Q',
      status: 'Approved',
      timestamp: inHours(-48),
    },
  ];

  return {
    users: [demoUser, admin],
    matches,
    transactions,
    currentUserId: null,
    isAdmin: false,
  };
}

export function loadDB(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as DB;
  } catch {
    const s = seed();
    localStorage.setItem(KEY, JSON.stringify(s));
    return s;
  }
}

export function saveDB(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function resetDB(): DB {
  const s = seed();
  saveDB(s);
  return s;
}

export const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export { now };
