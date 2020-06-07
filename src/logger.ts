import { configure, getLogger } from "log4js";

const logger = getLogger();

// TODO(xinbenlv): contribute to log4js main

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
      level: "debug",
      enableCallStack: true,
    },
  },
});

export { logger };
