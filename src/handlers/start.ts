import { logger } from "../logger";
import { Handler } from "./handler";

export class Start extends Handler {
  public listener() {
    logger.info(`Start running Wecahty`);
  }
}
