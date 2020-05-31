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
    name: "ZGZG Bot",
    puppet: puppet,
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
    .on("error", (...args) => botHandler.error.listener(...args))
    .on("ready", (...args) => botHandler.ready.listener(...args))
    .on("start", (...args) => botHandler.start.listener(...args))
    .on("stop", (...args) => botHandler.stop.listener(...args))
    .on("scan", (...args) => botHandler.scan.listener(...args))
    .on("login", (...args) => botHandler.login.listener(...args))
    .on("logout", (...args) => botHandler.logout.listener(...args))
    .on("message", (...args) => botHandler.message.listener(...args))
    .on("friendship", (...args) => botHandler.friendship.listener(...args))
    .on("room-join", (...args) => botHandler.roomJoin.listener(...args))
    .on("room-leave", (...args) => botHandler.roomLeave.listener(...args))
    .on("room-topic", (...args) => botHandler.roomTopic.listener(...args))
    .on("room-invite", (...args) => botHandler.roomInvite.listener(...args))
    .on("heartbeat", (...args) => botHandler.heartbeat.listener(...args));

  // bot start
  bot.start();
}

main()
  .then()
  .catch((e) => console.error(e));
