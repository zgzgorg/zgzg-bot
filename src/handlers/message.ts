import { logger } from "../logger";
import {
  Handler,
  WechatyMessage,
  WechatyContact,
  WechatyRoom,
} from "./handler";
import { MessageType as WechatyMessageType } from "wechaty-puppet";
import { cn2tw, tw2cn } from "cjk-conv";

export class Message extends Handler {
  private isMiniProgram(message: WechatyMessage) {
    const messageText: string = message.text();
    const messageType: WechatyMessageType = message.type();

    return (
      messageType == WechatyMessage.Type.MiniProgram ||
      (/<appmsg appid=/gim.test(messageText) && /@app/gim.test(messageText))
    );
  }

  public async listener(message: WechatyMessage) {
    logger.debug({ event: "message", data: message });
    this.mongoStorage.save(`WeChatyPadproMessage`, message);

    try {
      const fromContact: WechatyContact | null = message.from();
      const messageText: string = message.text();
      const messageTextTw: string = cn2tw(messageText);
      const fromRoom: WechatyRoom | null = message.room();
      const messageType: WechatyMessageType = message.type();
      const isMiniProgram: boolean = this.isMiniProgram(message);
      let replyText: string = "";

      if (
        message.self() ||
        !fromContact ||
        fromContact.type() == WechatyContact.Type.Official
      ) {
        // TODO: we can check bot is alive or not here
        return;
      }

      // TODO: Check blocklist here

      if (fromRoom) {
        // TODO: message from group chat room
        return;
      }

      // User talk to bot directly
      const roomList2020s: WechatyRoom[] = await this.getRoomList2020s();
      let room: WechatyRoom | null = null;
      if ((room = await this.roomMatch(messageText, roomList2020s))) {
        try {
          await this.addUserToRoom(fromContact, room);
          const roomTopic = await room.topic();
          const roomAnnounce: string = await room.announce().catch((e) => "");
          replyText = `歡迎加入 ${roomTopic},請看以下群公告:\n` + roomAnnounce;
        } catch (error) {
          replyText = error.message + `\n威廉　wechat id: kis87988`;
        }
      } else if (roomList2020s.length == 0) {
        replyText = `不好意思，目前沒有可以加的群，我們將盡快更新，請關注載歌在谷公眾號獲取最新消息`;
      } else {
        const roomList2020sContent = await this.getRoomListToString(
          roomList2020s
        );

        replyText =
          `不好意思，請告訴我你想加的群，以下是可以加入的群列表\n` +
          roomList2020sContent +
          `\n請輸入編號或群名加群，謝謝`;
      }

      if (this.isTwText(messageText)) replyText = cn2tw(replyText);
      await message.say(replyText);
    } catch (e) {
      logger.error("Bot", "message event exception: %s", e.stack);
    }
  }
}
