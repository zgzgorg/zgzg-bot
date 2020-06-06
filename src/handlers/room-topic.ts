import { logger } from "../logger";
import { Handler, WechatyRoom, WechatyContact } from "./handler";

export class RoomTopic extends Handler {
  public async listener(
    room: WechatyRoom,
    topic: string,
    oldTopic: string,
    changer: WechatyContact,
    date?: Date
  ) {
    try {
      logger.info(
        `Room(${room.id}) topic changed from ${oldTopic} to ${topic} by ${changer}(${changer.id})`
      );
    } catch (e) {
      logger.error(`room-topic event exception: ${e.stack}`);
    }
  }
}
