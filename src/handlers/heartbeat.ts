import { logger } from "../logger";
import { Handler, WechatyContactSelf } from "./handler";

export class Heartbeat extends Handler {
  public listener(data: any) {
    return;
  }
}
