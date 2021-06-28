import commander from "commander";
import { createWestpacAuSyncCommand } from "./westpac-au";

const program = new commander.Command();
program
  .command("sync")
  .description("Sync transactions from banks to YNAB")
  .addCommand(createWestpacAuSyncCommand());

program
  .parseAsync(process.argv)
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
