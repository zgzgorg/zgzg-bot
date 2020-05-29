import { logger } from "../logger";
import { Handler, WechatyRoomInvitation, WechatyContact } from "./handler";

export class RoomInvite extends Handler {
  public async listener(roomInvitation: WechatyRoomInvitation) {
    try {
      const inviter: WechatyContact = await roomInvitation.inviter();
      if (inviter && inviter.self()) {
        return;
      }

      const roomTopic: string = await roomInvitation.topic();

      logger.info(`received room-invite event. from ${roomTopic}`);
      // await roomInvitation.accept();
    } catch (e) {
      logger.error(`room-invite event exception: ${e.stack}`);
    }
  }
}
