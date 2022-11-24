import type { Logger } from "ynab-sync-core";
import winston from "winston";

export function createTaskLogger(id: string): Logger {
  const winstonTaskLogger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    transports: [new winston.transports.Console()],
  });

  return {
    debug(message, ...args) {
      winstonTaskLogger.log("debug", `${id} - ${message}`, args);
    },

    error(message, ...args) {
      winstonTaskLogger.log("error", `${id} - ${message}`, args);
    },

    fatal(message, ...args) {
      winstonTaskLogger.log("error", `${id} - ${message}`, args);
    },

    info(message, ...args) {
      winstonTaskLogger.log("info", `${id} - ${message}`, args);
    },

    verbose(message, ...args) {
      winstonTaskLogger.log("verbose", `${id} - ${message}`, args);
    },

    warning(message, ...args) {
      winstonTaskLogger.log("warn", `${id} - ${message}`, args);
    },
  };
}
