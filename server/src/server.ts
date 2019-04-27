require('dotenv').config();

import * as express from 'express';
import { connectionController } from './connection/connectionController';

const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

let server = require('http').createServer(app);
let io = require('socket.io')(server);
io.set('origins', '*:*');

connectionController.init(io)
    .then(() => {
        const port = process.env.PORT || 3002;
        server.listen(port, () => {
            console.log('socket server started on port ' + port + '.');
        });
    })
    .catch(err => {
        console.error('Failed to initialize socket app:', err);
        process.exit(1);
    })

export default io;