import { CustomerInterface } from '../interfaces';
import { Schema, Model, model } from 'mongoose';



export let CustomerSchema: Schema = new Schema({
    name: String,
    address: String,
    transactionsref: [{ type: Schema.Types.ObjectId, ref: 'listransaction' }],
});

CustomerSchema.virtual('transactionsCount', {
    ref: 'listransaction',
    localField: 'transactionsref',
    foreignField: '_id',
    justOne: false,
    count: true,
});





export const CustomerModel: Model<CustomerInterface> = model<CustomerInterface>("customer", CustomerSchema);
