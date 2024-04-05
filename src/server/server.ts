import express = require('express');
import mongoose = require('mongoose');

export default class Server {
    public app: express.Application;
    public port: number;

    constructor(puerto: any) {
        this.port = puerto;
        this.app = express();
        this.app.use(express.json());
    }
    static init(puerto: any) {
        return new Server(puerto)
    }

    private connectDB() {
       return mongoose.connect('mongodb://mongo/mydatabase');
    }

    start(callback: () => void) {
        this.connectDB().then(async db => {
            console.log('DB is conected to', db.connection.host);
            await mongoose.connection.dropDatabase();
            this.app.listen(this.port, callback);
        })
        .catch(err => console.error('DB is not conected ', err));
        
    }
}