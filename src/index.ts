import Server from "./server/server";
import { readFile} from "fs/promises";
import { ListSinceBlock, Transaction } from "./interfaces";
import { CustomerModel } from "./models/customer.model";
import { ListSinceblockModel } from "./models/transaction.model";
import { CustomerInterface } from "./interfaces";
import { TransactionM } from "./models/transaction.model";
import { Types } from "mongoose";
// import { Types, isValidObjectId } from "mongoose";

const port = 3000;
const server = Server.init(port);


let stringOut = "";
let allIdsWithReference: Types.ObjectId[] = [];


server.start(async () => {
    console.log(`Server running on port ${port}`);
    

    /**
     * Read and save customer to db
     */
    try {
        await setDataCustomer();
    } catch (error) {
        console.log('Customers error when read and save ', error);  
        return;      
    }


    /**
     * Read and save deposits to db
     */
    try {
        await setDataTransactions();
    } catch (error) {
        console.log('Transactions error when read and save ', error);       
        return;       
    }

    /**
     * Read customer and deposits from db
     */
    try {
          


        /**
         * Find and print deposits with reference
         */
        await findDepositsWithReference();


        /**
         * Find and print deposits without reference
         */
        await findDepositsWithOutReference()

        /**
         * Find small valid deposits
         */
        await findSmallValidDeposit();

        /**
         * Find largest valid deposits
         */
        await findLargestValidDeposit();
        

    } catch (error) {
        console.log('Error app ', error);
        
    }

    process.stdout.write(stringOut);
});

const readDataTransactions: (transactionPath: string) => Promise<ListSinceBlock | null> = async (transactionPath: string) =>  {
    let data = null;
    try {
         data = await readFile(`src/data/${transactionPath}`, 'utf8' );
    } catch (error) {
        console.log(error);
        return null;
    }
    return data ? JSON.parse(data) as ListSinceBlock : null;
    
}
const setDataCustomer = async () => {
    const customersList: { customers: CustomerInterface[]} = JSON.parse(await readFile(`src/data/customer.json`, 'utf8' ));
    
    if (customersList) {
        return await CustomerModel.insertMany(customersList.customers)                   
    }
    return;
}


const setDataTransactions = async () => {

    let transactionsPathList = [readDataTransactions('transactions-1.json'), readDataTransactions('transactions-2.json')];

    for await (const iterator of transactionsPathList) {
        if (iterator && iterator.hasOwnProperty('transactions')) {
            iterator.transactions = iterator.transactions.filter(el => {
                if (el.hasOwnProperty('confirmations') && typeof(el.confirmations ) === 'number') {
                    return el.confirmations > 6
                }
                return false;
            });


            const listSinceBlockModel = new ListSinceblockModel({removed: iterator.removed, lastblock: iterator.lastblock});

            const listSinceBlockSave =  await listSinceBlockModel.save();

            iterator.transactions = iterator.transactions.map(el => {
                el.listsinceblock = listSinceBlockSave._id;
                return el;
            });

            
            const transactionM = await TransactionM.insertMany(iterator.transactions);                     
            transactionM.forEach(async transaction => {
                await CustomerModel.updateOne({ address : { $eq : transaction.address }}, {
                    $push: {
                        transactionsref: transaction._id
                    }
                }).exec();
                await ListSinceblockModel.findByIdAndUpdate(listSinceBlockSave._id, {
                    $push: {
                        transactions: transaction._id
                    }
                }).exec();
            });
        }
    }
}

const findDepositsWithReference = async () => {
    const customers = await CustomerModel
    .find({})
    .populate('transactionsCount')
    .populate('transactionsref')
    .exec();


    customers.forEach(async cs => {
        if (cs.transactionsref && cs.transactionsref.length > 0) {
            const idsList = cs.transactionsref.map((ts) => (ts as Transaction)._id );               
            allIdsWithReference.push(...idsList);                
        }
        const totalSum = (cs.transactionsref as any[]).reduce((acc, doc) => acc + doc.amount, 0);
        stringOut =  stringOut + `Deposited for ${cs.name}: count=${cs.transactionsCount} sum=${ totalSum } \n`;
    });

    return;
}

const findDepositsWithOutReference = async () => {
    const transactionsWithoutReference = await TransactionM.find({'_id' : { $nin: allIdsWithReference}}).exec();
    const totalSumWithoutReference = transactionsWithoutReference.reduce((acc, doc) => acc + doc.amount, 0);
    stringOut =  stringOut + `Deposited without reference: count=${transactionsWithoutReference.length} sum=${ totalSumWithoutReference } \n`;
    return;
}

const findSmallValidDeposit = async () => {
    const smallValidDeposit = await TransactionM.findOne({}).sort({ amount: -1 }).limit(1).select('amount').exec();       
    stringOut =  stringOut + `Smallest valid deposit: ${ smallValidDeposit?.amount } \n`;
    return;
}

const findLargestValidDeposit = async () => {
    const largestValidDeposit = await TransactionM.findOne({}).sort({ amount: 1 }).limit(1).select('amount').exec();
    stringOut =  stringOut + `Largest valid deposit: ${ largestValidDeposit?.amount } \n`;        
    return;
}

