import * as esbuild from "esbuild";
import fs from "fs";

await fs.cpSync(
  "./node_modules/canvas/build/Release/canvas.node",
  "./build/canvas.node",
  {
    recursive: true,
  }
);

await fs.cpSync(
  "./node_modules/rpi-led-matrix/build/Release/rpi-led-matrix.node",
  "./build/rpi-led-matrix.node",
  {
    recursive: true,
  }
);

await esbuild.build({
  entryPoints: ["hardware/index.ts"],
  bundle: true,
  platform: "node",
  loader: {
    ".node": "file",
  },
  external: ["*.node"],
  outfile: "build/out.cjs",
});

// Read the file
const filePath = "build/out.cjs";
let content = fs.readFileSync(filePath, "utf8");

// Replace the string
const oldString = "../build/Release/canvas.node";
const newString = "./canvas.node";
content = content.replace(oldString, newString);

// Write the file back
fs.writeFileSync(filePath, content, "utf8");

console.log("String replacement completed");
