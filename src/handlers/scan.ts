import { logger } from "../logger";
import { Handler } from "./handler";
import { qrcodeValueToImageUrl } from "wechaty";
import { ScanStatus as WechatyPuppetScanStatus } from "wechaty-puppet";
import { generate } from "qrcode-terminal";

export class Scan extends Handler {
  public listener(
    qrcode: string,
    status: WechatyPuppetScanStatus,
    data?: string
  ) {
    if (data) {
      logger.info(data);
    }

    logger.info(`status code:[${status}]`);

    switch (status) {
      case WechatyPuppetScanStatus.Cancel: {
        logger.info(`Login has been canceled on phone`);
        break;
      }

      case WechatyPuppetScanStatus.Waiting: {
        const url: string = qrcodeValueToImageUrl(qrcode);
        logger.info(url);
        logger.info(`^^^ Online QR Code Image URL ^^^ `);
        logger.info(
          `${qrcode} Scan QR Code above url or below image to login.`
        );
        generate(qrcode, { small: true });
        break;
      }
      case WechatyPuppetScanStatus.Scanned: {
        logger.info("QR Code scanned, wait for confirm on phone.");
        break;
      }
      case WechatyPuppetScanStatus.Confirmed: {
        logger.info(
          `Login has been confirmed on phone, processing login to Wechat.`
        );
        break;
      }
      case WechatyPuppetScanStatus.Timeout: {
        logger.info(`QR code has timeouted`);
        break;
      }
      default: {
        logger.warn(`status code is unknown`);
        break;
      }
    }
  }
}
