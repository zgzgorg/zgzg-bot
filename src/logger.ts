import { configure, getLogger, addLayout } from "log4js";

const logger = getLogger();

// TODO(xinbenlv): contribute to log4js main

configure({
  appenders: {
    out: { type: "stdout", layout: { type: "colored" } },
  },
  categories: {
    default: {
      appenders: [`out`],
      level: "debug",
    },
  },
});

export { logger };
