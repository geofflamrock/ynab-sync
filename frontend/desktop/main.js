const { initRemix } = require("remix-electron");
const { app, BrowserWindow } = require("electron");
const { join } = require("node:path");
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
  } catch (error) {
    console.error(error);
  }
});
