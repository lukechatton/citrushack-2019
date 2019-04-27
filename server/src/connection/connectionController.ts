import GamePlayer from "../game/GamePlayer";

export class ConnectionController {
    players: GamePlayer[] = [];

    constructor() {

    }

    async init(io: SocketIO.Server) {
        console.log('connection controller init.');

        io.on('connection', (client: GamePlayer) => {
            client.on('login', ({ deviceId }) => {
                client.user = {
                    deviceId: deviceId,
                    name: "Player" + (this.players.length + 1)
                }
                client.score = 0;
                client.completedItems = [];
                this.players.push(client);

                console.log(client.use.name + ' connected (' + this.players.length + ' total).');
            });

            client.on('disconnect', () => {
                if(client.user) {
                    let index = this.players.indexOf(client);
                    if (index > -1) {
                        this.players.splice(this.players.indexOf(client), 1);   
                    }
                    console.log(client.user.name + ' disconnected.');
                }
            });
        })
    }
}

export const connectionController = new ConnectionController();