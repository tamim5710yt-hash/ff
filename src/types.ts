export type Role = 'user' | 'admin';
export type MatchMap = 'Bermuda' | 'Kalahari' | 'Purgatory';
export type MatchMode = 'Solo' | 'Duo' | 'Squad';
export type MatchStatus = 'Upcoming' | 'Live' | 'Completed';
export type TxType = 'Deposit' | 'Withdrawal' | 'EntryFee';
export type TxMethod = 'bKash' | 'Nagad';
export type TxStatus = 'Pending' | 'Approved' | 'Rejected';

export interface User {
  id: string;
  name: string;
  phone: string;
  password: string;
  balance: number;
  inGameName: string;
  inGameUID: string;
  role: Role;
  joinedMatches: string[];
  totalKills: number;
  totalMatches: number;
}

export interface Match {
  id: string;
  title: string;
  map: MatchMap;
  mode: MatchMode;
  entryFee: number;
  prizePool: number;
  perKill: number;
  totalSlots: number;
  joinedSlots: number;
  startTime: string;
  status: MatchStatus;
  roomId: string;
  roomPassword: string;
  participants: string[];
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: TxType;
  amount: number;
  method: TxMethod;
  trxId: string;
  status: TxStatus;
  timestamp: string;
}

export interface DB {
  users: User[];
  matches: Match[];
  transactions: Transaction[];
  currentUserId: string | null;
  isAdmin: boolean;
}
