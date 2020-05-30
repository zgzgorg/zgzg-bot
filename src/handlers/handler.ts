import { logger } from "../logger";
import { Wechaty } from "wechaty";
import { MongoStorage } from "../mongo-storage";
import * as util from "../util";
import {
  Contact as WechatyContact,
  ContactSelf as WechatyContactSelf,
  Message as WechatyMessage,
  Room as WechatyRoom,
  Friendship as WechatyFriendship,
  RoomInvitation as WechatyRoomInvitation,
} from "wechaty/dist/src/user/";

export {
  WechatyContact,
  WechatyContactSelf,
  WechatyMessage,
  WechatyRoom,
  WechatyFriendship,
  WechatyRoomInvitation,
};

export abstract class Handler {
  // TODO: add Wechaty cache for findAll() room
  protected bot: Wechaty;
  protected mongoStorage: MongoStorage;
  constructor(bot: Wechaty, mongoStorage: MongoStorage) {
    this.bot = bot;
    this.mongoStorage = mongoStorage;
  }

  protected async sleep(
    ms: number = util.get_random_int_inclusive(3000, 5000)
  ) {
    await util.sleep(ms);
  }

  protected get_random_int_inclusive(min: number, max: number) {
    return util.get_random_int_inclusive(min, max);
  }

  protected async getRoomListToString(
    roomList: WechatyRoom[],
    displayId: boolean = false
  ) {
    let roomItemList: string = "rooms list:\n";

    try {
      for (let i = 0; i < roomList.length; i++) {
        const roomTopic = await roomList[i].topic();
        if (displayId)
          roomItemList += i + 1 + `. ${roomTopic}  id: ${roomList[i].id}\n`;
        else roomItemList += i + 1 + `. ${roomTopic}\n`;
      }

      return roomItemList;
    } catch (err) {
      logger.error("Bot", "getRoomList() exception: " + err.stack);
      return "Can not get rooms list";
    }
  }

  protected async getRoomList(regexpGroup: RegExp[] = []) {
    try {
      const roomList: WechatyRoom[] = await this.bot.Room.findAll();

      // means get all rooms
      if (regexpGroup.length == 0) return roomList;

      const filterRoomList: WechatyRoom[] = roomList.filter(async (room) => {
        const roomTopic = await room.topic();
        for (const regexp of regexpGroup)
          if (regexp.test(roomTopic)) return true;
        return false;
      });
      return filterRoomList;
    } catch (error) {
      logger.error("Bot", "getRoomList() exception: " + error.stack);
      return [];
    }
  }

  public abstract listener(...args: any[]): void;
}
