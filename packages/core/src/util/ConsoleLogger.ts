import { Logger } from "./Logger";

export enum LogLevel {
  Error = 1,
  Warning = 2,
  Info = 3,
  Debug = 4,
}

export type ConsoleLoggerOptions = {
  minLogLevel: LogLevel;
};

export function createConsoleLogger(minLogLevel: LogLevel) {
  return new ConsoleLogger({
    minLogLevel: minLogLevel,
  });
}

export class ConsoleLogger implements Logger {
  private options: ConsoleLoggerOptions;
  constructor(options: ConsoleLoggerOptions) {
    this.options = options;
  }

  error(message: string) {
    if (this.options.minLogLevel >= LogLevel.Error) {
      console.log(`[error] ${message}`);
    }
  }

  warning(message: string) {
    if (this.options.minLogLevel >= LogLevel.Error) {
      console.log(`[warning] ${message}`);
    }
  }

  info(message: string) {
    if (this.options.minLogLevel >= LogLevel.Info) {
      console.log(`[info] ${message}`);
    }
  }

  debug(message: string) {
    if (this.options.minLogLevel >= LogLevel.Debug) {
      console.log(`[debug] ${message}`);
    }
  }
}
