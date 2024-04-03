export interface RootTransaction {
  transactions: Transaction[];
  removed: any[];
  lastblock: string;
}

export interface Transaction {
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
}
