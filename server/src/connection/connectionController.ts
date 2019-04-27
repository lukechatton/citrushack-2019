export class ConnectionController {
    constructor() {

    }

    async init(io: SocketIO.Server) {
        console.log('connection controller init.');
    }
}

export const connectionController = new ConnectionController();