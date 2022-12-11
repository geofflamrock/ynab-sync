import type { Logger } from "ynab-sync-core";
import { createLogger, format, transports } from "winston";
import { logLevels } from "./levels";
const { combine, timestamp, json } = format;

export function createTaskLogger(id: string): Logger {
  const winstonTaskLogger = createLogger({
    levels: logLevels.levels,
    level: "verbose",
    format: combine(timestamp(), json()),
    transports: [
      new transports.File({
        dirname: ".",
        filename: `${id}.log`,
      }),
    ],
  });

  return {
    debug(message, ...args) {
      winstonTaskLogger.log(
        "debug",
        args && args.length ? `${message} ${JSON.stringify(args)}` : message
      );
    },

    error(message, ...args) {
      winstonTaskLogger.log(
        "error",
        args && args.length ? `${message} ${JSON.stringify(args)}` : message
      );
    },

    fatal(message, ...args) {
      winstonTaskLogger.log(
        "error",
        args && args.length ? `${message} ${JSON.stringify(args)}` : message
      );
    },

    info(message, ...args) {
      winstonTaskLogger.log(
        "info",
        args && args.length ? `${message} ${JSON.stringify(args)}` : message
      );
    },

    verbose(message, ...args) {
      winstonTaskLogger.log(
        "verbose",
        args && args.length ? `${message} ${JSON.stringify(args)}` : message
      );
    },

    warning(message, ...args) {
      winstonTaskLogger.log(
        "warn",
        args && args.length ? `${message} ${JSON.stringify(args)}` : message
      );
    },
  };
}
