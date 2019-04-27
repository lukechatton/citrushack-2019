import GamePlayer from "./GamePlayer";
import { connectionController } from "../connection/connectionController";
import ScavengerItem from "./ScavengerItem";
import { itemList } from "./items";
import { visionClient } from "../vision/vision";
import { shuffleArray } from "../util/utils";

const ITEM_COUNT = 5;
const GAME_LENGTH = 3 * 60 * 1000;

export class GameController {
    items: ScavengerItem[] = [];
    startedAt: number;
    endsAt: number;

    constructor(
        public io: SocketIO.Server
    ) {

    }

    async start() {
        // randomly generate item list
        this.items = [];
        for(let i = 0; i < ITEM_COUNT; i++) {
            this.items.push(itemList[Math.floor(Math.random() * itemList.length)]);
        }

        // reset player scores
        for(let player of connectionController.players) {
            player.score = 0;
            player.completedItems = [];
            this.handleClientEvents(player);

            let items = [...this.items];
            shuffleArray(items);
            player.itemQueue = items;

            player.emit('update-user', {
                user: this.getClientboundPlayerData(player)
            });
        }

        this.startedAt = Date.now();
        this.endsAt = Date.now() + GAME_LENGTH;

        this.io.emit('start-game', this.getGameState());
    }

    handleClientEvents(client: GamePlayer) {
        
        client.on('scan-image', async (image) => {
            if(client.itemQueue.length == 0) return; //already completed

            // https://github.com/googleapis/nodejs-vision/blob/master/samples/detect.js#L691
            const request = {
                image: { content: image } //base64
            }
            const [response] = await visionClient.objectLocalization(request); 

            const objects: [] = response.localizedObjectAnnotations;
            const filteredItems: ScavengerItem[] = [];
            let found = false;
            objects.forEach((object: any) => {
                console.log(`Name: ${object.name}`);
                console.log(`Confidence: ${object.score}`);
                if(found) return;

                const foundItems = this.getScavengerItems(object.name);
                if(foundItems.length > 0) {
                    for(let foundItem of foundItems) {
                        if(foundItem.name == client.itemQueue[0].name) {
                            console.log(client.user.name + ' found ' + foundItem.name);
                            client.completedItems.push(foundItem);
                            filteredItems.push(foundItem);
                            client.itemQueue.shift();
                            client.score += 1;
                            
                            found = true;
                            break;
                        }
                    }
                }
            });

            if(filteredItems.length > 0) {
                this.io.emit('update-state', this.getGameState());
                this.io.emit('player-successful-scan', {
                    player: client.user,
                    items: filteredItems
                });
                client.emit('scan-success', {
                    items: filteredItems
                });
                client.emit('update-user', {
                    user: this.getClientboundPlayerData(client)
                });
                console.log('new user data:', this.getClientboundPlayerData(client));
            } else {
                client.emit('scan-failure', {});
            }
        });

    }

    getScavengerItems(name): ScavengerItem[] {
        let response = [];
        for(let item of this.items) {
            for(let tag of item.tags) {
                if(tag == name.toLowerCase()) {
                    response.push(item);
                }
            }
        }
        return response;
    }

    hasPlayerFoundItem(player: GamePlayer, item: ScavengerItem): boolean {
        for(let item of player.completedItems) {
            if(item.name == item.name) {
                return true;
            }
        }
        return false;
    }

    getGameState() {
        let topPlayer: GamePlayer;
        if(connectionController.players.length > 0) {
            for(let player of connectionController.players) {
                if(!topPlayer || player.score > topPlayer.score) {
                    if(player.score > 0) {
                        topPlayer = player;
                    }
                }
            }
        }

        let players = [];
        for(let player of connectionController.players) {
            players.push(this.getClientboundPlayerData(player));
        }

        let data = {
            players: players,
            items: this.items,
            topPlayer: topPlayer ? this.getClientboundPlayerData(topPlayer) : null,
            endsAt: this.endsAt
        }
        console.log('game state:', data);

        return data;
    }

    getClientboundPlayerData(player: GamePlayer) {
        return {
            user: player.user,
            score: player.score,
            completedItems: player.completedItems,
            itemQueue: player.itemQueue
        }
    }
}