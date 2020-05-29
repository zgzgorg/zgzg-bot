import { logger } from "../logger";
import { Handler } from "./handler";

export class Error_ extends Handler {
  public listener(error: Error) {
    logger.error("Bot", "error: %s", error);
  }
}
