import { ListSinceBlock, Transaction } from '../interfaces';
import { Schema, Model, model } from 'mongoose';



export let TransactionSchema: Schema = new Schema({
    involvesWatchonly: Boolean,
    account: String,
    address: String,
    category: String,
    amount: Number,
    label: String,
    confirmations: Number,
    blockhash: String,
    blockindex: Number,
    blocktime: Number,
    txid: String,
    vout: Number,
    walletconflicts: Array,
    time: Number,
    timereceived: Number,
    'bip125-replaceable': String,
    listsinceblock: { type: Schema.Types.ObjectId, ref: 'listsinceblock' },
});

const listsinceblockSchema: Schema = new Schema({
    transactions: [{ type: Schema.Types.ObjectId, ref: 'listransaction' }],
    removed: [],
    lastblock: String,
});

export const ListSinceblockModel: Model<ListSinceBlock> = model<ListSinceBlock>("listsinceblock", listsinceblockSchema);
export const TransactionM: Model<Transaction> = model<Transaction>("listransaction", TransactionSchema);
