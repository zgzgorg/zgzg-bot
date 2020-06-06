import { logger } from "../logger";
import { Handler } from "./handler";

export class Start extends Handler {
  public listener() {
    logger.info(`Start running Wecahty`);
    logger.info(
      `wechaty puppet(${this.bot.puppet.name()}) version:${this.bot.puppet.version()}`
    );
  }
}
