import puppeteer, { BrowserFetcherRevisionInfo } from "puppeteer";
import { PUPPETEER_REVISIONS } from "puppeteer/lib/cjs/puppeteer/revisions";
import fs from "fs";
import os from "os";
import prettyBytes from "pretty-bytes";
import cliProgress from "cli-progress";

export async function createBrowser(
  downloadDirectory?: string
): Promise<puppeteer.Browser> {
  const chromiumDownloadDirectory =
    downloadDirectory ?? `${os.homedir()}/.chromium`;

  if (!fs.existsSync(chromiumDownloadDirectory))
    fs.mkdirSync(chromiumDownloadDirectory);

  let browserFetcher: puppeteer.BrowserFetcher = (
    puppeteer as any
  ).createBrowserFetcher({
    path: chromiumDownloadDirectory,
  });

  const revision = PUPPETEER_REVISIONS.chromium;
  const localRevisions = await browserFetcher.localRevisions();

  let downloadedRevisionInfo: BrowserFetcherRevisionInfo | undefined =
    undefined;

  if (!localRevisions.includes(revision)) {
    console.log(
      `Downloading chromium revision ${revision} to '${chromiumDownloadDirectory}'`
    );

    const progressBar = new cliProgress.SingleBar({
      format:
        "[{bar}] {percentage}% | ETA: {eta}s | {prettyValue}/{prettyTotal}",
    });
    let downloadStarted = false;
    const download = await browserFetcher.download(
      revision,
      (downloaded, total) => {
        if (!downloadStarted) {
          progressBar.start(total, downloaded, {
            prettyTotal: prettyBytes(total),
            prettyValue: prettyBytes(downloaded),
          });
          downloadStarted = true;
        } else {
          progressBar.update(downloaded, {
            prettyTotal: prettyBytes(total),
            prettyValue: prettyBytes(downloaded),
          });
        }
      }
    );
    console.log(
      `Downloaded chromium revision ${revision} to '${download.executablePath}'`
    );

    downloadedRevisionInfo = download;
  } else {
    downloadedRevisionInfo = browserFetcher.revisionInfo(revision);
  }

  return await puppeteer.launch({
    executablePath: downloadedRevisionInfo.executablePath,
  });
}
