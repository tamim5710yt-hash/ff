import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  DB,
  Match,
  MatchMode,
  MatchStatus,
  Transaction,
  TxMethod,
  TxType,
  User,
} from '@/types';
import { loadDB, saveDB, uid, now } from '@/store';

interface Result {
  ok: boolean;
  message: string;
}

interface Ctx {
  db: DB;
  currentUser: User | null;
  // auth
  login: (phone: string, password: string) => Result;
  signup: (data: {
    name: string;
    phone: string;
    password: string;
    inGameName: string;
    inGameUID: string;
  }) => Result;
  loginAdmin: (username: string, password: string) => Result;
  logout: () => void;
  exitAdmin: () => void;
  // matches
  createMatch: (m: Omit<Match, 'id' | 'joinedSlots' | 'status' | 'roomId' | 'roomPassword' | 'participants'>) => void;
  updateMatch: (id: string, patch: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  setMatchStatus: (id: string, status: MatchStatus) => void;
  setRoomInfo: (id: string, roomId: string, roomPassword: string) => void;
  joinMatch: (matchId: string) => Result;
  // wallet
  deposit: (amount: number, method: TxMethod, trxId: string) => Result;
  withdraw: (amount: number, method: TxMethod, number: string) => Result;
  approveTx: (txId: string) => void;
  rejectTx: (txId: string) => void;
  // users
  updateUserBalance: (userId: string, balance: number) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => loadDB());

  useEffect(() => {
    saveDB(db);
  }, [db]);

  const currentUser = useMemo(
    () => db.users.find((u) => u.id === db.currentUserId) ?? null,
    [db.users, db.currentUserId]
  );

  const login = useCallback(
    (phone: string, password: string): Result => {
      const u = db.users.find(
        (x) => x.phone === phone && x.password === password && x.role === 'user'
      );
      if (!u) return { ok: false, message: 'Invalid phone or password' };
      setDb((d) => ({ ...d, currentUserId: u.id, isAdmin: false }));
      return { ok: true, message: 'Welcome back!' };
    },
    [db.users]
  );

  const signup = useCallback(
    (data: {
      name: string;
      phone: string;
      password: string;
      inGameName: string;
      inGameUID: string;
    }): Result => {
      if (db.users.some((x) => x.phone === data.phone))
        return { ok: false, message: 'Phone already registered' };
      const u: User = {
        id: uid('u'),
        name: data.name,
        phone: data.phone,
        password: data.password,
        balance: 0,
        inGameName: data.inGameName,
        inGameUID: data.inGameUID,
        role: 'user',
        joinedMatches: [],
        totalKills: 0,
        totalMatches: 0,
      };
      setDb((d) => ({
        ...d,
        users: [...d.users, u],
        currentUserId: u.id,
        isAdmin: false,
      }));
      return { ok: true, message: 'Account created!' };
    },
    [db.users]
  );

  const loginAdmin = useCallback(
    (username: string, password: string): Result => {
      const u = db.users.find(
        (x) =>
          x.role === 'admin' &&
          x.name === username &&
          x.password === password
      );
      if (!u) return { ok: false, message: 'Invalid admin credentials' };
      setDb((d) => ({ ...d, isAdmin: true, currentUserId: u.id }));
      return { ok: true, message: 'Admin mode' };
    },
    [db.users]
  );

  const logout = useCallback(() => {
    setDb((d) => ({ ...d, currentUserId: null, isAdmin: false }));
  }, []);

  const exitAdmin = useCallback(() => {
    setDb((d) => ({ ...d, isAdmin: false, currentUserId: null }));
  }, []);

  const createMatch = useCallback<Ctx['createMatch']>((m) => {
    setDb((d) => ({
      ...d,
      matches: [
        ...d.matches,
        {
          ...m,
          id: uid('m'),
          joinedSlots: 0,
          status: 'Upcoming',
          roomId: '',
          roomPassword: '',
          participants: [],
        },
      ],
    }));
  }, []);

