import GamePlayer from "../game/GamePlayer";
import { GameController } from "../game/gameController";

export class ConnectionController {
    players: GamePlayer[] = [];
    gameController: GameController;
    io: SocketIO.Server;

    constructor() {

    }

    async init(io: SocketIO.Server) {
        console.log('connection controller init.');
        this.io = io;
        
        this.gameController = new GameController(io);

        io.on('connection', (client: GamePlayer) => {
            client.on('login', async ({ deviceId }) => {
                client.user = {
                    deviceId: deviceId,
                    name: "Player" + (this.players.length + 1)
                }
                client.score = 0;
                client.completedItems = [];
                this.players.push(client);

                this.emitPlayerList();

                console.log(client.user.name + ' connected (' + this.players.length + ' total).');

                // start after connect for testing
                // await this.gameController.start();
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

            client.on('trigger-start', async () => {
                await this.gameController.start();
                console.log('Started game!');
            });

            client.on('change-username', name => {
                client.user.name = name;
                this.emitPlayerList();
            });
        });
    }

    emitPlayerList() {
        let response = [];
        for(let player of this.players) {
            response.push(player.user);
        }
        this.io.emit('player-list', {
            players: response
        });
    }
}

export const connectionController = new ConnectionController();