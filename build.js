import * as esbuild from "esbuild";
import fs from "fs";
import { exec } from "child_process";
import packageInfo from "./package.json" with { type: "json" };
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

console.log("Building version:", packageInfo.version);

const esbuildOptions = {
  bundle: true,
  platform: "node",
  loader: {
    ".node": "file",
  },
  keepNames: true,
  external: ["*.node"],
};

// rewrite hardcoded native module paths to match where build.js
// copies them under dist/hardware/
function rewriteNativeModulePaths(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/"\.\.\/skia\.node"/g, '"./skia.node"');
  content = content.replace(
    /"\.\.\/build\/Release\/rpi-led-matrix\.node"/g,
    '"./build/rpi-led-matrix.node"',
  );
  fs.writeFileSync(filePath, content, "utf8");
}

await esbuild.build({
  ...esbuildOptions,
  entryPoints: ["hardware/index.ts"],
  outfile: "dist/hardware/index.cjs",
});
rewriteNativeModulePaths("dist/hardware/index.cjs");

console.log("\n -> Hardware script built");

// standalone rpi-led-matrix smoke test, bundled so it reuses the prebuilt
// native module shipped alongside the hardware script in dist/hardware/
await esbuild.build({
  ...esbuildOptions,
  entryPoints: ["hardware/test-matrix.ts"],
  outfile: "dist/hardware/test-matrix.cjs",
});
rewriteNativeModulePaths("dist/hardware/test-matrix.cjs");

console.log("\n -> Smoke test script built");

fs.cpSync("hardware/prebuilt", "dist/hardware", { recursive: true });

console.log("\n -> Copied prebuilt native modules to dist/hardware");

fs.cpSync(".next/standalone", "dist/app", { recursive: true });
fs.cpSync("public", "dist/app/public", { recursive: true });
fs.cpSync(".next/static", "dist/app/.next/static", { recursive: true });

fs.cpSync("public", "dist/hardware/public", { recursive: true });

console.log("\n -> Copied Next.js app with static assets to /dist");

const releaseFolder = "moonclock";

console.log("\n -> Creating release folder");

if (fs.existsSync(releaseFolder)) {
  fs.rmSync(releaseFolder, { recursive: true });
}

fs.mkdirSync(releaseFolder);

console.log("\n -> Copying folders to release directory");

fs.cpSync("dist", `${releaseFolder}/dist`, { recursive: true });
fs.cpSync("bin", `${releaseFolder}/bin`, { recursive: true });
fs.cpSync("services", `${releaseFolder}/services`, { recursive: true });
fs.cpSync("custom_scenes", `${releaseFolder}/custom_scenes`, {
  recursive: true,
});

console.log("\n -> Updating systemd services to include version");

const services = [
  "moonclock-app.service",
  "moonclock-hardware.service",
  "moonclock-update-checker.service",
  "moonclock-update-checker.timer",
];

const placeholder = "{VERSION}";

for (const service of services) {
  const file = `${releaseFolder}/services/${service}`;
  const data = await readFile(file, "utf8");
  const result = data.replace(
    new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    packageInfo.version,
  );
  await writeFile(file, result, "utf8");
}

console.log("\n -> Copying individual release files");

const releaseFiles = ["install.sh", "install-dependencies.sh", "package.json"];

for (const file of releaseFiles) {
  fs.copyFileSync(file, `${releaseFolder}/${file}`);
}

console.log("\n -> Compiled release folder");

exec("tar -czf release.tar.gz moonclock", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log("release.tar.gz");
});

console.log("\n -> Tarred release folder");
