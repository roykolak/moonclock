import * as esbuild from "esbuild";
import fs from "fs";
import { exec } from "child_process";

await esbuild.build({
  entryPoints: ["hardware/index.ts"],
  bundle: true,
  platform: "node",
  loader: {
    ".node": "file",
  },
  external: ["*.node"],
  outfile: "dist/hardware/index.cjs",
});

console.log("\n -> Hardware script built");

// update canvas.node path in hardware output
const filePath = "dist/hardware/index.cjs";
let content = fs.readFileSync(filePath, "utf8");
const oldString = "../build/Release/canvas.node";
const newString = "./canvas.node";
content = content.replace(oldString, newString);
fs.writeFileSync(filePath, content, "utf8");

console.log("\n -> canvas.node dependency path rewritten");

fs.cpSync(".next/standalone", "dist/app", { recursive: true });
fs.cpSync(".next/static", "dist/app/.next/static", { recursive: true });

console.log("\n -> Copied Next.js app with static assets to /dist");

fs.cpSync(
  "dist/hardware/canvas.node",
  "dist/app/node_modules/canvas/build/Release/canvas.node"
);

console.log("\n -> Copied RPI canvas.node to /dist/app/node_modules...");

const releaseFolder = "moonclock";

if (fs.existsSync(releaseFolder)) {
  fs.rmSync(releaseFolder, { recursive: true });
}

fs.mkdirSync(releaseFolder);

fs.cpSync("dist", `${releaseFolder}/dist`, { recursive: true });
fs.cpSync("bin", `${releaseFolder}/bin`, { recursive: true });
fs.cpSync("services", `${releaseFolder}/services`, { recursive: true });
fs.cpSync("custom_scenes", `${releaseFolder}/custom_scenes`, {
  recursive: true,
});

const releaseFiles = ["install.sh", "package.json"];

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
