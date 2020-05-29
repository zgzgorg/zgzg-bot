import { Wechaty } from "wechaty";
import { MongoStorage } from "../mongo-storage";
import * as util from "../util";
export {
  Contact as WechatyContact,
  ContactSelf as WechatyContactSelf,
  Message as WechatyMessage,
  Room as WechatyRoom,
  Friendship as WechatyFriendship,
  RoomInvitation as WechatyRoomInvitation,
} from "wechaty/dist/src/user/";

export abstract class Handler {
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

  public abstract listener(...args: any[]): void;
}
