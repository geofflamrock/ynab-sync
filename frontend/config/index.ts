export type YnabSyncConfig = {
  dataDirectory: string;
  systemLogsDirectory: string;
  taskLogsDirectory: string;
};

const defaultConfig: YnabSyncConfig = {
  dataDirectory: "./data",
  systemLogsDirectory: "./logs",
  taskLogsDirectory: "./logs",
};

let config: YnabSyncConfig | undefined = undefined;

export function getConfig(): YnabSyncConfig {
  return config || defaultConfig;
}

export function setConfig(newConfig: YnabSyncConfig) {
  config = newConfig;
}
