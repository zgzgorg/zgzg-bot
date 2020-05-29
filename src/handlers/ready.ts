import { logger } from "../logger";
import { Handler } from "./handler";

export class Ready extends Handler {
  public listener() {
    try {
      logger.info(`bot ${this.bot.name()} ready`);
    } catch (e) {
      logger.error("Bot", "ready event exception: %s", e.stack);
    }
  }
}