  const updateMatch = useCallback<Ctx['updateMatch']>((id, patch) => {
    setDb((d) => ({
      ...d,
      matches: d.matches.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  }, []);

  const deleteMatch = useCallback<Ctx['deleteMatch']>((id) => {
    setDb((d) => ({
      ...d,
      matches: d.matches.filter((m) => m.id !== id),
    }));
  }, []);

  const setMatchStatus = useCallback<Ctx['setMatchStatus']>((id, status) => {
    setDb((d) => ({
      ...d,
      matches: d.matches.map((m) => (m.id === id ? { ...m, status } : m)),
    }));
  }, []);

  const setRoomInfo = useCallback<Ctx['setRoomInfo']>(
    (id, roomId, roomPassword) => {
      setDb((d) => ({
        ...d,
        matches: d.matches.map((m) =>
          m.id === id ? { ...m, roomId, roomPassword } : m
        ),
      }));
    },
    []
  );

  const joinMatch = useCallback<Ctx['joinMatch']>(
    (matchId) => {
      const user = db.users.find((u) => u.id === db.currentUserId);
      const match = db.matches.find((m) => m.id === matchId);
      if (!user || !match) return { ok: false, message: 'Error' };
      if (user.joinedMatches.includes(matchId))
        return { ok: false, message: 'Already joined' };
      if (match.joinedSlots >= match.totalSlots)
        return { ok: false, message: 'Slots full' };
      if (user.balance < match.entryFee)
        return {
          ok: false,
          message: `Need ৳${match.entryFee - user.balance} more`,
        };

      const tx: Transaction = {
        id: uid('t'),
        userId: user.id,
        userName: user.name,
        type: 'EntryFee',
        amount: match.entryFee,
        method: 'bKash',
        trxId: 'auto',
        status: 'Approved',
        timestamp: now(),
      };

      setDb((d) => ({
        ...d,
        users: d.users.map((u) =>
          u.id === user.id
            ? {
                ...u,
                balance: u.balance - match.entryFee,
                joinedMatches: [...u.joinedMatches, matchId],
                totalMatches: u.totalMatches + 1,
              }
            : u
        ),
        matches: d.matches.map((m) =>
          m.id === matchId
            ? {
                ...m,
                joinedSlots: m.joinedSlots + 1,
                participants: [...m.participants, user.id],
              }
            : m
        ),
        transactions: [tx, ...d.transactions],
      }));
      return { ok: true, message: 'Joined successfully!' };
    },
    [db.users, db.matches, db.currentUserId]
  );

  const deposit = useCallback<Ctx['deposit']>(
    (amount, method, trxId) => {
      const user = db.users.find((u) => u.id === db.currentUserId);
      if (!user) return { ok: false, message: 'Login required' };
      if (amount < 20)
        return { ok: false, message: 'Minimum deposit ৳20' };
      if (!trxId.trim()) return { ok: false, message: 'TrxID required' };
      const tx: Transaction = {
        id: uid('t'),
        userId: user.id,
        userName: user.name,
        type: 'Deposit',
        amount,
        method,
        trxId,
        status: 'Pending',
        timestamp: now(),
      };
      setDb((d) => ({ ...d, transactions: [tx, ...d.transactions] }));
      return { ok: true, message: 'Deposit submitted for approval' };
    },
    [db.users, db.currentUserId]
  );

  const withdraw = useCallback<Ctx['withdraw']>(
    (amount, method, number) => {
      const user = db.users.find((u) => u.id === db.currentUserId);
      if (!user) return { ok: false, message: 'Login required' };
      if (amount < 50) return { ok: false, message: 'Min withdraw ৳50' };
      if (amount > user.balance)
        return { ok: false, message: 'Insufficient balance' };
      if (!number.trim()) return { ok: false, message: 'Number required' };
      const tx: Transaction = {
        id: uid('t'),
        userId: user.id,
        userName: user.name,
        type: 'Withdrawal',
        amount,
        method,
        trxId: number,
        status: 'Pending',
        timestamp: now(),
      };
      setDb((d) => ({ ...d, transactions: [tx, ...d.transactions] }));
      return { ok: true, message: 'Withdrawal submitted' };
    },
    [db.users, db.currentUserId]
  );

  const approveTx = useCallback<Ctx['approveTx']>((txId) => {
    setDb((d) => {
      const tx = d.transactions.find((t) => t.id === txId);
      if (!tx || tx.status !== 'Pending') return d;
      const users = d.users.map((u) => {
        if (u.id !== tx.userId) return u;
        if (tx.type === 'Deposit') return { ...u, balance: u.balance + tx.amount };
        if (tx.type === 'Withdrawal')
          return { ...u, balance: Math.max(0, u.balance - tx.amount) };
        return u;
      });
      return {
        ...d,
        users,
        transactions: d.transactions.map((t) =>
          t.id === txId ? { ...t, status: 'Approved' } : t
        ),
      };
    });
  }, []);

  const rejectTx = useCallback<Ctx['rejectTx']>((txId) => {
    setDb((d) => ({
      ...d,
      transactions: d.transactions.map((t) =>
        t.id === txId ? { ...t, status: 'Rejected' } : t
      ),
    }));
  }, []);

  const updateUserBalance = useCallback<Ctx['updateUserBalance']>(
    (userId, balance) => {
      setDb((d) => ({
        ...d,
        users: d.users.map((u) =>
          u.id === userId ? { ...u, balance: Math.max(0, balance) } : u
        ),
      }));
    },
    []
  );

  const value: Ctx = {
    db,
    currentUser,
    login,
    signup,
    loginAdmin,
    logout,
    exitAdmin,
    createMatch,
    updateMatch,
    deleteMatch,
    setMatchStatus,
    setRoomInfo,
    joinMatch,
    deposit,
    withdraw,
    approveTx,
    rejectTx,
    updateUserBalance,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export type { MatchMode };
