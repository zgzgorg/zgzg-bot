require("dotenv").config();

import { logger } from "./logger";
import { MongoStorage } from "./mongo-storage";
import * as handlers from "./handlers";

import { Wechaty } from "wechaty";
import { PuppetPadplus } from "wechaty-puppet-padplus";

function botInstantiate(): Wechaty {
  const puppet: PuppetPadplus = new PuppetPadplus({
    token: process.env.WECHATY_PUPPET_PADPLUS_TOKEN,
  });

  const bot = new Wechaty({
    puppet,
  });

  logger.info(`wechaty version:${bot.version()},`);
  logger.info(`wechaty puppet(${puppet.name()}) version:${puppet.version()}`);
  return bot;
}

async function mongoStorageInstantiate(): Promise<MongoStorage> {
  const mongoStorage = new MongoStorage();
  await mongoStorage.init();

  return mongoStorage;
}

async function main() {
  logger.info(`Start ZGZG bot`);

  const mongoStorage: MongoStorage = await mongoStorageInstantiate();
  const bot: Wechaty = botInstantiate();

  const botHandler = {
    error: new handlers.Error_(bot, mongoStorage),
    ready: new handlers.Ready(bot, mongoStorage),
    start: new handlers.Start(bot, mongoStorage),
    stop: new handlers.Stop(bot, mongoStorage),
    scan: new handlers.Scan(bot, mongoStorage),
    login: new handlers.Login(bot, mongoStorage),
    logout: new handlers.Logout(bot, mongoStorage),
    message: new handlers.Message(bot, mongoStorage),
    friendship: new handlers.Friendship(bot, mongoStorage),
    roomJoin: new handlers.RoomJoin(bot, mongoStorage),
    roomLeave: new handlers.RoomLeave(bot, mongoStorage),
    roomTopic: new handlers.RoomTopic(bot, mongoStorage),
    roomInvite: new handlers.RoomInvite(bot, mongoStorage),
    heartbeat: new handlers.Heartbeat(bot, mongoStorage),
  };

  // bind all listeners
  bot
    .on("error", botHandler.error.listener)
    .on("ready", botHandler.ready.listener)
    .on("start", botHandler.start.listener)
    .on("stop", botHandler.stop.listener)
    .on("scan", botHandler.scan.listener)
    .on("login", botHandler.login.listener)
    .on("logout", botHandler.logout.listener)
    .on("message", botHandler.message.listener)
    .on("friendship", botHandler.friendship.listener)
    .on("room-join", botHandler.roomJoin.listener)
    .on("room-leave", botHandler.roomLeave.listener)
    .on("room-topic", botHandler.roomTopic.listener)
    .on("room-invite", botHandler.roomInvite.listener)
    .on("heartbeat", botHandler.heartbeat.listener);

  // bot start
  bot.start();
}

main()
  .then()
  .catch((e) => console.error(e));
