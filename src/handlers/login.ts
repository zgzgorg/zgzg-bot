import { logger } from "../logger";
import { Handler, WechatyContactSelf } from "./handler";

export class Login extends Handler {
  public listener(botOwnerUser: WechatyContactSelf) {
    console.log(`bot ${botOwnerUser.name()} login`);
    logger.info({ event: "login", data: botOwnerUser });
  }
}
