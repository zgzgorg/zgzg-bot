import { logger } from "../logger";
import { Wechaty } from "wechaty";
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
  // TODO(WilliamC, kis87988): add Wechaty cache for findAll() room
  protected bot: Wechaty;
  constructor(bot: Wechaty, ...args: any[]) {
    this.bot = bot;
  }

  protected async sleep(ms: number = util.getRandomIntInclusive(3000, 5000)) {
    await util.sleep(ms);
  }

  protected getRandomIntInclusive(min: number, max: number) {
    return util.getRandomIntInclusive(min, max);
  }

  protected isTcText(text: string) {
    const textTw = cn2tw(text);
    return textTw == text;
  }

  protected async getRoomListToString(
    roomList: WechatyRoom[],
    displayId: boolean = false
  ) {
    if (roomList.length == 0) return "";
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

      const filterRoomList: WechatyRoom[] = [];
      for (const room of roomList) {
        const roomTopic: string = await room.topic();
        const roomTopicCn: string = tw2cn(roomTopic);
        for (const regexp of regexpGroup)
          if (regexp.test(roomTopicCn)) filterRoomList.push(room);
      }
      return filterRoomList;
    } catch (error) {
      logger.error("Bot", "getRoomList() exception: " + error.stack);
      return [];
    }
  }

  protected async getRoomList2020s() {
    const room2020sRegexpStringGroup: string[] = [
      `ZGZGx开车群`,
      // TODO(WilliamC, kis87988): refactor to general room
      `ZGZG[ -]2020s`,
      `“云集”志愿者大群 载歌在谷2020S`,
      `云生活-观众嘉年华`,
    ];

    const room2020sRegexpGroup: RegExp[] = room2020sRegexpStringGroup.map(
      (s) => {
        const sCn: string = tw2cn(s);
        return new RegExp(sCn, "gim");
      }
    );

    const room2020sList = await this.getRoomList(room2020sRegexpGroup);
    return room2020sList;
  }

  protected async addUserToRoom(contact: WechatyContact, room: WechatyRoom) {
    const roomMaxSize = 500;
    let roomMemberCount: number = 0;
    let hasMember: boolean = false;
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
      throw new Error(
        "不好意思，邀請過程中發生點問題，請聯絡管理員 William(Wechat ID:kis87988)"
      );
    }

    if (roomMemberCount >= roomMaxSize)
      throw new Error(
        "不好意思，想加的群超過500人了，請聯絡管理員William(Wechat ID:kis87988)"
      );
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
    const trimText: string = text.trim();
    const trimTextCn: string = tw2cn(trimText);

    // number only
    if (/\d+/gim.test(trimText)) {
      const roomIndex = +trimText - 1;
      if (roomIndex < roomList.length) return roomList[roomIndex];
    }

    // text match room.topic()

    const textRegexp: RegExp = RegExp(trimTextCn, "gim");
    for (const room of roomList) {
      const roomTopic: string = await room.topic();
      const roomTopicCn = tw2cn(roomTopic);
      if (textRegexp.test(roomTopicCn)) return room;
    }

    // nothing match
    return null;
  }

  public abstract listener(...args: any[]): void;
}
