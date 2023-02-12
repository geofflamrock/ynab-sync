import type { Logger } from "ynab-sync-core";
import winston from "winston";
import { logLevels } from "./levels";

const winstonSystemLogger = winston.createLogger({
  levels: logLevels.levels,
  level: "debug",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      dirname: ".",
      filename: `ynab-sync.log`,
    }),
  ],
});

winston.addColors(logLevels.colors);

export const systemLogger: Logger = {
  debug(message, ...args) {
    winstonSystemLogger.log("debug", message, args);
  },

  error(message, ...args) {
    winstonSystemLogger.log("error", message, args);
  },

  fatal(message, ...args) {
    winstonSystemLogger.log("error", message, args);
  },

  info(message, ...args) {
    winstonSystemLogger.log("info", message, args);
  },

  verbose(message, ...args) {
    winstonSystemLogger.log("verbose", message, args);
  },

  warning(message, ...args) {
    winstonSystemLogger.log("warn", message, args);
  },
};
