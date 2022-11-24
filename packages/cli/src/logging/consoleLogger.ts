import { Logger } from "ynab-sync-core";

export const consoleLogger: Logger = {
  debug(message, ...args) {
    console.debug(message, args);
  },

  error(message, ...args) {
    console.error(message, args);
  },

  fatal(message, ...args) {
    console.error(message, args);
  },

  info(message, ...args) {
    console.info(message, args);
  },

  verbose(message, ...args) {
    console.debug(message, args);
  },

  warning(message, ...args) {
    console.warn(message, args);
  },
};
