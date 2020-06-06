import { logger } from "../logger";
import { Handler, WechatyRoom, WechatyContact } from "./handler";

export class RoomLeave extends Handler {
  public async listener(
    room: WechatyRoom,
    leaverList: WechatyContact[],
    remover?: WechatyContact,
    date?: Date
  ) {
    try {
      const roomTopic = await room.topic();
      const leaverNameList = leaverList.map((c) => c.toString()).join(",");

      // if bot-self being kick out the  room
      if (leaverList[0].self()) {
        logger.info(`Bot being kick out ${roomTopic} by ${remover}`);
        return;
      }

      logger.info(`${leaverNameList} remove from ${roomTopic} by ${remover}`);
    } catch (e) {
      logger.error(`room-level event exception: ${e.stack}`);
    }
  }
}
