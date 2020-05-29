import { logger } from "../logger";
import { Handler, WechatyContactSelf } from "./handler";

export class Logout extends Handler {
  public listener(botOwnerUser: WechatyContactSelf) {
    logger.info(`bot ${botOwnerUser.name()} logout`);
  }
}
