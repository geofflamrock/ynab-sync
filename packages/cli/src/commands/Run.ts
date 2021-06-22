import commander from "commander";

/*
 * Runs a sync
 */
export default function RunCommand(): commander.Command {
  return new commander.Command("run")
    .description("Runs a YNAB sync")
    .action(() => console.log("run!"));
}
