import { initRemix } from "remix-electron";
import { app, BrowserWindow, Menu, utilityProcess } from "electron";
import { join } from "path";
import { systemLogger } from "logging";

const env = process.env.NODE_ENV || "development";

// If development environment
// if (env === "development") {
//   require("electron-reload")(join(__dirname, "build"), {
//     electron: join(__dirname, "..", "node_modules", ".bin", "electron"),
//     hardResetMethod: "exit",
//   });
// }

if (require("electron-squirrel-startup")) app.quit();

try {
  systemLogger.info("Starting ynab-sync application");

  let win: BrowserWindow;

  systemLogger.info(`Electron app`, app);

  app.on("ready", async () => {
    try {
      systemLogger.info(`Initialising remix app`);

      const url = await initRemix({
        serverBuild: join(__dirname, "..", "server"),
        mode: env,
        publicFolder: join(__dirname, "..", "..", "public"),
      });

      systemLogger.info(`Creating browser window from url ${url}`);

      win = new BrowserWindow({
        show: false,
        icon: join(
          __dirname,
          "..",
          "..",
          "public",
          "android-chrome-192x192.png"
        ),
        autoHideMenuBar: true,
      });

      win.on("ready-to-show", () => {
        win.show();
      });

      await win.loadURL(url);

      utilityProcess.fork(join(__dirname, "..", "workers", "sync.js"));
      utilityProcess.fork(join(__dirname, "..", "workers", "schedule.js"));
    } catch (error) {
      systemLogger.error(
        "An error occurred inside electron ready event",
        error
      );
      // process.exit(1);
    }
  });
} catch (e) {
  try {
    systemLogger.error("An error occurred starting up ynab-sync", e);
  } catch {
    // ignore
  }

  process.exit(1);
}
