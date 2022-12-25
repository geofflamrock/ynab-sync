import { getAccountSchedules, syncNow } from "../api";
import * as dotenv from "dotenv";
import { systemLogger } from "../logging";
import { parseExpression } from "cron-parser";
import { subDays } from "date-fns";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function pollAndProcessSchedules() {
  while (true) {
    systemLogger.verbose(
      "Polling to check if any scheduled syncs are ready to be processed"
    );
    const accountSchedules = await getAccountSchedules();

    for (const account of accountSchedules) {
      if (account.schedule) {
        const parsedSchedule = parseExpression(account.schedule, {
          currentDate: account.lastSyncTime,
        });
        const nextSyncDate = parsedSchedule.next().toDate();
        const now = new Date();

        if (
          nextSyncDate <= now &&
          (account.status === "error" || account.status === "synced")
        ) {
          systemLogger.info(
            `Queuing sync of account '${account.id}' from ${account.bankAccount.type} bank account '${account.bankAccount.name}' to ynab account '${account.ynabAccount.accountName}' in budget '${account.ynabAccount.budgetName}'`
          );

          await syncNow(account.id, {
            startDate: account.maxTransactionDate ?? subDays(new Date(), 7),
            debug: true,
          });
        }
      }
    }

    await sleep(60000);
  }
}

systemLogger.info("Starting schedule worker");

// Load environment
dotenv.config();

pollAndProcessSchedules()
  .catch((e) => {
    systemLogger.error(e);
    process.exit(1);
  })
  .finally(() => {
    systemLogger.info("Stopping schedule worker");
    process.exit(0);
  });
