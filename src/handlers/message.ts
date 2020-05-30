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
  }
}
