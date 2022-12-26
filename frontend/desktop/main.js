const { initRemix } = require("remix-electron");
const { app, BrowserWindow } = require("electron");
const { join } = require("node:path");
const { Worker } = require("node:worker_threads");
const env = process.env.NODE_ENV || "development";

// If development environment
if (env === "development") {
  require("electron-reload")(join(__dirname, "build"), {
    electron: join(__dirname, "..", "node_modules", ".bin", "electron"),
    hardResetMethod: "exit",
  });
}

let win;

app.on("ready", async () => {
  try {
    const url = await initRemix({
      serverBuild: join(__dirname, "build"),
      mode: env,
      publicFolder: join(__dirname, "..", "public"),
    });

    win = new BrowserWindow({ show: false });
    await win.loadURL(url);
    win.show();

    var syncWorker = new Worker(
      join(__dirname, "..", "build", "workers", "sync.js")
    );
    var scheduleWorker = new Worker(
      join(__dirname, "..", "build", "workers", "schedule.js")
    );
  } catch (error) {
    console.error(error);
  }
});
