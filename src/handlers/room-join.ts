import { logger } from "../logger";
import { Handler, WechatyRoom, WechatyContact } from "./handler";

export class RoomJoin extends Handler {
  public async listener(
    room: WechatyRoom,
    inviteeList: WechatyContact[],
    inviter: WechatyContact,
    date?: Date
  ) {
    try {
      const roomTopic = await room.topic();
      const inviteeNameList = inviteeList.map((c) => c.toString()).join(",");

      // if bot-self join the new room
      if (inviteeList[0].self()) {
        logger.info(`Bot join ${roomTopic} invite by ${inviter}`);
        return;
      }

      logger.info(`${inviteeNameList} join ${roomTopic} invite by ${inviter}`);
    } catch (e) {
      logger.error(`room-join event exception: ${e.stack}`);
    }
  }
}
