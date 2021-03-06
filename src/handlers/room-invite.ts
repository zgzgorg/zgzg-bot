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
      const deplyRoomInviteSec = this.getRandomIntInclusive(15000, 300000);
      await this.sleep(deplyRoomInviteSec);
      await roomInvitation.accept();
    } catch (e) {
      logger.error(`room-invite event exception: ${e.stack}`);
    }
  }
}
