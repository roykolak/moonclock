import * as esbuild from "esbuild";
import fs from "fs";

await esbuild.build({
  entryPoints: ["hardware/index.ts"],
  bundle: true,
  platform: "node",
  loader: {
    ".node": "file",
  },
  external: ["*.node"],
  outfile: "build/hardware/index.cjs",
});

console.log("\nHardware script built");

// update canvas.node path in hardware output
const filePath = "dist/hardware/index.cjs";
let content = fs.readFileSync(filePath, "utf8");
const oldString = "../build/Release/canvas.node";
const newString = "./canvas.node";
content = content.replace(oldString, newString);
fs.writeFileSync(filePath, content, "utf8");

console.log("\ncanvas.node dependency path rewritten");

fs.cpSync(".next/standalone", "build/app", { recursive: true });
fs.cpSync(".next/static", "build/app/.next/static", { recursive: true });

console.log("\n\nCopied Next.js app with static assets to /dist");
