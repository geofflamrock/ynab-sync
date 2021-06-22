import commander from "commander";

/*
 * Creates a new sync
 */
export default function CreateCommand(): commander.Command {
  return new commander.Command("create")
    .description("Creates a new YNAB sync")
    .action(() => console.log("create!"));
}
