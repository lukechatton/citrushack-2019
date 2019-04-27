import GamePlayer from "./GamePlayer";
import { connectionController } from "../connection/connectionController";
import ScavengerItem from "./ScavengerItem";
import { itemList } from "./items";

const ITEM_COUNT = 5;


export class GameController {
    players: GamePlayer[] = [];
    items: ScavengerItem[] = [];

    constructor(
        public io: SocketIO.Server
    ) {

    }

    async start() {
        // reset player scores
        for(let player of connectionController.players) {
            player.score = 0;
            player.completedItems = [];
        }

        // randomly generate item list
        this.items = [];
        for(let i = 0; i < ITEM_COUNT; i++) {
            this.items.push(itemList[Math.floor(Math.random() * itemList.length)]);
        }


        this.io.emit('start-game', {
            players: this.players,
            items: this.items
        });
    }
}