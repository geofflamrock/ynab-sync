import type { Logger } from "ynab-sync-core";
import winston from "winston";

export function createTaskLogger(id: string): Logger {
  const winstonTaskLogger = winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        dirname: ".",
        filename: `${id}.log`,
      }),
    ],
  });

  return {
    debug(message, ...args) {
      winstonTaskLogger.log("debug", message, args);
    },

    error(message, ...args) {
      winstonTaskLogger.log("error", message, args);
    },

    fatal(message, ...args) {
      winstonTaskLogger.log("error", message, args);
    },

    info(message, ...args) {
      winstonTaskLogger.log("info", message, args);
    },

    verbose(message, ...args) {
      winstonTaskLogger.log("verbose", message, args);
    },

    warning(message, ...args) {
      winstonTaskLogger.log("warn", message, args);
    },
  };
}
