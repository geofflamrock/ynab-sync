import { build } from "esbuild";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "fs";
import { dirname, join } from "path";

const baseDir = join(__dirname, "..");
const srcDir = join(baseDir, "src");
const outDir = join(baseDir, "bin");

const assetsToCopy = [
  {
    from: join(baseDir, "package.json"),
    to: join(outDir, "package.json"),
  },
  {
    from: join(
      baseDir,
      "node_modules",
      "node-expat",
      "build",
      "Release",
      "node_expat.node"
    ),
    to: join(outDir, "build", "node_expat.node"),
  },
];

function cleanOutputDirectory(outDir: string) {
  if (existsSync(outDir)) rmSync(outDir, { recursive: true });
}

cleanOutputDirectory(outDir);

build({
  entryPoints: [join(srcDir, "index.ts")],
  bundle: true,
  platform: "node",
  target: "node16",
  outdir: outDir,
  // This is important as there is some code in node-fetch
  // which relies on the name of a type being retained
  keepNames: true,
  minify: false,
})
  .then(() => {
    for (const assetToCopy of assetsToCopy) {
      const dir = dirname(assetToCopy.to);
      try {
        if (!existsSync(dir)) {
          mkdirSync(dir);
        }
      } catch (e) {
        console.log(e);
      }

      console.log(`Copying '${assetToCopy.from}' to '${assetToCopy.to}'`);

      copyFileSync(assetToCopy.from, assetToCopy.to);
    }
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
