import { logger } from "../logger";
import { Handler } from "./handler";

export class Stop extends Handler {
  public listener() {
    logger.info(`Stop running Wecahty`);
  }
}
