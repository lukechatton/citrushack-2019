import UserSession from "../connection/UserSession";
import ScavengerItem from "./ScavengerItem";

export default interface GamePlayer extends SocketIO.Socket {
    user: UserSession,
    score: number,
    completedItems: ScavengerItem[],
    itemQueue: ScavengerItem[],
    lastScanAt: number
}