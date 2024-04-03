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
        mongoose.connect('mongodb://mongo/mydatabase')
        .then(db => console.log('DB is conected to', db.connection.host))
        .catch(err => console.error('DB is not conected ', err));
    }

    start(callback: () => void) {
        this.connectDB();
        this.app.listen(this.port, callback);
    }
}