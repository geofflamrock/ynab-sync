export type Logger = {
  verbose: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warning: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  fatal: (message: string, ...args: any[]) => void;
};
