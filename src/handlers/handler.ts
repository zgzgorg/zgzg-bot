import { logger } from "../logger";
import { Wechaty } from "wechaty";
import { MongoStorage } from "../mongo-storage";
import { cn2tw, tw2cn } from "cjk-conv";
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

  protected async sleep(ms: number = util.getRandomIntInclusive(3000, 5000)) {
    await util.sleep(ms);
  }

  protected getRandomIntInclusive(min: number, max: number) {
    return util.getRandomIntInclusive(min, max);
  }

  protected isTwText(text: string) {
    const textTw = cn2tw(text);
    return textTw == text;
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

  protected async getRoomList2020s() {
    const room2020sRegexpGroup: RegExp[] = [
      /ZGZG[ -]2020s/gim,
      /云生活-观众嘉年华/gim,
    ];
    const room2020sList = await this.getRoomList(room2020sRegexpGroup);
    return room2020sList;
  }

  protected async addUserToRoom(contact: WechatyContact, room: WechatyRoom) {
    const roomMaxSize = 500;
    let roomMemberCount: number, hasMember: boolean;
    try {
      roomMemberCount = await room
        .memberAll()
        .then((memberList: any[]) => memberList.length)
        .catch(() => 0);
      hasMember = await room.has(contact);
    } catch (error) {
      logger.error(
        "Bot",
        "addUserToRoom() call room.memberAll(),room.has() exception: " +
          error.stack
      );
      throw new Error("不好意思，邀請過程中發生點問題，請聯絡管理員");
    }

    if (roomMemberCount >= roomMaxSize)
      throw new Error("不好意思，想加的群超過500人了，請聯絡管理員");
    if (hasMember) throw new Error("不好意思，你已經在想加的群中了");
    await this.sleep();
    try {
      room.add(contact);
    } catch (error) {
      logger.error(
        "Bot",
        "addUserToRoom() call room.add() exception: " + error.stack
      );
      throw new Error("不好意思，邀請過程中發生點問題，請聯絡管理員");
    }
  }

  protected async roomMatch(text: string, roomList: WechatyRoom[]) {
    let trimText = text.trim();
    if (/\d+/gim.test(trimText)) {
      // number only
      const roomIndex = +trimText - 1;
      if (roomIndex < roomList.length) return roomList[roomIndex];
    }

    const textRegexp: RegExp = RegExp(trimText, "gim");

    for (const room of roomList) {
      const roomTopic: string = await room.topic();
      const roomTopicCN: string = tw2cn(roomTopic);
      const roomTopicTW: string = cn2tw(roomTopic);
      if (textRegexp.test(roomTopic)) return room;
      if (textRegexp.test(roomTopicCN)) return room;
      if (textRegexp.test(roomTopicTW)) return room;
    }
    return null;
  }

  public abstract listener(...args: any[]): void;
}
