import Server from "./server/server";
import { readFile} from "fs/promises";
import { RootTransaction } from "./interfaces";


const port = 3000;
const server = Server.init(port);

server.start(async () => {
    console.log(`Server running on port ${port}`);

    let transactions: string[] = ['transactions-1.json', 'transactions-2.json'];

    for (const iterator of transactions) {
        process.stdout.write(JSON.stringify(await readData(iterator)));
    }


});

const readData: (transactionPath: string) => Promise<RootTransaction | null> = async (transactionPath: string) =>  {
    let data = null;
    try {
         data = await readFile(`src/data/${transactionPath}`, 'utf8' );
    } catch (error) {
        console.log(error);
        return null;
    }
    return data ? JSON.parse(data) as RootTransaction : null;
    
}

