import GamePlayer from "./GamePlayer";
import { connectionController } from "../connection/connectionController";
import ScavengerItem from "./ScavengerItem";
import { itemList } from "./items";
import { visionClient } from "../vision/vision";
import { shuffleArray } from "../util/utils";

const ITEM_COUNT = 5;


export class GameController {
    players: GamePlayer[] = [];
    items: ScavengerItem[] = [];

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
            const foundItems: ScavengerItem[] = [];
            objects.forEach((object: any) => {
                console.log(`Name: ${object.name}`);
                console.log(`Confidence: ${object.score}`);

                const foundItem = this.getScavengerItem(object.name);
                if(foundItem) {
                    if(foundItem.name == client.itemQueue[0].name) {
                        client.completedItems.push(foundItem);
                        foundItems.push(foundItem);
                    }
                }
            });

            if(foundItems.length > 0) {
                this.io.emit('update-state', this.getGameState());
                this.io.emit('player-successful-scan', {
                    player: client.user,
                    items: foundItems
                });
                client.emit('scan-success', {
                    items: foundItems
                });
                client.emit('update-user', {
                    user: this.getClientboundPlayerData(client)
                });
            } else {
                client.emit('scan-failure', {});
                console.log('scan failure.');
            }
        });

    }

    getScavengerItem(name): ScavengerItem {
        for(let item of this.items) {
            if(item.name.toLowerCase() == name.toLowerCase()) {
                return item;
            }
        }
        return null;
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
        return {
            players: this.players,
            items: this.items
        }
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