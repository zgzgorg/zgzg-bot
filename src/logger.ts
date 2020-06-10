import { configure, getLogger } from "log4js";

const logger = getLogger();

// TODO(xinbenlv): contribute to log4js main

let logLevel: string = "info";

if (process.env.DEBUG) {
  logLevel = "debug";
  process.env.WECHATY_LOG = logLevel;
} else if (process.env.LOG_LEVEL) {
  const envLogLevel = process.env.LOG_LEVEL.toLowerCase();
  switch (envLogLevel) {
    case "all": {
      logLevel = envLogLevel;
      process.env.WECHATY_LOG = "silly";
      break;
    }
    case "debug":
    case "info":
    case "warn":
    case "error": {
      logLevel = envLogLevel;
      process.env.WECHATY_LOG = logLevel;
      break;
    }
  }
}

configure({
  appenders: {
    out: {
      type: "stdout",
      layout: {
        type: "pattern",
        pattern: `%[[%d] [%p] [%f{2,3}:%l]%]: %m`,
      },
    },
  },
  categories: {
    default: {
      appenders: [`out`],
      level: logLevel,
      enableCallStack: true,
    },
  },
});

export { logger };
