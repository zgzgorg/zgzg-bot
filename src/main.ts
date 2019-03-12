import {Wechaty} from 'wechaty';
import {PuppetPadpro} from 'wechaty-puppet-padpro';

require('dotenv').config();
import {configure, getLogger, addLayout} from 'log4js';
import {MongoStorage} from "./mongo-storage";

const logger = getLogger();

// TODO(xinbenlv): contribute to log4js main
addLayout('asis', function(config) {
  return function(logEvent):any {
    return logEvent;
  }
});

configure({
  appenders: {
    stackdriver: {
      type: 'log4js-stackdriver-appender',
      credentials: {
        projectId: process.env.GCS_PROJECT_ID,
        keyFilename: '.credentials/gcs.json'
      },
      layout: { type: 'asis' },
    },
    out: { type: 'stdout', layout: { type: 'colored' } }
  },
  categories: {
    default: {
      appenders: ['stackdriver', `out`], level: 'debug'
    }
  }
});

async function main() {

  logger.debug(`Start!`);
  const mongoStorage = new MongoStorage();
  await mongoStorage.init();
  const puppet = new PuppetPadpro({
    token: process.env.WECHATY_PUPPET_PADPRO_TOKEN,
  });

  const bot = new Wechaty({
    puppet,
  });

// 设置完成

// 运行 wechaty
  bot
      .on('scan', (qrcode, status) => {
        let msg = `Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`;
        logger.debug(msg);
      })
      .on('login', user => {
        console.log(`User ${user} logined`);
        logger.debug({event: "login", data: user});
      })
      .on('message', message => {
        console.log(`Received message ${message}`);
        logger.debug({event: "message", data: message});
        mongoStorage.save(`WeChatyPadproMessage`, message);
      })
      .start();

}

main().then().catch(e => console.error(e));

