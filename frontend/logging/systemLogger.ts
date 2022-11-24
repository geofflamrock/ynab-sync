import type { Logger } from "ynab-sync-core";
import winston from "winston";

const winstonSystemLogger = winston.createLogger({
  level: "verbose",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

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
