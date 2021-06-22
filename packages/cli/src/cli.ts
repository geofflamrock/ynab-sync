import { Command } from "commander";
import * as commands from "./commands";

const program = new Command();

program.description("YNAB sync");
program.addCommand(commands.Create());
program.addCommand(commands.Run());

program.parse(process.argv);
