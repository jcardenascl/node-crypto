import { Document, Types } from "mongoose";

export interface ListSinceBlock extends Document {
  transactions: Transaction[];
  removed: any[];
  lastblock: string;
}

export interface Transaction extends Document {
  involvesWatchonly: boolean;
  account: string;
  address: string;
  category: string;
  amount: number;
  label: string;
  confirmations: number;
  blockhash: string;
  blockindex: number;
  blocktime: number;
  txid: string;
  vout: number;
  walletconflicts: any[];
  time: number;
  timereceived: number;
  'bip125-replaceable': string;
  listsinceblock: Types.ObjectId;
}

export interface CustomerInterface extends Document {
  name: string;
  address: string;
  transactionsref: Types.ObjectId[] | Transaction[];
  transactionsCount?: number;
}
