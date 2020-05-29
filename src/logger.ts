import { configure, getLogger, addLayout } from "log4js";

const logger = getLogger();

// TODO(xinbenlv): contribute to log4js main
addLayout("asis", function (config) {
  return function (logEvent): any {
    return logEvent;
  };
});

configure({
  appenders: {
    // stackdriver: {
    //   type: 'log4js-stackdriver-appender',
    //   credentials: {
    //     projectId: process.env.GCS_PROJECT_ID,
    //     keyFilename: '.credentials/gcs.json'
    //   },
    //   layout: { type: 'asis' },
    // },
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
